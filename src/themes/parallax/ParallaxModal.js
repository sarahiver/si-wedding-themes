// src/themes/parallax/ParallaxModal.js
import { useEffect, useCallback, useState, useRef } from 'react'
import { useRSVP } from '../../components/shared/RSVPCore'
import { useGuestbook } from '../../components/shared/GuestbookCore'
import { useMusicWishes } from '../../components/shared/MusicWishesCore'
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore'
import { useGifts } from '../../components/shared/GiftsCore'
import { getAllGalleryUrls } from './galleryHelper'

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
      case 'directions':    return <DirectionsContent {...p} />
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
        <h2 style={st.modalTitle}>{ls.title || 'Love Story'}</h2>
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

// ── LOCATIONS (Orte + Anfahrt) ──
function LocationsContent({ content, scrollTop }) {
  const lc = content?.locations || {}
  const raw = lc.locations || lc.items || lc.venues || []
  const locations = raw.length > 0 ? raw : [
    { name: 'Kirche St. Peter', time: '14:00 Uhr', address: 'Kirchstraße 12, 80331 München', description: 'Hier beginnt unser gemeinsamer Weg.' },
    { name: 'Gut Sonnenhof', time: '16:00 Uhr', address: 'Sonnenweg 5, 82049 Pullach', description: 'Empfang, Dinner & Party bis in die Nacht.' },
  ]
  const directions = content?.directions || {}

  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 2rem 2rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <h2 style={st.modalTitle}>{lc.title || 'Locations'}</h2>
      </div>
      <div style={{ padding: '0 2rem' }}>
        <div style={{ transform: `translateY(${px(scrollTop, 0.3)}px)` }}><p style={st.label}>ORTE</p></div>
        {locations.map((loc, i) => (
          <div key={i} style={{ marginBottom: '4rem', transform: `translateY(${px(scrollTop, 0.4 + i * 0.15)}px)` }}>
            {loc.image && (
              <div style={{ overflow: 'hidden', height: '40vh', marginBottom: '1.5rem' }}>
                <img src={loc.image} alt={loc.name} loading="lazy" style={{
                  width: '100%', height: '120%', objectFit: 'cover', display: 'block',
                  transform: `scale(${1 + scrollTop * 0.0003})`,
                }} />
              </div>
            )}
            {loc.label && <p style={st.label}>{loc.label}</p>}
            <h3 style={{ ...st.sectionTitle, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>{loc.name || loc.title}</h3>
            {loc.time && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{loc.time}</p>}
            {loc.address && <p style={st.bodyText}>{loc.address}</p>}
            {loc.description && <p style={st.bodyText}>{loc.description}</p>}
            {loc.maps_url && <a href={loc.maps_url} target="_blank" rel="noopener noreferrer" style={st.link}>Karte anzeigen</a>}
          </div>
        ))}
      </div>
      {(directions.title || directions.address || directions.items?.length > 0 || directions.note) && (
        <div style={{ padding: '0 2rem', transform: `translateY(${px(scrollTop, 0.55)}px)` }}>
          <p style={st.label}>ANFAHRT</p>
          {directions.address && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>{directions.address}</p>}
          {directions.maps_embed && (
            <div style={{ marginBottom: '2rem', height: '250px', overflow: 'hidden' }}>
              <iframe src={directions.maps_embed} width="100%" height="250" style={{ border: 0, filter: 'invert(0.9) grayscale(1)' }} allowFullScreen loading="lazy" title="Anfahrt" />
            </div>
          )}
          {directions.note && <p style={{ ...st.bodyText, marginBottom: '1.5rem' }}>{directions.note}</p>}
          {directions.items?.map((item, i) => (
            <div key={i} style={{ marginTop: '1.5rem', transform: `translateY(${px(scrollTop, 0.6 + i * 0.1)}px)` }}>
              <h4 style={{ ...st.sectionTitle, fontSize: '1rem' }}>{item.title}</h4>
              <p style={st.bodyText}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── DIRECTIONS (Standalone Anfahrt) ──
function DirectionsContent({ content, scrollTop }) {
  const dir = content?.directions || {}
  const items = dir.items?.length > 0 ? dir.items : []
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>WEGBESCHREIBUNG</p>
        <h2 style={st.modalTitle}>{dir.title || 'Anfahrt'}</h2>
      </div>
      {dir.address && (
        <div style={{ marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
          <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{dir.address}</p>
        </div>
      )}
      {dir.maps_embed && (
        <div style={{ marginBottom: '2rem', height: '300px', overflow: 'hidden', transform: `translateY(${px(scrollTop, 0.35)}px)` }}>
          <iframe src={dir.maps_embed} width="100%" height="300" style={{ border: 0, filter: 'invert(0.9) grayscale(1)' }} allowFullScreen loading="lazy" title="Anfahrt" />
        </div>
      )}
      {dir.note && (
        <div style={{ marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.4)}px)` }}>
          <p style={st.bodyText}>{dir.note}</p>
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.4 + i * 0.12)}px)` }}>
          <h3 style={st.sectionTitle}>{item.title}</h3>
          {item.description && <p style={st.bodyText}>{item.description}</p>}
        </div>
      ))}
    </div>
  )
}

// ── RSVP ──
function RSVPContent({ content, scrollTop }) {
  const rsvp = useRSVP()
  const cfg = content?.rsvp || {}
  const askDietary = cfg.ask_dietary !== false
  const askAllergies = cfg.ask_allergies !== false
  const persons = rsvp.formData.persons || 1

  // Handle persons change — sync guests array
  const handlePersonsChange = (delta) => {
    const newCount = Math.max(1, Math.min(5, persons + delta))
    rsvp.updateField('persons', newCount)
    const currentGuests = rsvp.formData.guests || []
    if (newCount > currentGuests.length) {
      const newGuests = [...currentGuests]
      for (let i = currentGuests.length; i < newCount; i++) {
        newGuests.push({ name: '', dietary: '', allergies: '' })
      }
      rsvp.updateField('guests', newGuests)
    } else {
      rsvp.updateField('guests', currentGuests.slice(0, newCount))
    }
  }

  const updateGuest = (index, field, value) => {
    const newGuests = [...(rsvp.formData.guests || [])]
    if (!newGuests[index]) newGuests[index] = { name: '', dietary: '', allergies: '' }
    newGuests[index] = { ...newGuests[index], [field]: value }
    rsvp.updateField('guests', newGuests)
  }

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
      {cfg.deadline && (
        <div style={{ marginBottom: '1.5rem', transform: `translateY(${px(scrollTop, 0.38)}px)` }}>
          <p style={{ ...st.label, color: 'rgba(255,255,255,0.5)' }}>BITTE BIS {cfg.deadline} ANTWORTEN</p>
        </div>
      )}
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
              <button style={st.adjustBtn} onClick={() => handlePersonsChange(-1)}>−</button>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '1.5rem', textAlign: 'center', color: '#fff' }}>{persons}</span>
              <button style={st.adjustBtn} onClick={() => handlePersonsChange(1)}>+</button>
            </div>

            {/* Single person fields */}
            {persons === 1 && askDietary && (
              <select style={st.input} value={rsvp.formData.dietary || ''} onChange={e => rsvp.updateField('dietary', e.target.value)}>
                <option value="">Keine besonderen Wünsche</option>
                <option value="vegetarisch">Vegetarisch</option>
                <option value="vegan">Vegan</option>
                <option value="pescetarisch">Pescetarisch</option>
                <option value="andere">Andere</option>
              </select>
            )}
            {persons === 1 && askAllergies && (
              <input style={st.input} placeholder="Allergien / Unverträglichkeiten" value={rsvp.formData.allergies || ''} onChange={e => rsvp.updateField('allergies', e.target.value)} />
            )}

            {/* Multi-person fields */}
            {persons > 1 && (askDietary || askAllergies) && (
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem' }}>
                <p style={{ ...st.label, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>ANGABEN PRO PERSON</p>
                {Array.from({ length: persons }, (_, i) => {
                  const guest = rsvp.formData.guests?.[i] || { name: '', dietary: '', allergies: '' }
                  return (
                    <div key={i} style={{ paddingBottom: i < persons - 1 ? '1rem' : 0, marginBottom: i < persons - 1 ? '1rem' : 0, borderBottom: i < persons - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Person {i + 1}{i === 0 ? ' (Hauptgast)' : ''}</p>
                      {i > 0 && <input style={{ ...st.input, marginBottom: '0.6rem' }} placeholder={`Name Person ${i + 1}`} value={guest.name || ''} onChange={e => updateGuest(i, 'name', e.target.value)} />}
                      {askDietary && (
                        <select style={{ ...st.input, marginBottom: '0.6rem' }} value={i === 0 ? (rsvp.formData.dietary || '') : (guest.dietary || '')} onChange={e => i === 0 ? rsvp.updateField('dietary', e.target.value) : updateGuest(i, 'dietary', e.target.value)}>
                          <option value="">Keine besonderen Wünsche</option>
                          <option value="vegetarisch">Vegetarisch</option>
                          <option value="vegan">Vegan</option>
                          <option value="pescetarisch">Pescetarisch</option>
                          <option value="andere">Andere</option>
                        </select>
                      )}
                      {askAllergies && (
                        <input style={st.input} placeholder="Allergien / Unverträglichkeiten" value={i === 0 ? (rsvp.formData.allergies || '') : (guest.allergies || '')} onChange={e => i === 0 ? rsvp.updateField('allergies', e.target.value) : updateGuest(i, 'allergies', e.target.value)} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
        {cfg.custom_question && (
          <input style={st.input} placeholder={cfg.custom_question} value={rsvp.formData.custom_answer || ''} onChange={e => rsvp.updateField('custom_answer', e.target.value)} />
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
  const images = getAllGalleryUrls(content)
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
  const code = dc.code || 'Festlich Elegant'
  const desc = dc.description || 'Wir freuen uns, wenn ihr euch festlich kleidet. Tragt, worin ihr euch wohlfühlt — Hauptsache, ihr feiert mit uns!'
  const rawColors = dc.colors?.length > 0 ? dc.colors : [{ hex: '#8B7355' }, { hex: '#A8B5A2' }, { hex: '#F5F0EB' }, { hex: '#D4C5B2' }, { hex: '#2C3E2D' }]
  const colors = rawColors.map(c => typeof c === 'string' ? { hex: c, name: '' } : c)
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>KLEIDUNG</p>
        <h2 style={st.modalTitle}>{dc.title || 'Dresscode'}</h2>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.6)}px)` }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          {code}
        </span>
      </div>
      <div style={{ transform: `translateY(${px(scrollTop, 0.35)}px)`, marginBottom: '3rem' }}>
        <p style={st.bodyText}>{desc}</p>
      </div>
      <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.45)}px)` }}>
        <p style={st.label}>FARBPALETTE</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {colors.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: c.hex, border: '2px solid rgba(255,255,255,0.2)' }} />
              {c.name && <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textAlign: 'center' }}>{c.name}</span>}
            </div>
          ))}
        </div>
      </div>
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
  const fallbackDesc = gc.description || 'Das größte Geschenk ist eure Anwesenheit an unserem Tag. Wer uns dennoch etwas schenken möchte, darf gerne zu unserer Reisekasse beitragen.'
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
      <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
        <p style={st.bodyText}>{fallbackDesc}</p>
      </div>
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
      {gc.show_registry && gc.registry_url && (
        <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.44)}px)` }}>
          <a href={gc.registry_url} target="_blank" rel="noopener noreferrer" style={st.link}>Wunschliste anzeigen</a>
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
                <h3 style={st.sectionTitle}>{item.title || item.name}</h3>
                {item.cost && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{item.cost}</p>}
                {item.description && <p style={st.bodyText}>{item.description}</p>}
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ ...st.link, marginBottom: '0.5rem' }}>Ansehen</a>}
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
  const desc = ac.description || 'Für alle, die von weiter anreisen oder einfach die Nacht durchfeiern wollen — hier ein paar Empfehlungen in der Nähe.'
  const hotels = ac.hotels?.length > 0 ? ac.hotels : [
    { name: 'Hotel Bergblick', distance: '5 Min. zur Location', price_range: 'ab 89 € / Nacht', address: 'Bergstraße 15, 82049 Pullach' },
    { name: 'Gasthof zur Post', distance: '10 Min. zur Location', price_range: 'ab 69 € / Nacht', address: 'Postplatz 3, 82049 Pullach' },
    { name: 'Pension am See', distance: '15 Min. zur Location', price_range: 'ab 55 € / Nacht', address: 'Seeweg 8, 82049 Pullach' },
  ]
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>SCHLAFEN</p>
        <h2 style={st.modalTitle}>{ac.title || 'Unterkunft'}</h2>
      </div>
      <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
        <p style={st.bodyText}>{desc}</p>
      </div>
      {hotels.map((h, i) => (
        <div key={i} style={{
          marginBottom: '4rem', padding: '1.5rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transform: `translateY(${px(scrollTop, 0.35 + i * 0.12)}px)`,
        }}>
          {h.image && (
            <div style={{ overflow: 'hidden', height: '35vh', marginBottom: '1.5rem' }}>
              <img src={h.image} alt={h.name} loading="lazy" style={{
                width: '100%', height: '120%', objectFit: 'cover', display: 'block',
                transform: `scale(${1 + scrollTop * 0.0003})`,
              }} />
            </div>
          )}
          <h3 style={st.sectionTitle}>{h.name}</h3>
          {h.distance && <p style={{ ...st.label, marginTop: '0.5rem' }}>{h.distance}</p>}
          {h.price_range && <p style={{ ...st.bodyText, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{h.price_range}</p>}
          {h.address && <p style={st.bodyText}>{h.address}</p>}
          {h.booking_code && <p style={{ ...st.bodyText, fontStyle: 'italic' }}>Buchungscode: {h.booking_code}</p>}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {h.maps_url && <a href={h.maps_url} target="_blank" rel="noopener noreferrer" style={st.link}>Karte</a>}
            {(h.booking_url || h.url) && <a href={h.booking_url || h.url} target="_blank" rel="noopener noreferrer" style={st.link}>Buchen</a>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── WITNESSES (Trauzeugen) ──
function WitnessesContent({ content, scrollTop }) {
  const wt = content?.witnesses || {}
  const desc = wt.description || 'Die Menschen, die uns auf diesem Weg begleiten und ohne die dieser Tag nicht derselbe wäre.'
  const persons = wt.persons?.length > 0 ? wt.persons : [
    { name: 'Anna Müller', role: 'Trauzeugin der Braut', description: 'Beste Freundin seit der Schulzeit. Immer an meiner Seite — vom ersten Liebeskummer bis zum Brautkleidkauf.' },
    { name: 'Max Weber', role: 'Trauzeuge des Bräutigams', description: 'Seit dem Studium unzertrennlich. Partner in Crime, bester Ratgeber und offizieller Ring-Bewacher.' },
  ]
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>UNSERE BEGLEITER</p>
        <h2 style={st.modalTitle}>{wt.title || 'Trauzeugen'}</h2>
      </div>
      <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
        <p style={st.bodyText}>{desc}</p>
      </div>
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
          {(p.phone || p.contact?.phone) && <p style={st.bodyText}>Tel: {p.phone || p.contact.phone}</p>}
          {(p.email || p.contact?.email) && <p style={st.bodyText}>{p.email || p.contact.email}</p>}
          {p.whatsapp && <a href={`https://wa.me/${p.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={st.link}>WhatsApp</a>}
        </div>
      ))}
    </div>
  )
}

// ── GUESTBOOK (Gästebuch) ──
function GuestbookContent({ content, scrollTop }) {
  const gb = useGuestbook()
  const cfg = content?.guestbook || {}
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>WÜNSCHE & GRÜSSE</p>
        <h2 style={st.modalTitle}>{cfg.title || 'Gästebuch'}</h2>
      </div>
      {cfg.description && (
        <div style={{ marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.25)}px)` }}>
          <p style={st.bodyText}>{cfg.description}</p>
        </div>
      )}

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
function MusicWishesContent({ content, scrollTop }) {
  const mw = useMusicWishes()
  const cfg = content?.musicwishes || {}
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>PLAYLIST</p>
        <h2 style={st.modalTitle}>{cfg.title || 'Musikwünsche'}</h2>
      </div>
      {cfg.description && (
        <div style={{ marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.25)}px)` }}>
          <p style={st.bodyText}>{cfg.description}</p>
        </div>
      )}
      {cfg.spotify_playlist && (
        <div style={{ marginBottom: '2rem', transform: `translateY(${px(scrollTop, 0.28)}px)` }}>
          <a href={cfg.spotify_playlist} target="_blank" rel="noopener noreferrer" style={st.link}>Spotify Playlist anhören</a>
        </div>
      )}

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
  const questions = faqData.questions?.length > 0 ? faqData.questions : [
    { question: 'Kann ich jemanden mitbringen?', answer: 'Bitte sprecht uns vorher an, falls ihr noch eine Begleitung mitbringen möchtet. Wir planen mit festen Platzzahlen.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze sind direkt an der Location vorhanden. Bitte bildet Fahrgemeinschaften, wenn möglich.' },
    { question: 'Sind Kinder willkommen?', answer: 'Natürlich! Für die kleinen Gäste wird es eine Spielecke und Kinderbetreuung geben.' },
    { question: 'Was passiert bei Regen?', answer: 'Keine Sorge — die Location bietet genug Platz für drinnen und draußen. Plan B steht!' },
    { question: 'Bis wann muss ich zusagen?', answer: 'Bitte gebt uns bis spätestens 6 Wochen vor der Hochzeit Bescheid, damit wir alles planen können.' },
    { question: 'Gibt es ein Shuttle?', answer: 'Wir organisieren Sammeltaxis für die Rückfahrt. Details folgen rechtzeitig.' },
  ]
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
  const desc = abc.description || 'Alles, was ihr über unseren großen Tag wissen müsst — alphabetisch sortiert.'
  const entries = abc.entries?.length > 0 ? abc.entries : [
    { letter: 'A', word: 'Anfahrt', description: 'Parkplätze sind direkt an der Location vorhanden. Bildet gerne Fahrgemeinschaften!' },
    { letter: 'B', word: 'Blumenkinder', description: 'Wer möchte, darf gerne nach der Trauung Blütenblätter streuen. Meldet euch bei den Trauzeugen.' },
    { letter: 'D', word: 'Dresscode', description: 'Festlich elegant. Farben: Erdtöne, Salbei, Creme. Tragt, worin ihr euch wohlfühlt!' },
    { letter: 'F', word: 'Fotos', description: 'Nutzt gerne unsere Foto-Upload-Funktion auf dieser Seite. Wir freuen uns über eure Perspektive!' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das größte Geschenk. Wer dennoch etwas geben möchte: unsere Reisekasse freut sich.' },
    { letter: 'K', word: 'Kinder', description: 'Herzlich willkommen! Kinderbetreuung und Spielecke sind vorhanden.' },
    { letter: 'M', word: 'Musik', description: 'Songwünsche könnt ihr vorab über diese Seite einreichen. Die DJ-Playlist freut sich!' },
    { letter: 'P', word: 'Party', description: 'Wir feiern bis in die Nacht. Bequeme Tanzschuhe empfohlen!' },
    { letter: 'R', word: 'Reden', description: 'Wer eine Rede halten möchte, meldet sich bitte vorab bei den Trauzeugen.' },
    { letter: 'T', word: 'Taxis', description: 'Sammeltaxis für die Heimfahrt werden organisiert. Details folgen rechtzeitig.' },
    { letter: 'U', word: 'Unterkunft', description: 'Empfehlungen für Übernachtungen findet ihr unter "Unterkunft" auf dieser Seite.' },
    { letter: 'W', word: 'Wetter', description: 'Wir haben einen Plan B für schlechtes Wetter. Kommt einfach — egal was der Himmel macht!' },
  ]
  return (
    <div style={{ paddingBottom: '8rem' }}>
      <div style={{ padding: '6rem 0 4rem', transform: `translateY(${px(scrollTop, 0.15)}px)` }}>
        <p style={st.label}>VON A BIS Z</p>
        <h2 style={st.modalTitle}>{abc.title || 'Hochzeits-ABC'}</h2>
      </div>
      <div style={{ marginBottom: '3rem', transform: `translateY(${px(scrollTop, 0.3)}px)` }}>
        <p style={st.bodyText}>{desc}</p>
      </div>
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
            <h3 style={{ ...st.sectionTitle, fontSize: '1.1rem' }}>{e.word || e.title}</h3>
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
