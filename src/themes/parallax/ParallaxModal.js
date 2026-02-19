// src/themes/parallax/ParallaxModal.js
import { useEffect, useCallback, useState, useRef } from 'react'
import { useRSVP } from '../../components/shared/RSVPCore'

// ── KEYFRAMES (injected once) ──
const STYLE_ID = 'parallax-modal-keyframes'
function ensureKeyframes() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes letterSpin {
      0% {
        transform: translate(-50%, -50%) translateX(0) rotate(0deg);
        font-size: 0.8rem;
        opacity: 1;
        color: #000;
      }
      25% {
        color: #fff;
      }
      60% {
        transform: translate(-50%, -50%) translateX(var(--spread)) rotate(480deg);
        font-size: clamp(2.5rem, 8vw, 5rem);
        opacity: 1;
        color: #fff;
      }
      100% {
        transform: translate(-50%, -50%) translateX(var(--spread-far)) rotate(720deg);
        font-size: clamp(4rem, 12vw, 8rem);
        opacity: 0;
        color: #fff;
      }
    }
    @keyframes fadeToBlack {
      from { background: rgba(0,0,0,0); }
      to { background: rgba(0,0,0,1); }
    }
    @keyframes contentAppear {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

// ── MAIN MODAL ──
export default function ParallaxModal({ activeModal, onClose, project, content }) {
  // phase: null | 'letters' | 'open' | 'closing'
  const [phase, setPhase] = useState(null)
  const [current, setCurrent] = useState(null)

  useEffect(() => { ensureKeyframes() }, [])

  // Open sequence
  useEffect(() => {
    if (activeModal && !current) {
      setCurrent(activeModal)
      setPhase('letters')
      const t = setTimeout(() => setPhase('open'), 1200)
      return () => clearTimeout(t)
    }
  }, [activeModal, current])

  // Close
  const handleClose = useCallback(() => {
    if (phase === 'closing') return
    setPhase('closing')
    setTimeout(() => {
      setPhase(null)
      setCurrent(null)
      onClose()
    }, 500)
  }, [phase, onClose])

  // Lock body scroll
  useEffect(() => {
    if (current) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [current])

  // ESC to close
  useEffect(() => {
    if (!current) return
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, handleClose])

  if (!current) return null

  const isMobile = window.innerWidth < 768
  const label = current.label || 'Entdecken'
  const letters = label.split('')
  const origin = current.origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      animation: phase === 'closing' ? 'modalFadeOut 0.5s ease forwards' : 'none',
    }}>
      {/* ── BLACK BACKDROP (fades in during letter phase) ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: phase === 'letters' ? undefined : '#000',
          animation: phase === 'letters' ? 'fadeToBlack 0.9s ease forwards' : 'none',
        }}
        onClick={handleClose}
      />

      {/* ── LETTER ANIMATION (during 'letters' phase) ── */}
      {phase === 'letters' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
          {letters.map((char, i) => {
            const centerOffset = i - (letters.length - 1) / 2
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: origin.x,
                  top: origin.y,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  pointerEvents: 'none',
                  willChange: 'transform, font-size, opacity',
                  '--spread': `${centerOffset * 40}px`,
                  '--spread-far': `${centerOffset * 120}px`,
                  animation: `letterSpin 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s forwards`,
                }}
              >
                {char}
              </span>
            )
          })}
        </div>
      )}

      {/* ── CONTENT PANEL ── */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: isMobile ? '100vw' : '66vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          opacity: phase === 'open' ? 1 : 0,
          animation: phase === 'open' ? 'contentAppear 0.4s ease forwards' : 'none',
          pointerEvents: phase === 'open' ? 'auto' : 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button style={styles.closeBtn} onClick={handleClose} aria-label="Schließen">
          ✕
        </button>

        {/* Scroll area */}
        <div data-scroll-area style={styles.scrollArea}>
          <div style={{
            ...styles.contentInner,
            maxWidth: current.id === 'gallery' ? '900px' : '600px',
          }}>
            {current.id === 'lovestory' && <LoveStoryContent content={content} />}
            {current.id === 'info' && <InfoContent project={project} content={content} />}
            {current.id === 'rsvp' && <RSVPContent content={content} />}
            {current.id === 'gallery' && <GalleryContent content={content} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── LOVESTORY ──
function LoveStoryContent({ content }) {
  const ls = content?.lovestory || {}
  const chapters = ls.events?.length >= 2
    ? ls.events
    : [
        { date: '2019', title: 'Das erste Mal', description: 'Ein Blick quer durch den Raum. Die Musik verstummte.', image: '' },
        { date: '2022', title: 'Das Ja', description: 'Unter einem Himmel voller Sterne. Ein Knie. Ein Ring.', image: '' },
        { date: '2025', title: 'Für immer', description: 'Jetzt beginnt das schönste Kapitel unseres Lebens.', image: '' },
      ]

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <h2 style={styles.modalTitle}>Unsere Geschichte</h2>
      {chapters.map((ch, i) => (
        <div key={i} style={{ marginBottom: '5rem' }}>
          <p style={styles.label}>{ch.date}</p>
          <h3 style={styles.sectionTitle}>{ch.title}</h3>
          {ch.image && typeof ch.image === 'string' && ch.image.startsWith('http') && (
            <img src={ch.image} alt={ch.title} style={styles.chapterImg} loading="lazy" />
          )}
          <p style={styles.bodyText}>{ch.description}</p>
        </div>
      ))}
    </div>
  )
}

// ── INFO ──
function InfoContent({ project, content }) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0, past: false })
  const weddingDate = project?.wedding_date

  useEffect(() => {
    if (!weddingDate) return
    const target = new Date(weddingDate)
    const tick = () => {
      const diff = target - new Date()
      if (diff <= 0) { setCd(p => ({ ...p, past: true })); return }
      setCd({
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

  const p2 = n => String(n).padStart(2, '0')
  const dateStr = weddingDate
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const locations = content?.locations?.items || content?.locations?.venues || []
  const directions = content?.directions || {}

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <h2 style={styles.modalTitle}>Infos</h2>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={styles.label}>{cd.past ? 'WIR HABEN GEHEIRATET' : 'COUNTDOWN'}</p>
        {!cd.past && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1.5rem 0' }}>
            {[
              { v: p2(cd.d), l: 'Tage' },
              { v: p2(cd.h), l: 'Std' },
              { v: p2(cd.m), l: 'Min' },
              { v: p2(cd.s), l: 'Sek' },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>{v}</span>
                <br />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{l}</span>
              </div>
            ))}
          </div>
        )}
        {dateStr && <p style={{ ...styles.bodyText, textAlign: 'center' }}>{dateStr}</p>}
      </div>

      {locations.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <p style={styles.label}>LOCATIONS</p>
          {locations.map((loc, i) => (
            <div key={i} style={{ marginBottom: '2rem' }}>
              <h3 style={styles.sectionTitle}>{loc.name || loc.title}</h3>
              {loc.address && <p style={styles.bodyText}>{loc.address}</p>}
              {loc.time && <p style={styles.bodyText}>{loc.time}</p>}
              {loc.description && <p style={styles.bodyText}>{loc.description}</p>}
            </div>
          ))}
        </div>
      )}

      {directions.description && (
        <div>
          <p style={styles.label}>ANFAHRT</p>
          <p style={styles.bodyText}>{directions.description}</p>
        </div>
      )}
    </div>
  )
}

