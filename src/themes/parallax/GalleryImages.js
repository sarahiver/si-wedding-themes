// src/themes/parallax/GalleryImages.js
import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import SafeImage from './SafeImage'
import { r, GAL_IMG } from './scrollConfig'

const FALLBACK = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80&auto=format',
]

export default function GalleryImages({ content }) {
  const group  = useRef()
  const data   = useScroll()
  const { width, height } = useThree(s => s.viewport)

  const rawImgs = content?.gallery?.images
  const mapped = rawImgs?.length >= 4
    ? rawImgs.slice(0, 7).map(i => typeof i === 'string' ? i : i.url).filter(Boolean)
    : []
  const imgs = Array.from({ length: 7 }, (_, i) => mapped[i] || FALLBACK[i % FALLBACK.length])

  const [gs, gl] = r(...GAL_IMG)
  const third  = gl / 3
  const pageH  = height
  const yOff   = -(GAL_IMG[0] * pageH)

  useFrame(() => {
    if (!group.current) return
    const c = group.current.children
    if (c.length < 7) return
    c[0].material.zoom = 1 + data.range(gs,              third) / 3
    c[1].material.zoom = 1 + data.range(gs,              third) / 3
    c[2].material.zoom = 1 + data.range(gs + third*1.15, third) / 2
    c[3].material.zoom = 1 + data.range(gs + third*1.15, third) / 2
    c[4].material.zoom = 1 + data.range(gs + third*1.15, third) / 2
    c[5].material.grayscale = 1 - data.range(gs + third*1.6, third)
    c[6].material.zoom = 1 + (1 - data.range(gs + third*2, third)) / 3
  })

  return (
    <group position={[0, yOff, 0]} ref={group}>
      <SafeImage url={imgs[0]} position={[-width*0.18, 0,                       0   ]} scale={[width*0.5,  height,      1]} transparent />
      <SafeImage url={imgs[1]} position={[ width*0.2,  0,                       3   ]} scale={[width*0.3,  height*0.6,  1]} transparent />
      <SafeImage url={imgs[2]} position={[-width*0.17, -pageH*GAL_IMG[1]*0.38,  6   ]} scale={[width*0.18, height*0.9,  1]} transparent radius={0.02} />
      <SafeImage url={imgs[3]} position={[-width*0.04, -pageH*GAL_IMG[1]*0.38,  9   ]} scale={[width*0.2,  height*0.65, 1]} transparent radius={0.02} />
      <SafeImage url={imgs[4]} position={[ width*0.2,  -pageH*GAL_IMG[1]*0.38,  10.5]} scale={[width*0.22, height*0.5,  1]} transparent radius={0.02} />
      <SafeImage url={imgs[5]} position={[ 0,          -pageH*GAL_IMG[1]*0.6,   7.5 ]} scale={[width*0.35, height*0.85, 1]} transparent grayscale={1} />
      <SafeImage url={imgs[6]} position={[ 0,          -pageH*GAL_IMG[1]*0.88,  0   ]} scale={[width,      height*0.95, 1]} transparent />
    </group>
  )
}
