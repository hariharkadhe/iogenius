import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Request (Conversational History) ---
class ChatMessage(BaseModel):
    role: str
    content: str

class PromptRequest(BaseModel):
    history: List[ChatMessage]

# --- Pydantic Models for Structured Output (Gemini) ---
class Microcontroller(BaseModel):
    name: str = Field(description="Name of the microcontroller (e.g., ESP32, Raspberry Pi 4)")
    desc: str = Field(description="Short description of the microcontroller")
    specs: List[str] = Field(description="List of key specifications")

class Component(BaseModel):
    name: str = Field(description="Name of the sensor or output component")
    desc: str = Field(description="Short description of the component")
    specs: List[str] = Field(description="List of key specifications (e.g., Voltage, Protocol)")

class Hardware(BaseModel):
    microcontroller: Microcontroller
    sensors: List[Component]
    outputs: List[Component]

class InstructionStep(BaseModel):
    title: str = Field(description="Title of the step")
    desc: str = Field(description="Detailed instruction for the step")

class Software(BaseModel):
    language: str = Field(description="Programming language (e.g., cpp, python)")
    code: str = Field(description="The complete, functional source code for the project")
    wiring_steps: List[InstructionStep] = Field(description="Step-by-step wiring instructions connecting the microcontroller to the sensors and outputs based on the generated code.")
    ide_steps: List[InstructionStep] = Field(description="Step-by-step instructions for running the code in an IDE (e.g., Arduino IDE or Thonny)")
    cloud_steps: List[InstructionStep] = Field(description="Step-by-step instructions for connecting to a cloud dashboard (e.g., Blynk, ThingSpeak)")

class ProjectPlan(BaseModel):
    message: str = Field(description="A friendly, conversational response summarizing what you generated and addressing the user's latest prompt.")
    hardware: Hardware
    software: Software

SYSTEM_PROMPT = """You are an expert IoT Hardware Architect and Software Developer.
The user is building an IoT project. They will provide a request or a follow-up modification.
You must design the hardware system and write the software for it.
- Choose an appropriate microcontroller (e.g., ESP32 for C++, Raspberry Pi for Python).
- List the exact sensors and output components needed with real-world specs.
- Write fully functional code (C++ or Python) for the system.
- Provide a step-by-step wiring guide. The pins mentioned here MUST perfectly match the GPIO pins defined in the generated code.
- Provide step-by-step IDE instructions (Arduino IDE for C++, Thonny for Python). MUST include the direct download link to the IDE.
- Provide step-by-step Cloud integration instructions if applicable. MUST include the direct link to the cloud platform (e.g., thingspeak.com).
Always respond strictly in the requested JSON structure.
"""

@app.post("/api/generate")
async def generate_project(req: PromptRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    
    # Check if API key is set
    if not api_key or not genai:
        return {
            "status": "success",
            "message": "⚠️ GEMINI_API_KEY is not set in the backend/.env file! Using fallback mock data. Please add your API key to enable real AI generation.",
            "hardware": {
                "microcontroller": {
                    "name": "ESP32 NodeMCU (Wi-Fi/BT)",
                    "desc": "Fallback Mock Microcontroller",
                    "specs": ["Operating Voltage: 3.3V Logic"]
                },
                "sensors": [],
                "outputs": []
            },
            "software": {
                "language": "cpp",
                "code": "// Add GEMINI_API_KEY to backend/.env to generate real code!",
                "ide_steps": [{"title": "Setup API Key", "desc": "Create a .env file in the backend folder and add GEMINI_API_KEY=your_key"}],
                "cloud_steps": []
            }
        }

    try:
        client = genai.Client(api_key=api_key)
        
        # Convert React chat history to Gemini chat history format
        # React uses 'ai' for model, Gemini uses 'model'.
        contents = []
        for msg in req.history:
            role = "user" if msg.role == "user" else "model"
            contents.append(
                types.Content(role=role, parts=[types.Part.from_text(text=msg.content)])
            )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=ProjectPlan,
                temperature=0.7,
            ),
        )
        
        # Parse the JSON response
        import json
        plan_data = json.loads(response.text)
        
        return {
            "status": "success",
            "message": plan_data.get("message", "Here is your updated project plan."),
            "hardware": plan_data.get("hardware"),
            "software": plan_data.get("software")
        }
        
    except Exception as e:
        print(f"Error generating plan: {e}")
        return {
            "status": "error",
            "message": f"An error occurred while generating the plan: {str(e)}"
        }
