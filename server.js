// server.js



// --- IMPORTS ---

// Used for creating the server and handling HTTP requests

const express = require('express');

// Cross-Origin Resource Sharing middleware to allow requests from our frontend

const cors = require('cors');

// The official MongoDB driver for Node.js

const { MongoClient, ServerApiVersion } = require('mongodb');

// Library for sending emails (for OTP verification)

const nodemailer = require('nodemailer');

// Built-in Node.js module for generating random data (for OTP)

const crypto = require('crypto');



// --- INITIALIZATION ---

// Create an instance of an Express application

const app = express();

// Define the port the server will run on. Use the environment variable or default to 3000

const port = process.env.PORT || 3000;



// --- MIDDLEWARE ---

// Enable CORS for all routes, allowing our frontend to make requests to this server

app.use(cors());

// Enable the express.json() middleware to parse incoming JSON payloads from requests

app.use(express.json());



// --- MONGODB SETUP ---

// Your MongoDB Atlas connection string

const uri = "mongodb+srv://Aaron-Admin:Aaren2002@bomberman.plbcjta.mongodb.net/?retryWrites=true&w=majority&appName=Bomberman";



// Create a new MongoClient with specific options

const client = new MongoClient(uri, {

  serverApi: {

    version: ServerApiVersion.v1,

    strict: true,

    deprecationErrors: true,

  }

});



// Global variables to hold database collections once connected

let usersCollection;

let otpCollection;



/**

 * Connects to the MongoDB database and initializes collections.

 */

async function connectToDB() {

  try {

    // Connect the client to the MongoDB server

    await client.connect();

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

   

    // Access the database and initialize collections

    const db = client.db("bomberman_db");

    usersCollection = db.collection("users");

    otpCollection = db.collection("otp_verifications");



    // Create a TTL (Time-To-Live) index on the 'expiresAt' field for the OTP collection.

    // MongoDB will automatically delete documents from this collection when the 'expiresAt' time is reached.

    // This ensures that expired OTPs are automatically cleaned up.

    await otpCollection.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });



  } catch (err) {

    // If there's an error during connection, log it and exit the process

    console.error("Failed to connect to MongoDB", err);

    process.exit(1);

  }

}



// --- NODEMAILER SETUP ---

// Configure the email transporter.

// IMPORTANT: Replace these with your actual email service credentials.

// For Gmail, you might need to generate an "App Password".

const transporter = nodemailer.createTransport({

    service: 'gmail', // e.g., 'gmail'

    auth: {

        user: 'aarenstanly20@gmail.com', // Your email address

        pass: 'aeqf bgmb alcx cdvp'    // Your email password or app-specific password

    }

});





// --- API ENDPOINTS ---



// **********************************

// ** Send OTP Endpoint **

// **********************************

app.post('/api/send-otp', async (req, res) => {

    const { email } = req.body;



    if (!email) {

        return res.status(400).json({ success: false, message: 'Email is required.' });

    }



    try {

        // Check if a user with this email already exists and is verified

        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {

            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

        }



        // Generate a secure 6-digit OTP

        const otp = crypto.randomInt(100000, 999999).toString();

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes



        // Store or update the OTP in the database for the user's email

        await otpCollection.updateOne(

            { email },

            { $set: { otp, expiresAt } },

            { upsert: true } // Creates a new document if one doesn't exist

        );



        // Setup email data

        const mailOptions = {

            from: '"Bomberman Game" <YOUR_EMAIL@gmail.com>',

            to: email,

            subject: 'Your Bomberman Verification Code',

            text: `Your verification code is: ${otp}\nThis code will expire in 10 minutes.`,

            html: `<p>Your verification code is: <b>${otp}</b></p><p>This code will expire in 10 minutes.</p>`

        };



        // Send the email

        await transporter.sendMail(mailOptions);



        res.status(200).json({ success: true, message: 'OTP sent to your email.' });



    } catch (error) {

        console.error("Send OTP error:", error);

        res.status(500).json({ success: false, message: 'Server error while sending OTP.' });

    }

});



// **********************************

// ** Verify OTP & Register User Endpoint **

// **********************************

