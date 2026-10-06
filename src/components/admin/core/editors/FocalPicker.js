// src/components/admin/core/editors/FocalPicker.js
// Bildausschnitt für Desktop und Mobile getrennt festlegen.
//
// Statt nur eines Punktes: ein Rahmen im Seitenverhältnis der späteren
// Darstellung. Der Rahmen lässt sich über dem Bild verschieben, der Regler
// darunter macht den Ausschnitt enger oder weiter. Was im Rahmen liegt, ist
// später sichtbar — der Rest wird beschnitten.
import React, { useRef, useState } from 'react';
import { parseFocal, CENTER, MIN_ZOOM, MAX_ZOOM } from '../../../../lib/focalPoint';
import { optimizedUrl } from '../../../../lib/cloudinary';

const lbl = {
  fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)', marginBottom: '0.45rem', display: 'block',
};

function Crop({ image, ratio, point, onChange, label, hint }) {
  const boxRef = useRef(null);
  const dragging = useRef(false);
  const p = point || CENTER;
  const zoom = p.zoom || 1;

  // Je höher der Zoom, desto kleiner der Rahmen: bei zoom 2 ist später
  // die Hälfte des Bildes zu sehen.
  const fw = 100 / zoom;
  const fh = 100 / zoom;
  const clamp = (v, half) => Math.min(Math.max(v, half), 100 - half);
  const cx = clamp(p.x, fw / 2);
  const cy = clamp(p.y, fh / 2);

  const setFrom = (e) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const px = e.touches ? e.touches[0].clientX : e.clientX;
    const py = e.touches ? e.touches[0].clientY : e.clientY;
    onChange({
      ...p,
      x: Math.round(clamp(((px - r.left) / r.width) * 100, fw / 2)),
      y: Math.round(clamp(((py - r.top) / r.height) * 100, fh / 2)),
    });
  };

  const start = (e) => {
    dragging.current = true;
    setFrom(e);
    const move = (ev) => { if (dragging.current) { ev.preventDefault(); setFrom(ev); } };
    const end = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={lbl}>{label}</span>
      <div
        ref={boxRef}
        onMouseDown={start}
        onTouchStart={start}
        style={{
          position: 'relative', overflow: 'hidden', cursor: 'move',
          background: '#111', border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '6px', aspectRatio: ratio, userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Vollbild abgedunkelt — so sieht man, was wegfällt */}
        <img
          src={image} alt="" draggable={false}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            display: 'block', opacity: 0.35, pointerEvents: 'none',
          }}
        />
        {/* Der gewählte Ausschnitt, hell und mit Drittel-Linien */}
        <div style={{
          position: 'absolute',
          left: `${cx - fw / 2}%`, top: `${cy - fh / 2}%`,
          width: `${fw}%`, height: `${fh}%`,
          overflow: 'hidden', pointerEvents: 'none',
          boxShadow: '0 0 0 1px #fff, 0 0 0 9999px rgba(0,0,0,0.5)',
        }}>
          <img
            src={image} alt="" draggable={false}
            style={{
              position: 'absolute',
              left: `${-(cx - fw / 2) * (100 / fw)}%`,
              top: `${-(cy - fh / 2) * (100 / fh)}%`,
              width: `${100 / fw * 100}%`,
              height: `${100 / fh * 100}%`,
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'linear-gradient(to right, transparent 33.2%, rgba(255,255,255,0.18) 33.2%, rgba(255,255,255,0.18) 33.5%, transparent 33.5%, transparent 66.2%, rgba(255,255,255,0.18) 66.2%, rgba(255,255,255,0.18) 66.5%, transparent 66.5%),'
              + 'linear-gradient(to bottom, transparent 33.2%, rgba(255,255,255,0.18) 33.2%, rgba(255,255,255,0.18) 33.5%, transparent 33.5%, transparent 66.2%, rgba(255,255,255,0.18) 66.2%, rgba(255,255,255,0.18) 66.5%, transparent 66.5%)',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.55rem' }}>
        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Weit</span>
        <input
          type="range" min={MIN_ZOOM} max={MAX_ZOOM} step="0.05" value={zoom}
          onChange={e => onChange({ ...p, zoom: Number(e.target.value) })}
          style={{ flex: 1, accentColor: '#C08A4E' }}
        />
        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Eng</span>
      </div>
      {hint && (
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem', lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default function FocalPicker({ image, value, onChange, desktopRatio = '16 / 9' }) {
  const [focal, setFocal] = useState(parseFocal(value));
  const [broken, setBroken] = useState(false);

  if (!image || broken) return null;

  // f_auto: ohne Umwandlung bleibt ein HEIC-Upload außerhalb von Safari leer
  const preview = optimizedUrl.preview(image);
  const push = (next) => { setFocal(next); onChange(next); };

  return (
    <div style={{ marginTop: '1rem' }}>
      <span style={{ ...lbl, marginBottom: '0.7rem' }}>
        Bildausschnitt — Rahmen verschieben, Regler für die Nähe
      </span>
      <img src={preview} alt="" onError={() => setBroken(true)} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <Crop
            image={preview} ratio={desktopRatio} label="Desktop"
            point={focal.desktop}
            onChange={pt => push({ ...focal, desktop: pt })}
          />
        </div>
        <div style={{ flex: '0 0 165px', maxWidth: '165px' }}>
          <Crop
            image={preview} ratio="9 / 16" label="Mobile"
            point={focal.mobile || focal.desktop}
            onChange={pt => push({ ...focal, mobile: pt })}
            hint="Eigener Ausschnitt fürs Handy"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => push({ desktop: CENTER, mobile: null })}
        style={{
          marginTop: '0.8rem', padding: '0.45rem 0.85rem', fontSize: '0.7rem',
          background: 'transparent', color: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.18)', borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Zurücksetzen
      </button>
    </div>
  );
}
