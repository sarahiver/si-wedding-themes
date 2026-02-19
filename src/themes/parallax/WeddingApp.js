// src/themes/parallax/WeddingApp.js
import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Preload, Scroll } from '@react-three/drei'
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

export default function ParallaxWeddingApp() {
  const { project, content } = useWedding()
  const [activeModal, setActiveModal] = useState(null)

  const openModal = useCallback((id) => setActiveModal(id), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  return (
    <>
      <GlobalStyles />
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
        active={activeModal}
        onClose={closeModal}
        project={project}
        content={content}
      />
    </>
  )
}
