// src/themes/parallax/LoveStoryImages.js
// Uses gallery images (positions 2,3,4) — all website images come from gallery uploads
import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import SafeImage from './SafeImage'
import { r, LS_IMG } from './scrollConfig'
import { getGalleryUrl } from './galleryHelper'

export default function LoveStoryImages({ content }) {
  const group = useRef()
  const data  = useScroll()
  const { width, height } = useThree(s => s.viewport)

  const images = [
    getGalleryUrl(content, 2),
    getGalleryUrl(content, 3),
    getGalleryUrl(content, 4),
  ]

  const chapterLen = LS_IMG[1] / 3
  const pageH = height
  const yOffset = -(LS_IMG[0] * pageH)

  useFrame(() => {
    if (!group.current) return
    const c = group.current.children
    if (c.length < 5) return

    const ch0s = r(LS_IMG[0], chapterLen)
    c[0].material.zoom      = 1 + data.range(...ch0s) / 3
    c[0].material.grayscale = 1 - data.range(ch0s[0], ch0s[1] * 0.6)

    const ch1s = r(LS_IMG[0] + chapterLen, chapterLen)
    c[1].material.zoom      = 1 + data.range(...ch1s) / 2
    c[1].material.grayscale = 1 - data.range(ch1s[0], ch1s[1] * 0.5)

    const ch2s = r(LS_IMG[0] + chapterLen * 2, chapterLen)
    c[2].material.zoom      = 1 + data.range(...ch2s) / 4
    c[2].material.grayscale = 1 - data.range(ch2s[0], ch2s[1] * 0.4)

    c[3].material.zoom = 1 + data.range(...ch0s) / 2
    c[4].material.zoom = 1 + data.range(...ch1s) / 1.5
  })

  return (
    <group position={[0, yOffset, 0]} ref={group}>
      <SafeImage position={[-width*0.1, 0, 0]}                          scale={[width*0.55, height*0.95, 1]} url={images[0]} transparent grayscale={1} />
      <SafeImage position={[width*0.15, -pageH*chapterLen, 6]}          scale={[width*0.45, height*0.9, 1]}  url={images[1]} transparent grayscale={1} />
      <SafeImage position={[-width*0.08, -pageH*chapterLen*2, 0]}       scale={[width*0.6,  height,    1]}   url={images[2]} transparent grayscale={1} />
      <SafeImage position={[width*0.28, -pageH*0.2, 9]}                 scale={[width*0.18, height*0.35, 1]} url={images[1]} transparent radius={0.03} />
      <SafeImage position={[-width*0.28, -pageH*chapterLen*1.4, 10.5]}  scale={[width*0.16, height*0.3, 1]}  url={images[0]} transparent radius={0.03} />
    </group>
  )
}
