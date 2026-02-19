// src/themes/parallax/HtmlContent.js
// Scattered bold titles with individual parallax + Footer

import { useEffect, useRef } from 'react'
import { FOOTER, PAGES } from './scrollConfig'

// ── Scattered title layout — wild positions across the entire page ──
const TITLES = [
  { id: 'lovestory',      text: 'Love Story',    top: 70,  left: '48%',  speed: 0.82, size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'timeline',       text: 'Tagesablauf',   top: 125, left: '4%',   speed: 1.2,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'dresscode',      text: 'Dresscode',     top: 195, left: '55%',  speed: 0.88, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'rsvp',           text: 'RSVP',          top: 250, left: '18%',  speed: 1.15, size: 'clamp(4rem, 9vw, 8rem)' },
  { id: 'locations',      text: 'Locations',     top: 320, left: '62%',  speed: 0.8,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'gallery',        text: 'Galerie',       top: 380, left: '2%',   speed: 1.22, size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'gifts',          text: 'Geschenke',     top: 445, left: '42%',  speed: 0.84, size: 'clamp(2.5rem, 6vw, 5rem)' },
  { id: 'guestbook',      text: 'Gästebuch',     top: 515, left: '6%',   speed: 1.14, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'musicwishes',    text: 'Musikwünsche',  top: 570, left: '50%',  speed: 0.9,  size: 'clamp(2rem, 4.5vw, 3.5rem)' },
  { id: 'photoupload',    text: 'Eure Fotos',    top: 630, left: '12%',  speed: 1.18, size: 'clamp(2.5rem, 6vw, 5rem)' },
  { id: 'accommodations', text: 'Unterkunft',    top: 685, left: '58%',  speed: 0.83, size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'faq',            text: 'FAQ',           top: 735, left: '5%',   speed: 1.2,  size: 'clamp(3.5rem, 8vw, 6.5rem)' },
  { id: 'witnesses',      text: 'Trauzeugen',    top: 780, left: '44%',  speed: 0.82, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'weddingabc',     text: 'Hochzeits-ABC', top: 825, left: '15%',  speed: 1.16, size: 'clamp(2rem, 5vw, 4rem)' },
]

export default function HtmlContent({ project, content, onOpenModal, scrollOffsetRef }) {
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
          const drift = offset * (speed - 1) * PAGES * vh * 0.15
          el.style.transform = `translateY(${drift}px)`
        })
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [scrollOffsetRef])

  return (
    <div ref={containerRef} style={{
      position: 'relative',
      width: '100vw',
      userSelect: 'none',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── SCATTERED TITLES — wild positions, each with own parallax ── */}
      {TITLES.map((t) => (
        <ScatteredTitle
          key={t.id}
          t={t}
          onOpenModal={onOpenModal}
        />
      ))}

      {/* ── FOOTER ── */}
      <div style={{
        position: 'absolute',
        top: `${FOOTER[0] * 100}vh`,
        left: 0,
        width: '100vw',
        height: `${FOOTER[1] * 100}vh`,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        <p style={s.footerNames}>{cn}</p>
        <p style={{ ...s.footerSub, opacity: 0.25, marginTop: '0.6rem' }}>MIT LIEBE</p>
      </div>

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
  footerNames: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    color: '#000',
  },
  footerSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.35)',
  },
}
