// src/themes/parallax/CountdownImages.js
// Pages 3.7–5.0: Single atmospheric full-bleed image
// Fades in as section enters, very slow zoom throughout

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll, Image } from '@react-three/drei'
import { r, COUNTDOWN } from './scrollConfig'

const FALLBACK = 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1400&q=80'

export default function CountdownImages() {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)

  const pageH = height
  const yOffset = -(COUNTDOWN[0] * pageH)

  useFrame(() => {
    if (!group.current) return
    const c = group.current.children
    if (c.length < 2) return

    const [start, len] = r(...COUNTDOWN)

    // Full-bleed: fades in, slow zoom, fades out at end
    c[0].material.opacity = Math.min(data.range(start, len * 0.3) * 4, 0.55)
                          * (1 - data.range(start + len * 0.7, len * 0.3))
    c[0].material.zoom    = 1 + data.range(start, len) / 5   // very slow zoom

    // Second layer — dark overlay plane (using mesh not Image)
    // c[1] is a mesh, skip material.zoom
  })

  return (
    <group position={[0, yOffset, 0]} ref={group}>
      {/* Background photo */}
      <Image
        position={[0, 0, -2]}
        scale={[width, height, 1]}
        url={FALLBACK}
        transparent
        opacity={0}
        grayscale={0.5}
      />

      {/* Dark scrim — using plane so we can control darkness */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#0c0a08" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}
