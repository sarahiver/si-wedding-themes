// src/themes/parallax/HtmlContent.js
// Scattered bold titles across the page + Hero with countdown + Footer

import { useState, useEffect, useRef } from 'react'
import { HERO_TXT, FOOTER } from './scrollConfig'

function useCountdown(weddingDate) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, past: false })
  useEffect(() => {
    if (!weddingDate) return
    const target = new window.Date(weddingDate)
    const tick = () => {
      const diff = target - new window.Date()
      if (diff <= 0) { setT(p => ({ ...p, past: true })); return }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        past: false,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [weddingDate])
  return t
}

const p2 = n => String(n).padStart(2, '0')

// White block zone (only Hero + Footer)
function TextZone({ range, children }) {
  const top = range[0] * 100
  const height = range[1] * 100
  return (
    <div style={{
      position: 'absolute',
      top: `${top}vh`,
      left: 0,
      width: '100vw',
      height: `${height}vh`,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    }}>
      {children}
    </div>
  )
}

// Clickable title — scattered across the page
function ScatteredTitle({ text, modalId, onOpenModal, style }) {
  const ref = useRef(null)
  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    onOpenModal?.(modalId, origin, text)
  }
  return (
    <h2
      ref={ref}
      onClick={handleClick}
      style={{
        position: 'absolute',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 800,
        color: '#000',
        background: '#fff',
        padding: '0.15em 0.4em',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        margin: 0,
        cursor: 'pointer',
        zIndex: 2,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </h2>
  )
}

// ── Layout: scattered titles across the full scroll page ──
// Positions in vh, alternating left/right, varying sizes
const TITLES = [
  { id: 'lovestory',      text: 'Love Story',      top: 75,  left: '6%',              size: 'clamp(3rem, 7vw, 6rem)' },
  { id: 'timeline',       text: 'Tagesablauf',     top: 140, right: '8%',             size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'dresscode',      text: 'Dresscode',       top: 210, left: '22%',             size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'rsvp',           text: 'RSVP',            top: 275, right: '10%',            size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'locations',      text: 'Locations',       top: 340, left: '8%',              size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'gallery',        text: 'Galerie',         top: 405, right: '5%',             size: 'clamp(3rem, 7vw, 6rem)' },
  { id: 'gifts',          text: 'Geschenke',       top: 470, left: '12%',             size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'guestbook',      text: 'Gästebuch',       top: 535, right: '12%',            size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'musicwishes',    text: 'Musikwünsche',    top: 595, left: '3%',              size: 'clamp(2rem, 4.5vw, 3.5rem)' },
  { id: 'photoupload',    text: 'Eure Fotos',      top: 645, right: '6%',             size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'accommodations', text: 'Unterkunft',      top: 695, left: '18%',             size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'faq',            text: 'FAQ',             top: 740, right: '15%',            size: 'clamp(3rem, 7vw, 5.5rem)' },
  { id: 'witnesses',      text: 'Trauzeugen',      top: 780, left: '5%',              size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'weddingabc',     text: 'Hochzeits-ABC',   top: 815, right: '8%',             size: 'clamp(2rem, 4.5vw, 3.5rem)' },
]

export default function HtmlContent({ project, content, onOpenModal }) {
  const cd = useCountdown(project?.wedding_date)
  const cn = project?.couple_names || 'Lena & Jonas'

  return (
    <div style={{ userSelect: 'none', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO (countdown at bottom, names are in fixed overlay) ── */}
      <TextZone range={HERO_TXT}>
        <div style={{
          position: 'absolute',
          bottom: '8%',
          textAlign: 'center',
        }}>
          {!cd.past ? (
            <div style={s.countRow}>
              {[
                { v: p2(cd.d), l: 'TAGE' },
                { v: p2(cd.h), l: 'STD' },
                { v: p2(cd.m), l: 'MIN' },
                { v: p2(cd.s), l: 'SEK' },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <span style={s.countNum}>{v}</span>
                  <br />
                  <span style={s.countLabel}>{l}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={s.pastLabel}>WIR HABEN GEHEIRATET</p>
          )}
        </div>
      </TextZone>

      {/* ── SCATTERED TITLES — bold, large, across the entire page ── */}
      {TITLES.map((t) => (
        <ScatteredTitle
          key={t.id}
          text={t.text}
          modalId={t.id}
          onOpenModal={onOpenModal}
          style={{
            top: `${t.top}vh`,
            ...(t.left ? { left: t.left } : {}),
            ...(t.right ? { right: t.right } : {}),
            fontSize: t.size,
          }}
        />
      ))}

      {/* ── FOOTER ── */}
      <TextZone range={FOOTER}>
        <p style={s.footerNames}>{cn}</p>
        <p style={{ ...s.pastLabel, opacity: 0.25, marginTop: '0.6rem' }}>MIT LIEBE</p>
      </TextZone>

    </div>
  )
}

const s = {
  countRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(1.5rem, 4vw, 3rem)',
  },
  countNum: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 800,
    color: '#000',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  countLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.55rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.25)',
  },
  pastLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.35)',
  },
  footerNames: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    color: '#000',
  },
}
