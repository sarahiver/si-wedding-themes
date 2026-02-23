// src/themes/parallax/HtmlContent.js
// Scattered bold titles with individual parallax + Footer
// Respects project.active_components from SuperAdmin

import { useEffect, useRef, useMemo, useState } from 'react'
import { FOOTER, PAGES } from './scrollConfig'

// Inject bounce keyframes once
function ensureBounceKeyframes() {
  if (document.getElementById('parallax-bounce-kf')) return
  const style = document.createElement('style')
  style.id = 'parallax-bounce-kf'
  style.textContent = `
    @keyframes letterBounce {
      0% { transform: translateY(0); }
      30% { transform: translateY(-0.25em); }
      50% { transform: translateY(0.04em); }
      70% { transform: translateY(-0.06em); }
      100% { transform: translateY(0); }
    }
    @keyframes hintFadeInOut {
      0% { opacity: 0; transform: translateY(8px); }
      15% { opacity: 1; transform: translateY(0); }
      75% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-5px); }
    }
  `
  document.head.appendChild(style)
}

// ── Scattered title definitions — base layout before filtering ──
const ALL_TITLES = [
  // Short words + low mLeft → can be bigger
  // Long words + high mLeft → must be smaller to fit in viewport
  // Formula: (100vw - mLeft) / ~charCount ≈ max safe char width
  { id: 'lovestory',      text: 'Love Story',    left: '48%', mLeft: '4%',  speed: 0.82, size: 'clamp(3.5rem, 8vw, 7rem)', mSize: 'clamp(2rem, 9vw, 2.8rem)' },
  { id: 'timeline',       text: 'Tagesablauf',   left: '4%',  mLeft: '4%',  speed: 1.2,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)', mSize: 'clamp(1.4rem, 6vw, 2rem)' },
  { id: 'dresscode',      text: 'Dresscode',     left: '55%', mLeft: '20%', speed: 0.88, size: 'clamp(2.5rem, 5.5vw, 4.5rem)', mSize: 'clamp(1.4rem, 6vw, 2rem)' },
  { id: 'rsvp',           text: 'RSVP',          left: '18%', mLeft: '8%',  speed: 1.15, size: 'clamp(4rem, 9vw, 8rem)', mSize: 'clamp(2.5rem, 11vw, 3.5rem)' },
  { id: 'locations',      text: 'Locations',     left: '62%', mLeft: '15%', speed: 0.8,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)', mSize: 'clamp(1.4rem, 6vw, 2rem)' },
  { id: 'directions',     text: 'Anfahrt',       left: '8%',  mLeft: '5%',  speed: 1.1,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)', mSize: 'clamp(1.6rem, 8vw, 2.2rem)' },
  { id: 'gallery',        text: 'Galerie',       left: '2%',  mLeft: '3%',  speed: 1.22, size: 'clamp(3.5rem, 8vw, 7rem)', mSize: 'clamp(2rem, 10vw, 3rem)' },
  { id: 'gifts',          text: 'Geschenke',     left: '42%', mLeft: '12%', speed: 0.84, size: 'clamp(2.5rem, 6vw, 5rem)', mSize: 'clamp(1.4rem, 6vw, 2.2rem)' },
  { id: 'guestbook',      text: 'Gästebuch',     left: '6%',  mLeft: '4%',  speed: 1.14, size: 'clamp(2.5rem, 5.5vw, 4.5rem)', mSize: 'clamp(1.4rem, 6vw, 2rem)' },
  { id: 'musicwishes',    text: 'Musikwünsche',  left: '50%', mLeft: '3%',  speed: 0.9,  size: 'clamp(2rem, 4.5vw, 3.5rem)', mSize: 'clamp(1.1rem, 5vw, 1.6rem)' },
  { id: 'photoupload',    text: 'Eure Fotos',    left: '12%', mLeft: '6%',  speed: 1.18, size: 'clamp(2.5rem, 6vw, 5rem)', mSize: 'clamp(1.5rem, 7vw, 2.2rem)' },
  { id: 'accommodations', text: 'Unterkunft',    left: '58%', mLeft: '10%', speed: 0.83, size: 'clamp(2.5rem, 5vw, 4rem)', mSize: 'clamp(1.4rem, 6vw, 2rem)' },
  { id: 'faq',            text: 'FAQ',           left: '5%',  mLeft: '5%',  speed: 1.2,  size: 'clamp(3.5rem, 8vw, 6.5rem)', mSize: 'clamp(2.5rem, 11vw, 3.5rem)' },
  { id: 'witnesses',      text: 'Trauzeugen',    left: '44%', mLeft: '8%',  speed: 0.82, size: 'clamp(2.5rem, 5.5vw, 4.5rem)', mSize: 'clamp(1.3rem, 6vw, 1.8rem)' },
  { id: 'weddingabc',     text: 'Hochzeits-ABC', left: '15%', mLeft: '3%',  speed: 1.16, size: 'clamp(2rem, 5vw, 4rem)', mSize: 'clamp(1.1rem, 5vw, 1.5rem)' },
]

