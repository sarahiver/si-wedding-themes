// src/themes/parallax/ParallaxModal.js
import { useEffect, useCallback, useState } from 'react'
import { useRSVP } from '../../components/shared/RSVPCore'

export default function ParallaxModal({ active, onClose, project, content }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [active])

  // ESC key to close
  useEffect(() => {
    if (!active) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onClose])

  if (!active) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Schließen">
          ✕
        </button>
        <div style={styles.scrollArea}>
          {active === 'lovestory' && <LoveStoryContent content={content} />}
          {active === 'info' && <InfoContent project={project} content={content} />}
          {active === 'rsvp' && <RSVPContent content={content} />}
          {active === 'gallery' && <GalleryContent content={content} />}
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
    <div style={{ padding: '3rem 0' }}>
      <h2 style={styles.modalTitle}>Unsere Geschichte</h2>
      {chapters.map((ch, i) => (
        <div key={i} style={{ marginBottom: '3rem' }}>
          <p style={styles.label}>{ch.date}</p>
          <h3 style={styles.sectionTitle}>{ch.title}</h3>
          {ch.image && typeof ch.image === 'string' && ch.image.startsWith('http') && (
            <img src={ch.image} alt={ch.title} style={styles.chapterImg} />
          )}
          <p style={styles.bodyText}>{ch.description}</p>
        </div>
      ))}
    </div>
  )
}

// ── INFO (Countdown, Location, Anfahrt) ──
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
    <div style={{ padding: '3rem 0' }}>
      <h2 style={styles.modalTitle}>Infos</h2>

      {/* Countdown */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2.5rem', fontWeight: 800 }}>{v}</span>
                <br />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4 }}>{l}</span>
              </div>
            ))}
          </div>
        )}
        {dateStr && <p style={{ ...styles.bodyText, textAlign: 'center' }}>{dateStr}</p>}
      </div>

      {/* Locations */}
      {locations.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={styles.label}>LOCATIONS</p>
          {locations.map((loc, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <h3 style={styles.sectionTitle}>{loc.name || loc.title}</h3>
              {loc.address && <p style={styles.bodyText}>{loc.address}</p>}
              {loc.time && <p style={styles.bodyText}>{loc.time}</p>}
              {loc.description && <p style={styles.bodyText}>{loc.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Directions */}
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
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2 style={styles.modalTitle}>Danke!</h2>
        <p style={styles.bodyText}>Deine Rückmeldung wurde gespeichert.</p>
        <button style={styles.formBtn} onClick={rsvp.resetForm}>Neue Antwort</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem 0' }}>
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

        {/* Attendance */}
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
            {/* Persons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Personen:</span>
              <button style={styles.adjustBtn} onClick={() => rsvp.adjustPersons(-1)}>−</button>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '1.5rem', textAlign: 'center' }}>{rsvp.formData.persons}</span>
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

        {rsvp.error && <p style={{ color: '#c00', fontWeight: 700, fontSize: '0.85rem' }}>{rsvp.error}</p>}

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

// ── GALLERY ──
function GalleryContent({ content }) {
  const [current, setCurrent] = useState(0)
  const rawImgs = content?.gallery?.images || []
  const imgs = rawImgs.map(i => typeof i === 'string' ? i : i.url).filter(Boolean)

  const FALLBACK = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1400&q=80&auto=format',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=80&auto=format',
  ]
  const images = imgs.length > 0 ? imgs : FALLBACK

  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%', justifyContent: 'center' }}>
      <h2 style={{ ...styles.modalTitle, marginBottom: '1.5rem' }}>Galerie</h2>

      <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
        <img
          src={images[current]}
          alt={`Foto ${current + 1}`}
          style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
        />

        {/* Nav buttons */}
        <button
          style={{ ...styles.navBtn, left: '0.5rem' }}
          onClick={prev}
          aria-label="Vorheriges Bild"
        >
          ‹
        </button>
        <button
          style={{ ...styles.navBtn, right: '0.5rem' }}
          onClick={next}
          aria-label="Nächstes Bild"
        >
          ›
        </button>
      </div>

      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '1rem', opacity: 0.4 }}>
        {current + 1} / {images.length}
      </p>
    </div>
  )
}

// ── STYLES ──
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    background: '#ffffff',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '700px',
    padding: '0 2rem',
  },
  scrollArea: {
    overflowY: 'auto',
    height: '100vh',
    WebkitOverflowScrolling: 'touch',
  },
  closeBtn: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 10001,
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#000',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
  },
  modalTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    color: '#000',
    marginBottom: '2rem',
    lineHeight: 1.1,
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.35)',
    marginBottom: '0.5rem',
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#000',
    marginBottom: '0.6rem',
    lineHeight: 1.2,
  },
  bodyText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 1.7,
    whiteSpace: 'pre-line',
  },
  chapterImg: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
    margin: '1rem 0',
  },
  input: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '2px solid #000',
    borderRadius: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#000',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    flex: 1,
    padding: '0.8rem',
    border: '2px solid #000',
    background: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#000',
    cursor: 'pointer',
  },
  toggleActive: {
    background: '#000',
    color: '#fff',
  },
  adjustBtn: {
    width: '36px',
    height: '36px',
    border: '2px solid #000',
    background: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBtn: {
    padding: '1rem 2rem',
    border: 'none',
    background: '#000',
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.9)',
    border: '2px solid #000',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#000',
    cursor: 'pointer',
  },
}
