// src/themes/parallax/WeddingApp.js
// Fix: useWedding() data fetched HERE (inside WeddingProvider) 
// then passed as props into Scroll html — avoids portal context loss

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Preload, Scroll } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import GlobalStyles from './GlobalStyles'
import HeroImages      from './HeroImages'
import LoveStoryImages from './LoveStoryImages'
import CountdownImages from './CountdownImages'
import GalleryImages   from './GalleryImages'
import HtmlContent     from './HtmlContent'
import Loader from './Loader'

const PAGES = 8

export default function ParallaxWeddingApp() {
  // Fetch data HERE — this component is inside WeddingProvider
  const { project, content } = useWedding()

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

            <Scroll>
              <HeroImages project={project} content={content} />
              <LoveStoryImages content={content} />
              <CountdownImages project={project} />
              <GalleryImages content={content} />
            </Scroll>

            {/* Pass data as props — NO useWedding() inside Scroll html */}
            <Scroll html>
              <HtmlContent project={project} content={content} />
            </Scroll>

            <Preload />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}
