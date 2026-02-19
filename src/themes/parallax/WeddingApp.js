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

// Bridge: passes scroll offset from drei to a ref (must be inside ScrollControls)
function ScrollBridge({ scrollRef }) {
  const scroll = useScroll()
  useFrame(() => { scrollRef.current = scroll.offset })
  return null
}

export default function ParallaxWeddingApp() {
  const { project, content } = useWedding()
  const [activeModal, setActiveModal] = useState(null)
  const scrollOffsetRef = useRef(0)
  const logoRef = useRef(null)

  const openModal = useCallback((id, origin, label) => {
    setActiveModal({
      id,
      origin: origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      label: label || 'Entdecken',
    })
  }, [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  const cn = project?.couple_names || 'Lena & Jonas'

  // Scroll-based logo animation (direct DOM for perf)
  useEffect(() => {
    let raf
    const update = () => {
      if (logoRef.current) {
        if (activeModal) {
          logoRef.current.style.opacity = '1'
          logoRef.current.style.transform = 'translateX(0) translateY(0) scale(1)'
        } else {
          const offset = scrollOffsetRef.current
          // Hero ends at ~0.0625 (0.5 pages / 8 pages). Animate over 0.03–0.10
          const t = Math.max(0, Math.min((offset - 0.03) / 0.07, 1))
          const ease = t * t * (3 - 2 * t) // smoothstep
          logoRef.current.style.opacity = `${ease}`
          // Fly in from roughly where hero text was (center-left, below)
          logoRef.current.style.transform = `translateX(${-(1 - ease) * 20}vw) translateY(${(1 - ease) * 12}vh) scale(${1 + (1 - ease) * 4})`
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

      {/* ── FIXED LOGO (hero names fly here on scroll) ── */}
      <div
        ref={logoRef}
        onClick={activeModal ? closeModal : undefined}
        style={{
          position: 'fixed',
          top: '1.2rem',
          right: '1.5rem',
          zIndex: 10002,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          color: activeModal ? '#fff' : '#000',
          cursor: activeModal ? 'pointer' : 'default',
          pointerEvents: activeModal ? 'auto' : 'none',
          userSelect: 'none',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'color 0.8s ease',
        }}
      >
        {cn}
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
            <ScrollBridge scrollRef={scrollOffsetRef} />
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
