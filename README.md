#PyHelper - AI-Powered Python Debugger 🤖

PyHelper is your mini AI co-pilot for debugging Python code. Just paste your buggy code, and PyHelper will catch errors, explain them in simple English, and even provide a corrected, runnable version.

Think of it as your personal Python tutor that not only fixes issues but also teaches you what went wrong.

✨ Features

Smart Error Detection → Powered by Google Gemini LLM, it can spot both syntax and logical errors.

Beginner-Friendly Explanations → Errors are explained in plain English so anyone can understand.

One-Click Fixes → Instantly get the corrected version of your code.

Text-to-Speech Support → Let PyHelper read out the explanation for you.

Modern UI → Sleek, dark-themed interface with smooth animations and responsive design.

🛠️ Tech Stack

Backend: Python, FastAPI

Frontend: React (Vite), Tailwind CSS, Framer Motion

AI Integration: Google Gemini API

Deployment: Vercel (Frontend) + Render (Backend)

🚀 Getting Started (Run Locally)

Follow these steps to set up PyHelper on your machine.

Prerequisites

Make sure you have:

Node.js
 & npm installed

Python
 & pip installed

A Google Gemini API Key

1️⃣ Clone the Repository
git clone https://github.com/shivammpal/code-debugger-py.git
cd code-debugger-py

2️⃣ Backend Setup
cd backend
python -m venv venv

# Activate virtual environment
# On Windows
.\venv\Scripts\Activate.ps1
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt


Create a .env file inside the backend/ folder:

GOOGLE_API_KEY="your-api-key-here"


Run the backend:

uvicorn main:app --reload

3️⃣ Frontend Setup
cd ../frontend
npm install


Run the frontend:

npm run dev

🎉 Now Open in Browser

Go to: http://localhost:5173

📌 Deployment

Frontend: Deploy on Vercel

Backend: Deploy on Render
 or Railway

👨‍💻 Author

Built with ❤️ by Shivam

