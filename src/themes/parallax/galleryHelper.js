// src/themes/parallax/galleryHelper.js
// Central helper to extract gallery image URLs
// All website images come from the user's gallery uploads (min 10 images required)

const FALLBACK = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80&auto=format',
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1400&q=80&auto=format',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80&auto=format',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80&auto=format',
]

// Cached extraction — avoids re-parsing every frame
let _lastRaw = null
let _cache = []

function extractUrls(content) {
  const raw = content?.gallery?.images
  if (raw === _lastRaw) return _cache
  _lastRaw = raw
  if (!raw || !Array.isArray(raw)) { _cache = []; return _cache }
  _cache = raw.map(i => typeof i === 'string' ? i : i?.url).filter(Boolean)
  return _cache
}

// Get a single gallery image URL at the given position, wrapping + fallback
export function getGalleryUrl(content, index) {
  const urls = extractUrls(content)
  if (urls.length > 0) {
    return urls[index % urls.length]
  }
  return FALLBACK[index % FALLBACK.length]
}

// Get all gallery URLs (for modal gallery view)
export function getAllGalleryUrls(content) {
  const urls = extractUrls(content)
  return urls.length > 0 ? urls : FALLBACK
}
