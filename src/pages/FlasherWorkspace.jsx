import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Terminal, ArrowLeft, Code } from 'lucide-react';
import WebFlasher from '../components/WebFlasher';

const FlasherWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { code, language } = location.state || { code: '// No code provided', language: 'cpp' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn" 
          style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem', marginRight: '1rem' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '-0.5px' }}>Device Deployment Workspace</h1>
      </header>

      {/* Split Screen Layout */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', overflow: 'hidden' }}>
        
        {/* Left Side: Code Viewer */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div className="glass-card" style={{ flex: 1, padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderTop: '4px solid #6366f1' }}>
             <div style={{ padding: '1rem', background: '#1e293b', borderBottom: '1px solid #0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace', color: '#a5b4fc', fontWeight: 'bold' }}>
                 <Code size={18} /> Source Code ({language})
               </span>
             </div>
             <div style={{ flex: 1, overflowY: 'auto', background: '#0f172a' }}>
               <pre style={{ margin: 0, padding: '1.5rem', color: '#f8fafc', fontSize: '0.9rem', lineHeight: 1.5, fontFamily: 'monospace' }}>
                 <code>{code}</code>
               </pre>
             </div>
          </div>
        </div>

        {/* Right Side: Flasher */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', borderTop: '4px solid #10b981' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Terminal size={20} color="#34d399" />
               <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.125rem' }}>1-Click Browser Flasher</h3>
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
               <WebFlasher code={code} language={language} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default FlasherWorkspace;
