# Import necessary libraries and modules for the FastAPI application.
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from fastapi.middleware.cors import CORSMiddleware

# --- Environment Variable Loading ---
load_dotenv()

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware Configuration ---
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://code-debugger-py.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Google AI Client Setup ---
google_api_key = os.getenv("GOOGLE_API_KEY")
if not google_api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")
genai.configure(api_key=google_api_key)

# --- Pydantic Model Definition ---
class CodeInput(BaseModel):
    code: str
    translate: bool = False

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "PySleuth AI Debugger Backend is Running!"}

# --- Code Debugging Endpoint ---
@app.post("/debug")
async def debug_code(data: CodeInput):
    user_code = data.code
    
    # --- Dynamic Prompt Generation ---
    translation_instruction = ""
    if data.translate:
        translation_instruction = "IMPORTANT: Translate the 'explanation' field into Hinglish (a mix of Hindi and English)."

    # --- Prompt Template ---
    prompt = f'''
    You are an expert Python code debugger named 'PySleuth'. 
    Your task is to analyze the following Python code for errors. 
    Please return your response ONLY in valid JSON with exactly three keys:
    - "has_errors": true/false
    - "explanation": string (A friendly, plain-English explanation)
    - "corrected_code": string (The complete, corrected Python code, WITHOUT any markdown code block fences like ```python or ``` around it. Just the raw code as a string.)

    {translation_instruction}

    Here is the code to analyze:
    ```python
    {user_code}
    ```
    '''
    
    # --- Safety Settings for AI Model ---
    safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }

    try:
        # --- AI Model Interaction ---
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt, safety_settings=safety_settings)

        # --- Response Validation ---
        if not (response.candidates and response.candidates[0].content.parts):
            raise ValueError("No valid text response from Gemini.")
        
        result_text = response.candidates[0].content.parts[0].text
        
        # --- Response Cleaning ---
        cleaned_text = result_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:-3].strip()
        elif cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:-3].strip()

        try:
            # --- JSON Parsing and Response ---
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            # --- Fallback for JSON Parsing Errors ---
            print(f"AI returned non-JSON despite cleaning. Raw output: {cleaned_text}")
            return {
                "has_errors": True,
                "explanation": "AI returned a response that could not be parsed as JSON, even after cleaning.",
                "corrected_code": cleaned_text
            }

    except Exception as e:
        # --- General Error Handling ---
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))