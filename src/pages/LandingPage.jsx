import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Cpu, Zap, ArrowRight, ShieldCheck, Database, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
          <BrainCircuit color="var(--primary)" size={32} /> 
          <span className="text-gradient">IOGENIUS</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn" style={{ background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>Sign In</Link>
          <Link to="/signup" className="btn btn-primary">Start Building</Link>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Animated Background Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -1 }} 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -1 }} 
          />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid rgba(59,130,246,0.3)', marginBottom: '2rem', fontWeight: 600, cursor: 'default' }}>
                <Zap size={16} /> Introducing the Future of IoT Development
              </motion.div>
              
              <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gradient">Turn your ideas</motion.span> into <br />
                <span style={{ color: 'var(--text-main)' }}>deployable hardware.</span>
              </h1>
            
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
              Describe your project in simple words. Our AI automatically extracts requirements, builds circuit maps, and generates the exact C++ and Python code you need.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Build Your First Project <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem', background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How it works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>From a simple prompt to a fully working IoT system in seconds.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <motion.div whileHover={{ y: -8, scale: 1.02 }} className="glass-card" style={{ padding: '2.5rem', borderTop: '4px solid var(--primary)', transition: 'all 0.3s ease' }}>
              <div style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(59,130,246,0.2)' }}>
                <BrainCircuit size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 700 }}>AI Requirement Engine</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Simply type what you want to build. Our AI reads your prompt and intelligently extracts all hardware, sensor, and logical requirements instantly.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8, scale: 1.02 }} className="glass-card" style={{ padding: '2.5rem', borderTop: '4px solid var(--accent)', transition: 'all 0.3s ease' }}>
              <div style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(139,92,246,0.2)' }}>
                <Cpu size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 700 }}>Smart Circuit Mapping</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>No more guessing which pin goes where. Get an auto-generated, visually clean wiring map matching your specific microcontroller and sensors.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8, scale: 1.02 }} className="glass-card" style={{ padding: '2.5rem', borderTop: '4px solid var(--success)', transition: 'all 0.3s ease' }}>
              <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(16,185,129,0.2)' }}>
                <Database size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 700 }}>Deployable Code</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Generate production-ready C++ (for Arduino/ESP32) and Python (for Raspberry Pi) code, fully integrated with cloud data transmission.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} IOGENIUS. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
