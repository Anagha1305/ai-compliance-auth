# AI Compliance Inspector – Authentication Module

Authentication module for the AI Compliance Inspector project.

## Tech Stack

- React
- FastAPI
- MongoDB
- JWT
- Google OAuth
- Email OTP

---

## 1. Clone the Repository

Open PowerShell:

```powershell
cd "$HOME\OneDrive\Desktop"

git clone https://github.com/Anagha1305/ai-compliance-auth.git

cd ai-compliance-auth

2. Backend Setup
cd backend

Create virtual environment:

python -m venv venv

Activate it:

.\venv\Scripts\Activate.ps1

If PowerShell blocks activation:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Then activate again:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt
Create .env

Create:

backend/.env

Add the required MongoDB, JWT, Google OAuth and email credentials.

Then start the backend:

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs
3. Frontend Setup

Open a new PowerShell window.

Go to the project:

cd "$HOME\OneDrive\Desktop\ai-compliance-auth\frontend"

Install dependencies:

npm install

Start React:

npm start

Frontend:

http://127.0.0.1:3000
4. Running the Project

Keep two PowerShell windows open.

Terminal 1 – Backend
cd "$HOME\OneDrive\Desktop\ai-compliance-auth\backend"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
Terminal 2 – Frontend
cd "$HOME\OneDrive\Desktop\ai-compliance-auth\frontend"
npm start

Open:

http://127.0.0.1:3000

## 🔐 Authentication & Database Backend

I worked on the **Authentication and Database Backend** of the AI Compliance Inspector.

The main purpose of this module is to provide secure user authentication and a common database layer that can later be used by the other modules of the project.

### ⚙️ Working of the Authentication System

The authentication system supports both **email-based authentication** and **Google authentication**.

```text
                         User
                          │
              ┌───────────┴───────────┐
              │                       │
        Email Authentication     Google Authentication
              │                       │
          Send OTP                  Google OAuth
              │                       │
        Verify OTP              Verify Google Account
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
                   FastAPI Backend
                          │
                          ▼
                   MongoDB User Data
                          │
                          ▼
                     Generate JWT
                          │
                          ▼
                  HttpOnly Cookie
                          │
                          ▼
                Authenticated Session

📧 Email Authentication

For email-based signup:

The user enters their email address.
The backend generates a 6-digit OTP.
The OTP is sent to the user's email.
The user enters the OTP for verification.
After successful verification, the user creates their account using their name and password.
The password is securely hashed before being stored.
The account is created in MongoDB.
A JWT session token is generated and stored in an HttpOnly cookie.
Enter Email
     ↓
Generate OTP
     ↓
Send OTP to Email
     ↓
Verify OTP
     ↓
Create Account
     ↓
Hash Password
     ↓
Store User in MongoDB
     ↓
Generate JWT
     ↓
HttpOnly Cookie
     ↓
Logged In
🔑 Google Authentication

The system also provides Google OAuth for signup and login.

User
 ↓
Continue with Google
 ↓
Google OAuth
 ↓
Google Account Verification
 ↓
Backend receives verified user information
 ↓
Find Existing User / Create New User
 ↓
Generate JWT
 ↓
HttpOnly Cookie
 ↓
Authenticated User

Google handles the user's Google account authentication, so the application does not store the user's Google password.

🍪 JWT Session Management

JWT (JSON Web Token) is used to maintain the authenticated session.

After successful login or signup, the backend generates a JWT containing the user's ID and session information.

User Login
    ↓
FastAPI verifies credentials
    ↓
JWT generated
    ↓
JWT stored in HttpOnly Cookie
    ↓
Authenticated Session

For subsequent protected requests:

Frontend Request
      ↓
Browser automatically sends HttpOnly Cookie
      ↓
FastAPI
      ↓
Verify JWT
      ↓
Get User ID
      ↓
Find User in MongoDB
      ↓
Allow / Reject Request

The JWT also has an expiration time, so the session does not remain valid indefinitely.

🛡️ Why HttpOnly Cookies?

The JWT is stored in an HttpOnly cookie instead of being stored directly in browser-accessible JavaScript storage.

An HttpOnly cookie cannot be directly read by JavaScript running in the browser.

This means the React frontend does not need to access or manually store the JWT.

React Frontend
      │
      │ Request
      ▼
    Browser
      │
      │ Automatically sends cookie
      ▼
FastAPI Backend
      │
      ▼
JWT Verification

This provides a safer way to manage the authentication session and keeps the session token away from normal frontend JavaScript access.

🔒 Password Security

Passwords are never stored as plain text.

The system uses Argon2 password hashing:

User Password
     ↓
Argon2 Hashing
     ↓
Password Hash
     ↓
MongoDB

During login, the entered password is compared with the stored password hash.

Entered Password
       ↓
Verify against stored hash
       ↓
     Valid?
    /     \
  Yes      No
   ↓        ↓
 Login    Reject
🗄️ Database – MongoDB

I used MongoDB as the database for the authentication and application backend.

MongoDB is a document-based database, which is useful for this project because the application handles product information that can vary between different products.

Another product may contain additional fields depending on the information available on its packaging.

MongoDB allows this information to be stored as flexible documents without requiring every product to have exactly the same set of fields.

👤 User Data

The authentication system stores user information in the users collection.

For Google users, the authentication provider and Google account identifier are stored instead of a password.

🔗 Database for Team Integration

The MongoDB database is designed to be extended for the other modules of the project.

The planned structure can include:

MongoDB
│
├── users
├── products
├── scans
├── compliance_results
├── evidence
└── reports

This allows the other team members to use the same backend for storing data generated by their modules.

For example:

Inspection Module
       ↓
FastAPI API
       ↓
MongoDB
       ↓
Store Product / Scan / Result

Similarly, scan history can be stored as separate records so that previous inspection results are preserved.

🔌 Backend API

The authentication functionality is exposed through FastAPI APIs.

Authentication APIs
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register
POST /api/auth/login

GET  /api/auth/google
GET  /api/auth/google/callback

GET  /api/auth/me
POST /api/auth/logout

The frontend communicates with the backend through these APIs and does not directly connect to MongoDB.

React Frontend
      ↓
FastAPI Backend
      ↓
MongoDB

This separation allows the authentication backend to be integrated with the main AI Compliance Inspector frontend and also allows other team modules to use the same backend.
