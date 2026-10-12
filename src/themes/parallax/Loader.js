import { useEffect, useState } from 'react'

export default function Loader({ coupleNames, duration = 3000 }) {
  const [visible, setVisible] = useState(duration > 0)
  useEffect(() => {
    const id = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(id)
  }, [duration])

  // Extract initials from couple names (e.g. "Lena & Jonas" → "L&J.")
  // Avoid showing "S&I." as it's our brand logo — show nothing instead
  const initials = (() => {
    if (!coupleNames) return ''
    const parts = coupleNames.split('&').map(s => s.trim())
    if (parts.length === 2 && parts[0] && parts[1]) {
      const init = `${parts[0][0]}&${parts[1][0]}.`
      // Skip if it matches our brand
      if (init === 'S&I.') return ''
      return init
    }
    return ''
  })()

  if (!visible) return null
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#ffffff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.5rem', zIndex: 1000,
      transition: 'opacity 0.8s',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '2px solid rgba(0,0,0,0.08)',
        borderTopColor: '#000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#000', letterSpacing: '0.05em' }}>
        {initials}
      </div>
    </div>
  )
}
