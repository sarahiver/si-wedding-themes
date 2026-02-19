// src/themes/parallax/HtmlContent.js
// Receives project + content as PROPS — no useWedding() here
// <Scroll html> creates a portal outside WeddingProvider context

import { useState, useEffect } from 'react'
import { HERO, LOVESTORY, COUNTDOWN, GALLERY } from './scrollConfig'

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

export default function HtmlContent({ project, content }) {
  const cd = useCountdown(project?.wedding_date)
  const ls = content?.lovestory || {}

  const cn = project?.couple_names || 'Lena & Jonas'
  const [n1, n2] = cn.includes('&') ? cn.split('&').map(s => s.trim()) : [cn, '']
  const tagline = content?.hero?.tagline || ''
  const wDate = project?.wedding_date
    ? new window.Date(project.wedding_date).toLocaleDateString('de-DE', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : ''

  const chapterLen = LOVESTORY[1] / 3

  const defaultChapters = [
    { date: '2019', title: 'Das erste Mal', description: 'Ein Blick quer durch den Raum.\nDie Musik verstummte.' },
    { date: '2022', title: 'Das Ja', description: 'Unter einem Himmel voller Sterne.\nEin Knie. Ein Ring.' },
    { date: '2025', title: 'Für immer', description: 'Jetzt beginnt das schönste\nKapitel unseres Lebens.' },
  ]
  const chapters = ls.events?.length >= 2
    ? ls.events.slice(0, 3).map(e => ({ date: e.date, title: e.title, description: e.description }))
    : defaultChapters

  return (
    <div style={{ userSelect: 'none', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transform: `translate3d(52vw, 18vh, 0)`,
      }}>
        <p style={s.eyebrow}>{wDate || '16. August 2025'}</p>
        <h1 style={s.heroName}>{n1}</h1>
        <span style={s.amp}>&amp;</span>
        <h1 style={{ ...s.heroName, paddingLeft: '0.15em' }}>{n2}</h1>
        {tagline && <>
          <div style={s.divider} />
          <p style={s.tagline}>{tagline.toUpperCase()}</p>
        </>}
      </div>

      {/* ── LOVESTORY chapters ── */}
      {chapters.map((ch, i) => {
        const isEven = i % 2 === 0
        const vhStart = (LOVESTORY[0] + i * chapterLen) * 100
        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate3d(${isEven ? '58vw' : '6vw'}, ${vhStart + 18}vh, 0)`,
            maxWidth: '28vw',
          }}>
            <p style={s.year}>{ch.date}</p>
            <div style={s.yearLine} />
            <h2 style={s.chapterTitle}>{ch.title}</h2>
            <p style={s.chapterDesc}>{ch.description}</p>
          </div>
        )
      })}

      {/* Chapter watermarks */}
      {[0,1,2].map(i => (
        <div key={`wm${i}`} style={{
          position: 'absolute', top: 0, left: '50%',
          transform: `translate3d(-50%, ${(LOVESTORY[0] + i * chapterLen) * 100 + 5}vh, 0)`,
          fontSize: 'clamp(6rem,18vw,16rem)',
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 300,
          color: 'rgba(250,247,242,0.025)',
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          {String(i + 1).padStart(2, '0')}
        </div>
      ))}

      {/* ── COUNTDOWN ── */}
      <div style={{
        position: 'absolute',
        top: `${COUNTDOWN[0] * 100 + 12}vh`,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        width: '90vw',
      }}>
        <p style={s.eyebrow}>{cd.past ? 'WIR HABEN GEHEIRATET' : 'NOCH'}</p>
        {!cd.past && (
          <div style={s.countRow}>
            {[
              { v: p2(cd.d), l: 'TAGE' },
              { v: p2(cd.h), l: 'STUNDEN' },
              { v: p2(cd.m), l: 'MINUTEN' },
              { v: p2(cd.s), l: 'SEKUNDEN' },
            ].map(({ v, l }, i) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <span style={s.countNum}>{v}</span>
                <span style={s.countLabel}>{l}</span>
                {i < 3 && <span style={s.countSep}>·</span>}
              </div>
            ))}
          </div>
        )}
        {wDate && <p style={s.wDate}>{wDate}</p>}
        <p style={{ ...s.amp, fontSize: 'clamp(2rem,5vw,4rem)', opacity: 0.2 }}>{cn}</p>
      </div>

      {/* ── GALLERY header ── */}
      <div style={{
        position: 'absolute',
        top: `${GALLERY[0] * 100 + 8}vh`,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <p style={s.eyebrow}>UNSERE MOMENTE</p>
        <h2 style={{ ...s.chapterTitle, fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Galerie</h2>
      </div>

      {/* Final credits */}
      <div style={{
        position: 'absolute',
        top: `${(GALLERY[0] + GALLERY[1] * 0.88) * 100 + 44}vh`,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <p style={{ ...s.amp, fontSize: 'clamp(2rem,4vw,3.5rem)' }}>{cn}</p>
        <p style={{ ...s.eyebrow, opacity: 0.3, marginTop: '0.4rem' }}>MIT LIEBE · S&amp;I. WEDDING</p>
      </div>

    </div>
  )
}

const s = {
  eyebrow: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 'clamp(0.5rem,1vw,0.65rem)',
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color: '#b8922a', marginBottom: '0.7rem',
  },
  heroName: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(2.5rem,6vw,6rem)',
    fontWeight: 300, color: '#faf7f2',
    lineHeight: 0.92, letterSpacing: '-0.02em',
    textShadow: '0 2px 40px rgba(12,10,8,0.9)',
  },
  amp: {
    fontFamily: 'Pinyon Script, cursive',
    fontSize: 'clamp(3rem,7vw,7rem)',
    color: '#b8922a', display: 'block',
    lineHeight: 1, marginTop: '-0.1em',
    textShadow: '0 0 30px rgba(184,146,42,0.3)',
  },
  tagline: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 'clamp(0.45rem,0.8vw,0.6rem)',
    letterSpacing: '0.2em', color: 'rgba(250,247,242,0.38)',
  },
  divider: {
    width: '2.5rem', height: '1px',
    background: 'rgba(184,146,42,0.5)',
    margin: '0.9rem 0 0.7rem',
  },
  year: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 'clamp(0.5rem,0.9vw,0.65rem)',
    letterSpacing: '0.28em', color: '#b8922a',
    marginBottom: '0.3rem',
  },
  yearLine: {
    width: '1.8rem', height: '1px',
    background: '#b8922a',
    marginBottom: '0.7rem',
    boxShadow: '0 0 8px rgba(184,146,42,0.4)',
  },
  chapterTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(1.6rem,3.5vw,3rem)',
    fontWeight: 300, color: '#faf7f2',
    lineHeight: 1.1, letterSpacing: '-0.01em',
    textShadow: '0 2px 30px rgba(12,10,8,0.95)',
    marginBottom: '0.6rem',
  },
  chapterDesc: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 'clamp(0.75rem,1.2vw,0.9rem)',
    lineHeight: 1.85, color: 'rgba(250,247,242,0.42)',
    whiteSpace: 'pre-line',
  },
  countRow: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'flex-end', gap: '3vw',
    margin: '1.5rem 0',
  },
  countNum: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(3rem,8vw,7rem)',
    fontWeight: 300, color: '#faf7f2',
    lineHeight: 1, letterSpacing: '-0.02em',
    textShadow: '0 0 40px rgba(250,247,242,0.1)',
    fontVariantNumeric: 'tabular-nums',
  },
  countLabel: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 'clamp(0.42rem,0.75vw,0.58rem)',
    letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'rgba(250,247,242,0.28)',
    marginTop: '0.3rem',
  },
  countSep: {
    position: 'absolute', right: '-1.6vw', bottom: '1.5rem',
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(1.2rem,3vw,2.5rem)',
    color: 'rgba(184,146,42,0.35)', lineHeight: 1,
  },
  wDate: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 'clamp(0.55rem,1vw,0.75rem)',
    letterSpacing: '0.18em', color: 'rgba(250,247,242,0.22)',
    marginBottom: '0.4rem',
  },
}
