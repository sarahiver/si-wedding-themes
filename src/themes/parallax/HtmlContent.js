// src/themes/parallax/HtmlContent.js
// White text zones that cover images behind them
// Each zone: bold headline (clickable → opens modal)

import { useState, useEffect, useRef } from 'react'
import { HERO_TXT, LS_TXT, CD_TXT, GAL_TXT, FOOTER } from './scrollConfig'

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

// Clickable title — replaces DiscoverBtn
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

// Smaller clickable text for Infos/RSVP
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
  const [n1, n2] = cn.includes('&') ? cn.split('&').map(s => s.trim()) : [cn, '']
  const wDate = project?.wedding_date
    ? new window.Date(project.wedding_date).toLocaleDateString('de-DE', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : ''

  return (
    <div style={{ userSelect: 'none', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO TEXT ── */}
      <TextZone range={HERO_TXT}>
        <p style={s.label}>{wDate || '16. August 2025'}</p>
        <h1 style={s.heroName}>{n1}</h1>
        <span style={s.amp}>&</span>
        <h1 style={s.heroName}>{n2}</h1>
      </TextZone>

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
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '1.5rem' }}>
          <ClickableLink
            text="Infos"
            onClick={(origin, label) => onOpenModal?.('info', origin, label)}
            style={s.clickableLink}
          />
          <ClickableLink
            text="RSVP"
            onClick={(origin, label) => onOpenModal?.('rsvp', origin, label)}
            style={s.clickableLink}
          />
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
  heroName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    fontWeight: 800,
    color: '#000',
    lineHeight: 0.95,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  amp: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: 800,
    color: 'rgba(0,0,0,0.2)',
    display: 'block',
    margin: '0.3rem 0',
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
