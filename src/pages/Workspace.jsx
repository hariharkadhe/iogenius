import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  BrainCircuit, User, LogOut, Send, Cpu, 
  Settings, Activity, Zap, CheckCircle2, Monitor, Loader2,
  Code, Terminal, Cloud, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Workspace = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Welcome to the Architect Workspace. Describe the IoT hardware system you want to build, and I will generate a complete implementation plan.' }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data from Python Backend
  const [hardware, setHardware] = useState(null);
  const [software, setSoftware] = useState(null);
  
  const [showCode, setShowCode] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isGenerating]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    const updatedHistory = [...chatHistory, { role: 'user', content: currentPrompt }];
    setChatHistory(updatedHistory);
    setPrompt('');
    setIsGenerating(true);
    setShowCode(false); // Reset output view

    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: updatedHistory })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setHardware(data.hardware);
        setSoftware(data.software);
        setChatHistory(prev => [...prev, { role: 'ai', content: data.message }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', content: "An error occurred while generating the plan." }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Error connecting to the Architect Backend. Make sure the Python server is running!" }]);
    } finally {
      setIsGenerating(false);
    }
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
        <div style={{ width: '35%', minWidth: '400px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.6)' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} color="var(--primary)" /> Project Definition
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Discuss and refine your requirements</p>
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
                  background: msg.role === 'user' ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}`,
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  borderTopLeftRadius: msg.role === 'ai' ? '0px' : '12px',
                  borderTopRightRadius: msg.role === 'user' ? '0px' : '12px',
                  maxWidth: '90%',
                  lineHeight: 1.5,
                  color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--primary)' }}>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.875rem' }}>Backend AI is compiling implementation plan...</span>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)' }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '0.75rem' }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (prompt.trim() && !isGenerating) {
                      handleGenerate(e);
                    }
                  }
                }}
                disabled={isGenerating}
                placeholder="e.g. Build an automated greenhouse monitor..."
                className="input-field"
                style={{ 
                  flex: 1, 
                  background: 'rgba(15, 23, 42, 0.8)', 
                  resize: 'none', 
                  minHeight: '60px', 
                  padding: '1rem 1.25rem',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.5'
                }}
                rows={2}
              />
              <button 
                type="submit" 
                disabled={!prompt.trim() || isGenerating}
                className="btn btn-primary"
                style={{ padding: '0 1.5rem', background: prompt.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: prompt.trim() ? 'white' : 'gray', height: '60px', borderRadius: '12px' }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Implementation Plan & Output System */}
        <div style={{ width: '65%', background: 'var(--bg-main)', overflowY: 'auto', position: 'relative' }}>
          
          <AnimatePresence mode="wait">
            {!hardware ? (
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
                  Describe your IoT project in the left panel. The Python Backend will generate a complete hardware and software specification plan here.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto' }}
              >
                <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                  <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600, alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={16} /> Backend Implementation Ready
                  </div>
                  <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', letterSpacing: '-0.5px' }}>Project Architecture</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* HARDWARE SECTION */}
                  <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Hardware Required</h2>
                  
                  {/* Microcontroller */}
                  <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.2)', borderRadius: '12px', color: '#60a5fa' }}><Cpu size={24} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Recommended Microcontroller</h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{hardware.microcontroller.desc}</p>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#60a5fa' }}>{hardware.microcontroller.name}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                        {hardware.microcontroller.specs.map((spec, sIdx) => {
                          const parts = spec.split(': ');
                          return (
                             <div key={sIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>{parts[0]}</span>
                                <strong>{parts[1]}</strong>
                             </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Input Sensors */}
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid #10b981' }}>
                      <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity size={20} color="#34d399" /> <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Sensors</h3>
                      </div>
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {hardware.sensors.map((s, idx) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#34d399' }}>{s.name}</h4>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{s.specs.join(' | ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outputs */}
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid #f59e0b' }}>
                      <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Monitor size={20} color="#fbbf24" /> <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Outputs & Actuators</h3>
                      </div>
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {hardware.outputs.map((o, idx) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>{o.name}</h4>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{o.desc}</p>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{o.specs.join(' | ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SOFTWARE SECTION */}
                  <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!showCode ? (
                      <button onClick={() => setShowCode(true)} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem', borderRadius: '50px' }}>
                        <Code size={24} /> Generate Code & Instructions
                      </button>
                    ) : (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h2 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Software & Deployment</h2>
                        
                        {/* Source Code */}
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                           <div style={{ padding: '1rem', background: '#1e293b', borderBottom: '1px solid #0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace', color: '#a5b4fc' }}><Terminal size={16} /> main.{software.language === 'python' ? 'py' : 'cpp'}</span>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{software.language === 'python' ? 'Python Script' : 'Embedded C++'}</span>
                           </div>
                           <pre style={{ margin: 0, padding: '1.5rem', background: '#0f172a', color: '#f8fafc', overflowX: 'auto', fontSize: '0.9rem', lineHeight: 1.5, fontFamily: 'monospace' }}>
                             <code>{software.code}</code>
                           </pre>
                        </div>

                        {/* IDE Steps */}
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                           <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Terminal size={20} color="var(--primary)" /> IDE Execution Guide</h3>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                             {software.ide_steps.map((step, idx) => (
                               <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                 <div style={{ background: 'var(--primary)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</div>
                                 <div>
                                   <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#e2e8f0' }}>{step.title}</strong>
                                   <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{step.desc}</span>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>

                        {/* Cloud Steps */}
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
                           <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cloud size={20} color="var(--accent)" /> Cloud Integration Guide</h3>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                             {software.cloud_steps.map((step, idx) => (
                               <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                 <div style={{ background: 'var(--accent)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</div>
                                 <div>
                                   <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#e2e8f0' }}>{step.title}</strong>
                                   <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{step.desc}</span>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>

                      </motion.div>
                    )}
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
