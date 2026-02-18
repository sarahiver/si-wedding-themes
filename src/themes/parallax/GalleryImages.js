// src/themes/parallax/GalleryImages.js
// Pages 5.0–8.0: The key parallax showcase
// Images scattered at different Z positions (0 → 10.5)
// Closer Z = faster zoom when scrolling = depth illusion
// Direct translation of the CodeSandbox Images() component

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll, Image } from '@react-three/drei'
import { useWedding } from '../../context/WeddingContext'
import { r, GALLERY } from './scrollConfig'

const FALLBACK = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=85',
  'https://images.unsplash.com/photo-1591604329141-c2b78069a79c?w=900&q=85',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=85',
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=85',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
]

export default function GalleryImages() {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)
  const { content } = useWedding()

  const rawImgs = content?.gallery?.images
  const imgs = rawImgs?.length >= 4
    ? rawImgs.slice(0, 7).map(i => typeof i === 'string' ? i : i.url)
    : FALLBACK

  // Scale GALLERY range into thirds for sub-sections
  const [gs, gl] = r(...GALLERY)
  const third = gl / 3

  const pageH = height
  const yOffset = -(GALLERY[0] * pageH)

  useFrame(() => {
    const c = group.current.children
    if (c.length < 7) return

    // ── This is the exact pattern from the CodeSandbox example ──
    // Different range() calls per image = different zoom speeds = depth parallax

    // First row of images (pages GALLERY[0] → GALLERY[0]+1): zoom as we enter
    c[0].material.zoom = 1 + data.range(gs,         third) / 3
    c[1].material.zoom = 1 + data.range(gs,         third) / 3

    // Second row (middle third): zoom at faster/slower rates
    c[2].material.zoom = 1 + data.range(gs + third * 1.15, third) / 2
    c[3].material.zoom = 1 + data.range(gs + third * 1.15, third) / 2
    c[4].material.zoom = 1 + data.range(gs + third * 1.15, third) / 2

    // Grayscale → color on c[5] as it enters view
    c[5].material.grayscale = 1 - data.range(gs + third * 1.6, third)

    // Final full-bleed: zoom OUT (zoom down from high value as we approach end)
    c[6].material.zoom = 1 + (1 - data.range(gs + third * 2, third)) / 3
  })

  return (
    <group position={[0, yOffset, 0]} ref={group}>
      {/* ── Exact layout from CodeSandbox, scaled to viewport ── */}

      {/* img[0]: large left, back (Z=0) */}
      <Image
        url={imgs[0]}
        position={[-width * 0.18, 0, 0]}
        scale={[width * 0.5, height, 1]}
        transparent
      />

      {/* img[1]: medium right, slightly closer (Z=3) */}
      <Image
        url={imgs[1]}
        position={[width * 0.2, 0, 3]}
        scale={[width * 0.3, height * 0.6, 1]}
        transparent
      />

      {/* img[2]: tall narrow, very close (Z=6) — scrolls fastest */}
      <Image
        url={imgs[2]}
        position={[-width * 0.17, -pageH * GALLERY[1] * 0.38, 6]}
        scale={[width * 0.18, height * 0.9, 1]}
        transparent
        radius={0.02}
      />

      {/* img[3]: small, close (Z=9) */}
      <Image
        url={imgs[3]}
        position={[-width * 0.04, -pageH * GALLERY[1] * 0.38, 9]}
        scale={[width * 0.2, height * 0.65, 1]}
        transparent
        radius={0.02}
      />

      {/* img[4]: small right, closest (Z=10.5) — scrolls fastest = feels nearest */}
      <Image
        url={imgs[4]}
        position={[width * 0.2, -pageH * GALLERY[1] * 0.38, 10.5]}
        scale={[width * 0.22, height * 0.5, 1]}
        transparent
        radius={0.02}
      />

      {/* img[5]: mid-size center, mid-depth (Z=7.5) — grayscale → color */}
      <Image
        url={imgs[5]}
        position={[0, -pageH * GALLERY[1] * 0.6, 7.5]}
        scale={[width * 0.35, height * 0.85, 1]}
        transparent
        grayscale={1}
      />

      {/* img[6]: FINAL — full bleed, back (Z=0), zooms out to reveal */}
      <Image
        url={imgs[6]}
        position={[0, -pageH * GALLERY[1] * 0.88, 0]}
        scale={[width, height * 0.95, 1]}
        transparent
      />
    </group>
  )
}
