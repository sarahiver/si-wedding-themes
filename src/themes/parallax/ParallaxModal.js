// src/themes/parallax/ParallaxModal.js
import { useEffect, useCallback, useState, useRef } from 'react'
import { useRSVP } from '../../components/shared/RSVPCore'
import { useGuestbook } from '../../components/shared/GuestbookCore'
import { useMusicWishes } from '../../components/shared/MusicWishesCore'
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore'
import { useGifts } from '../../components/shared/GiftsCore'

// ── KEYFRAMES ──
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
      25% { color: #fff; }
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
      to { background: rgba(0,0,0,0.45); }
    }
    @keyframes contentAppear {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes spinIn {
      from { transform: rotate(0deg) scale(0); opacity: 0; }
      to { transform: rotate(360deg) scale(1); opacity: 1; }
    }
  `
  document.head.appendChild(style)
}

// Parallax offset
function px(scrollTop, speed) {
  return scrollTop * (speed - 0.5) * 0.6
}

// ── MAIN MODAL ──
export default function ParallaxModal({ activeModal, onClose, project, content }) {
  const [phase, setPhase] = useState(null)
  const [current, setCurrent] = useState(null)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => { ensureKeyframes() }, [])

  useEffect(() => {
    if (activeModal) {
      setCurrent(activeModal)
      setScrollTop(0)
      setPhase('letters')
      const t = setTimeout(() => setPhase('open'), 1200)
      return () => clearTimeout(t)
    }
  }, [activeModal])

  const handleClose = useCallback(() => {
    if (phase === 'closing') return
    setPhase('closing')
    setTimeout(() => {
      setPhase(null)
      setCurrent(null)
      onClose()
    }, 500)
  }, [phase, onClose])

  useEffect(() => {
    if (current) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [current])

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

  const renderContent = () => {
    const id = current.id
    const p = { content, project, scrollTop }
    switch (id) {
      case 'lovestory':     return <LoveStoryContent {...p} />
      case 'locations':     return <LocationsContent {...p} />
      case 'rsvp':          return <RSVPContent {...p} />
      case 'gallery':       return <GalleryContent {...p} />
      case 'timeline':      return <TimelineContent {...p} />
      case 'dresscode':     return <DresscodeContent {...p} />
      case 'gifts':         return <GiftsContent {...p} />
      case 'accommodations':return <AccommodationsContent {...p} />
      case 'witnesses':     return <WitnessesContent {...p} />
      case 'guestbook':     return <GuestbookContent {...p} />
      case 'musicwishes':   return <MusicWishesContent {...p} />
      case 'photoupload':   return <PhotoUploadContent {...p} />
      case 'faq':           return <FAQContent {...p} />
      case 'weddingabc':    return <WeddingABCContent {...p} />
      default:              return null
    }
  }

  const isFullWidth = ['gallery', 'photoupload'].includes(current.id)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      animation: phase === 'closing' ? 'modalFadeOut 0.5s ease forwards' : 'none',
    }}>
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: phase === 'letters' ? undefined : 'rgba(0,0,0,0.45)',
          animation: phase === 'letters' ? 'fadeToBlack 0.9s ease forwards' : 'none',
        }}
        onClick={handleClose}
      />

      {/* Letter Animation */}
      {phase === 'letters' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
          {letters.map((char, i) => {
            const centerOffset = i - (letters.length - 1) / 2
            return (
              <span key={i} style={{
                position: 'absolute', left: origin.x, top: origin.y,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: '0.8rem',
                pointerEvents: 'none', willChange: 'transform, font-size, opacity',
                '--spread': `${centerOffset * 40}px`,
                '--spread-far': `${centerOffset * 120}px`,
                animation: `letterSpin 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s forwards`,
              }}>{char}</span>
            )
          })}
        </div>
      )}

      {/* X Close Button */}
      {phase === 'open' && (
        <button onClick={handleClose} aria-label="Schließen" style={{
          position: 'fixed', top: '1.2rem', right: '1.5rem', zIndex: 10002,
          background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: 800,
          color: '#fff', cursor: 'pointer', width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          animation: 'spinIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}>✕</button>
      )}

      {/* Content Panel */}
      <div
        style={{
          position: 'absolute', right: 0, top: 0,
          width: isMobile ? '100vw' : '66vw', height: '100vh',
          background: '#000', display: 'flex', flexDirection: 'column', zIndex: 1,
          opacity: phase === 'open' ? 1 : 0,
          animation: phase === 'open' ? 'contentAppear 0.4s ease forwards' : 'none',
          pointerEvents: phase === 'open' ? 'auto' : 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div data-scroll-area onScroll={e => setScrollTop(e.target.scrollTop)} style={st.scrollArea}>
          <div style={{
            ...st.contentInner,
            maxWidth: isFullWidth ? 'none' : '600px',
            padding: isFullWidth ? '0' : '0 2rem',
          }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════
// CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── LOVESTORY ──
function LoveStoryContent({ content, scrollTop }) {
  const ls = content?.lovestory || {}
  const chapters = ls.events?.length >= 2 ? ls.events : [
    { date: '2019', title: 'Das erste Mal', description: 'Ein Blick quer durch den Raum. Die Musik verstummte.', image: '' },
    { date: '2022', title: 'Das Ja', description: 'Unter einem Himmel voller Sterne. Ein Knie. Ein Ring.', image: '' },
    { date: '2025', title: 'Für immer', description: 'Jetzt beginnt das schönste Kapitel unseres Lebens.', image: '' },
  ]
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 2rem 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>UNSERE GESCHICHTE</p>
        <h2 style={st.modalTitle}>Love Story</h2>
      </div>
      {chapters.map((ch, i) => {
        const hasImg = ch.image && typeof ch.image === 'string' && ch.image.startsWith('http')
        return (
          <div key={i} style={{ marginBottom: '6rem' }}>
            {hasImg && (
              <div style={{ overflow: 'hidden', height: '55vh', transform: `translateY(${px(scrollTop, 0.7 + i * 0.06)}px)` }}>
                <img src={ch.image} alt={ch.title} loading="lazy" style={{
                  width: '100%', height: '120%', objectFit: 'cover', display: 'block',
                  transform: `scale(${1 + scrollTop * 0.0004})`,
                  filter: `grayscale(${Math.max(0, Math.min(1, 1 - (scrollTop - i * 200) * 0.004))})`,
                  transition: 'filter 0.3s ease-out',
                }} />
              </div>
            )}
            <div style={{ padding: '3rem 2rem', transform: `translateY(${px(scrollTop, 0.25 + i * 0.1)}px)` }}>
              <p style={st.label}>{ch.date}</p>
              <h3 style={{ ...st.sectionTitle, fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>{ch.title}</h3>
              <p style={st.bodyText}>{ch.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── LOCATIONS (Orte + Anfahrt, kein Countdown mehr) ──
function LocationsContent({ content, scrollTop }) {
  const locations = content?.locations?.locations || content?.locations?.items || content?.locations?.venues || []
  const directions = content?.directions || {}

  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 2rem 2rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <h2 style={st.modalTitle}>Locations</h2>
      </div>
      {locations.length > 0 && (
        <div style={{ padding: '0 2rem' }}>
          <div style={{ transform: `translateY(${px(scrollTop, 0.3)}px)` }}><p style={st.label}>ORTE</p></div>
          {locations.map((loc, i) => (
            <div key={i} style={{ marginBottom: '4rem', transform: `translateY(${px(scrollTop, 0.4 + i * 0.15)}px)` }}>
              <h3 style={{ ...st.sectionTitle, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>{loc.name || loc.title}</h3>
              {loc.time && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{loc.time}</p>}
              {loc.address && <p style={st.bodyText}>{loc.address}</p>}
              {loc.description && <p style={st.bodyText}>{loc.description}</p>}
              {loc.maps_url && <a href={loc.maps_url} target="_blank" rel="noopener noreferrer" style={st.link}>Karte anzeigen</a>}
            </div>
          ))}
        </div>
      )}
      {directions.description && (
        <div style={{ padding: '0 2rem', transform: `translateY(${px(scrollTop, 0.55)}px)` }}>
          <p style={st.label}>ANFAHRT</p>
          <p style={st.bodyText}>{directions.description}</p>
          {directions.options?.map((opt, i) => (
            <div key={i} style={{ marginTop: '1.5rem', transform: `translateY(${px(scrollTop, 0.6 + i * 0.1)}px)` }}>
              <h4 style={{ ...st.sectionTitle, fontSize: '1rem' }}>{opt.method}</h4>
              <p style={st.bodyText}>{opt.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── RSVP ──
function RSVPContent({ content, scrollTop }) {
  const rsvp = useRSVP()
  const cfg = content?.rsvp || {}
  if (rsvp.submitted) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={st.modalTitle}>Danke!</h2>
        <p style={st.bodyText}>Deine Rückmeldung wurde gespeichert.</p>
        <button style={st.formBtn} onClick={rsvp.resetForm}>Neue Antwort</button>
      </div>
    )
  }
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 2rem', transform: `translateY(${px(scrollTop, 0.2)}px)` }}>
        <h2 style={st.modalTitle}>{cfg.title || 'RSVP'}</h2>
      </div>
      {cfg.description && <div style={{ transform: `translateY(${px(scrollTop, 0.35)}px)` }}><p style={{ ...st.bodyText, marginBottom: '2rem' }}>{cfg.description}</p></div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <input style={st.input} placeholder="Name *" value={rsvp.formData.name} onChange={e => rsvp.updateField('name', e.target.value)} />
        <input style={st.input} type="email" placeholder="E-Mail *" value={rsvp.formData.email} onChange={e => rsvp.updateField('email', e.target.value)} />
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button style={{ ...st.toggleBtn, ...(rsvp.formData.attending ? st.toggleActive : {}) }} onClick={() => rsvp.toggleAttending(true)}>Zusage</button>
          <button style={{ ...st.toggleBtn, ...(!rsvp.formData.attending ? st.toggleActive : {}) }} onClick={() => rsvp.toggleAttending(false)}>Absage</button>
        </div>
        {rsvp.formData.attending && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Personen:</span>
              <button style={st.adjustBtn} onClick={() => rsvp.adjustPersons(-1)}>−</button>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '1.5rem', textAlign: 'center', color: '#fff' }}>{rsvp.formData.persons}</span>
              <button style={st.adjustBtn} onClick={() => rsvp.adjustPersons(1)}>+</button>
            </div>
            <input style={st.input} placeholder="Unverträglichkeiten / Allergien" value={rsvp.formData.dietary} onChange={e => rsvp.updateField('dietary', e.target.value)} />
          </>
        )}
        <textarea style={{ ...st.input, minHeight: '80px', resize: 'vertical' }} placeholder="Nachricht (optional)" value={rsvp.formData.message} onChange={e => rsvp.updateField('message', e.target.value)} />
        {rsvp.error && <p style={{ color: '#f66', fontWeight: 700, fontSize: '0.85rem' }}>{rsvp.error}</p>}
        <button style={{ ...st.formBtn, opacity: rsvp.submitting ? 0.5 : 1 }} onClick={rsvp.submit} disabled={rsvp.submitting}>{rsvp.submitting ? 'Wird gesendet...' : 'Absenden'}</button>
      </div>
    </div>
  )
}

// ── GALLERY ──
const GALLERY_SPEEDS = [0.3, 0.55, 0.7, 0.35, 0.6, 0.45, 0.5, 0.65, 0.4]
function GalleryContent({ content, scrollTop }) {
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
  const isMobile = window.innerWidth < 768
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 2rem 3rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>MOMENTE</p>
        <h2 style={st.modalTitle}>Galerie</h2>
      </div>
      {images.map((src, i) => {
        const speed = GALLERY_SPEEDS[i % GALLERY_SPEEDS.length]
        const isWide = i % 3 === 0
        const isLeft = i % 2 === 0
        return (
          <div key={i} style={{
            overflow: 'hidden', height: isWide ? '70vh' : '50vh',
            width: isWide || isMobile ? '100%' : '70%',
            marginLeft: isWide || isMobile ? 0 : (isLeft ? 0 : 'auto'),
            marginRight: isWide || isMobile ? 0 : (isLeft ? 'auto' : 0),
            marginBottom: '-3vh', position: 'relative', zIndex: images.length - i,
            transform: `translateY(${scrollTop * (speed - 0.5) * 0.5}px)`,
          }}>
            <img src={src} alt={`Foto ${i + 1}`} loading="lazy" style={{
              width: '100%', height: '130%', objectFit: 'cover', display: 'block',
              transform: `scale(${1 + scrollTop * speed * 0.0004})`,
              filter: `grayscale(${Math.max(0, Math.min(1, 1 - (scrollTop - i * 120) * 0.004))})`,
              transition: 'filter 0.3s ease-out',
            }} />
          </div>
        )
      })}
    </div>
  )
}

// ── TIMELINE (Tagesablauf) ──
function TimelineContent({ content, scrollTop }) {
  const tl = content?.timeline || {}
  const events = tl.events?.length > 0 ? tl.events : [
    { time: '14:00 Uhr', title: 'Trauung', description: 'Die Zeremonie beginnt.' },
    { time: '15:30 Uhr', title: 'Sektempfang', description: 'Anstoßen im Garten.' },
    { time: '18:00 Uhr', title: 'Abendessen', description: 'Gemeinsam genießen.' },
    { time: '21:00 Uhr', title: 'Party', description: 'Bis in die Nacht tanzen.' },
  ]
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>DER TAG</p>
        <h2 style={st.modalTitle}>{tl.title || 'Tagesablauf'}</h2>
      </div>
      {events.map((ev, i) => (
        <div key={i} style={{
          display: 'flex', gap: '2rem', marginBottom: '4rem',
          transform: `translateY(${px(scrollTop, 0.3 + i * 0.12)}px)`,
        }}>
          <div style={{ minWidth: '5rem', textAlign: 'right' }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 800, color: 'rgba(255,255,255,0.15)', lineHeight: 1,
            }}>{ev.time}</span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '2rem' }}>
            <h3 style={st.sectionTitle}>{ev.title}</h3>
            {ev.description && <p style={st.bodyText}>{ev.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── DRESSCODE ──
function DresscodeContent({ content, scrollTop }) {
  const dc = content?.dresscode || {}
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>KLEIDUNG</p>
        <h2 style={st.modalTitle}>{dc.title || 'Dresscode'}</h2>
      </div>
      {dc.code && (
        <div style={{ textAlign: 'center', marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.6)}px)` }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            {dc.code}
          </span>
        </div>
      )}
      {dc.description && (
        <div style={{ transform: `translateY(${px(scrollTop, 0.35)}px)`, marginBottom: '3rem' }}>
          <p style={st.bodyText}>{dc.description}</p>
        </div>
      )}
      {dc.colors?.length > 0 && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.45)}px)` }}>
          <p style={st.label}>FARBPALETTE</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {dc.colors.map((c, i) => (
              <div key={i} style={{ width: '48px', height: '48px', borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
      )}
      {dc.dos?.length > 0 && (
        <div style={{ marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.5)}px)` }}>
          <p style={st.label}>GERNE GESEHEN</p>
          {dc.dos.map((d, i) => <p key={i} style={{ ...st.bodyText, marginBottom: '0.5rem' }}>{d}</p>)}
        </div>
      )}
      {dc.donts?.length > 0 && (
        <div style={{ transform: `translateY(${px(scrollTop, 0.55)}px)` }}>
          <p style={st.label}>BITTE NICHT</p>
          {dc.donts.map((d, i) => <p key={i} style={{ ...st.bodyText, marginBottom: '0.5rem' }}>{d}</p>)}
        </div>
      )}
    </div>
  )
}

