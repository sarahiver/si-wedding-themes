// src/themes/parallax/NativeParallax.js
//
// "Modern" ohne 3D-Szene – für Handys und schwache/gedrosselte Geräte.
//
// Warum: Die 3D-Version bewegt Bilder UND Texte per JavaScript (WebGL +
// gedämpftes Scrollen). Im iOS-Stromsparmodus drosselt Safari genau das hart
// auf 30 Bilder/s – es ruckelt. Natives Scrollen und CSS-Scroll-Animationen
// laufen dagegen mit voller Bildrate.
//
// Aufbau: Dieselbe Collage, nur als normale <img> im Dokument.
//  - Jedes Bild wird dort platziert, wo es in der 3D-Szene genau dann steht,
//    wenn es in der Bildschirmmitte ist (Perspektive: Bilder mit Tiefe z
//    erscheinen um f = 20/(20-z) größer).
//  - Tiefen-Parallax, Zoom und Schwarzweiß→Farbe laufen als CSS-Scroll-
//    Animation (animation-timeline: scroll()), wo der Browser das kann
//    (Safari 26+, Chrome). Sonst stehen die Bilder einfach ruhig – flüssig
//    ist es in jedem Fall.
//  - Headlines, Tap-Hinweis und Footer kommen unverändert aus HtmlContent,
//    die Modals unverändert aus ParallaxModal.
//
// WICHTIG: Die Bild-Specs unten spiegeln HeroImages / LoveStoryImages /
// CountdownImages / GalleryImages. Wer dort Positionen ändert, muss sie hier
// nachziehen.

import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import HtmlContent, { ALL_TITLES } from './HtmlContent'
import { PAGES, HERO_IMG, LS_IMG, CD_IMG, GAL_IMG } from './scrollConfig'
import { getGalleryUrl } from './galleryHelper'
import { optimizedUrl } from '../../lib/cloudinary'

const CAM_Z = 20
const depth = z => CAM_Z / (CAM_Z - z)          // Perspektiv-Faktor
const prog = pages => (pages / PAGES) * 100      // Seitenposition → % der Scroll-Timeline (wie r() in scrollConfig)
const MAX_S = PAGES - 1                          // maximale Scrollstrecke in Bildschirmhöhen

