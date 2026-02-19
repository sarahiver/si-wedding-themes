// src/themes/parallax/WeddingApp.js
import { Suspense, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Preload, Scroll, useScroll } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import GlobalStyles, { ParallaxPageStyles } from './GlobalStyles'
import HeroImages      from './HeroImages'
import LoveStoryImages from './LoveStoryImages'
import CountdownImages from './CountdownImages'
import GalleryImages   from './GalleryImages'
import HtmlContent     from './HtmlContent'
import ParallaxModal   from './ParallaxModal'
import Loader from './Loader'
import { PAGES } from './scrollConfig'

function ScrollBridge({ scrollRef, scrollToTopRef }) {
  const scroll = useScroll()
  useFrame(() => { scrollRef.current = scroll.offset })

  // Expose scroll-to-top for logo click
  useEffect(() => {
    if (scrollToTopRef) {
      scrollToTopRef.current = () => {
        if (scroll.el) scroll.el.scrollTop = 0
      }
    }
  }, [scroll.el, scrollToTopRef])

  return null
}

function parseCountdownDate(raw) {
  if (!raw) return null
  // Extract YYYY-MM-DD from any format (ISO, timestamp, etc.)
  const match = String(raw).match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  // Build date at noon LOCAL time to avoid timezone edge cases
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0)
}