// Start/end in vh for title zone (between hero images and footer)
const TITLE_START = 70
const TITLE_END = 790

function isActive(project, id) {
  const ac = project?.active_components
  if (!ac || ac.length === 0) return true
  return ac.includes('all') || ac.includes(id)
}

export default function HtmlContent({ project, content, onOpenModal, scrollOffsetRef }) {
  const cn = project?.couple_names || 'Lena & Jonas'
  const wDate = project?.wedding_date
    ? new Date(project.wedding_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '16. August 2025'
  const containerRef = useRef(null)
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => { ensureBounceKeyframes() }, [])

  // Filter titles by active_components + respect component_order for sequencing
  const titles = useMemo(() => {
    const order = project?.component_order
    let active = ALL_TITLES.filter(t => isActive(project, t.id))
    // Sort by component_order if defined
    if (order?.length > 0) {
      active.sort((a, b) => {
        const ia = order.indexOf(a.id)
        const ib = order.indexOf(b.id)
        if (ia === -1 && ib === -1) return 0
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      })
    }
    // Distribute top positions evenly across the title zone
    const count = active.length
    if (count === 0) return []
    const step = (TITLE_END - TITLE_START) / (count + 1)
    return active.map((t, i) => ({ ...t, top: TITLE_START + step * (i + 1) }))
  }, [project])

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

      {/* ── SCATTERED TITLES — filtered by active_components, each with own parallax ── */}
      {titles.map((t, idx) => (
        <ScatteredTitle
          key={t.id}
          t={t}
          idx={idx}
          isMobile={isMobile}
          onOpenModal={onOpenModal}
        />
      ))}

      {/* ── MOBILE TAP HINT ── */}
      {isMobile && titles.length > 0 && (
        <div style={{
          position: 'absolute',
          top: `${titles[0].top + 8}vh`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          animation: 'hintFadeInOut 4s ease 3.5s both',
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.35)',
            background: '#fff',
            padding: '0.5em 1em',
            display: 'inline-block',
          }}>↑ Tippe auf eine Headline</p>
        </div>
      )}

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
        gap: '0.8rem',
      }}>
        <p style={s.footerSub}>WIR FREUEN UNS AUF EUCH</p>
        <p style={s.footerNames}>{cn}</p>
        <p style={{ ...s.footerSub, opacity: 0.4 }}>{wDate}</p>
        <div style={{ width: '40px', height: '1px', background: 'rgba(0,0,0,0.15)', margin: '1.5rem 0 0.5rem' }} />
        <p style={{ ...s.footerSub, opacity: 0.2, fontSize: '0.55rem' }}>MADE WITH LOVE</p>
      </div>

    </div>
  )
}

// Single scattered title element
function ScatteredTitle({ t, idx, isMobile, onOpenModal }) {
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
      onMouseEnter={(e) => {
        const spans = e.currentTarget.querySelectorAll('.bounce-letter')
        spans.forEach((span, i) => {
          span.style.animation = `letterBounce 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.03}s both`
        })
      }}
      onMouseLeave={(e) => {
        const spans = e.currentTarget.querySelectorAll('.bounce-letter')
        spans.forEach(span => { span.style.animation = 'none' })
      }}
      style={{
        position: 'absolute',
        top: `${t.top}vh`,
        left: isMobile ? (t.mLeft || t.left) : t.left,
        fontSize: isMobile ? (t.mSize || t.size) : t.size,
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
        maxWidth: '85vw',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {t.text.split('').map((char, i) => (
        <span
          key={i}
          className="bounce-letter"
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            // Auto-wink on first title after 2.5s
            ...(idx === 0 ? {
              animation: `letterBounce 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${2.5 + i * 0.03}s both`,
            } : {}),
          }}
        >
          {char}
        </span>
      ))}
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