// ── Bild-Specs (Spiegel der 3D-Komponenten) ─────────────────────────────
// x/w: Anteil der Breite, dy/h: Anteil der Höhe (dy positiv = nach oben),
// zone: Startseite der Gruppe, z: Tiefe, zoom: [start%, ende%, von, bis],
// gray: [start%, ende%] (Schwarzweiß → Farbe)
function buildSpecs() {
  const specs = []
  // Hero
  {
    const [s, l] = HERO_IMG
    specs.push({ img: 0, zone: s, x: -0.14, dy: 0,    z: 0, w: 0.62, h: 1,    zoom: [prog(s), prog(s + l), 1, 1 + 1 / 3] })
    specs.push({ img: 1, zone: s, x: 0.24,  dy: 0.04, z: 3, w: 0.33, h: 0.76, radius: true, zoom: [prog(s), prog(s + l), 1, 1 + 1 / 6] })
  }
  // Love Story
  {
    const s = LS_IMG[0], cl = LS_IMG[1] / 3
    const ch = i => [s + cl * i, cl]
    const zr = ([a, l], k) => [prog(a), prog(a + l), 1, 1 + 1 / k]
    const gr = ([a, l], f) => [prog(a), prog(a + l * f)]
    specs.push({ img: 2, zone: s, x: -0.1,  dy: 0,           z: 0,    w: 0.55, h: 0.95, zoom: zr(ch(0), 3), gray: gr(ch(0), 0.6) })
    specs.push({ img: 3, zone: s, x: 0.15,  dy: -cl,         z: 6,    w: 0.45, h: 0.9,  zoom: zr(ch(1), 2), gray: gr(ch(1), 0.5) })
    specs.push({ img: 4, zone: s, x: -0.08, dy: -cl * 2,     z: 0,    w: 0.6,  h: 1,    zoom: zr(ch(2), 4), gray: gr(ch(2), 0.4) })
    specs.push({ img: 3, zone: s, x: 0.28,  dy: -0.2,        z: 9,    w: 0.18, h: 0.35, radius: true, zoom: zr(ch(0), 2) })
    specs.push({ img: 2, zone: s, x: -0.28, dy: -cl * 1.4,   z: 10.5, w: 0.16, h: 0.3,  radius: true, zoom: zr(ch(1), 1.5) })
  }
  // Countdown-Bild
  {
    const [s, l] = CD_IMG
    specs.push({ img: 5, zone: s, x: 0, dy: 0, z: 0, w: 1, h: 1, zoom: [prog(s), prog(s + l), 1, 1.2] })
  }
  // Galerie (Bilder 4–10)
  {
    const [gs, gl] = GAL_IMG
    const third = gl / 3
    const zr = (a, k) => [prog(a), prog(a + third), 1, 1 + 1 / k]
    specs.push({ img: 4,  zone: gs, x: -0.18, dy: 0,           z: 0,    w: 0.5,  h: 1,    zoom: zr(gs, 3) })
    specs.push({ img: 5,  zone: gs, x: 0.2,   dy: 0,           z: 3,    w: 0.3,  h: 0.6,  zoom: zr(gs, 3) })
    specs.push({ img: 6,  zone: gs, x: -0.17, dy: -gl * 0.38,  z: 6,    w: 0.18, h: 0.9,  radius: true, zoom: zr(gs + third * 1.15, 2) })
    specs.push({ img: 7,  zone: gs, x: -0.04, dy: -gl * 0.38,  z: 9,    w: 0.2,  h: 0.65, radius: true, zoom: zr(gs + third * 1.15, 2) })
    specs.push({ img: 8,  zone: gs, x: 0.2,   dy: -gl * 0.38,  z: 10.5, w: 0.22, h: 0.5,  radius: true, zoom: zr(gs + third * 1.15, 2) })
    specs.push({ img: 9,  zone: gs, x: 0,     dy: -gl * 0.6,   z: 7.5,  w: 0.35, h: 0.85, gray: [prog(gs + third * 1.6), prog(gs + third * 2.6)] })
    specs.push({ img: 10, zone: gs, x: 0,     dy: -gl * 0.88,  z: 0,    w: 1,    h: 0.95, zoom: [prog(gs + third * 2), prog(gs + third * 3), 1 + 1 / 3, 1] })
  }
  return specs
}

const r2 = n => Math.round(n * 1000) / 1000

// Geometrie + Keyframes je Bild
function layout(spec, i) {
  const f = depth(spec.z)
  const c = spec.zone - spec.dy                     // Scrollposition (Bildschirmhöhen), bei der das Bild mittig steht
  const wVw = spec.w * f * 100
  const hVh = spec.h * f * 100
  const style = {
    top: `${r2((c + 0.5) * 100 - hVh / 2)}vh`,
    left: `${r2(50 + spec.x * f * 100 - wVw / 2)}vw`,
    width: `${r2(wVw)}vw`,
    height: `${r2(hVh)}vh`,
    zIndex: Math.round(spec.z * 10),
  }
  let css = ''
  // Tiefen-Parallax: nähere Bilder bewegen sich (f-1)-mal schneller
  if (f !== 1) {
    css += `@keyframes npx-m${i}{from{transform:translate3d(0,${r2((f - 1) * c * 100)}vh,0)}to{transform:translate3d(0,${r2((f - 1) * (c - MAX_S) * 100)}vh,0)}}`
    css += `.npx-i${i}{animation-name:npx-m${i}}`
  }
  if (spec.zoom) {
    const [a, b, z0, z1] = spec.zoom
    css += `@keyframes npx-z${i}{0%{transform:scale(${r2(z0)})}${r2(a)}%{transform:scale(${r2(z0)})}${r2(Math.min(b, 100))}%{transform:scale(${r2(z1)})}100%{transform:scale(${r2(z1)})}}`
    css += `.npx-i${i} img{animation-name:npx-z${i}}`
  }
  if (spec.gray) {
    const [a, b] = spec.gray
    css += `@keyframes npx-g${i}{0%{filter:grayscale(1)}${r2(a)}%{filter:grayscale(1)}${r2(Math.min(b, 100))}%{filter:grayscale(0)}100%{filter:grayscale(0)}}`
    css += `.npx-i${i} .npx-frame{animation-name:npx-g${i}}`
  }
  return { style, css }
}

