import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Sparkles, ArrowRight, BrainCircuit, LogOut, User, Zap, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IdeaInput = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Establishing neural link...",
    "Analyzing requirement functionality...",
    "Extracting sensor and hardware needs...",
    "Recommending optimal microcontroller...",
    "Drafting automatic circuit diagram...",
    "Compiling C++ & Python code magic...",
    "Preparing Cloud integrations..."
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setLoadingStep(step);
      if (step >= loadingSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/dashboard', { state: { idea: prompt } });
        }, 500);
      }
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Glowing Background Orbs */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }} 
        transition={{ duration: 5, repeat: Infinity }}
        style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }} 
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.5, 1] }} 
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1 }} 
      />

      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(20px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.25rem' }}>
          <BrainCircuit color="var(--primary)" size={24} /> <span className="text-gradient">IOGENIUS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} /> {user?.name}
          </span>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div 
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              style={{ width: '100%', maxWidth: '800px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)', borderRadius: '50px', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                >
                  <Sparkles size={16} /> Powered by Advanced AI
                </motion.div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
                  What will we <span className="text-gradient">build</span> today?
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
                  Enter your project idea below. The AI will handle the circuit, the hardware, and the code.
                </p>
              </div>

              <form onSubmit={handleGenerate}>
                <motion.div 
                  whileFocus="focus"
                  variants={{
                    focus: { boxShadow: '0 0 0 2px var(--primary), 0 0 40px rgba(59,130,246,0.3)' }
                  }}
                  className="glass-card" 
                  style={{ padding: '0.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.7)' }}
                >
                  {/* Subtle scanning laser effect */}
                  <motion.div 
                    animate={{ y: ['-100%', '800%'] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.5, zIndex: 0 }}
                  />

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', color: 'var(--primary)', flexShrink: 0 }}>
                      <TerminalSquare size={24} />
                    </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., I want to build a system that monitors soil moisture and temperature and sends data to my mobile phone..."
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '1.25rem',
                        lineHeight: '1.6',
                        padding: '0.25rem 0',
                        minHeight: '120px',
                        background: 'transparent',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-sans)'
                      }}
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1rem 1rem 0', position: 'relative', zIndex: 1 }}>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={!prompt.trim()}
                      style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '16px', background: prompt.trim() ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--primary)', transition: 'all 0.3s ease' }}
                    >
                      <Zap size={20} fill={prompt.trim() ? "white" : "none"} /> Initialize AI Builder
                    </button>
                  </div>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="loading-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}
            >
              <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 3rem' }}>
                {/* Glowing rotating rings */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed var(--primary)', opacity: 0.5 }} />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', opacity: 0.8 }} />
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', inset: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }}>
                  <BrainCircuit size={60} color="white" />
                </motion.div>
              </div>
              
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
                <span className="text-gradient">Compiling Project Architecture...</span>
              </h2>
              
              <div style={{ height: '40px', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 500, position: 'absolute', width: '100%', fontFamily: 'monospace' }}
                  >
                    > {loadingSteps[Math.min(loadingStep, loadingSteps.length - 1)]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(loadingStep / loadingSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))', height: '100%', boxShadow: '0 0 20px var(--primary)' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default IdeaInput;
