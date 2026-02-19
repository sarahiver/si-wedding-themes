// src/themes/parallax/HeroImages.js
// Uses gallery images (positions 0,1) — all website images come from gallery uploads
import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import SafeImage from './SafeImage'
import { r, HERO_IMG } from './scrollConfig'
import { getGalleryUrl } from './galleryHelper'

export default function HeroImages({ project, content }) {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)

  const img1 = getGalleryUrl(content, 0)
  const img2 = getGalleryUrl(content, 1)

  const pageH = height
  const yOffset = -(HERO_IMG[0] * pageH)

  useFrame(() => {
    if (!group.current) return
    const c = group.current.children
    if (c.length < 2) return
    const [start, len] = r(...HERO_IMG)
    c[0].material.zoom = 1 + data.range(start, len) / 3
    c[1].material.zoom = 1 + data.range(start, len) / 6
  })

  return (
    <group position={[0, yOffset, 0]} ref={group}>
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
