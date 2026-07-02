import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  Copy, Download, Terminal, Lightbulb, BrainCircuit, 
  Cpu, Zap, Cloud, FileText, CheckCircle2, ArrowLeft,
  Smartphone, Droplets, ThermometerSun, LogOut, User
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const idea = state?.idea || "I want to build a system that monitors soil moisture and temperature and sends data to mobile.";
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('cpp');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedCpp = `
#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT22
#define SOIL_MOISTURE_PIN 34

DHT dht(DHTPIN, DHTTYPE);
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverName = "http://your-cloud-endpoint.com/api/data";

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    int soil = analogRead(SOIL_MOISTURE_PIN);

    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\\"temperature\\":" + String(t) + 
                         ",\\"humidity\\":" + String(h) + 
                         ",\\"soilMoisture\\":" + String(soil) + "}";

    int httpResponseCode = http.POST(jsonPayload);
    http.end();
  }
  delay(10000);
}
  `.trim();

  const generatedPython = `
import time
import requests
import random # Mock for RPi GPIO

SERVER_URL = "http://your-cloud-endpoint.com/api/data"

def read_sensors():
    return {
        "temperature": round(random.uniform(20.0, 35.0), 2),
        "humidity": round(random.uniform(40.0, 60.0), 2),
        "soilMoisture": random.randint(300, 800)
    }

def main():
    headers = {"Content-Type": "application/json"}
    
    while True:
        try:
            payload = read_sensors()
            response = requests.post(SERVER_URL, headers=headers, json=payload)
            print(f"Data sent. Status: {response.status_code}")
        except Exception as e:
            print(f"Error: {e}")
            
        time.sleep(10)

if __name__ == "__main__":
    main()
  `.trim();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/input')} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
            <BrainCircuit color="var(--primary)" /> IOGENIUS Dashboard
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} /> {user?.name}
          </span>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Step 1 & 2: Idea & Analyze */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', margin: '0 0 1rem 0' }}>
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: '50%' }}><Lightbulb size={20} /></div>
              Idea Input
            </h3>
            <p style={{ fontSize: '1.125rem', fontStyle: 'italic', color: 'var(--text-main)', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', margin: 0 }}>
              "{idea}"
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', margin: '0 0 1rem 0' }}>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '50%' }}><BrainCircuit size={20} /></div>
              AI Extracted Requirements
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--success)" /> Soil Moisture Monitoring</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--success)" /> Temperature Monitoring</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--success)" /> Real-time Data Sync</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--success)" /> Mobile/Cloud Integration</li>
            </ul>
          </motion.div>
        </div>

        {/* Step 3 & 4: Hardware & Circuit */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(30,58,138,0.5), rgba(15,23,42,0.8))' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', margin: '0 0 1.5rem 0' }}>
              <div style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '0.5rem', borderRadius: '50%' }}><Cpu size={20} /></div>
              Recommended Hardware
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Microcontroller</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>ESP32 NodeMCU</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Droplets size={14} /> Soil Moisture Sensor
                </span>
                <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ThermometerSun size={14} /> DHT22 Temp/Hum
                </span>
                <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={14} /> Built-in WiFi
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', margin: '0 0 1rem 0' }}>
              <div style={{ background: 'rgba(245,158,11,0.1)', padding: '0.5rem', borderRadius: '50%' }}><Zap size={20} /></div>
              Automatic Wiring Map
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Component</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Sensor Pin</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>ESP32 Pin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>DHT22</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>VCC / GND / DATA</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--primary)', fontFamily: 'monospace' }}>3V3 / GND / D4</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>Soil Moisture</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>VCC / GND / A0</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--primary)', fontFamily: 'monospace' }}>3V3 / GND / D34</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Step 5: Code Magic */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', margin: 0 }}>
              <div style={{ background: 'rgba(139,92,246,0.1)', padding: '0.5rem', borderRadius: '50%' }}><Terminal size={20} /></div>
              Code Magic Generator
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setActiveCodeTab('cpp')}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: activeCodeTab === 'cpp' ? 'var(--accent)' : 'transparent', color: activeCodeTab === 'cpp' ? 'white' : 'var(--text-muted)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >Arduino / ESP32</button>
              <button 
                onClick={() => setActiveCodeTab('python')}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: activeCodeTab === 'python' ? 'var(--accent)' : 'transparent', color: activeCodeTab === 'python' ? 'white' : 'var(--text-muted)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >Raspberry Pi</button>
            </div>
          </div>
          
          <div style={{ background: '#050505', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleCopy(activeCodeTab === 'cpp' ? generatedCpp : generatedPython)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem' }}>
                {copied ? <CheckCircle2 size={16} color="var(--success)" /> : <Copy size={16} />}
              </button>
            </div>
            <pre style={{ padding: '2rem', color: '#f8fafc', fontSize: '0.875rem', fontFamily: 'monospace', overflowX: 'auto', margin: 0 }}>
              <code>{activeCodeTab === 'cpp' ? generatedCpp : generatedPython}</code>
            </pre>
          </div>
        </motion.div>

        {/* Step 6, 7, 8: Cloud, Docu, Deploy */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(14,165,233,0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#0ea5e9' }}>
              <Cloud size={24} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Cloud Connect</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ready to integrate with Firebase, MQTT, or AWS IoT.</p>
            <button className="btn" style={{ width: '100%', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>Configure Cloud</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(219,39,119,0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#db2777' }}>
              <FileText size={24} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Docu Create</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Automatically generated README and component list.</p>
            <button className="btn" style={{ width: '100%', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>View Docs</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', border: '2px solid var(--success)' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--success)' }}>
              <Smartphone size={24} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Test & Deploy</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Step-by-step guidance to upload code to your board.</p>
            <button className="btn btn-primary" style={{ width: '100%', background: 'var(--success)', boxShadow: '0 4px 14px 0 rgba(16,185,129,0.39)' }}>Deployment Guide</button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
