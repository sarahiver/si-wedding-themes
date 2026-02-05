// core/editors/IconPicker.js - Reusable Icon Picker Popover
import React, { useState, useRef, useEffect } from 'react';

// Kuratierte Hochzeits-Icons nach Kategorien
const ICON_CATEGORIES = [
  {
    label: 'Zeremonie',
    icons: ['💒', '⛪', '💍', '🤵', '👰', '💐', '🕊️', '✨'],
  },
  {
    label: 'Feier',
    icons: ['🥂', '🍾', '🎉', '🥳', '🎊', '🪅', '🎈', '🎆'],
  },
  {
    label: 'Essen & Trinken',
    icons: ['🍽️', '☕', '🍰', '🎂', '🍔', '🍕', '🍷', '🍹'],
  },
  {
    label: 'Musik & Tanz',
    icons: ['💃', '🕺', '🎶', '🎵', '🎤', '🎸', '🎧', '🪩'],
  },
  {
    label: 'Tageszeit & Ort',
    icons: ['☀️', '🌅', '🌙', '⭐', '🌸', '🏰', '🌿', '🌊'],
  },
  {
    label: 'Sonstiges',
    icons: ['📸', '🎁', '💌', '🚗', '✈️', '🧳', '❤️', '🫶'],
  },
];

export { ICON_CATEGORIES };

export default function IconPicker({ value, onChange, components: C }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          padding: '0.6rem 0.8rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px',
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.85)',
          minHeight: '44px',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{value || '—'}</span>
        <span style={{
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginLeft: 'auto',
        }}>
          ▼
        </span>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          width: '280px',
          zIndex: 50,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          padding: '0.5rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          maxHeight: '320px',
          overflowY: 'auto',
        }}>
          {/* Kein Icon */}
          <div
            onClick={() => { onChange(''); setOpen(false); }}
            style={{
              padding: '0.4rem 0.6rem',
              marginBottom: '0.4rem',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            ✕ Kein Icon
          </div>

          {ICON_CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ marginBottom: '0.35rem' }}>
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                padding: '0.3rem 0.3rem 0.2rem',
              }}>
                {cat.label}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '2px',
              }}>
                {cat.icons.map((icon) => (
                  <div
                    key={icon}
                    onClick={() => { onChange(icon); setOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      padding: '0.35rem',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      background: value === icon ? 'rgba(255,255,255,0.12)' : 'transparent',
                      border: value === icon ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (value !== icon) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (value !== icon) e.currentTarget.style.background = 'transparent';
                    }}
                    title={icon}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