// ── GIFTS (Geschenke) ──
function GiftsContent({ content, scrollTop }) {
  const gifts = useGifts()
  const gc = content?.gifts || {}
  const items = gc.items?.length > 0 ? gc.items : []
  const [reservingId, setReservingId] = useState(null)
  const [reserveName, setReserveName] = useState('')
  const [reserveEmail, setReserveEmail] = useState('')

  const handleReserve = async (item) => {
    if (!reserveName.trim()) return
    await gifts.reserveGiftItem?.(item.id, reserveName, reserveEmail)
    setReservingId(null)
    setReserveName('')
    setReserveEmail('')
  }

  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>WUNSCHLISTE</p>
        <h2 style={st.modalTitle}>{gc.title || 'Geschenke'}</h2>
      </div>
      {gc.description && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
          <p style={st.bodyText}>{gc.description}</p>
        </div>
      )}
      {gc.bank_details && (
        <div style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.15)', transform: `translateY(${px(scrollTop, 0.4)}px)` }}>
          <p style={st.label}>BANKVERBINDUNG</p>
          <p style={{ ...st.bodyText, whiteSpace: 'pre-line' }}>{gc.bank_details}</p>
        </div>
      )}
      {gc.paypal_link && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.42)}px)` }}>
          <a href={gc.paypal_link} target="_blank" rel="noopener noreferrer" style={st.link}>PayPal</a>
        </div>
      )}
      {items.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          {items.map((item, i) => {
            const reserved = gifts.isItemReserved?.(item.id) || item.reserved
            return (
              <div key={item.id || i} style={{
                marginBottom: '3rem', padding: '1.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                transform: `translateY(${px(scrollTop, 0.35 + i * 0.08)}px)`,
                opacity: reserved ? 0.4 : 1,
              }}>
                {item.image && (
                  <div style={{ overflow: 'hidden', height: '30vh', marginBottom: '1rem' }}>
                    <img src={item.image} alt={item.name || item.title} loading="lazy" style={{
                      width: '100%', height: '120%', objectFit: 'cover', display: 'block',
                      transform: `scale(${1 + scrollTop * 0.0003})`,
                    }} />
                  </div>
                )}
                <h3 style={st.sectionTitle}>{item.name || item.title}</h3>
                {item.price && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{item.price}</p>}
                {item.description && <p style={st.bodyText}>{item.description}</p>}
                {reserved ? (
                  <p style={{ ...st.label, marginTop: '1rem', color: 'rgba(255,255,255,0.3)' }}>RESERVIERT</p>
                ) : reservingId === (item.id || i) ? (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <input style={st.input} placeholder="Dein Name *" value={reserveName} onChange={e => setReserveName(e.target.value)} />
                    <input style={st.input} type="email" placeholder="E-Mail" value={reserveEmail} onChange={e => setReserveEmail(e.target.value)} />
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button style={st.formBtn} onClick={() => handleReserve(item)}>Reservieren</button>
                      <button style={{ ...st.toggleBtn, padding: '0.8rem 1.5rem' }} onClick={() => setReservingId(null)}>Abbrechen</button>
                    </div>
                  </div>
                ) : (
                  <button style={{ ...st.formBtn, marginTop: '1rem' }} onClick={() => setReservingId(item.id || i)}>Reservieren</button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── ACCOMMODATIONS (Unterkunft) ──
function AccommodationsContent({ content, scrollTop }) {
  const ac = content?.accommodations || {}
  const hotels = ac.hotels || []
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>SCHLAFEN</p>
        <h2 style={st.modalTitle}>{ac.title || 'Unterkunft'}</h2>
      </div>
      {ac.description && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
          <p style={st.bodyText}>{ac.description}</p>
        </div>
      )}
      {hotels.map((h, i) => (
        <div key={i} style={{
          marginBottom: '4rem', padding: '1.5rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transform: `translateY(${px(scrollTop, 0.35 + i * 0.12)}px)`,
        }}>
          <h3 style={st.sectionTitle}>{h.name}</h3>
          {h.distance && <p style={{ ...st.label, marginTop: '0.5rem' }}>{h.distance}</p>}
          {h.price_range && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{h.price_range}</p>}
          {h.address && <p style={st.bodyText}>{h.address}</p>}
          {h.description && <p style={st.bodyText}>{h.description}</p>}
          {h.phone && <p style={st.bodyText}>Tel: {h.phone}</p>}
          {h.website && <a href={h.website} target="_blank" rel="noopener noreferrer" style={st.link}>Website</a>}
        </div>
      ))}
    </div>
  )
}

// ── WITNESSES (Trauzeugen) ──
function WitnessesContent({ content, scrollTop }) {
  const wt = content?.witnesses || {}
  const persons = wt.persons || []
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>UNSERE BEGLEITER</p>
        <h2 style={st.modalTitle}>{wt.title || 'Trauzeugen'}</h2>
      </div>
      {wt.description && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
          <p style={st.bodyText}>{wt.description}</p>
        </div>
      )}
      {persons.map((p, i) => (
        <div key={i} style={{
          marginBottom: '4rem',
          transform: `translateY(${px(scrollTop, 0.35 + i * 0.15)}px)`,
        }}>
          {p.image && (
            <div style={{ overflow: 'hidden', height: '40vh', marginBottom: '1.5rem' }}>
              <img src={p.image} alt={p.name} loading="lazy" style={{
                width: '100%', height: '120%', objectFit: 'cover', display: 'block',
                transform: `scale(${1 + scrollTop * 0.0003})`,
                filter: `grayscale(${Math.max(0, Math.min(1, 1 - (scrollTop - i * 150) * 0.004))})`,
                transition: 'filter 0.3s ease-out',
              }} />
            </div>
          )}
          <h3 style={st.sectionTitle}>{p.name}</h3>
          {p.role && <p style={{ ...st.label, marginTop: '0.3rem' }}>{p.role}</p>}
          {p.description && <p style={st.bodyText}>{p.description}</p>}
          {p.contact?.phone && <p style={st.bodyText}>Tel: {p.contact.phone}</p>}
          {p.contact?.email && <p style={st.bodyText}>{p.contact.email}</p>}
        </div>
      ))}
    </div>
  )
}

// ── GUESTBOOK (Gästebuch) ──
function GuestbookContent({ scrollTop }) {
  const gb = useGuestbook()
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>WÜNSCHE & GRÜSSE</p>
        <h2 style={st.modalTitle}>Gästebuch</h2>
      </div>

      {gb.success ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h3 style={st.sectionTitle}>Danke!</h3>
          <p style={st.bodyText}>Dein Eintrag wurde gespeichert.</p>
          <button style={{ ...st.formBtn, marginTop: '1.5rem' }} onClick={gb.resetForm}>Neuer Eintrag</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', transform: `translateY(${px(scrollTop, 0.35)}px)` }}>
          <input style={st.input} placeholder="Dein Name *" value={gb.formData.name} onChange={e => gb.updateField('name', e.target.value)} />
          <textarea style={{ ...st.input, minHeight: '120px', resize: 'vertical' }} placeholder="Deine Nachricht *" value={gb.formData.message} onChange={e => gb.updateField('message', e.target.value)} />
          {gb.error && <p style={{ color: '#f66', fontWeight: 700, fontSize: '0.85rem' }}>{gb.error}</p>}
          <button style={{ ...st.formBtn, opacity: gb.submitting ? 0.5 : 1 }} onClick={gb.submitEntry} disabled={gb.submitting}>
            {gb.submitting ? 'Wird gesendet...' : 'Eintragen'}
          </button>
        </div>
      )}

      {/* Existing entries */}
      {gb.entries?.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <p style={st.label}>EINTRÄGE</p>
          {gb.entries.map((entry, i) => (
            <div key={i} style={{
              padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
              transform: `translateY(${px(scrollTop, 0.4 + i * 0.08)}px)`,
            }}>
              <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.3rem' }}>{entry.name}</p>
              <p style={st.bodyText}>{entry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── MUSIC WISHES (Musikwünsche) ──
function MusicWishesContent({ scrollTop }) {
  const mw = useMusicWishes()
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>PLAYLIST</p>
        <h2 style={st.modalTitle}>Musikwünsche</h2>
      </div>

      {mw.success ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h3 style={st.sectionTitle}>Danke!</h3>
          <p style={st.bodyText}>Dein Song wurde hinzugefügt.</p>
          <button style={{ ...st.formBtn, marginTop: '1.5rem' }} onClick={mw.resetForm}>Noch ein Song</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', transform: `translateY(${px(scrollTop, 0.35)}px)` }}>
          <input style={st.input} placeholder="Dein Name *" value={mw.formData.name} onChange={e => mw.updateField('name', e.target.value)} />
          <input style={st.input} placeholder="Künstler / Band *" value={mw.formData.artist} onChange={e => mw.updateField('artist', e.target.value)} />
          <input style={st.input} placeholder="Songtitel *" value={mw.formData.songTitle} onChange={e => mw.updateField('songTitle', e.target.value)} />
          {mw.error && <p style={{ color: '#f66', fontWeight: 700, fontSize: '0.85rem' }}>{mw.error}</p>}
          <button style={{ ...st.formBtn, opacity: mw.submitting ? 0.5 : 1 }} onClick={mw.submitWish} disabled={mw.submitting}>
            {mw.submitting ? 'Wird gesendet...' : 'Song vorschlagen'}
          </button>
        </div>
      )}

      {mw.wishes?.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <p style={st.label}>VORGESCHLAGENE SONGS</p>
          {mw.wishes.map((w, i) => (
            <div key={i} style={{
              padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
              transform: `translateY(${px(scrollTop, 0.4 + i * 0.06)}px)`,
            }}>
              <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{w.artist} — {w.songTitle || w.song_title}</p>
              <p style={{ ...st.label, fontSize: '0.6rem', marginTop: '0.2rem' }}>von {w.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PHOTO UPLOAD (Eure Fotos) ──
function PhotoUploadContent({ content, scrollTop }) {
  const pu = usePhotoUpload({ maxFiles: content?.photoupload?.max_files || 10, maxSizeMB: content?.photoupload?.max_size_mb || 10 })
  const cfg = content?.photoupload || {}
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 2rem 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>TEILT EURE BILDER</p>
        <h2 style={st.modalTitle}>{cfg.title || 'Eure Fotos'}</h2>
      </div>
      {cfg.description && (
        <div style={{ padding: '0 2rem', marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
          <p style={st.bodyText}>{cfg.description}</p>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={pu.openFilePicker}
        onDrop={pu.handleDrop}
        onDragOver={pu.handleDragOver}
        style={{
          margin: '0 2rem', padding: '4rem 2rem',
          border: '2px dashed rgba(255,255,255,0.2)',
          textAlign: 'center', cursor: 'pointer',
          transform: `translateY(${px(scrollTop, 0.4)}px)`,
        }}
      >
        <p style={{ ...st.sectionTitle, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          {pu.uploading ? `Hochladen... ${pu.progress}%` : 'Fotos hochladen'}
        </p>
        <p style={st.bodyText}>Klicken oder Dateien hierher ziehen</p>
      </div>
      <HiddenFileInput fileInputRef={pu.fileInputRef} handleFileSelect={pu.handleFileSelect} />

      {pu.error && <p style={{ color: '#f66', fontWeight: 700, fontSize: '0.85rem', padding: '1rem 2rem' }}>{pu.error}</p>}
      {pu.success && <p style={{ color: '#6f6', fontWeight: 700, fontSize: '0.85rem', padding: '1rem 2rem' }}>Fotos erfolgreich hochgeladen!</p>}

      {/* Uploaded photos */}
      {pu.uploadedPhotos?.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ padding: '0 2rem' }}><p style={st.label}>HOCHGELADENE FOTOS</p></div>
          {pu.uploadedPhotos.map((photo, i) => {
            const speed = GALLERY_SPEEDS[i % GALLERY_SPEEDS.length]
            return (
              <div key={i} style={{
                overflow: 'hidden', height: '40vh', marginBottom: '-2vh',
                transform: `translateY(${scrollTop * (speed - 0.5) * 0.4}px)`,
              }}>
                <img src={photo.url || photo} alt={`Upload ${i + 1}`} loading="lazy" style={{
                  width: '100%', height: '120%', objectFit: 'cover', display: 'block',
                  transform: `scale(${1 + scrollTop * speed * 0.0003})`,
                }} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── FAQ ──
function FAQContent({ content, scrollTop }) {
  const faqData = content?.faq || {}
  const questions = faqData.questions || []
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>FRAGEN & ANTWORTEN</p>
        <h2 style={st.modalTitle}>{faqData.title || 'FAQ'}</h2>
      </div>
      {questions.map((q, i) => (
        <div
          key={i}
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            transform: `translateY(${px(scrollTop, 0.3 + i * 0.08)}px)`,
          }}
        >
          <div
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              padding: '1.5rem 0', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <h3 style={{ ...st.sectionTitle, fontSize: '1.1rem', marginBottom: 0 }}>{q.question}</h3>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '1.2rem', fontWeight: 800,
              color: 'rgba(255,255,255,0.3)', transform: openIdx === i ? 'rotate(45deg)' : 'none',
              transition: 'transform 0.3s ease',
            }}>+</span>
          </div>
          {openIdx === i && (
            <div style={{ paddingBottom: '1.5rem' }}>
              <p style={st.bodyText}>{q.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── WEDDING ABC (Hochzeits-ABC) ──
function WeddingABCContent({ content, scrollTop }) {
  const abc = content?.weddingabc || {}
  const entries = abc.entries || []
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>VON A BIS Z</p>
        <h2 style={st.modalTitle}>{abc.title || 'Hochzeits-ABC'}</h2>
      </div>
      {abc.description && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
          <p style={st.bodyText}>{abc.description}</p>
        </div>
      )}
      {entries.map((e, i) => (
        <div key={i} style={{
          display: 'flex', gap: '1.5rem', marginBottom: '2.5rem',
          transform: `translateY(${px(scrollTop, 0.3 + i * 0.05)}px)`,
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.1)',
            lineHeight: 1,
            minWidth: '2.5rem',
          }}>{e.letter}</span>
          <div>
            <h3 style={{ ...st.sectionTitle, fontSize: '1.1rem' }}>{e.title}</h3>
            <p style={st.bodyText}>{e.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const st = {
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
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '1rem',
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
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
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.7,
    whiteSpace: 'pre-line',
  },
  link: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#fff',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    display: 'inline-block',
    marginTop: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '1px solid rgba(255,255,255,0.25)',
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
    border: '1px solid rgba(255,255,255,0.25)',
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
    border: '1px solid rgba(255,255,255,0.25)',
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
