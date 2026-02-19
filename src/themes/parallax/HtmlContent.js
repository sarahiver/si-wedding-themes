// src/themes/parallax/HtmlContent.js
// White text zones that cover images behind them
// Each zone: bold headline (clickable → opens modal)

import { useState, useEffect, useRef } from 'react'
import { HERO_TXT, LS_TXT, CD_TXT, GAL_TXT, DETAILS_TXT, FOOTER } from './scrollConfig'

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

// Clickable title (big heading)
function ClickableTitle({ text, onClick, style }) {
  const ref = useRef(null)
  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    onClick(origin, text)
  }
  return (
    <h2
      ref={ref}
      onClick={handleClick}
      style={{ ...style, cursor: 'pointer' }}
    >
      {text}
    </h2>
  )
}

// Smaller clickable text
function ClickableLink({ text, onClick, style }) {
  const ref = useRef(null)
  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    onClick(origin, text)
  }
  return (
    <span
      ref={ref}
      onClick={handleClick}
      style={{ ...style, cursor: 'pointer' }}
    >
      {text}
    </span>
  )
}

export default function HtmlContent({ project, content, onOpenModal }) {
  const cd = useCountdown(project?.wedding_date)
  const cn = project?.couple_names || 'Lena & Jonas'

  return (
    <div style={{ userSelect: 'none', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO TEXT (names in fixed overlay in WeddingApp) ── */}
      <TextZone range={HERO_TXT} />

      {/* ── LOVESTORY TEXT ── */}
      <TextZone range={LS_TXT}>
        <p style={s.label}>UNSERE GESCHICHTE</p>
        <ClickableTitle
          text="Love Story"
          onClick={(origin, label) => onOpenModal?.('lovestory', origin, label)}
          style={s.sectionTitle}
        />
      </TextZone>

      {/* ── COUNTDOWN TEXT ── */}
      <TextZone range={CD_TXT}>
        {!cd.past ? (
          <>
            <p style={s.label}>NOCH</p>
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
          </>
        ) : (
          <p style={s.label}>WIR HABEN GEHEIRATET</p>
        )}
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ClickableLink text="Tagesablauf" onClick={(o, l) => onOpenModal?.('timeline', o, l)} style={s.clickableLink} />
          <ClickableLink text="Dresscode" onClick={(o, l) => onOpenModal?.('dresscode', o, l)} style={s.clickableLink} />
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ClickableLink text="Infos" onClick={(o, l) => onOpenModal?.('info', o, l)} style={s.clickableLink} />
          <ClickableLink text="RSVP" onClick={(o, l) => onOpenModal?.('rsvp', o, l)} style={s.clickableLink} />
        </div>
      </TextZone>

      {/* ── GALLERY TEXT ── */}
      <TextZone range={GAL_TXT}>
        <p style={s.label}>MOMENTE</p>
        <ClickableTitle
          text="Galerie"
          onClick={(origin, label) => onOpenModal?.('gallery', origin, label)}
          style={s.sectionTitle}
        />
      </TextZone>

      {/* ── DETAILS TEXT (additional sections) ── */}
      <TextZone range={DETAILS_TXT}>
        <p style={s.label}>MEHR ENTDECKEN</p>
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ClickableLink text="Geschenke" onClick={(o, l) => onOpenModal?.('gifts', o, l)} style={s.clickableLink} />
          <ClickableLink text="Gästebuch" onClick={(o, l) => onOpenModal?.('guestbook', o, l)} style={s.clickableLink} />
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ClickableLink text="Musikwünsche" onClick={(o, l) => onOpenModal?.('musicwishes', o, l)} style={s.clickableLink} />
          <ClickableLink text="Eure Fotos" onClick={(o, l) => onOpenModal?.('photoupload', o, l)} style={s.clickableLink} />
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ClickableLink text="Unterkunft" onClick={(o, l) => onOpenModal?.('accommodations', o, l)} style={s.clickableLink} />
          <ClickableLink text="FAQ" onClick={(o, l) => onOpenModal?.('faq', o, l)} style={s.clickableLink} />
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ClickableLink text="Trauzeugen" onClick={(o, l) => onOpenModal?.('witnesses', o, l)} style={s.clickableLink} />
          <ClickableLink text="Hochzeits-ABC" onClick={(o, l) => onOpenModal?.('weddingabc', o, l)} style={s.clickableLink} />
        </div>
      </TextZone>

      {/* ── FOOTER ── */}
      <TextZone range={FOOTER}>
        <p style={s.footerNames}>{cn}</p>
        <p style={{ ...s.label, opacity: 0.25, marginTop: '0.6rem' }}>MIT LIEBE</p>
      </TextZone>

    </div>
  )
}

const s = {
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.35)',
    marginBottom: '0.6rem',
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 800,
    color: '#000',
    lineHeight: 1.1,
    marginBottom: '0',
  },
  clickableLink: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#000',
  },
  countRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(1.5rem, 4vw, 3rem)',
    margin: '0.5rem 0',
  },
  countNum: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
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
  footerNames: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    color: '#000',
  },
}