function useCountdown(weddingDate) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, past: false, ready: false })
  useEffect(() => {
    const target = parseCountdownDate(weddingDate)
    if (!target || isNaN(target.getTime())) {
      setT({ d: 0, h: 0, m: 0, s: 0, past: false, ready: false })
      return
    }
    const tick = () => {
      const diff = target - new Date()
      if (diff <= 0) {
        setT({ d: 0, h: 0, m: 0, s: 0, past: true, ready: true })
        return
      }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        past: false,
        ready: true,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [weddingDate])
  return t
}

const p2 = n => String(n).padStart(2, '0')

export default function ParallaxWeddingApp() {
  const { project, content } = useWedding()
  const [activeModal, setActiveModal] = useState(null)
  const scrollOffsetRef = useRef(0)
  const scrollToTopRef = useRef(null)
  const heroRef = useRef(null)
  const countdownRef = useRef(null)
  // Countdown-Datum: target_date hat Vorrang, aber wenn veraltet → wedding_date nutzen
  const cdDateRaw = content?.countdown?.target_date || project?.wedding_date || '2026-09-20'
  const cdDate = (() => {
    const parsed = parseCountdownDate(cdDateRaw)
    if (parsed && parsed < new Date() && project?.wedding_date) {
      const wd = parseCountdownDate(project.wedding_date)
      if (wd && wd > new Date()) return project.wedding_date
    }
    return cdDateRaw
  })()
  const cd = useCountdown(cdDate)

  const openModal = useCallback((id, origin, label) => {
    setActiveModal({
      id,
      origin: origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      label: label || 'Entdecken',
    })
  }, [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  const cn = project?.couple_names || 'Lena & Jonas'
  const [n1, n2] = cn.includes('&') ? cn.split('&').map(s => s.trim()) : [cn, '']
  const wDate = project?.wedding_date
    ? new Date(project.wedding_date).toLocaleDateString('de-DE', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '16. August 2025'

  // Logo click → scroll to top
  const handleLogoClick = useCallback(() => {
    scrollToTopRef.current?.()
  }, [])

  // Animate hero names: center → top-right on scroll
  useEffect(() => {
    let raf
    const update = () => {
      const el = heroRef.current
      if (el) {
        if (activeModal) {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
        } else {
          el.style.opacity = '1'
          const offset = scrollOffsetRef.current
          const t = Math.max(0, Math.min(offset / 0.07, 1))
          const e = t * t * (3 - 2 * t) // smoothstep

          const vw = window.innerWidth
          const vh = window.innerHeight

          // Position: center of hero zone → top-right corner
          const x = vw / 2 + ((vw - 80) - vw / 2) * e
          const y = vh * 0.22 + (22 - vh * 0.22) * e
          el.style.left = `${x}px`
          el.style.top = `${y}px`

          // Font sizes
          const startSize = Math.min(Math.max(vw * 0.08, 48), 112)
          const endSize = 12
          const sz = startSize + (endSize - startSize) * e
          const ampStart = Math.min(Math.max(vw * 0.03, 24), 40)
          const ampEnd = endSize * 0.8

          const ch = el.children
          // ch[0] = date, ch[1] = n1, ch[2] = amp, ch[3] = n2

          // Date fades out quickly
          ch[0].style.opacity = `${Math.max(0, 1 - e * 5)}`
          if (e > 0.2) {
            ch[0].style.height = '0'
            ch[0].style.marginBottom = '0'
            ch[0].style.overflow = 'hidden'
          } else {
            ch[0].style.height = 'auto'
            ch[0].style.marginBottom = '0.6rem'
            ch[0].style.overflow = 'visible'
          }

          // Names
          ch[1].style.fontSize = `${sz}px`
          ch[3].style.fontSize = `${sz}px`

          // Amp
          ch[2].style.fontSize = `${ampStart + (ampEnd - ampStart) * e}px`

          // Layout: column → row
          if (e > 0.6) {
            el.style.flexDirection = 'row'
            ch[2].style.margin = '0 0.15em'
          } else {
            el.style.flexDirection = 'column'
            ch[2].style.margin = '0.2rem 0'
          }

          // Enable clicking when at logo position
          if (e > 0.9) {
            el.style.pointerEvents = 'auto'
            el.style.cursor = 'pointer'
          } else {
            el.style.pointerEvents = 'none'
            el.style.cursor = 'default'
          }
        }
      }

      // Countdown fades out on scroll
      const cdEl = countdownRef.current
      if (cdEl) {
        if (activeModal) {
          cdEl.style.opacity = '0'
        } else {
          const offset = scrollOffsetRef.current
          const fade = Math.max(0, 1 - offset / 0.04)
          cdEl.style.opacity = `${fade}`
        }
      }

      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [activeModal])

  return (
    <>
      <GlobalStyles />
      <ParallaxPageStyles />

      {/* ── HERO NAMES — animate from center to top-right, click → scroll top ── */}
      <div
        ref={heroRef}
        onClick={handleLogoClick}
        style={{
          position: 'fixed',
          left: '50%',
          top: '22%',
          zIndex: 100,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          color: '#000',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <p style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
          marginTop: 0,
          marginBottom: '0.6rem',
        }}>{wDate}</p>
        <span style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
        }}>{n1}</span>
        <span style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          color: 'rgba(0,0,0,0.2)',
          margin: '0.2rem 0',
        }}>&</span>
        <span style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
        }}>{n2}</span>
      </div>

      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 15 }}
        style={{
          position: 'fixed', inset: 0,
          background: '#ffffff',
          pointerEvents: activeModal ? 'none' : 'auto',
        }}
      >
        <Suspense fallback={null}>
          <ScrollControls damping={0.2} pages={PAGES} distance={0.5}>
            <ScrollBridge scrollRef={scrollOffsetRef} scrollToTopRef={scrollToTopRef} />
            <Scroll>
              <HeroImages project={project} content={content} />
              <LoveStoryImages content={content} />
              <CountdownImages content={content} />
              <GalleryImages content={content} />
            </Scroll>

            <Scroll html>
              <HtmlContent project={project} content={content} onOpenModal={openModal} scrollOffsetRef={scrollOffsetRef} />
            </Scroll>

            <Preload />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Loader />

      {/* ── COUNTDOWN — after Canvas so it renders on top ── */}
      {cd.ready && (
        <div
          ref={countdownRef}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '5vh',
            transform: 'translateX(-50%)',
            zIndex: 200,
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: "'DM Sans', sans-serif",
            background: '#fff',
            padding: 'clamp(1rem, 2vw, 2rem) clamp(2rem, 4vw, 4rem)',
          }}
        >
          {!cd.past ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 5vw, 4rem)' }}>
              {[
                { v: p2(cd.d), l: 'TAGE' },
                { v: p2(cd.h), l: 'STD' },
                { v: p2(cd.m), l: 'MIN' },
                { v: p2(cd.s), l: 'SEK' },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                    fontWeight: 800,
                    color: '#000',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{v}</span>
                  <br />
                  <span style={{
                    fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(0,0,0,0.3)',
                  }}>{l}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.35)',
              margin: 0,
            }}>WIR HABEN GEHEIRATET</p>
          )}
        </div>
      )}

      <ParallaxModal
        activeModal={activeModal}
        onClose={closeModal}
        project={project}
        content={content}
      />
    </>
  )
}
