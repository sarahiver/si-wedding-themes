// src/themes/parallax/LoveStoryImages.js
// Pages 1.2–3.7: 3 story chapters, stacked vertically
// Each image: starts grayscale, transitions to color as it enters view
// Z depth varies → different zoom speed → parallax

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll, Image } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import { r, LOVESTORY, PAGES } from './scrollConfig'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=900&q=85',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&q=85',
  'https://images.unsplash.com/photo-1591604329141-c2b78069a79c?w=900&q=85',
]

export default function LoveStoryImages() {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)
  const { content } = useWedding()

  const events = content?.lovestory?.events
  const images = events?.length >= 3
    ? events.slice(0, 3).map(e => e.image || FALLBACK_IMAGES[0])
    : FALLBACK_IMAGES

  // Each chapter = LOVESTORY.len / 3 pages
  const chapterLen = LOVESTORY[1] / 3

  useFrame(() => {
    const c = group.current.children
    if (c.length < 5) return

    // Chapter 0: pages LOVESTORY[0] → +chapterLen
    const ch0s = r(LOVESTORY[0], chapterLen)
    c[0].material.zoom      = 1 + data.range(...ch0s) / 3
    c[0].material.grayscale = 1 - data.range(ch0s[0], ch0s[1] * 0.6)
    c[0].material.opacity   = Math.min(data.range(ch0s[0], ch0s[1] * 0.3) * 3, 1)
                            * (1 - data.range(ch0s[0] + ch0s[1] * 0.7, ch0s[1] * 0.3))

    // Chapter 1: offset image (different Z = different speed)
    const ch1s = r(LOVESTORY[0] + chapterLen, chapterLen)
    c[1].material.zoom      = 1 + data.range(...ch1s) / 2   // faster zoom = closer feel
    c[1].material.grayscale = 1 - data.range(ch1s[0], ch1s[1] * 0.5)
    c[1].material.opacity   = Math.min(data.range(ch1s[0], ch1s[1] * 0.3) * 3, 1)
                            * (1 - data.range(ch1s[0] + ch1s[1] * 0.7, ch1s[1] * 0.3))

    // Chapter 2
    const ch2s = r(LOVESTORY[0] + chapterLen * 2, chapterLen)
    c[2].material.zoom      = 1 + data.range(...ch2s) / 4
    c[2].material.grayscale = 1 - data.range(ch2s[0], ch2s[1] * 0.4)
    c[2].material.opacity   = Math.min(data.range(ch2s[0], ch2s[1] * 0.3) * 3, 1)

    // Accent images (small, decorative)
    c[3].material.zoom = 1 + data.range(...ch0s) / 2
    c[4].material.zoom = 1 + data.range(...ch1s) / 1.5
  })

  // Y offset — sections stack downward in world space
  // 1 page ≈ viewport.height in world units for fov:15 at z:20
  const pageH = height  // approximate: 1 page = 1 viewport height

  const yOffset = -(LOVESTORY[0] * pageH)  // start below hero

  return (
    <group position={[0, yOffset, 0]} ref={group}>
      {/* Chapter 0 — large, left, back */}
      <Image
        position={[-width * 0.1, 0, 0]}
        scale={[width * 0.55, height * 0.95, 1]}
        url={images[0]}
        transparent
        grayscale={1}
        opacity={0}
      />

      {/* Chapter 1 — medium, right, front (higher Z = more zoom = feels closer) */}
      <Image
        position={[width * 0.15, -pageH * chapterLen, 6]}
        scale={[width * 0.45, height * 0.9, 1]}
        url={images[1]}
        transparent
        grayscale={1}
        opacity={0}
      />

      {/* Chapter 2 — left again, deepest back */}
      <Image
        position={[-width * 0.08, -pageH * chapterLen * 2, 0]}
        scale={[width * 0.6, height, 1]}
        url={images[2]}
        transparent
        grayscale={1}
        opacity={0}
      />

      {/* Accent: small portrait, ch0 area */}
      <Image
        position={[width * 0.28, -pageH * 0.2, 9]}
        scale={[width * 0.18, height * 0.35, 1]}
        url={images[1]}
        transparent
        radius={0.03}
      />

      {/* Accent: small portrait, ch1 area */}
      <Image
        position={[-width * 0.28, -pageH * chapterLen * 1.4, 10.5]}
        scale={[width * 0.16, height * 0.3, 1]}
        url={images[0]}
        transparent
        radius={0.03}
      />
    </group>
  )
}
