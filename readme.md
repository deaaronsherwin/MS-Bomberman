# Bomberman: Enhanced Edition

**A Full-Stack Modernization of a Classic Arcade Game**

[cite_start]This project revitalizes the iconic 1980s arcade title, *Bomberman*, for a modern audience[cite: 18, 53]. [cite_start]It merges the beloved core mechanics of the original with contemporary web technologies and features like secure authentication, social systems, and persistent progression[cite: 19, 21, 23].

* * * * *

## 🚀 Features

### **The "Modern Twist"**

* [cite_start]**Secure Authentication:** User registration and login system featuring email-based One-Time Password (OTP) verification[cite: 23, 56, 77].

* [cite_start]**Social Hub:** Unique friend-code system allowing players to connect, add friends, and manage social connections[cite: 23, 78, 88].

* [cite_start]**Competitive Leaderboards:** An online leaderboard for the 'Deathmatch' mode that fosters competition by ranking the user and their friends[cite: 23, 242, 288].

* [cite_start]**Persistence:** A robust save/load system for the single-player campaign that stores progress, scores, and power-ups in the cloud[cite: 24, 91, 286].

* [cite_start]**Modern Input:** Full gamepad controller support with haptic (vibration) feedback[cite: 24, 79, 96].

### **Gameplay Modes**

* [cite_start]**Enhanced Edition:** The modernized remake featuring procedural wall generation and a multi-stage campaign[cite: 21, 286, 1318].

* [cite_start]**Classic Mode:** An embedded version of the original game for direct nostalgic comparison[cite: 24, 59, 80].

* [cite_start]**Deathmatch Mode:** A high-score-driven survival mode against endlessly spawning enemies[cite: 23, 242, 286].

* * * * *

## 🛠️ Technical Stack

[cite_start]The project utilizes a **three-tier client-server architecture** to separate presentation, logic, and data storage[cite: 180, 299].

### **Frontend (Presentation Tier)**

* [cite_start]**Engine:** Phaser 3 Game Engine[cite: 21, 74, 142].

* [cite_start]**UI:** A hybrid model using standard HTML5 DOM for menus and Phaser Scenes for gameplay[cite: 324, 325, 555].

* [cite_start]**Language:** JavaScript (ES6+), HTML5, and CSS3[cite: 21, 321, 650].

### **Backend (Application Tier)**

* [cite_start]**Runtime:** Node.js[cite: 22, 189, 621].

* [cite_start]**Framework:** Express.js for RESTful API construction[cite: 22, 189, 634].

* [cite_start]**Services:** Nodemailer for automated OTP email dispatch[cite: 315, 348, 641].

### **Database (Data Tier)**

* [cite_start]**Technology:** MongoDB Atlas (NoSQL)[cite: 22, 354, 657].

* [cite_start]**Features:** Time-To-Live (TTL) indexing for self-cleaning temporary OTP records[cite: 361, 476, 479].

* * * * *

## 🏗️ System Architecture

[cite_start]The application functions as a **Single-Page Application (SPA)**[cite: 319, 553]. [cite_start]All communication between the Phaser client and the Node.js server is handled via a stateless **REST API** using JSON for data interchange[cite: 197, 301, 340].

### **Key API Endpoints**

* [cite_start]`POST /api/send-otp`: Validates email, generates a 6-digit OTP, and dispatches it via email[cite: 504, 505].

* [cite_start]`POST /api/verify-otp`: Validates the code and creates a permanent user record in the database[cite: 509, 511, 512].

* [cite_start]`PUT /api/user/:email`: A general-purpose endpoint for saving game states, updating social lists, and recording high scores[cite: 527, 530].

* [cite_start]`POST /api/users/by-codes`: Bulk retrieval of user data to efficiently populate friends lists and leaderboards[cite: 543, 544, 546].

* * * * *

## 🔧 Installation & Setup

1\. **Clone the repository:**

  ```bash

  git clone [repository-url]

  ```

2\. **Install dependencies:**

  [cite_start]The project uses `npm` to manage external libraries like `express`, `mongodb`, and `nodemailer`[cite: 626, 628, 631].

  ```bash

  npm install

  ```

3\. **Environment Variables:**

  Create a `.env` file in the root directory and provide:

  * [cite_start]`MONGODB\_URI`: Your MongoDB Atlas connection string[cite: 661].

  * [cite_start]`EMAIL\_USER` & `EMAIL\_PASS`: SMTP credentials for Nodemailer[cite: 349, 642].

4\. **Run the application:**

  ```bash

  npm start

  ```

* * * * *

## 📝 Author & Project Info

* [cite_start]**Author:** Aaren Sherwin Stanly Rajesh [cite: 5]

* [cite_start]**Project Supervisor:** Prof. Anthony Conway [cite: 6]

* [cite_start]**Institution:** University of Leicester, School of Computing and Mathematical Sciences [cite: 1]

* [cite_start]**Date:** September 05, 2025 [cite: 8]

* [cite_start]**Word Count:** 19,551 [cite: 9]

* * * * *

> [cite_start]**Note:** For the scope of this project, passwords are currently stored in plaintext[cite: 358, 1355]. [cite_start]Implementation of salted hashing (e.g., bcrypt) is identified as a high-priority recommendation for future work[cite: 1356, 1408, 1409].
