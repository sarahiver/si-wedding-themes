import { useEffect, useState } from 'react'

export default function Loader() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(id)
  }, [])

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
        S&amp;I.
      </div>
    </div>
  )
}
