import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

_API_KEY = os.getenv("GEMINI_API_KEY")

def generate(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "System error: API key missing"

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response.text:
            return "No response generated"

        return response.text.strip()

    except Exception as e:
        msg = str(e)

        if "503" in msg or "UNAVAILABLE" in msg:
            return "The AI service is busy. Retry in a few seconds."

        return "Internal AI error"
    
    return response.text.strip()
