// src/themes/parallax/WeddingApp.js
import { Suspense, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Preload, Scroll, useScroll } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import GlobalStyles from './GlobalStyles'
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

export default function ParallaxWeddingApp() {
  const { project, content } = useWedding()
  const [activeModal, setActiveModal] = useState(null)
  const scrollOffsetRef = useRef(0)
  const scrollToTopRef = useRef(null)
  const heroRef = useRef(null)

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
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [activeModal])

  return (
    <>
      <GlobalStyles />

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
              <CountdownImages project={project} />
              <GalleryImages content={content} />
            </Scroll>

            <Scroll html>
              <HtmlContent project={project} content={content} onOpenModal={openModal} />
            </Scroll>

            <Preload />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Loader />
      <ParallaxModal
        activeModal={activeModal}
        onClose={closeModal}
        project={project}
        content={content}
      />
    </>
  )
}
