// src/themes/parallax/HtmlContent.js
// Scattered bold titles with individual parallax + Footer
// Respects project.active_components from SuperAdmin

import { useEffect, useRef, useMemo } from 'react'
import { FOOTER, PAGES } from './scrollConfig'

// ── Scattered title definitions — base layout before filtering ──
const ALL_TITLES = [
  { id: 'lovestory',      text: 'Love Story',    left: '48%',  speed: 0.82, size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'timeline',       text: 'Tagesablauf',   left: '4%',   speed: 1.2,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'dresscode',      text: 'Dresscode',     left: '55%',  speed: 0.88, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'rsvp',           text: 'RSVP',          left: '18%',  speed: 1.15, size: 'clamp(4rem, 9vw, 8rem)' },
  { id: 'locations',      text: 'Locations',     left: '62%',  speed: 0.8,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'directions',     text: 'Anfahrt',       left: '8%',   speed: 1.1,  size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'gallery',        text: 'Galerie',       left: '2%',   speed: 1.22, size: 'clamp(3.5rem, 8vw, 7rem)' },
  { id: 'gifts',          text: 'Geschenke',     left: '42%',  speed: 0.84, size: 'clamp(2.5rem, 6vw, 5rem)' },
  { id: 'guestbook',      text: 'Gästebuch',     left: '6%',   speed: 1.14, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'musicwishes',    text: 'Musikwünsche',  left: '50%',  speed: 0.9,  size: 'clamp(2rem, 4.5vw, 3.5rem)' },
  { id: 'photoupload',    text: 'Eure Fotos',    left: '12%',  speed: 1.18, size: 'clamp(2.5rem, 6vw, 5rem)' },
  { id: 'accommodations', text: 'Unterkunft',    left: '58%',  speed: 0.83, size: 'clamp(2.5rem, 5vw, 4rem)' },
  { id: 'faq',            text: 'FAQ',           left: '5%',   speed: 1.2,  size: 'clamp(3.5rem, 8vw, 6.5rem)' },
  { id: 'witnesses',      text: 'Trauzeugen',    left: '44%',  speed: 0.82, size: 'clamp(2.5rem, 5.5vw, 4.5rem)' },
  { id: 'weddingabc',     text: 'Hochzeits-ABC', left: '15%',  speed: 1.16, size: 'clamp(2rem, 5vw, 4rem)' },
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
      {titles.map((t) => (
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
