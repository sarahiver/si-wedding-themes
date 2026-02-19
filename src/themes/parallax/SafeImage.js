// src/themes/parallax/SafeImage.js
// Wrapper around drei Image that catches load errors
// Falls back to a 1x1 transparent pixel instead of crashing

import { Component } from 'react'
import { Image } from '@react-three/drei'

// Tiny 1x1 white PNG as data-URL (matches theme background)
const PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BAwAI/AL+hc2rNAAAAABJRU5ErkJggg=='

class ImageErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) {
    console.warn('Parallax Image failed to load:', err?.message || err)
  }
  render() {
    if (this.state.hasError) {
      // Render invisible placeholder so children count stays the same
      const { position, scale } = this.props
      return (
        <Image
          position={position}
          scale={scale}
          url={PIXEL}
          transparent
          opacity={0}
        />
      )
    }
    return this.props.children
  }
}

export default function SafeImage({ url, ...props }) {
  const safeUrl = (url && typeof url === 'string' && url.length > 5) ? url : PIXEL
  return (
    <ImageErrorBoundary position={props.position} scale={props.scale}>
      <Image url={safeUrl} {...props} />
    </ImageErrorBoundary>
  )
}
