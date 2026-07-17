import React from 'react';
import { ShoppingCart as CartIcon, ExternalLink } from 'lucide-react';

const ShoppingCart = ({ hardware }) => {
  if (!hardware) return null;

  const components = [
    hardware.microcontroller,
    ...(hardware.sensors || []),
    ...(hardware.outputs || [])
  ].filter(Boolean);

  const totalCost = components.reduce((acc, curr) => {
    return acc + (parseFloat(curr.estimated_price) || 0);
  }, 0);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', borderLeft: '4px solid var(--success)' }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
        <CartIcon size={20} color="var(--success)" /> Estimated Shopping Cart
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {components.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc || item.connection_type}</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                ${(parseFloat(item.estimated_price) || 0).toFixed(2)}
              </div>
              <a 
                href={item.purchase_link || `https://www.amazon.com/s?k=${encodeURIComponent(item.name)}`}
                target="_blank" 
                rel="noreferrer"
                className="btn"
                style={{ padding: '0.4rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.85rem' }}
              >
                Buy Now <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Total Estimated Cost:</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>${totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ShoppingCart;
