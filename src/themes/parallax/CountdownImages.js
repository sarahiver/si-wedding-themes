// src/themes/parallax/CountdownImages.js
// Single atmospheric full-bleed image — uses gallery image position 5
import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import SafeImage from './SafeImage'
import { r, CD_IMG } from './scrollConfig'
import { getGalleryUrl } from './galleryHelper'

export default function CountdownImages({ content }) {
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

    c[0].material.zoom = 1 + data.range(start, len) / 5
  })

  return (
    <group position={[0, yOffset, 0]} ref={group}>
      <SafeImage
        position={[0, 0, 0]}
        scale={[width, height, 1]}
        url={getGalleryUrl(content, 5)}
        transparent
      />
    </group>
  )
}
