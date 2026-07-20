import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from bson import ObjectId
import datetime

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# --- Database Setup ---
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.iogenius
users_collection = db.users
projects_collection = db.projects

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

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

# --- Auth Models ---
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ProjectSaveRequest(BaseModel):
    user_id: str
    prompt: str
    hardware: dict
    software: dict

# --- Pydantic Models for Structured Output (Gemini) ---
class Microcontroller(BaseModel):
    name: str = Field(description="Name of the microcontroller (e.g., ESP32, Raspberry Pi Pico)")
    desc: str = Field(description="Brief explanation of why this was chosen")
    specs: List[str] = Field(description="Key specifications")
    estimated_price: float = Field(description="The estimated cost in USD (e.g., 5.50)")
    purchase_link: str = Field(description="An Amazon search URL to buy this component (e.g., https://www.amazon.com/s?k=ESP32+NodeMCU)")

class Sensor(BaseModel):
    name: str = Field(description="Name of the sensor")
    desc: str = Field(description="What this sensor does")
    connection_type: str = Field(description="e.g., I2C, SPI, Analog, Digital")
    estimated_price: float = Field(description="The estimated cost in USD (e.g., 2.50)")
    purchase_link: str = Field(description="An Amazon search URL to buy this component")

class Output(BaseModel):
    name: str = Field(description="Name of the output device")
    desc: str = Field(description="What this output device does")
    connection_type: str = Field(description="e.g., PWM, Digital, I2C")
    estimated_price: float = Field(description="The estimated cost in USD (e.g., 3.00)")
    purchase_link: str = Field(description="An Amazon search URL to buy this component")

class Hardware(BaseModel):
    microcontroller: Microcontroller
    sensors: List[Sensor]
    outputs: List[Output]

class InstructionStep(BaseModel):
    title: str = Field(description="Title of the step")
    desc: str = Field(description="Detailed instruction for the step")

class WiringConnection(BaseModel):
    from_component: str = Field(description="Name of the component (e.g. 'DHT11')")
    from_pin: str = Field(description="Pin name on the component (e.g. 'VCC')")
    to_component: str = Field(description="Name of the target component (usually the microcontroller)")
    to_pin: str = Field(description="Pin name on the target (e.g. '3V3')")
    color: str = Field(description="Wire color hex code (e.g. '#ef4444' for power, '#3b82f6' for data, '#22c55e' for ground)")

class Software(BaseModel):
    language: str = Field(description="Either 'cpp' or 'python'")
    code: str = Field(description="The full, functional source code")
    wiring_steps: List[InstructionStep]
    wiring_connections: List[WiringConnection] = Field(description="Structured data for drawing the visual breadboard")
    ide_steps: List[InstructionStep] = Field(description="Step-by-step instructions for running the code in an IDE (e.g., Arduino IDE or Thonny)")
    cloud_steps: List[InstructionStep] = Field(description="Step-by-step instructions for connecting to a cloud dashboard (e.g., Blynk, ThingSpeak)")

class ProjectPlan(BaseModel):
    message: str = Field(description="A friendly, conversational response summarizing what you generated and addressing the user's latest prompt.")
    hardware: Hardware
    software: Software

SYSTEM_PROMPT = """You are an Expert IoT Architect.
You help users design and implement IoT hardware systems.
Your job is to recommend the best microcontroller (like ESP32 or Raspberry Pi Pico), sensors, and output devices for the user's project.
You must also provide a real-world estimated cost (in USD) for every component, and generate a valid Amazon search URL for that component (e.g. https://www.amazon.com/s?k=DHT11+Sensor).
You will also write the complete C++ (Arduino) or MicroPython code required to run the system, including any necessary libraries.
Provide a clear, step-by-step wiring guide matching the exact pins used in your code.
Always respond strictly in the requested JSON structure. Do not include markdown formatting or explanation outside the JSON.
"""

@app.post("/api/signup")
async def signup(user: UserSignup):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        return {"status": "error", "message": "Email already registered"}
    
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    return {
        "status": "success", 
        "user": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": user.email
        }
    }