// ── RSVP ──
function RSVPContent({ content }) {
  const rsvp = useRSVP()
  const rsvpConfig = content?.rsvp || {}

  if (rsvp.submitted) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={styles.modalTitle}>Danke!</h2>
        <p style={styles.bodyText}>Deine Rückmeldung wurde gespeichert.</p>
        <button style={styles.formBtn} onClick={rsvp.resetForm}>Neue Antwort</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <h2 style={styles.modalTitle}>{rsvpConfig.title || 'RSVP'}</h2>
      {rsvpConfig.description && <p style={{ ...styles.bodyText, marginBottom: '2rem' }}>{rsvpConfig.description}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <input
          style={styles.input}
          placeholder="Name *"
          value={rsvp.formData.name}
          onChange={e => rsvp.updateField('name', e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="E-Mail *"
          value={rsvp.formData.email}
          onChange={e => rsvp.updateField('email', e.target.value)}
        />

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            style={{ ...styles.toggleBtn, ...(rsvp.formData.attending ? styles.toggleActive : {}) }}
            onClick={() => rsvp.toggleAttending(true)}
          >
            Zusage
          </button>
          <button
            style={{ ...styles.toggleBtn, ...(!rsvp.formData.attending ? styles.toggleActive : {}) }}
            onClick={() => rsvp.toggleAttending(false)}
          >
            Absage
          </button>
        </div>

        {rsvp.formData.attending && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Personen:</span>
              <button style={styles.adjustBtn} onClick={() => rsvp.adjustPersons(-1)}>−</button>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '1.5rem', textAlign: 'center', color: '#fff' }}>{rsvp.formData.persons}</span>
              <button style={styles.adjustBtn} onClick={() => rsvp.adjustPersons(1)}>+</button>
            </div>

            <input
              style={styles.input}
              placeholder="Unverträglichkeiten / Allergien"
              value={rsvp.formData.dietary}
              onChange={e => rsvp.updateField('dietary', e.target.value)}
            />
          </>
        )}

        <textarea
          style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
          placeholder="Nachricht (optional)"
          value={rsvp.formData.message}
          onChange={e => rsvp.updateField('message', e.target.value)}
        />

        {rsvp.error && <p style={{ color: '#f66', fontWeight: 700, fontSize: '0.85rem' }}>{rsvp.error}</p>}

        <button
          style={{ ...styles.formBtn, opacity: rsvp.submitting ? 0.5 : 1 }}
          onClick={rsvp.submit}
          disabled={rsvp.submitting}
        >
          {rsvp.submitting ? 'Wird gesendet...' : 'Absenden'}
        </button>
      </div>
    </div>
  )
}

