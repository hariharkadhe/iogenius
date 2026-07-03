import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  BrainCircuit, User, LogOut, Send, Cpu, 
  Settings, Activity, Zap, CheckCircle2, Monitor, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Workspace = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Welcome to the Architect Workspace. Describe the IoT hardware system you want to build, and I will generate a complete implementation plan and component list for you.' }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  // Dynamic State for Hardware
  const [sensors, setSensors] = useState([]);
  const [outputs, setOutputs] = useState([]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isGenerating]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setChatHistory(prev => [...prev, { role: 'user', content: currentPrompt }]);
    setPrompt('');
    setIsGenerating(true);

    // Mock AI Logic to extract components based on text
    setTimeout(() => {
      let newSensors = [...sensors];
      let newOutputs = [...outputs];
      const text = currentPrompt.toLowerCase();
      let responseText = `I have analyzed your request for "${currentPrompt}". `;

      let addedSomething = false;

      // Check for Ultrasonic / Distance
      if (text.includes('ultrasonic') || text.includes('distance') || text.includes('gate')) {
        if (!newSensors.find(s => s.name.includes('Ultrasonic'))) {
          newSensors.push({
            name: 'HC-SR04 Ultrasonic Sensor',
            desc: 'Non-contact distance measurement module for object detection.',
            specs: ['Voltage: 5V DC', 'Range: 2cm to 400cm', 'Pins: VCC, TRIG, ECHO, GND']
          });
          addedSomething = true;
        }
      }

      // Check for Temp / Moisture / Greenhouse
      if (text.includes('temp') || text.includes('greenhouse') || text.includes('plant') || text.includes('moisture')) {
        if (!newSensors.find(s => s.name.includes('DHT22'))) {
          newSensors.push({
            name: 'DHT22 - Temperature & Humidity',
            desc: 'High precision digital sensor for accurate ambient atmosphere readings.',
            specs: ['Voltage: 3.3V to 5.5V DC', 'Signal: Single-bus digital', 'Range: 0-100% RH, -40 to 80°C']
          });
          newSensors.push({
            name: 'Capacitive Soil Moisture Sensor v1.2',
            desc: 'Corrosion-resistant analog sensor for measuring soil water content.',
            specs: ['Voltage: 3.3V to 5.5V DC', 'Signal: Analog Output']
          });
          addedSomething = true;
        }
      }

      // Check for Display / Screen
      if (text.includes('display') || text.includes('screen') || text.includes('oled') || text.includes('lcd')) {
        if (!newOutputs.find(o => o.name.includes('Display'))) {
          newOutputs.push({
            name: '0.96" OLED Display (SSD1306)',
            desc: 'High-contrast screen for on-device real-time data visualization.',
            specs: ['Resolution: 128x64 Pixels', 'Protocol: I2C (SDA/SCL)', 'Voltage: 3.3V Logic']
          });
          addedSomething = true;
        }
      }

      // Check for Motor / Servo / Relay
      if (text.includes('motor') || text.includes('servo') || text.includes('gate') || text.includes('pump')) {
        if (!newOutputs.find(o => o.name.includes('Servo'))) {
          newOutputs.push({
            name: 'SG90 Micro Servo Motor',
            desc: 'Small footprint motor for precise physical movement.',
            specs: ['Voltage: 4.8V - 6V', 'Control: PWM Signal', 'Torque: 1.8 kgf·cm']
          });
          addedSomething = true;
        }
      }
      
      if (text.includes('relay') || text.includes('light') || text.includes('pump') || text.includes('ac')) {
         if (!newOutputs.find(o => o.name.includes('Relay'))) {
            newOutputs.push({
              name: '5V Single-Channel Relay Module',
              desc: 'Electromagnetic switch to safely control high-power devices.',
              specs: ['Control: Digital High/Low', 'Capacity: 10A @ 250V AC']
            });
            addedSomething = true;
         }
      }

      // If it's the very first prompt and they didn't trigger anything specific, add some defaults to show it works
      if (sensors.length === 0 && outputs.length === 0 && !addedSomething) {
         newSensors.push({
            name: 'Generic Multi-Sensor Module',
            desc: 'Standard IoT sensing unit.',
            specs: ['Voltage: 3.3V', 'Protocol: I2C']
         });
         newOutputs.push({
            name: 'Status LED Indicator',
            desc: 'Basic visual feedback.',
            specs: ['Color: RGB', 'Control: PWM']
         });
         addedSomething = true;
      }

      if (addedSomething) {
        responseText += 'I have updated the hardware implementation plan on the right with the new components you requested.';
      } else {
        responseText += 'The requested components are already in your plan or I did not detect any new hardware requirements. Let me know if you need specific parts added!';
      }

      setSensors(newSensors);
      setOutputs(newOutputs);
      
      setChatHistory(prev => [...prev, { role: 'ai', content: responseText }]);
      setIsGenerating(false);
      setShowPlan(true);
    }, 1500);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <header style={{ height: '64px', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.95)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.25rem' }}>
          <BrainCircuit color="var(--primary)" size={24} /> <span className="text-gradient">IOGENIUS Architect</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} /> {user?.name || 'Developer'}
          </span>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn" style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Area (Split Screen) */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* LEFT PANEL: Chat / Project Input */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.6)' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} color="var(--primary)" /> Project Definition
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Discuss and refine your hardware requirements</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {chatHistory.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' 
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {msg.role === 'ai' ? <><BrainCircuit size={14} color="var(--primary)" /> System</> : <><User size={14} /> You</>}
                </div>
                <div style={{ 
                  background: msg.role === 'user' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}`,
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  borderTopLeftRadius: msg.role === 'ai' ? '0px' : '12px',
                  borderTopRightRadius: msg.role === 'user' ? '0px' : '12px',
                  maxWidth: '90%',
                  lineHeight: 1.5,
                  color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                  fontSize: '0.95rem'
                }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--primary)' }}>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.875rem' }}>Architect AI is compiling implementation plan...</span>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)' }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                placeholder="e.g. Add an ultrasonic sensor for the gate..."
                className="input-field"
                style={{ flex: 1, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button 
                type="submit" 
                disabled={!prompt.trim() || isGenerating}
                className="btn btn-primary"
                style={{ padding: '0 1.25rem', background: prompt.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: prompt.trim() ? 'white' : 'gray' }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Implementation Plan */}
        <div style={{ width: '60%', background: '#0a0f1c', overflowY: 'auto', position: 'relative' }}>
          
          <AnimatePresence mode="wait">
            {!showPlan ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
              >
                <Cpu size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 500 }}>Awaiting Project Details</h3>
                <p style={{ maxWidth: '400px', textAlign: 'center', lineHeight: 1.6, marginTop: '0.75rem', opacity: 0.7 }}>
                  Describe your IoT project in the left panel. The AI will generate a complete hardware specification plan here.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}
              >
                <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                  <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600, alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={16} /> Implementation Plan Ready
                  </div>
                  <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', letterSpacing: '-0.5px' }}>Hardware Architecture</h1>
                  <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Based on your requirements, here are the full technical specifications for all components needed to build this system.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Microcontroller */}
                  <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.2)', borderRadius: '12px', color: '#60a5fa' }}><Cpu size={24} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Recommended Microcontroller</h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>The core processing unit for your system.</p>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#60a5fa' }}>ESP32 NodeMCU (Wi-Fi/BT)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Operating Voltage</span>
                          <strong>3.3V Logic</strong> (5V USB Power Input)
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Processor Speed</span>
                          <strong>240 MHz</strong> (Dual Core Xtensa)
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Wireless Capabilities</span>
                          <strong>802.11 b/g/n Wi-Fi</strong> & Bluetooth v4.2 BR/EDR
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Usable GPIO</span>
                          <strong>~25 Pins</strong> (ADC, DAC, I2C, SPI, UART supported)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Sensors */}
                  <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderLeft: '4px solid #10b981' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.2)', borderRadius: '12px', color: '#34d399' }}><Activity size={24} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Input Sensors</h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Devices to capture environmental data.</p>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {sensors.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No sensors requested yet.</p>
                      ) : (
                        sensors.map((sensor, idx) => (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.125rem', color: '#34d399' }}>{sensor.name}</h4>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{sensor.desc}</p>
                            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', fontSize: '0.9rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {sensor.specs.map((spec, sIdx) => {
                                const parts = spec.split(': ');
                                return (
                                  <li key={sIdx}><strong>{parts[0]}:</strong> {parts[1]}</li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Output Devices & Actuators */}
                  <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(245,158,11,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.2)', borderRadius: '12px', color: '#fbbf24' }}><Monitor size={24} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Output Devices & Actuators</h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Displays, motors, relays, and visual indicators.</p>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {outputs.length === 0 ? (
                         <p style={{ color: 'var(--text-muted)' }}>No outputs requested yet.</p>
                      ) : (
                         outputs.map((output, idx) => (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.125rem', color: '#fbbf24' }}>{output.name}</h4>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{output.desc}</p>
                            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', fontSize: '0.9rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {output.specs.map((spec, sIdx) => {
                                const parts = spec.split(': ');
                                return (
                                  <li key={sIdx}><strong>{parts[0]}:</strong> {parts[1]}</li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
