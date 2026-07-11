import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Activity, Zap } from 'lucide-react';

const BreadboardViewer = ({ hardware, connections }) => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Mock static layout for the prototype. In production, we'd map this perfectly.
  useEffect(() => {
    if (!hardware || !connections) return;
    
    // Draw some dynamic SVG curves simulating the wiring
    const generatedLines = connections.map((conn, idx) => {
      // Fake coordinates for the visual prototype
      const startX = 150; 
      const startY = 150 + (idx * 20);
      const endX = 400 + (idx * 30);
      const endY = 100 + (idx * 40);
      
      const path = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`;
      
      return (
        <path 
          key={idx}
          d={path}
          stroke={conn.color || "#8b5cf6"}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0px 0px 4px ${conn.color || "#8b5cf6"}80)` }}
        />
      );
    });
    
    setLines(generatedLines);
  }, [hardware, connections]);

  if (!hardware || !connections || connections.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginTop: '1.5rem', borderLeft: '4px solid #f43f5e' }}>
      <div style={{ padding: '1.5rem', background: 'rgba(244,63,94,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Zap size={20} color="#fb7185" />
        <h3 style={{ margin: 0, color: '#e2e8f0' }}>Interactive Breadboard UI</h3>
      </div>
      
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          background: '#0f172a', 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* SVG Wiring Layer */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          {lines}
        </svg>

        {/* Central Microcontroller Node */}
        <div style={{ 
          position: 'absolute', top: '100px', left: '50px', width: '120px', height: '200px', 
          background: '#1e293b', border: '2px solid #334155', borderRadius: '8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <Cpu size={32} color="#60a5fa" />
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '0 0.5rem' }}>
            {hardware.microcontroller.name.substring(0, 15)}...
          </div>
          
          {/* Fake Pins */}
          <div style={{ position: 'absolute', right: '-6px', top: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...Array(8)].map((_, i) => <div key={`r${i}`} style={{ width: '6px', height: '12px', background: '#fbbf24', borderRadius: '0 2px 2px 0' }} />)}
          </div>
        </div>

        {/* Peripheral Sensors */}
        {hardware.sensors.map((sensor, idx) => (
          <div key={idx} style={{ 
            position: 'absolute', top: `${80 + (idx * 120)}px`, left: `${400 + (idx * 30)}px`, 
            background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', borderRadius: '8px',
            padding: '1rem', width: '150px', zIndex: 2, backdropFilter: 'blur(4px)'
          }}>
            <Activity size={20} color="#34d399" />
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sensor.name}
            </div>
            {/* Fake Pins */}
            <div style={{ position: 'absolute', left: '-6px', top: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...Array(4)].map((_, i) => <div key={`l${i}`} style={{ width: '6px', height: '12px', background: '#fbbf24', borderRadius: '2px 0 0 2px' }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadboardViewer;