// ── GALLERY with parallax scroll (no fade, just translateY) ──
const GALLERY_LAYOUT = [
  { span: 2, speed: 0.3 },
  { span: 1, speed: 0.5 },
  { span: 1, speed: 0.7 },
  { span: 2, speed: 0.4 },
  { span: 1, speed: 0.6 },
  { span: 1, speed: 0.35 },
  { span: 2, speed: 0.55 },
  { span: 1, speed: 0.45 },
  { span: 1, speed: 0.65 },
]

function GalleryContent({ content }) {
  const scrollRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)

  const rawImgs = content?.gallery?.images || []
  const imgs = rawImgs.map(i => typeof i === 'string' ? i : i.url).filter(Boolean)

  const FALLBACK = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80&auto=format',
  ]
  const images = imgs.length > 0 ? imgs : FALLBACK

  useEffect(() => {
    const scrollArea = scrollRef.current?.closest('[data-scroll-area]')
    if (!scrollArea) return
    const onScroll = () => setScrollTop(scrollArea.scrollTop)
    scrollArea.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollArea.removeEventListener('scroll', onScroll)
  }, [])

  const isMobile = window.innerWidth < 768

  return (
    <div ref={scrollRef} style={{ padding: '4rem 0 6rem' }}>
      <h2 style={{ ...styles.modalTitle, marginBottom: '2rem' }}>Galerie</h2>
      <p style={{ ...styles.label, marginBottom: '3rem' }}>MOMENTE</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '1.5rem',
      }}>
        {images.map((src, i) => {
          const layout = GALLERY_LAYOUT[i % GALLERY_LAYOUT.length]
          const speed = layout.speed
          const parallaxY = scrollTop * (speed - 0.5) * 0.3
          const spanFull = !isMobile && layout.span === 2

          return (
            <div
              key={i}
              style={{
                gridColumn: spanFull ? '1 / -1' : 'auto',
                overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt={`Foto ${i + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: spanFull ? '55vh' : '40vh',
                  objectFit: 'cover',
                  display: 'block',
                  transform: `translateY(${parallaxY}px)`,
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── STYLES (inverted: white on black) ──
const styles = {
  closeBtn: {
    position: 'absolute',
    top: '1.2rem',
    left: '1.2rem',
    zIndex: 10,
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fff',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
  },
  scrollArea: {
    overflowY: 'auto',
    height: '100vh',
    WebkitOverflowScrolling: 'touch',
    flex: 1,
  },
  contentInner: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  modalTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '2rem',
    lineHeight: 1.1,
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.5rem',
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '0.6rem',
    lineHeight: 1.2,
  },
  bodyText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.7,
    whiteSpace: 'pre-line',
  },
  chapterImg: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
    margin: '1.5rem 0',
  },
  input: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#fff',
    background: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    flex: 1,
    padding: '0.8rem',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
  },
  toggleActive: {
    background: '#fff',
    color: '#000',
  },
  adjustBtn: {
    width: '36px',
    height: '36px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBtn: {
    padding: '1rem 2rem',
    border: 'none',
    background: '#fff',
    color: '#000',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
}
