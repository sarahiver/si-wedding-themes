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

  const clamp = (v) => Math.min(Math.max(v, 0), 100);

  const coords = (e) => ({
    x: e.touches ? e.touches[0].clientX : e.clientX,
    y: e.touches ? e.touches[0].clientY : e.clientY,
  });

  // Relativ verschieben statt absolut setzen: Das Bild springt sonst bei
  // jedem Klick an die Zeigerposition. Jetzt bewegt es sich nur um die
  // zurückgelegte Strecke — wie das Verschieben einer Karte.
  const pan = (e) => {
    const box = boxRef.current;
    const from = dragging.current;
    if (!box || !from) return;
    const { x: px, y: py } = coords(e);
    const r = box.getBoundingClientRect();
    // Umgekehrtes Vorzeichen: zieht man nach rechts, wandert der
    // Bildinhalt nach rechts, der Ausschnitt also nach links.
    const dx = ((px - from.px) / r.width) * 100 * -1;
    const dy = ((py - from.py) / r.height) * 100 * -1;
    onChange({
      ...p,
      x: Math.round(clamp(from.x + dx)),
      y: Math.round(clamp(from.y + dy)),
    });
  };

  const start = (e) => {
    const c = coords(e);
    dragging.current = { px: c.x, py: c.y, x: p.x, y: p.y };
    const move = (ev) => { if (dragging.current) { ev.preventDefault(); pan(ev); } };
    const end = () => {
      dragging.current = null;
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
      {/* Die Vorschau nutzt exakt dieselben CSS-Regeln wie das Frontend:
          background-position aus x/y, background-size aus dem Zoom. Dadurch
          kann das Ergebnis gar nicht von der Vorschau abweichen. Vorher
          hatte ich den Ausschnitt mit einem zweiten Bild nachgebaut — das
          rechnete den Versatz falsch. */}
      <div
        ref={boxRef}
        onMouseDown={start}
        onTouchStart={start}
        style={{
          position: 'relative', overflow: 'hidden', cursor: 'move',
          background: '#111', border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '6px', aspectRatio: ratio, userSelect: 'none',
          touchAction: 'none',
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${p.x}% ${p.y}%`,
          backgroundSize: zoom <= 1 ? 'cover' : `${zoom * 100}%`,
        }}
      >
        {/* Drittel-Linien als Gestaltungshilfe */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(to right, transparent 33.2%, rgba(255,255,255,0.22) 33.2%, rgba(255,255,255,0.22) 33.5%, transparent 33.5%, transparent 66.2%, rgba(255,255,255,0.22) 66.2%, rgba(255,255,255,0.22) 66.5%, transparent 66.5%),'
            + 'linear-gradient(to bottom, transparent 33.2%, rgba(255,255,255,0.22) 33.2%, rgba(255,255,255,0.22) 33.5%, transparent 33.5%, transparent 66.2%, rgba(255,255,255,0.22) 66.2%, rgba(255,255,255,0.22) 66.5%, transparent 66.5%)',
        }} />
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
        Bildausschnitt — Bild ziehen zum Verschieben, Regler für die Nähe
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
          {/* 4:5 statt 9:16: Auf dem Handy wird nicht die ganze Section
              mit Bild gefüllt, sondern ein Band in der Mitte, das oben und
              unten ausläuft. Die Vorschau zeigt dieses Band. */}
          <Crop
            image={preview} ratio="4 / 5" label="Mobile"
            point={focal.mobile || focal.desktop}
            onChange={pt => push({ ...focal, mobile: pt })}
            hint="Sichtbares Band auf dem Handy — oben und unten läuft es aus"
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
