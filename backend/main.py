from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/generate")
async def generate_project(req: PromptRequest):
    # Simulate AI processing delay
    time.sleep(1.5)
    
    text = req.prompt.lower()
    
    # Defaults
    microcontroller = {
        "name": "ESP32 NodeMCU (Wi-Fi/BT)",
        "desc": "The core processing unit for your system.",
        "specs": ["Operating Voltage: 3.3V Logic", "Processor Speed: 240 MHz", "Wireless: 802.11 b/g/n Wi-Fi & BT", "Usable GPIO: ~25 Pins"]
    }
    sensors = []
    outputs = []
    
    language = "cpp"
    code = ""
    ide_steps = []
    cloud_steps = []
    
    # 1. Parse Microcontroller & Language
    if "raspberry" in text or "pi" in text or "python" in text:
        microcontroller = {
            "name": "Raspberry Pi 4 Model B",
            "desc": "A powerful single-board computer running a full Linux OS.",
            "specs": ["Operating Voltage: 5V/3A USB-C", "Processor: Quad core Cortex-A72 (ARM v8) 64-bit @ 1.5GHz", "RAM: 2GB, 4GB or 8GB LPDDR4", "Wireless: 2.4 GHz and 5.0 GHz IEEE 802.11ac wireless, Bluetooth 5.0"]
        }
        language = "python"
        
        code = """import RPi.GPIO as GPIO
import time
import requests

# Setup
LED_PIN = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

print("Raspberry Pi Initialized")

try:
    while True:
        # Example logic
        GPIO.output(LED_PIN, GPIO.HIGH)
        time.sleep(1)
        GPIO.output(LED_PIN, GPIO.LOW)
        time.sleep(1)
        
        # Send data to cloud
        # requests.post("https://api.thingspeak.com/update", data={"api_key": "YOUR_KEY", "field1": 1})
except KeyboardInterrupt:
    GPIO.cleanup()
"""
        ide_steps = [
            {"title": "Open Thonny IDE", "desc": "Launch Thonny, the default Python IDE included in Raspberry Pi OS."},
            {"title": "Copy Code", "desc": "Copy the Python script above and paste it into a new file in Thonny."},
            {"title": "Save File", "desc": "Save the file as `main.py` on your Desktop or in your project folder."},
            {"title": "Run Script", "desc": "Click the Green 'Play' button in the toolbar to execute your code."}
        ]
        
    else:
        # Default to ESP32 / Arduino (Embedded C++)
        language = "cpp"
        code = """#include <WiFi.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const int LED_PIN = 2; // Onboard LED

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi connected");
}

void loop() {
  // Example logic
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
  
  // TODO: Send HTTP request to cloud dashboard
}
"""
        ide_steps = [
            {"title": "Install Arduino IDE", "desc": "Download and install the latest Arduino IDE from arduino.cc."},
            {"title": "Add ESP32 Board Manager", "desc": "Go to File > Preferences, and add `https://dl.espressif.com/dl/package_esp32_index.json` to Additional Boards Manager URLs."},
            {"title": "Select Board & Port", "desc": "Go to Tools > Board and select 'DOIT ESP32 DEVKIT V1'. Select your COM port under Tools > Port."},
            {"title": "Upload", "desc": "Paste the code, connect your ESP32 via micro-USB, and click the Upload button (Right Arrow icon)."}
        ]

    # Cloud Steps (Common for both in this mock)
    cloud_steps = [
        {"title": "Create Dashboard", "desc": "Sign up for a free account at ThingSpeak or Blynk IoT."},
        {"title": "Get API Keys", "desc": "Create a new Device or Channel and copy your Auth Token / API Key."},
        {"title": "Update Code", "desc": "Paste your Wi-Fi credentials and the API Key into the designated variables in the code."},
        {"title": "Visualize Data", "desc": "Add a Gauge or Graph widget to your cloud dashboard and link it to the data stream."}
    ]

    # 2. Parse Sensors & Outputs
    if "ultrasonic" in text or "distance" in text or "gate" in text:
        sensors.append({
            "name": 'HC-SR04 Ultrasonic Sensor',
            "desc": 'Non-contact distance measurement module for object detection.',
            "specs": ['Voltage: 5V DC', 'Range: 2cm to 400cm', 'Pins: VCC, TRIG, ECHO, GND']
        })
    if "temp" in text or "greenhouse" in text or "plant" in text or "moisture" in text:
        sensors.append({
            "name": 'DHT22 - Temperature & Humidity',
            "desc": 'High precision digital sensor.',
            "specs": ['Voltage: 3.3V to 5.5V DC', 'Signal: Single-bus digital', 'Range: 0-100% RH, -40 to 80°C']
        })
    if "display" in text or "screen" in text or "oled" in text:
        outputs.append({
            "name": '0.96" OLED Display (SSD1306)',
            "desc": 'High-contrast screen for on-device visualization.',
            "specs": ['Resolution: 128x64 Pixels', 'Protocol: I2C (SDA/SCL)']
        })
    if "motor" in text or "servo" in text or "gate" in text:
        outputs.append({
            "name": 'SG90 Micro Servo Motor',
            "desc": 'Small footprint motor for precise physical movement.',
            "specs": ['Voltage: 4.8V - 6V', 'Control: PWM Signal']
        })
    if "relay" in text or "light" in text or "pump" in text:
        outputs.append({
            "name": '5V Single-Channel Relay Module',
            "desc": 'Electromagnetic switch to control high-power devices.',
            "specs": ['Control: Digital High/Low', 'Capacity: 10A @ 250V AC']
        })

    # Defaults if empty
    if len(sensors) == 0 and len(outputs) == 0:
        sensors.append({
            "name": 'Generic Multi-Sensor',
            "desc": 'Standard IoT sensing unit.',
            "specs": ['Voltage: 3.3V', 'Protocol: I2C']
        })
        outputs.append({
            "name": 'Status LED Indicator',
            "desc": 'Basic visual feedback.',
            "specs": ['Color: RGB', 'Control: PWM']
        })

    return {
        "status": "success",
        "message": f"Successfully parsed requirements for '{req.prompt}'.",
        "hardware": {
            "microcontroller": microcontroller,
            "sensors": sensors,
            "outputs": outputs
        },
        "software": {
            "language": language,
            "code": code,
            "ide_steps": ide_steps,
            "cloud_steps": cloud_steps
        }
    }
