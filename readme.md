Bomberman: Enhanced Edition
A Full-Stack Modernization of a Classic Arcade Game

This project revitalizes the iconic 1980s arcade title, Bomberman, for modern web browsers. It merges the beloved core mechanics of the original with a contemporary suite of features, including secure authentication, social systems, and persistent progression.

🚀 Features
The "Modern Twist"

Secure Authentication: User registration and login system featuring email-based One-Time Password (OTP) verification.


Social Hub: Unique friend-code system allowing players to add friends and manage connections.


Competitive Leaderboards: An online leaderboard specifically for the new 'Deathmatch' mode, focused on friend-based competition.


Persistence: A robust save/load system for the single-player campaign that stores progress, scores, and power-ups in the cloud.


Modern Input: Full gamepad controller support with haptic (vibration) feedback.

Gameplay Modes

Enhanced Edition: The modernized remake featuring procedural wall generation and persistent progression.


Classic Mode: An embedded version of the original 1980s game for a direct nostalgic comparison.


Deathmatch Mode: A high-score-driven survival mode against endlessly spawning enemies.

🛠️ Technical Stack
The project utilizes a three-tier client-server architecture to separate presentation, logic, and data storage.

Frontend (Presentation Tier)

Engine: Phaser 3 (HTML5 Game Framework).


UI: Hybrid model using standard HTML5 DOM for menus and Phaser Scenes for gameplay.


Language: JavaScript (ES6+).

Backend (Application Tier)

Runtime: Node.js.


Framework: Express.js for RESTful API construction.


Services: Nodemailer for automated OTP email dispatch.

Database (Data Tier)

Technology: MongoDB Atlas (NoSQL).


Features: Time-To-Live (TTL) indexing for self-cleaning temporary OTP records.

🏗️ System Architecture
The application functions as a Single-Page Application (SPA). All communication between the Phaser client and the Node.js server is handled via a stateless REST API using JSON for data interchange.

Key API Endpoints

POST /api/send-otp: Initiates registration by sending a 6-digit code.


POST /api/verify-otp: Validates the code and creates a permanent user document.


PUT /api/user/:email: General-purpose endpoint for saving game states and updating social data.


POST /api/users/by-codes: Bulk retrieval of friend data for efficient leaderboard population.

🔧 Installation & Setup
Clone the repository:

Bash
git clone [repository-url]
Install dependencies:

Bash
npm install
Environment Variables: Create a .env file in the root directory and provide:


MONGODB_URI: Your MongoDB Atlas connection string.


EMAIL_USER & EMAIL_PASS: SMTP credentials for Nodemailer.

Run the application:

Bash
npm start
📝 Author & Project Info

Author: Aaren Sherwin Stanly Rajesh 


Supervisor: Prof. Anthony Conway 


Institution: University of Leicester, School of Computing and Mathematical Sciences 


Date: September 05, 2025 

Note: For the scope of this academic project, passwords are currently stored in plaintext. Future work includes implementing bcrypt for salted hashing to ensure production-level security.
