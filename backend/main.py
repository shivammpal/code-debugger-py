from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# --- Load environment variables ---
load_dotenv()

# --- App Initialization ---
app = FastAPI()

# Get Google API Key
google_api_key = os.getenv("GOOGLE_API_KEY")

if not google_api_key:
    raise ValueError("❌ GOOGLE_API_KEY not found in environment variables. Add it to your .env file.")

# Configure Google AI Client
genai.configure(api_key=google_api_key)


# --- Pydantic Model ---
class CodeInput(BaseModel):
    code: str


# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "✅ PySleuth AI Debugger Backend is Running!"}


# --- Debugging Endpoint ---
@app.post("/debug")
async def debug_code(data: CodeInput):
    user_code = data.code

    # Prompt for Gemini
    prompt = f"""
    You are an expert Python code debugger named 'PySleuth'. 
    Your task is to analyze the following Python code for errors. 
    Please return your response ONLY in valid JSON with exactly three keys:
    - "has_errors": true/false
    - "explanation": string
    - "corrected_code": string

    Here is the code to analyze:
    ```python
    {user_code}
    ```
    """

    # Safety Settings (disable blocking for this use-case)
    safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }

    try:
        # Initialize Gemini Model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate Response
        response = model.generate_content(prompt, safety_settings=safety_settings)

        # ✅ Extract text safely
        if response.candidates and response.candidates[0].content.parts:
            result_text = response.candidates[0].content.parts[0].text
        else:
            raise ValueError("No valid text response from Gemini.")

        # ✅ Try parsing JSON safely
        try:
            return json.loads(result_text)
        except json.JSONDecodeError:
            return {
                "has_errors": True,
                "explanation": "AI returned invalid JSON. Here's the raw output instead.",
                "corrected_code": result_text
            }

    except Exception as e:
        print(f"🔥 An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