// Headline-Drift wie im 3D-Loop: offset·(speed−1)·PAGES·vh·0.15
function titleCss() {
  const speeds = [...new Set(ALL_TITLES.map(t => t.speed))]
  return speeds.map(sp => {
    const key = String(sp).replace('.', '_')
    return `@keyframes npx-t${key}{from{transform:translate3d(0,0,0)}to{transform:translate3d(0,${r2((sp - 1) * PAGES * 15)}vh,0)}}` +
      `.npx-page [data-speed="${sp}"]{animation-name:npx-t${key}}`
  }).join('')
}

// Basis-Styles. Alle Scroll-Animationen NUR innerhalb von @supports –
// ohne Unterstützung würden sie sonst einmalig zeitbasiert ablaufen.
const NativeStyles = createGlobalStyle`
  html, body { overflow-x: hidden; }
  .npx-page { position: relative; width: 100%; height: ${PAGES * 100}vh; background: #fff; }
  .npx-imgs { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }
  .npx-i { position: absolute; will-change: transform; }
  .npx-frame { width: 100%; height: 100%; overflow: hidden; }
  .npx-frame.rounded { border-radius: 10px; }
  .npx-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .npx-hero, .npx-logo, .npx-cd { transition: opacity 0.3s; }
  .npx-modal-open .npx-hero, .npx-modal-open .npx-logo, .npx-modal-open .npx-cd { visibility: hidden; }

  @supports (animation-timeline: scroll()) {
    .npx-i, .npx-i img, .npx-i .npx-frame, .npx-page [data-speed],
    .npx-hero, .npx-hero-date, .npx-logo, .npx-cd {
      animation-timing-function: linear;
      animation-fill-mode: both;
      animation-duration: 1ms;
      animation-duration: auto;
      animation-timeline: scroll(root);
    }
    .npx-hero { animation-name: npx-hero; }
    .npx-hero-date { animation-name: npx-hero-date; }
    .npx-logo { animation-name: npx-logo; }
    .npx-cd { animation-name: npx-cd; }
  }

  /* Namen: Mitte → oben rechts (wie im 3D über die ersten 7 % der Strecke) */
  @keyframes npx-hero {
    0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
    4.9% { opacity: 1; }
    7%   { transform: translate(-50%, -50%) translate(var(--npx-hx, 0px), var(--npx-hy, 0px)) scale(var(--npx-hs, 0.2)); opacity: 0; }
    100% { transform: translate(-50%, -50%) translate(var(--npx-hx, 0px), var(--npx-hy, 0px)) scale(var(--npx-hs, 0.2)); opacity: 0; }
  }
  @keyframes npx-hero-date { 0% { opacity: 1; } 1.4% { opacity: 0; } 100% { opacity: 0; } }
  @keyframes npx-logo { 0% { opacity: 0; } 5% { opacity: 0; } 7% { opacity: 1; } 100% { opacity: 1; } }
  @keyframes npx-cd { 0% { opacity: 1; } 4% { opacity: 0; } 100% { opacity: 0; } }
`

const SUPPORTS_TIMELINE = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'scroll()')

