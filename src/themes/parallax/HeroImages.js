// src/themes/parallax/HeroImages.js
// Receives project + content as PROPS — no useWedding()

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import SafeImage from './SafeImage'
import { r, HERO } from './scrollConfig'

// picsum.photos: reliable CORS-friendly images, consistent aspect ratios
const FALLBACK_1 = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80&auto=format'
const FALLBACK_2 = 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=80&auto=format'

export default function HeroImages({ project, content }) {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)

  const img1 = (content?.hero?.background_image && content.hero.background_image.startsWith('http')) ? content.hero.background_image : FALLBACK_1
  const img2 = (content?.hero?.image2 && content.hero.image2.startsWith('http')) ? content.hero.image2
    : (content?.lovestory?.image_front && content.lovestory.image_front.startsWith('http')) ? content.lovestory.image_front
    : FALLBACK_2

  useFrame(() => {
    if (!group.current) return
    const c = group.current.children
    if (c.length < 2) return
    const [start, len] = r(...HERO)
    c[0].material.zoom    = 1 + data.range(start, len) / 3
    c[1].material.zoom    = 1 + data.range(start, len) / 6
    c[0].material.opacity = 1 - data.range(start + len * 0.5, len * 0.5)
    c[1].material.opacity = 1 - data.range(start + len * 0.6, len * 0.4)
  })

  return (
    <group ref={group}>
      <SafeImage
        position={[-width * 0.14, 0, 0]}
        scale={[width * 0.62, height, 1]}
        url={img1}
        transparent
      />
      <SafeImage
        position={[width * 0.24, height * 0.04, 3]}
        scale={[width * 0.33, height * 0.76, 1]}
        url={img2}
        transparent
        radius={0.025}
      />
    </group>
  )
}
