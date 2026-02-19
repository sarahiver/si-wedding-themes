// src/themes/parallax/HtmlContent.js
// Scattered bold titles with individual parallax + Hero countdown + Footer

import { useState, useEffect, useRef } from 'react'
import { HERO_TXT, FOOTER, PAGES } from './scrollConfig'

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

function TextZone({ range, children }) {
  return (
    <div style={{
      position: 'absolute',
      top: `${range[0] * 100}vh`,
      left: 0,
      width: '100vw',
      height: `${range[1] * 100}vh`,
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

// ── Scattered title layout — wild positions, each with own parallax speed ──
const TITLES = [
  { id: 'lovestory',      text: 'Love Story',    top: 70,  left: '52%', speed: 0.88, size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'timeline',       text: 'Tagesablauf',   top: 130, left: '5%',  speed: 1.15, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'dresscode',      text: 'Dresscode',     top: 200, left: '58%', speed: 0.9,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'rsvp',           text: 'RSVP',          top: 255, left: '22%', speed: 1.12, size: 'clamp(4rem, 9vw, 8rem)' },
  { id: 'locations',      text: 'Locations',     top: 325, left: '65%', speed: 0.84, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'gallery',        text: 'Galerie',       top: 385, left: '3%',  speed: 1.18, size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'gifts',          text: 'Geschenke',     top: 450, left: '40%', speed: 0.87, size: 'clamp(2.5rem, 6vw, 5rem)' },
  { id: 'guestbook',      text: 'Gästebuch',     top: 520, left: '8%',  speed: 1.1,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'musicwishes',    text: 'Musikwünsche',  top: 575, left: '50%', speed: 0.92, size: 'clamp(2rem, 4.5vw, 3.5rem)' },
  { id: 'photoupload',    text: 'Eure Fotos',    top: 635, left: '15%', speed: 1.14, size: 'clamp(2.5rem, 6vw, 5rem)' },
  { id: 'accommodations', text: 'Unterkunft',    top: 690, left: '60%', speed: 0.86, size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'faq',            text: 'FAQ',           top: 740, left: '6%',  speed: 1.16, size: 'clamp(3.5rem, 8vw, 6.5rem)' },
  { id: 'witnesses',      text: 'Trauzeugen',    top: 785, left: '45%', speed: 0.85, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'weddingabc',     text: 'Hochzeits-ABC', top: 825, left: '20%', speed: 1.12, size: 'clamp(2rem, 5vw, 4rem)' },
]

export default function HtmlContent({ project, content, onOpenModal, scrollOffsetRef }) {
  const cd = useCountdown(project?.wedding_date)
  const cn = project?.couple_names || 'Lena & Jonas'
  const containerRef = useRef(null)

  // rAF loop for individual parallax on each title
  useEffect(() => {
    if (!scrollOffsetRef) return
    let raf
    const update = () => {
      const offset = scrollOffsetRef.current
      const vh = window.innerHeight
      if (containerRef.current) {
        const els = containerRef.current.querySelectorAll('[data-speed]')
        els.forEach(el => {
          const speed = parseFloat(el.dataset.speed)
          // Each title drifts relative to normal scroll
          const drift = offset * (speed - 1) * PAGES * vh * 0.12
          el.style.transform = `translateY(${drift}px)`
        })
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [scrollOffsetRef])

  return (
    <div ref={containerRef} style={{ userSelect: 'none', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO (countdown at bottom) ── */}
      <TextZone range={HERO_TXT}>
        <div style={{ position: 'absolute', bottom: '6%', textAlign: 'center' }}>
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

      {/* ── SCATTERED TITLES — wild positions, each with own parallax ── */}
      {TITLES.map((t) => (
        <ScatteredTitle
          key={t.id}
          t={t}
          onOpenModal={onOpenModal}
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

// Single scattered title element
function ScatteredTitle({ t, onOpenModal }) {
  const ref = useRef(null)
  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    onOpenModal?.(t.id, origin, t.text)
  }
  return (
    <h2
      ref={ref}
      data-speed={t.speed}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: `${t.top}vh`,
        left: t.left,
        fontSize: t.size,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 800,
        color: '#000',
        background: '#fff',
        padding: '0.1em 0.35em',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        margin: 0,
        cursor: 'pointer',
        zIndex: 2,
        whiteSpace: 'nowrap',
      }}
    >
      {t.text}
    </h2>
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
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 800,
    color: '#000',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  countLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.3)',
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
