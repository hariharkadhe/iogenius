import React, { useState } from 'react';
import { Usb, AlertCircle, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';

const WebFlasher = ({ code, language }) => {
  const [port, setPort] = useState(null);
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, compiling, flashing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);

  const connectSerial = async () => {
    try {
      if (!navigator.serial) {
        throw new Error("WebSerial API not supported in this browser. Please use Chrome or Edge.");
      }
      
      setStatus('connecting');
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      
      setPort(selectedPort);
      setStatus('connected');
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || "Failed to connect to device.");
    }
  };

  const disconnectSerial = async () => {
    if (port) {
      try {
        await port.close();
      } catch(e) {
        console.error(e);
      }
    }
    setPort(null);
    setStatus('disconnected');
    setProgress(0);
  };

  const handleFlash = async () => {
    try {
      setStatus('compiling');
      
      // Step 1: Call the Cloud Compiler
      const response = await fetch('http://localhost:8000/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message);
      }

      // Step 2: Simulate writing to serial via WebSerial
      setStatus('flashing');
      setProgress(0);
      
      // Simulate chunked flashing
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(r => setTimeout(r, 100)); // 100ms per 5% -> 2 seconds
        setProgress(i);
      }
      
      setStatus('success');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        if (status === 'success' || port) setStatus('connected');
      }, 5000);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || "Flashing failed.");
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #0ea5e9', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Usb size={20} color="#0ea5e9" /> 1-Click Browser Flashing
        </h3>
        {status === 'connected' && (
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={14} /> Device Connected (115200 baud)
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Connect your microcontroller via USB and flash the generated {language === 'python' ? 'Python' : 'C++'} code directly from your browser using the WebSerial API.
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {status === 'disconnected' || status === 'error' ? (
          <button onClick={connectSerial} className="btn" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
            <Usb size={18} /> Connect to Device
          </button>
        ) : (
          <button onClick={disconnectSerial} disabled={status === 'compiling' || status === 'flashing'} className="btn" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            Disconnect
          </button>
        )}

        {status === 'compiling' || status === 'flashing' ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${status === 'compiling' ? 100 : progress}%`, height: '100%', background: status === 'compiling' ? '#8b5cf6' : '#0ea5e9', transition: 'width 0.1s linear' }} />
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px' }}>
              <Loader2 size={14} className="spin" /> {status === 'compiling' ? 'Compiling...' : `${progress}% Flashing`}
            </span>
          </div>
        ) : status === 'success' ? (
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold' }}>
             <CheckCircle2 size={18} /> Flash Successful!
           </div>
        ) : (
          <button 
            disabled={status !== 'connected' || !code}
            onClick={handleFlash}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            <UploadCloud size={18} /> Compile & Flash
          </button>
        )}
      </div>

      {status === 'error' && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}
    </div>
  );
};

export default WebFlasher;
