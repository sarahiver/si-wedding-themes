// src/components/admin/core/editors/FocalPicker.js
// Klick ins Bild setzt den Punkt, der beim Zuschneiden sichtbar bleibt.
//
// Zwei Vorschauen nebeneinander — Desktop im Querformat, Mobile im
// Hochformat. So sieht das Paar unmittelbar, was auf dem Handy abgeschnitten
// wird, statt es im Nachhinein zu entdecken.
import React, { useState } from 'react';
import { parseFocal, toCss, CENTER } from '../../../../lib/focalPoint';

const box = {
  position: 'relative', overflow: 'hidden', cursor: 'crosshair',
  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '6px',
};
const dot = {
  position: 'absolute', width: '18px', height: '18px', marginLeft: '-9px',
  marginTop: '-9px', borderRadius: '50%', border: '2px solid #fff',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)',
  pointerEvents: 'none',
};
const lbl = {
  fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', display: 'block',
};

function Pane({ image, ratio, point, onSet, label }) {
  const pick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSet({
      x: Math.round(((e.clientX - r.left) / r.width) * 100),
      y: Math.round(((e.clientY - r.top) / r.height) * 100),
    });
  };
  const p = point || CENTER;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={lbl}>{label}</span>
      <div style={{ ...box, aspectRatio: ratio }} onClick={pick}>
        <img
          src={image}
          alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: toCss(p), display: 'block',
          }}
        />
        <span style={{ ...dot, left: `${p.x}%`, top: `${p.y}%` }} />
      </div>
    </div>
  );
}

/**
 * @param {string} image  Bild-URL
 * @param {object|string} value  gespeicherter Fokuswert
 * @param {function} onChange  erhält das neue Objekt
 */
export default function FocalPicker({ image, value, onChange }) {
  const initial = parseFocal(value);
  const [focal, setFocal] = useState(initial);

  if (!image) return null;

  const push = (next) => { setFocal(next); onChange(next); };

  return (
    <div style={{ marginTop: '0.9rem' }}>
      <span style={{ ...lbl, marginBottom: '0.7rem' }}>
        Bildausschnitt — klickt auf den Punkt, der sichtbar bleiben soll
      </span>
      <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
        <Pane
          image={image} ratio="16 / 9" label="Desktop"
          point={focal.desktop}
          onSet={p => push({ ...focal, desktop: p })}
        />
        <div style={{ width: '38%', maxWidth: '150px' }}>
          <Pane
            image={image} ratio="9 / 16" label="Mobile"
            point={focal.mobile || focal.desktop}
            onSet={p => push({ ...focal, mobile: p })}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => push({ desktop: CENTER, mobile: null })}
        style={{
          marginTop: '0.7rem', padding: '0.4rem 0.8rem', fontSize: '0.7rem',
          background: 'transparent', color: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.18)', borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Zurück auf Bildmitte
      </button>
    </div>
  );
}
