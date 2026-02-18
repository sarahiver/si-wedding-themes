// src/themes/parallax/HtmlContent.js
// All text content rendered as HTML via <Scroll html>
// Positioned with transform: translate3d(xvw, yvh, 0) — same pattern as CodeSandbox

import { useState, useEffect } from 'react'
import { useWedding } from '../../context/WeddingContext'
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

export default function HtmlContent() {
  const { project, content } = useWedding()
  const cd = useCountdown(project?.wedding_date)
  const ls = content?.lovestory || {}

  const cn = project?.couple_names || 'Lena & Jonas'
  const [n1, n2] = cn.includes('&') ? cn.split('&').map(s => s.trim()) : [cn, '']
  const tagline = content?.hero?.tagline || ''
  const wDate = project?.wedding_date
    ? new window.Date(project.wedding_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const chapterLen = LOVESTORY[1] / 3

  const defaultChapters = [
    { date: '2019', title: 'Das erste Mal', description: 'Ein Blick quer durch den Raum.\nDie Musik verstummte.' },
    { date: '2022', title: 'Das Ja', description: 'Unter einem Himmel voller Sterne.\nEin Knie. Ein Ring. Ein Ja.' },
    { date: '2025', title: 'Für immer', description: 'Jetzt beginnt das schönste\nKapitel unseres Lebens.' },
  ]
  const chapters = ls.events?.length >= 2
    ? ls.events.slice(0, 3).map(e => ({ date: e.date, title: e.title, description: e.description }))
    : defaultChapters

  return (
    <div style={{ userSelect: 'none' }}>

      {/* ═══════════════════════════════════
          HERO — centered on top half of screen
      ═══════════════════════════════════ */}
      <div style={{ transform: `translate3d(52vw, 18vh, 0)`, position: 'absolute', top: 0, left: 0 }}>
        <p style={styles.eyebrow}>
          {wDate || '16. August 2025'}
        </p>
        <h1 style={styles.heroName}>{n1}</h1>
        <span style={styles.amp}>&amp;</span>
        <h1 style={{ ...styles.heroName, marginTop: '-0.1em', paddingLeft: '0.15em' }}>{n2}</h1>
        {tagline && (
          <>
            <div style={styles.divider} />
            <p style={styles.tagline}>{tagline.toUpperCase()}</p>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════
          LOVESTORY — 3 chapters
      ═══════════════════════════════════ */}
      {chapters.map((ch, i) => {
        const isEven = i % 2 === 0
        const vhStart = (LOVESTORY[0] + i * chapterLen) * 100
        return (
          <div
            key={i}
            style={{
              transform: `translate3d(${isEven ? '58vw' : '5vw'}, ${vhStart + 15}vh, 0)`,
              position: 'absolute', top: 0, left: 0,
              maxWidth: '30vw',
            }}
          >
            <p style={styles.year}>{ch.date}</p>
            <div style={styles.yearLine} />
            <h2 style={styles.chapterTitle}>{ch.title}</h2>
            <p style={styles.chapterDesc}>{ch.description}</p>
          </div>
        )
      })}

      {/* Chapter number watermarks */}
      {[0, 1, 2].map(i => (
        <div
          key={`wm${i}`}
          style={{
            transform: `translate3d(${['-8vw', '-10vw', '-8vw'][i]}, ${(LOVESTORY[0] + i * chapterLen) * 100 + 5}vh, 0)`,
            position: 'absolute', top: 0, left: '50%',
            fontSize: 'clamp(6rem,18vw,16rem)',
            fontFamily: 'var(--font-d)',
            fontWeight: 300,
            color: 'rgba(250,247,242,0.03)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {String(i + 1).padStart(2, '0')}
        </div>
      ))}

      {/* ═══════════════════════════════════
          COUNTDOWN
      ═══════════════════════════════════ */}
      <div style={{
        transform: `translate3d(-50%, 0, 0)`,
        position: 'absolute',
        top: `${COUNTDOWN[0] * 100 + 12}vh`,
        left: '50%',
        textAlign: 'center',
        width: '90vw',
      }}>
        <p style={styles.eyebrow}>{cd.past ? 'WIR HABEN GEHEIRATET' : 'NOCH'}</p>

        {!cd.past && (
          <div style={styles.countdownRow}>
            {[
              { v: p2(cd.d), l: 'TAGE' },
              { v: p2(cd.h), l: 'STUNDEN' },
              { v: p2(cd.m), l: 'MINUTEN' },
              { v: p2(cd.s), l: 'SEKUNDEN' },
            ].map(({ v, l }, i) => (
              <div key={l} style={styles.countUnit}>
                <span style={styles.countNum}>{v}</span>
                <span style={styles.countLabel}>{l}</span>
                {i < 3 && <span style={styles.countSep}>·</span>}
              </div>
            ))}
          </div>
        )}

        {wDate && <p style={styles.weddingDate}>{wDate}</p>}
        <p style={{ ...styles.amp, fontSize: 'clamp(2rem,5vw,4rem)', opacity: 0.25 }}>{cn}</p>
      </div>

      {/* ═══════════════════════════════════
          GALLERY header
      ═══════════════════════════════════ */}
      <div style={{
        transform: 'translate3d(-50%, 0, 0)',
        position: 'absolute',
        top: `${GALLERY[0] * 100 + 8}vh`,
        left: '50%',
        textAlign: 'center',
      }}>
        <p style={styles.eyebrow}>UNSERE MOMENTE</p>
        <h2 style={{ ...styles.chapterTitle, fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Galerie</h2>
      </div>

      {/* Final credits on last image */}
      <div style={{
        transform: 'translate3d(-50%, 0, 0)',
        position: 'absolute',
        top: `${(GALLERY[0] + GALLERY[1] * 0.88) * 100 + 42}vh`,
        left: '50%',
        textAlign: 'center',
      }}>
        <p style={{ ...styles.amp, fontSize: 'clamp(2.5rem,5vw,4rem)' }}>{cn}</p>
        <p style={{ ...styles.eyebrow, marginTop: '0.5rem', opacity: 0.3 }}>MIT LIEBE · S&amp;I. WEDDING</p>
      </div>

    </div>
  )
}

/* ── Shared styles ── */
const styles = {
  eyebrow: {
    fontFamily: 'var(--font-b)',
    fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: '#b8922a',
    marginBottom: '0.75rem',
  },
  heroName: {
    fontFamily: 'var(--font-d)',
    fontSize: 'clamp(3rem, 7vw, 7rem)',
    fontWeight: 300,
    color: '#faf7f2',
    lineHeight: 0.92,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 40px rgba(12,10,8,0.8)',
  },
  amp: {
    fontFamily: 'var(--font-s)',
    fontSize: 'clamp(3.5rem, 8vw, 8rem)',
    color: '#b8922a',
    display: 'block',
    lineHeight: 1,
    marginTop: '-0.15em',
    textShadow: '0 0 30px rgba(184,146,42,0.3)',
  },
  tagline: {
    fontFamily: 'var(--font-b)',
    fontSize: 'clamp(0.5rem, 0.9vw, 0.65rem)',
    letterSpacing: '0.22em',
    color: 'rgba(250,247,242,0.4)',
    marginTop: '0.5rem',
  },
  divider: {
    width: '3rem',
    height: '1px',
    background: 'rgba(184,146,42,0.5)',
    margin: '1rem 0 0.8rem',
  },
  year: {
    fontFamily: 'var(--font-b)',
    fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
    letterSpacing: '0.28em',
    color: '#b8922a',
    marginBottom: '0.3rem',
  },
  yearLine: {
    width: '2rem', height: '1px',
    background: '#b8922a',
    marginBottom: '0.8rem',
    boxShadow: '0 0 8px rgba(184,146,42,0.4)',
  },
  chapterTitle: {
    fontFamily: 'var(--font-d)',
    fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
    fontWeight: 300,
    color: '#faf7f2',
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
    textShadow: '0 2px 30px rgba(12,10,8,0.9)',
    marginBottom: '0.75rem',
  },
  chapterDesc: {
    fontFamily: 'var(--font-b)',
    fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)',
    lineHeight: 1.8,
    color: 'rgba(250,247,242,0.45)',
    whiteSpace: 'pre-line',
  },
  countdownRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '2vw',
    margin: '1.5rem 0',
    position: 'relative',
  },
  countUnit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    position: 'relative',
  },
  countNum: {
    fontFamily: 'var(--font-d)',
    fontSize: 'clamp(3.5rem, 9vw, 8rem)',
    fontWeight: 300,
    color: '#faf7f2',
    lineHeight: 1,
    letterSpacing: '-0.02em',
    textShadow: '0 0 40px rgba(250,247,242,0.15)',
    fontVariantNumeric: 'tabular-nums',
  },
  countLabel: {
    fontFamily: 'var(--font-b)',
    fontSize: 'clamp(0.45rem, 0.8vw, 0.6rem)',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,0.3)',
  },
  countSep: {
    position: 'absolute',
    right: '-1.2vw',
    bottom: '1.8rem',
    fontFamily: 'var(--font-d)',
    fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
    color: 'rgba(184,146,42,0.4)',
    lineHeight: 1,
  },
  weddingDate: {
    fontFamily: 'var(--font-b)',
    fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)',
    letterSpacing: '0.2em',
    color: 'rgba(250,247,242,0.25)',
    marginBottom: '0.5rem',
  },
}
