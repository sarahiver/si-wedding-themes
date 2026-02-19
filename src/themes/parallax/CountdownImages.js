// src/themes/parallax/CountdownImages.js
// Single atmospheric full-bleed image, no dark scrim
import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import SafeImage from './SafeImage'
import { r, CD_IMG } from './scrollConfig'

const FALLBACK = 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1400&q=80'

export default function CountdownImages() {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)

  const pageH = height
  const yOffset = -(CD_IMG[0] * pageH)

  useFrame(() => {
    if (!group.current) return
    const c = group.current.children
    if (c.length < 1) return

    const [start, len] = r(...CD_IMG)

    c[0].material.opacity = Math.min(data.range(start, len * 0.3) * 4, 1)
                          * (1 - data.range(start + len * 0.7, len * 0.3))
    c[0].material.zoom    = 1 + data.range(start, len) / 5
  })

  return (
    <group position={[0, yOffset, 0]} ref={group}>
      <SafeImage
        position={[0, 0, 0]}
        scale={[width, height, 1]}
        url={FALLBACK}
        transparent
        opacity={0}
      />
    </group>
  )
}
