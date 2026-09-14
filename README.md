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