app.post('/api/verify-otp', async (req, res) => {

    const { email, password, otp } = req.body;



    if (!email || !password || !otp) {

        return res.status(400).json({ success: false, message: 'Email, password, and OTP are required.' });

    }



    try {

        // Find the OTP record for the given email

        const otpRecord = await otpCollection.findOne({ email });



        if (!otpRecord) {

            return res.status(400).json({ success: false, message: 'Invalid OTP. Please request a new one.' });

        }



        // Check if the OTP matches and has not expired

        if (otpRecord.otp !== otp || new Date() > otpRecord.expiresAt) {

            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });

        }



        // --- OTP is valid, proceed with user registration ---



        // Generate a unique friend code

        let friendCode;

        let isCodeUnique = false;

        while (!isCodeUnique) {

            friendCode = Math.floor(10000000 + Math.random() * 90000000).toString();

            const userWithCode = await usersCollection.findOne({ friendCode });

            if (!userWithCode) {

                isCodeUnique = true;

            }

        }

       

        // IMPORTANT: In a real-world scenario, you MUST hash the password before storing it.

        const newUser = {

            email,

            password, // Storing plaintext password for simplicity. DO NOT DO THIS IN PRODUCTION.

            friendCode,

            friends: [],

            incomingRequests: [],

            pendingRequests: [],

            deathmatchStats: {

                highestScore: 0,

                totalTime: 0,

                enemiesKilled: {}

            },

            rank: 'Bronze',

            level: 1,

            xp: 0

        };



        // Insert the new user document into the collection

        await usersCollection.insertOne(newUser);



        // Clean up the used OTP from the verification collection

        await otpCollection.deleteOne({ email });



        res.status(201).json({ success: true, message: 'Account created successfully!' });



    } catch (error) {

        console.error("Verification/Registration error:", error);

        res.status(500).json({ success: false, message: 'Server error during registration.' });

    }

});





// **********************************

// ** User Login Endpoint **

// **********************************

app.post('/api/login', async (req, res) => {

    const { email, password } = req.body;



    if (!email || !password) {

        return res.status(400).json({ success: false, message: 'Email and password are required.' });

    }



    try {

        // Find the user by email

        const user = await usersCollection.findOne({ email });



        // Check if user exists and password matches

        // IMPORTANT: In production, you would compare hashed passwords.

        if (user && user.password === password) {

            // Omit the password from the returned user object for security

            const { password, ...userWithoutPassword } = user;

            res.status(200).json({ success: true, user: userWithoutPassword });

        } else {

            res.status(401).json({ success: false, message: 'Invalid email or password.' });

        }

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({ success: false, message: 'Server error during login.' });

    }

});



// **********************************

// ** Update User Data Endpoint **

// **********************************

app.put('/api/user/:email', async (req, res) => {

    const { email } = req.params;

    const updatedData = req.body;



    try {

        // Find the user by email and update their data

        const result = await usersCollection.updateOne({ email }, { $set: updatedData });

       

        if (result.matchedCount === 0) {

            return res.status(404).json({ success: false, message: 'User not found.' });

        }

       

        res.status(200).json({ success: true });

    } catch (error) {

        console.error("Update user error:", error);

        res.status(500).json({ success: false, message: 'Server error while updating user data.' });

    }

});



// **********************************

// ** Find User by Friend Code **

// **********************************

app.get('/api/user/by-code/:friendCode', async (req, res) => {

    const { friendCode } = req.params;

    try {

        const user = await usersCollection.findOne({ friendCode });

        if (user) {

            const { password, ...userWithoutPassword } = user;

            res.status(200).json({ success: true, user: userWithoutPassword });

        } else {

            res.status(404).json({ success: false, message: 'User not found.' });

        }

    } catch (error) {

        console.error("Find by friend code error:", error);

        res.status(500).json({ success: false, message: 'Server error.' });

    }

});



// **********************************

// ** Get Multiple Users by Codes **

// **********************************

app.post('/api/users/by-codes', async (req, res) => {

    const { friendCodes } = req.body;

    if (!Array.isArray(friendCodes)) {

        return res.status(400).json({ success: false, message: 'friendCodes must be an array.' });

    }

    try {

        // Find all users whose friendCode is in the provided array

        const users = await usersCollection.find({ friendCode: { $in: friendCodes } }).toArray();

       

        // Remove passwords before sending the response

        const usersWithoutPasswords = users.map(user => {

            const { password, ...rest } = user;

            return rest;

        });



        res.status(200).json({ success: true, users: usersWithoutPasswords });

    } catch (error) {

        console.error("Get users by codes error:", error);

        res.status(500).json({ success: false, message: 'Server error.' });

    }

});





// --- SERVER STARTUP ---

// Connect to the database and then start the Express server

connectToDB().then(() => {

    app.listen(port, () => {

        console.log(`Bomberman server listening at http://localhost:${port}`);

    });

});