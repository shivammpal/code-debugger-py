from fastapi import FastAPI
from pydantic import BaseModel
import os

# Initialize the FastAPI app
app = FastAPI()

# Define the data model for the code we'll receive from the frontend
class CodeInput(BaseModel):
    code: str

# Define our main API endpoint at /debug
@app.post("/debug")
def debug_code(data: CodeInput):
    """
    Receives Python code, and for now, returns a dummy analysis.
    This is where our AI logic will go on Day 2.
    """
    print("Received code:", data.code) # For testing in our terminal

    # Dummy response for Day 1
    return {
        "has_errors": True,
        "explanation": "This is a placeholder explanation from the server. AI logic will be implemented tomorrow!",
        "corrected_code": "print('This is placeholder corrected code.')"
    }

# A simple root endpoint to check if the server is running
@app.get("/")
def read_root():
    return {"message": "PySleuth Backend is Running!"}