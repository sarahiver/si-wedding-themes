// src/themes/parallax/HeroImages.js
// Pages 0–1.2: Two overlapping images, zoom at different rates = parallax depth

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll, Image } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import { r, HERO } from './scrollConfig'

const FALLBACK_1 = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85'
const FALLBACK_2 = 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=85'

export default function HeroImages() {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)
  const { content } = useWedding()

  const img1 = content?.hero?.background_image || FALLBACK_1
  const img2 = content?.hero?.image2 || content?.lovestory?.image_front || FALLBACK_2

  useFrame(() => {
    const c = group.current.children
    const [start, len] = r(...HERO)

    // Different zoom rates per image = the parallax depth effect
    c[0].material.zoom = 1 + data.range(start, len) / 3     // slow zoom
    c[1].material.zoom = 1 + data.range(start, len) / 6     // even slower = "behind"

    // Opacity out as hero leaves
    c[0].material.opacity = 1 - data.range(start + len * 0.5, len * 0.5)
    c[1].material.opacity = 1 - data.range(start + len * 0.6, len * 0.4)
  })

  return (
    <group ref={group}>
      <Image
        position={[-width * 0.14, 0, 0]}
        scale={[width * 0.62, height, 1]}
        url={img1}
        transparent
      />
      <Image
        position={[width * 0.24, height * 0.04, 3]}
        scale={[width * 0.33, height * 0.76, 1]}
        url={img2}
        transparent
        radius={0.025}
      />
    </group>
  )
}
