import React, { useRef } from 'react';
import { Cpu, Activity, Zap, Monitor } from 'lucide-react';

const BreadboardViewer = ({ hardware, connections }) => {
  const containerRef = useRef(null);

  if (!hardware || !connections || connections.length === 0) return null;

  // Group all peripherals (sensors + outputs)
  const peripherals = [...(hardware.sensors || []), ...(hardware.outputs || [])];
  
  // Identify unique MCU pins used across all connections
  const mcuPins = Array.from(new Set(connections.map(c => c.to_pin)));
  
  const MCU_X = 50;
  const MCU_Y = 50;
  const MCU_WIDTH = 140;
  const MCU_HEIGHT = Math.max(200, mcuPins.length * 35 + 100);

  // Map to store actual (X,Y) coordinates of rendered pins so we can draw exact SVG lines
  const pinCoords = {};

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginTop: '1.5rem', borderLeft: '4px solid #f43f5e' }}>
      <div style={{ padding: '1.5rem', background: 'rgba(244,63,94,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Zap size={20} color="#fb7185" />
        <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Interactive Breadboard UI</h3>
      </div>
      
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: `${Math.max(MCU_HEIGHT + 100, peripherals.length * 160 + 100)}px`, 
          background: 'var(--bg-main)', 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      >
        
        {/* Central Microcontroller Node */}
        <div style={{ 
          position: 'absolute', top: `${MCU_Y}px`, left: `${MCU_X}px`, width: `${MCU_WIDTH}px`, height: `${MCU_HEIGHT}px`, 
          background: 'var(--bg-secondary)', border: '2px solid var(--border-color)', borderRadius: '8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ marginTop: '1.5rem' }}><Cpu size={36} color="var(--primary)" /></div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0 0.5rem', fontWeight: 600 }}>
            {hardware.microcontroller.name}
          </div>
          
          {/* MCU Pins */}
          <div style={{ position: 'absolute', right: '0', top: '100px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end', width: '100%' }}>
            {mcuPins.map((pin, i) => {
              const pinY = MCU_Y + 100 + (i * 32) + 6; // center of physical pin
              const pinX = MCU_X + MCU_WIDTH;
              pinCoords[`mcu_${pin}`] = { x: pinX, y: pinY };
              
              return (
                <div key={pin} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 'bold' }}>{pin}</span>
                  <div style={{ width: '8px', height: '12px', background: '#fbbf24', borderRadius: '4px 0 0 4px', marginRight: '-2px' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Peripheral Nodes (Sensors & Outputs) */}
        {peripherals.map((device, pIdx) => {
          const DEVICE_X = 450;
          const DEVICE_Y = 50 + (pIdx * 160);
          
          // Find all connections routed to this specific device
          // We match strings loosely since AI might truncate names (e.g. "DHT11" vs "DHT11 Temperature Sensor")
          const deviceConns = connections.filter(c => 
             device.name.toLowerCase().includes(c.from_component.toLowerCase()) || 
             c.from_component.toLowerCase().includes(device.name.toLowerCase().substring(0, 5))
          );
          
          return (
            <div key={pIdx} style={{ 
              position: 'absolute', top: `${DEVICE_Y}px`, left: `${DEVICE_X}px`, 
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px',
              padding: '1rem', width: '220px', zIndex: 2, backdropFilter: 'blur(4px)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {device.connection_type && device.connection_type.toLowerCase().includes('output') ? 
                  <Monitor size={18} color="var(--warning)" /> : 
                  <Activity size={18} color="var(--success)" />
                }
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                  {device.name}
                </div>
              </div>
              
              {/* Device Pins */}
              <div style={{ position: 'absolute', left: '-2px', top: '50px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {deviceConns.map((conn, cIdx) => {
                  const pinY = DEVICE_Y + 50 + (cIdx * 32) + 6;
                  const pinX = DEVICE_X;
                  // Generate unique coordinate key
                  pinCoords[`device_${pIdx}_${conn.from_pin}`] = { x: pinX, y: pinY };
                  
                  return (
                    <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '12px', background: '#fbbf24', borderRadius: '0 4px 4px 0', marginLeft: '-2px' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 'bold' }}>{conn.from_pin}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* SVG Wiring Engine Overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          {connections.map((conn, idx) => {
            // Locate the device index for this connection
            const pIdx = peripherals.findIndex(p => 
              p.name.toLowerCase().includes(conn.from_component.toLowerCase()) || 
              conn.from_component.toLowerCase().includes(p.name.toLowerCase().substring(0, 5))
            );
            
            const fromCoord = pinCoords[`device_${pIdx}_${conn.from_pin}`];
            const toCoord = pinCoords[`mcu_${conn.to_pin}`];
            
            // If coords aren't calculated for some reason, skip drawing the line
            if (!fromCoord || !toCoord) return null;
            
            const startX = toCoord.x;
            const startY = toCoord.y;
            const endX = fromCoord.x;
            const endY = fromCoord.y;
            
            // Create a nice smooth bezier curve for the wire
            const cp1X = startX + (endX - startX) / 2;
            const cp1Y = startY;
            const cp2X = startX + (endX - startX) / 2;
            const cp2Y = endY;
            
            const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
            const wireColor = conn.color || "#8b5cf6";
            
            return (
              <g key={idx}>
                {/* Glow shadow */}
                <path d={path} stroke={wireColor} strokeWidth="8" fill="none" opacity="0.25" strokeLinecap="round" />
                {/* Solid core wire */}
                <path d={path} stroke={wireColor} strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BreadboardViewer;
