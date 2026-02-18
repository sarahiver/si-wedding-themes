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
      background: '#0c0a08',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.5rem', zIndex: 1000,
      transition: 'opacity 0.8s',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '1px solid rgba(184,146,42,0.2)',
        borderTopColor: '#b8922a',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontFamily: "'Pinyon Script', cursive", fontSize: '1.4rem', color: 'rgba(250,247,242,0.5)' }}>
        S&amp;I.
      </div>
    </div>
  )
}
