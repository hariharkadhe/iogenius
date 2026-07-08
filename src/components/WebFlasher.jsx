import React, { useState } from 'react';
import { Usb, AlertCircle, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';

const WebFlasher = ({ code, language }) => {
  const [port, setPort] = useState(null);
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, compiling, flashing, success, error
  const [errorMsg, setErrorMsg] = useState('');

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
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem', borderTop: '4px solid #0ea5e9' }}>
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
          <button onClick={disconnectSerial} className="btn" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            Disconnect
          </button>
        )}

        <button 
          disabled={status !== 'connected' || !code}
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          <UploadCloud size={18} /> Compile & Flash
        </button>
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
