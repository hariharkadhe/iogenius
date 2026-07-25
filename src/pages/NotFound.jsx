import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
      >
        <div style={{ display: 'inline-flex', background: 'rgba(59,130,246,0.1)', padding: '1.5rem', borderRadius: '50%' }}>
          <BrainCircuit size={48} color="var(--primary)" />
        </div>

        <h1 style={{ fontSize: '6rem', fontWeight: 800, margin: 0, lineHeight: 1 }} className="text-gradient">
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.6, margin: 0 }}>
          Looks like this circuit is disconnected. The page you are looking for does not exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}>
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