@app.post("/api/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        return {"status": "error", "message": "Invalid email or password"}
    
    return {
        "status": "success",
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }

@app.post("/api/projects")
async def save_project(req: ProjectSaveRequest):
    project_doc = {
        "user_id": req.user_id,
        "prompt": req.prompt,
        "hardware": req.hardware,
        "software": req.software,
        "created_at": datetime.datetime.utcnow()
    }
    result = await projects_collection.insert_one(project_doc)
    return {"status": "success", "project_id": str(result.inserted_id)}

@app.get("/api/projects/{user_id}")
async def get_projects(user_id: str):
    cursor = projects_collection.find({"user_id": user_id}).sort("created_at", -1)
    projects = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        projects.append(doc)
    return {"status": "success", "projects": projects}

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
                    "specs": ["Operating Voltage: 3.3V Logic"],
                    "estimated_price": 5.99,
                    "purchase_link": "https://www.amazon.com/s?k=ESP32+NodeMCU"
                },
                "sensors": [],
                "outputs": []
            },
            "software": {
                "language": "cpp",
                "code": "// Add GEMINI_API_KEY to backend/.env to generate real code!",
                "wiring_steps": [{"title": "Power", "desc": "Connect VCC to 3V3"}],
                "wiring_connections": [
                    {"from_component": "Mock Sensor", "from_pin": "VCC", "to_component": "ESP32 NodeMCU (Wi-Fi/BT)", "to_pin": "3V3", "color": "#ef4444"}
                ],
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

        response = None
        try:
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
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e):
                print("gemini-2.5-flash is unavailable, falling back to gemini-2.0-flash...")
                response = client.models.generate_content(
                    model='gemini-2.0-flash',
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        response_schema=ProjectPlan,
                        temperature=0.7,
                    ),
                )
            else:
                raise e
        
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

# --- Debugging Endpoint ---

class DebugRequest(BaseModel):
    error_message: str
    hardware: Hardware
    software: Software

class DebugResponse(BaseModel):
    diagnosis: str = Field(description="A friendly, clear diagnosis of what might be wrong based on the physical error.")
    solution_steps: List[str] = Field(description="Actionable, step-by-step instructions to fix the physical or code issue.")

DEBUG_SYSTEM_PROMPT = """You are an Expert IoT Hardware Debugger.
The user has built the circuit according to the provided hardware list and software code, but they are experiencing a physical error.
Analyze their error message against the specific pins and logic in the code, and diagnose the issue.
Always respond strictly in the requested JSON structure.
"""

@app.post("/api/debug")
async def debug_project(req: DebugRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or not genai:
        return {
            "status": "success",
            "diagnosis": "⚠️ GEMINI_API_KEY is not set. Cannot debug.",
            "solution_steps": ["Add GEMINI_API_KEY to backend/.env"]
        }

    try:
        client = genai.Client(api_key=api_key)
        
        # Construct the context for Gemini
        context = f"HARDWARE: {req.hardware.model_dump_json()}\n\nSOFTWARE CODE: {req.software.code}\n\nUSER ERROR: {req.error_message}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=context,
            config=types.GenerateContentConfig(
                system_instruction=DEBUG_SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=DebugResponse,
                temperature=0.2, # Lower temp for more analytical debugging
            ),
        )
        
        import json
        debug_data = json.loads(response.text)
        
        return {
            "status": "success",
            "diagnosis": debug_data.get("diagnosis", "Could not diagnose."),
            "solution_steps": debug_data.get("solution_steps", [])
        }
        
    except Exception as e:
        print(f"Error debugging: {e}")
        return {
            "status": "error",
            "message": f"An error occurred during debugging: {str(e)}"
        }

# --- Cloud Compiler Scaffold ---

class CompileRequest(BaseModel):
    code: str
    language: str

@app.post("/api/compile")
async def compile_code(req: CompileRequest):
    """
    Mock endpoint for the Prototype Cloud Compiler.
    In a real production environment, this would spin up a Docker container,
    run `arduino-cli compile --fqbn esp32:esp32:esp32`, and return the .bin file.
    """
    import asyncio
    
    # Simulate a realistic compilation delay
    await asyncio.sleep(2)
    
    if req.language.lower() == 'python':
        return {
            "status": "success",
            "message": "MicroPython script verified.",
            "binary_url": None # MicroPython is sent as raw text
        }
    else:
        return {
            "status": "success",
            "message": "C++ code compiled successfully to ESP32 binary.",
            "binary_url": "/mock_build/firmware.bin"
        }

@app.get("/api/health")
async def health_check():
    try:
        # Ping the database to verify connectivity
        await db.command("ping")
        return {"status": "success", "message": "API is running and MongoDB is connected!"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}
