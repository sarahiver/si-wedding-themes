// src/themes/parallax/WeddingApp.js
// React Three Fiber wedding theme — Hero, LoveStory, Countdown, Gallery
// Parallax: images zoom at different rates based on Z-depth (data.range() pattern)

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Preload, Scroll } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import GlobalStyles from './GlobalStyles'
import HeroImages   from './HeroImages'
import LoveStoryImages from './LoveStoryImages'
import CountdownImages from './CountdownImages'
import GalleryImages   from './GalleryImages'
import HtmlContent from './HtmlContent'
import Loader from './Loader'

// Total scroll pages — tune this if sections feel too fast/slow
const PAGES = 8

export default function ParallaxWeddingApp() {
  return (
    <>
      <GlobalStyles />
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 15 }}
        style={{ position: 'fixed', inset: 0, background: '#0c0a08' }}
      >
        <Suspense fallback={null}>
          <ScrollControls damping={0.2} pages={PAGES} distance={0.5}>

            {/* All 3D image layers */}
            <Scroll>
              <HeroImages />
              <LoveStoryImages />
              <CountdownImages />
              <GalleryImages />
            </Scroll>

            {/* All HTML text content */}
            <Scroll html>
              <HtmlContent />
            </Scroll>

            <Preload />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}