export default function NativeParallax({ project, content, activeModal, openModal, n1, n2, wDate, countdown }) {
  const heroRef = useRef(null)
  const logoRef = useRef(null)
  const cdWrapRef = useRef(null)
  const [, force] = useState(0)

  const items = useMemo(() => buildSpecs().map((s, i) => ({ ...s, ...layout(s, i), url: getGalleryUrl(content, s.img) })), [content])
  const css = useMemo(() => items.map(i => i.css).join('') + titleCss(), [items])

  // Ziel der Namens-Animation: Mitte des kleinen Logos oben rechts
  const measure = useCallback(() => {
    const hero = heroRef.current, logo = logoRef.current
    if (!hero || !logo) return
    const vw = window.innerWidth, vh = window.innerHeight
    const lr = logo.getBoundingClientRect()
    const hx = (lr.left + lr.width / 2) - vw / 2
    const hy = (lr.top + lr.height / 2) - vh * 0.22
    // Endgröße ≈ Logo-Schrift (12px) relativ zur großen Namensschrift
    const nameEl = hero.children[1]
    const big = nameEl ? parseFloat(getComputedStyle(nameEl).fontSize) : 48
    const hs = Math.max(0.08, Math.min(1, 12 / Math.max(1, big)))
    hero.style.setProperty('--npx-hx', `${Math.round(hx)}px`)
    hero.style.setProperty('--npx-hy', `${Math.round(hy)}px`)
    hero.style.setProperty('--npx-hs', String(r2(hs)))
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {})
    return () => window.removeEventListener('resize', measure)
  }, [measure, n1, n2])

  // Fallback ohne CSS-Scroll-Animationen: Namen/Logo/Countdown per Scroll-Event
  // (nur transform/opacity, keine Layout-Arbeit)
  useEffect(() => {
    if (SUPPORTS_TIMELINE) return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      const t = Math.min(1, p / 0.07)
      const e = t * t * (3 - 2 * t)
      const hero = heroRef.current
      if (hero) {
        const cs = getComputedStyle(hero)
        const hx = parseFloat(cs.getPropertyValue('--npx-hx')) || 0
        const hy = parseFloat(cs.getPropertyValue('--npx-hy')) || 0
        const hs = parseFloat(cs.getPropertyValue('--npx-hs')) || 0.2
        hero.style.transform = `translate(-50%, -50%) translate(${hx * e}px, ${hy * e}px) scale(${1 + (hs - 1) * e})`
        hero.style.opacity = String(e < 0.7 ? 1 : Math.max(0, 1 - (e - 0.7) / 0.3))
        const date = hero.firstChild
        if (date) date.style.opacity = String(Math.max(0, 1 - e * 5))
      }
      if (logoRef.current) logoRef.current.style.opacity = String(e < 0.7 ? 0 : Math.min(1, (e - 0.7) / 0.3))
      if (cdWrapRef.current) cdWrapRef.current.style.opacity = String(Math.max(0, 1 - p / 0.04))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  // Re-Render nach Schriftladen (Messung) – günstig, einmalig
  useEffect(() => { const id = setTimeout(() => force(x => x + 1), 1200); return () => clearTimeout(id) }, [])

  const toTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <div className={activeModal ? 'npx-modal-open' : undefined}>
      <NativeStyles />
      <style>{css}</style>

      {/* Namen groß (Mitte) */}
      <div ref={heroRef} className="npx-hero" style={{
        position: 'fixed', left: '50%', top: '22%', zIndex: 100,
        transform: 'translate(-50%, -50%)', transformOrigin: 'center center',
        fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: '#000',
        pointerEvents: 'none', userSelect: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        willChange: 'transform, opacity',
      }}>
        <p className="npx-hero-date" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', margin: '0 0 0.6rem' }}>{wDate}</p>
        <span style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>{n1}</span>
        <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'rgba(0,0,0,0.2)', margin: '0.2rem 0' }}>&</span>
        <span style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>{n2}</span>
      </div>

      {/* Namen klein (oben rechts) – Klick: nach oben */}
      <div ref={logoRef} className="npx-logo" onClick={toTop} role="button" aria-label="Nach oben" style={{
        position: 'fixed', top: 22, right: window.innerWidth < 768 ? 16 : 28, transform: 'translateY(-50%)',
        zIndex: 101, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: '#000',
        fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
        opacity: SUPPORTS_TIMELINE ? undefined : 0,
      }}>
        {n1}<span style={{ color: 'rgba(0,0,0,0.2)', margin: '0 0.15em', fontSize: '0.8em' }}>&</span>{n2}
      </div>

      {/* Countdown (feste Position, blendet beim Scrollen aus) */}
      <div ref={cdWrapRef} className="npx-cd" style={{ position: 'relative', zIndex: 200 }}>
        {countdown}
      </div>

      {/* Seite: Bildcollage + Headlines/Footer */}
      <div className="npx-page">
        <div className="npx-imgs" aria-hidden="true">
          {items.map((it, i) => (
            <div key={i} className={`npx-i npx-i${i}`} style={it.style}>
              <div className={`npx-frame${it.radius ? ' rounded' : ''}`}>
                <img src={optimizedUrl.preview(it.url)} alt="" loading={it.zone < 2 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
              </div>
            </div>
          ))}
        </div>
        <HtmlContent project={project} content={content} onOpenModal={openModal} scrollOffsetRef={null} />
      </div>
    </div>
  )
}
