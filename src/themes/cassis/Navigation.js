// src/themes/cassis/Navigation.js
// Kopfzeile. Über dem Startbild gehört sie zur Doppelseite: durchsichtig, ohne eigenen
// Schriftzug (der große steht direkt darunter); das Menü liegt auf dem Papier, die
// Sprachwahl auf dem Foto. Menüpunkte, die über die Kante reichen, wechseln dort die
// Farbe – wie der Schriftzug. Erst wenn das Startbild fast durchgescrollt ist, gleitet
// eine dezent hinterlegte, fixierte Fassung mit Schriftzug von oben herein. Beide Fassungen sind gleich hoch
// und liegen außerhalb des Textflusses: Der Wechsel verschiebt nichts.
// Auf dem Handy: Schriftzug, Sprachwahl (Auswahlfeld des Geräts) und ein Menü zum Aufklappen.
import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent, LANGUAGE_LABELS, LANGUAGE_NAMES } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SCRIPT, HEADER } from './shared';

// Angezeigt wird nur, was auf der Seite tatsächlich steht – in der Reihenfolge der Seite
const ITEMS = [
  { id: 'countdown', key: 'navCountdown' }, { id: 'timeline', key: 'navTimeline' }, { id: 'directions', key: 'navDirections' },
  { id: 'rsvp', key: 'navRsvp' }, { id: 'witnesses', key: 'navWitnesses' }, { id: 'faq', key: 'navFaq' },
];
// Anteil des Papiers an der Breite des Startbilds (siehe Hero.js, --split) und ab wann die Doppelseite gilt
const SPLIT = 0.41;
const SPREAD = 900;
const WIDE = '@media (min-width: 1024px)';
const NARROW = '@media (max-width: 1023px)';

const Bar = styled.header`
  position: ${(p) => (p.$pinned ? 'fixed' : 'absolute')}; z-index: 50; top: 0; left: 0; right: 0; box-sizing: border-box; height: ${HEADER};
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0 clamp(1rem, 4vw, 3.5rem); font-family: ${FONT};
  color: ${(p) => (p.$solid ? C.ink : C.white)};
  background: ${(p) => (p.$solid ? 'rgba(240,236,237,0.94)' : 'rgba(240,236,237,0)')};
  box-shadow: ${(p) => (p.$solid ? `0 1px 0 ${C.line}` : '0 1px 0 rgba(51,53,63,0)')};
  backdrop-filter: ${(p) => (p.$solid ? 'saturate(1.1) blur(10px)' : 'none')};
  transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  @keyframes cassisHeaderIn { from { transform: translateY(-100%); } to { transform: none; } }
  animation: ${(p) => (p.$pinned ? 'cassisHeaderIn 0.25s ease both' : 'none')};
  @media (prefers-reduced-motion: reduce) { transition: none; animation: none; }
  @media print { position: absolute; animation: none; }
`;
const Mark = styled.a`
  display: ${(p) => (p.$solid ? 'block' : 'none')}; flex: none; color: inherit; text-decoration: none; line-height: 1;
  img {
    display: block; width: auto; height: 3rem;
    /* Die Grafik ist weiß: über dem Foto mit Schatten, auf hellem Grund dunkel eingefärbt */
    filter: ${(p) => (p.$solid ? 'brightness(0) opacity(0.82)' : 'drop-shadow(0 1px 8px rgba(51,53,63,0.45))')};
    transition: filter 0.25s ease;
  }
  span { font-family: ${SCRIPT}; font-size: 1.75rem; white-space: nowrap; }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
`;
const link = `
  position: relative; display: inline-flex; align-items: center; color: inherit; text-decoration: none; cursor: pointer;
  &::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0.7rem; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform 0.22s ease; }
  &:hover::after, &[aria-current='true']::after { transform: scaleX(1); }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }
`;
const Menu = styled.nav`
  ${WIDE} {
    display: flex; align-items: center; gap: clamp(1rem, 2.2vw, 2.75rem); margin: ${(p) => (p.$solid ? '0 auto' : '0 auto 0 0')};
    a { ${link} min-height: 2.75rem; font-size: clamp(0.9375rem, 1.05vw, 1.0625rem); letter-spacing: 0.06em; white-space: nowrap; }
    /* Über dem Startbild: dunkel auf dem Papier, weiß auf dem Foto. --x ist der Abstand des Menüpunkts zur Kante. */
    ${(p) => !p.$solid && `
      a { color: transparent; background-image: linear-gradient(90deg, ${C.ink} var(--x, 200vw), ${C.white} var(--x, 200vw)); -webkit-background-clip: text; background-clip: text; }
      a::after { background: linear-gradient(90deg, ${C.ink} var(--x, 200vw), ${C.white} var(--x, 200vw)); }
      a:focus-visible { outline-color: ${C.ink}; }
      a[data-side='photo']:focus-visible { outline-color: ${C.white}; }
      /* Auf dem Foto hält ein weicher Schatten die weiße Schrift auch vor hellen Motiven lesbar */
      a[data-side='photo'] { filter: drop-shadow(0 0 5px rgba(51,53,63,0.6)); }
    `}
  }
  ${NARROW} {
    position: absolute; top: 100%; left: 0; right: 0; box-sizing: border-box; max-height: calc(100vh - ${HEADER}); max-height: calc(100dvh - ${HEADER}); overflow-y: auto;
    display: grid; padding: 0.5rem clamp(1rem, 4vw, 3.5rem) 2rem; background: ${C.shell}; color: ${C.ink}; box-shadow: 0 1px 0 ${C.line}, 0 18px 30px rgba(51,53,63,0.12);
    visibility: ${(p) => (p.$open ? 'visible' : 'hidden')}; opacity: ${(p) => (p.$open ? 1 : 0)}; transform: ${(p) => (p.$open ? 'none' : 'translateY(-8px)')};
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    a { display: flex; align-items: center; min-height: 3.5rem; color: ${C.ink}; text-decoration: none; font-weight: 300; font-size: 1.5rem; border-bottom: 1px solid ${C.line}; }
    a:focus-visible { outline: 2px solid ${C.ink}; outline-offset: -2px; }
    @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
  }
`;
const Right = styled.div`display: flex; align-items: center; gap: 0.25rem; flex: none; margin-left: auto; margin-right: -0.5rem;`;
const LangWrap = styled.div`position: relative; display: flex; align-items: center;`;
const iconButton = `
  display: inline-flex; align-items: center; justify-content: center; min-width: 2.75rem; height: 2.75rem; padding: 0 0.5rem; border: none; background: transparent; color: inherit; cursor: pointer;
  font-family: ${FONT}; font-size: 0.9375rem; letter-spacing: 0.08em;
  &:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
`;
// Handy: die Sprachwahl ist ein gewöhnliches Auswahlfeld des Geräts. Es liegt unsichtbar
// über der Anzeige „DE ⌄" – so öffnet sich die vertraute Auswahl von iOS und Android,
// ganz ohne eigene Aufklappliste.
const LangPick = styled.label`
  ${iconButton} position: relative; gap: 0.35rem; text-shadow: ${(p) => (p.$solid ? 'none' : '0 0 12px rgba(51,53,63,0.45)')};
  svg { width: 0.6rem; height: 0.6rem; }
  select { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; padding: 0; border: 0; opacity: 0; cursor: pointer; font-size: 16px; appearance: none; -webkit-appearance: none; color: ${C.ink}; background: ${C.shell}; }
  &:focus-within { outline: 2px solid currentColor; outline-offset: -2px; }
  ${WIDE} { display: none; }
`;
const Langs = styled.nav`
  display: none;
  ${WIDE} { display: flex; gap: 0.1rem; }
`;
const Lang = styled.button`
  ${iconButton} position: relative; opacity: ${(p) => (p.$on ? 1 : 0.74)}; transition: opacity 0.2s ease;
  &::after { content: ''; position: absolute; left: 0.5rem; right: 0.5rem; bottom: 0.55rem; height: 1px; background: currentColor; opacity: ${(p) => (p.$on ? 1 : 0)}; }
  &:hover { opacity: 1; }
  text-shadow: ${(p) => (p.$solid ? 'none' : '0 0 12px rgba(51,53,63,0.45)')};
`;
const Burger = styled.button`
  ${iconButton}
  span { position: relative; display: block; width: 1.375rem; height: 0.75rem; }
  span::before, span::after { content: ''; position: absolute; left: 0; right: 0; height: 1px; background: currentColor; transition: transform 0.22s ease, top 0.22s ease, bottom 0.22s ease; }
  span::before { top: ${(p) => (p.$open ? '50%' : '0')}; transform: ${(p) => (p.$open ? 'rotate(45deg)' : 'none')}; }
  span::after { bottom: ${(p) => (p.$open ? 'calc(50% - 1px)' : '0')}; transform: ${(p) => (p.$open ? 'rotate(-45deg)' : 'none')}; }
  filter: ${(p) => (p.$solid ? 'none' : 'drop-shadow(0 0 6px rgba(51,53,63,0.5))')};
  ${WIDE} { display: none; }
  @media (prefers-reduced-motion: reduce) { span::before, span::after { transition: none; } }
`;

function Navigation() {
  const { project, coupleNames } = useWedding();
  const { enabled, lang, languages, setLang, t } = useLanguage();
  const hero = useLocalizedContent('hero');
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState([]);
  const menuId = useId();
  const burgerRef = useRef(null);
  const menuRef = useRef(null);

  // Fixiert wird erst, wenn das Startfoto fast durchgescrollt ist. Die Schwelle wird
  // an der Höhe des Fotos gemessen und bei Größenänderung neu bestimmt.
  useEffect(() => {
    let limit = 0;
    const measure = () => {
      const hero = document.getElementById('top');
      const h = hero ? hero.offsetHeight : window.innerHeight;
      limit = Math.max(80, h - 72); // Unterkante des Fotos erreicht die Kopfzeile
      onScroll();
    };
    const onScroll = () => setPinned(window.scrollY > limit);
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    const late = window.setTimeout(measure, 600); // das Foto kann nach der Kopfzeile erscheinen
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure); window.clearTimeout(late); };
  }, []);

  // Direkter Aufruf mit Sprungziel (…/#rsvp): Die Bereiche entstehen erst nach dem Laden,
  // der Browser findet das Ziel deshalb nicht selbst. Einmal nachholen, sobald es da ist.
  const jumped = useRef(false);
  useEffect(() => {
    if (jumped.current || typeof window === 'undefined') return;
    const id = decodeURIComponent((window.location.hash || '').slice(1));
    if (!id) { jumped.current = true; return; }
    if (!ITEMS.some((i) => i.id === id) || !present.includes(id)) return;
    jumped.current = true;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [present]);

  // Nur Bereiche anbieten, die auf der Seite wirklich stehen (aktiv und mit Inhalt)
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const pos = (a, b) => (document.getElementById(a).compareDocumentPosition(document.getElementById(b)) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      const ids = ITEMS.map((i) => i.id).filter((id) => document.getElementById(id)).sort(pos);
      setPresent((prev) => (prev.join() === ids.join() ? prev : ids));
    };
    check();
    if (typeof MutationObserver === 'undefined') return undefined;
    const mo = new MutationObserver(() => { if (!frame) frame = window.requestAnimationFrame(check); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  // Über dem Startbild: für jeden Menüpunkt messen, wo die Kante zwischen Papier und Foto liegt
  useEffect(() => {
    const paint = () => {
      const nav = menuRef.current; if (!nav) return;
      const edge = window.innerWidth >= SPREAD ? window.innerWidth * SPLIT : 0; // darunter liegt das Foto oben: alles weiß
      nav.querySelectorAll('a').forEach((a) => {
        const b = a.getBoundingClientRect();
        a.style.setProperty('--x', `${Math.round(edge - b.left)}px`);
        a.setAttribute('data-side', b.left + b.width / 2 > edge ? 'photo' : 'paper');
      });
    };
    paint();
    window.addEventListener('resize', paint);
    const late = window.setTimeout(paint, 700); // Schriften können die Breiten noch ändern
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint).catch(() => {});
    return () => { window.removeEventListener('resize', paint); window.clearTimeout(late); };
  }, [present, lang, pinned, open]);

  // Escape schließt; bei offenem Menü scrollt die Seite dahinter nicht mit
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (burgerRef.current) burgerRef.current.focus();
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const root = document.documentElement; const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); root.style.overflow = prev; };
  }, [open]);

  // Wird das Fenster breit, gibt es kein Aufklappmenü mehr
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', onChange); else mq.removeListener(onChange); };
  }, []);

  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = names.length ? names.join(' ') : (coupleNames || '');
  const solid = pinned || open;
  const items = present.map((id) => ITEMS.find((i) => i.id === id)).filter(Boolean);
  const multi = enabled && languages.length > 1;

  const toggleMenu = () => {
    setOpen((v) => {
      // nach dem Öffnen den ersten Menüpunkt ansteuern (Tastatur, Screenreader)
      if (!v) window.requestAnimationFrame(() => { const first = menuRef.current && menuRef.current.querySelector('a'); if (first) first.focus({ preventScroll: true }); });
      return !v;
    });
  };

  return (
    <Bar $solid={solid} $pinned={pinned} data-solid={solid ? 'true' : 'false'} data-pinned={pinned ? 'true' : 'false'}>
      <Mark href="#top" aria-label={label} $solid={solid} onClick={() => setOpen(false)}>
        {hero.name_image ? <img src={hero.name_image} alt="" /> : <span aria-hidden="true">{label}</span>}
      </Mark>

      {items.length > 0 && (
        <Menu id={menuId} ref={menuRef} aria-label={t(STRINGS, 'menu')} $open={open} $solid={solid}>
          {items.map((i) => <a key={i.id} href={`#${i.id}`} onClick={() => setOpen(false)}>{t(STRINGS, i.key)}</a>)}
        </Menu>
      )}

      <Right>
        {multi && (
          <LangWrap>
            <LangPick $solid={solid}>
              <span aria-hidden="true">{LANGUAGE_LABELS[lang]}</span>
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 3 L5 7 L9 3" /></svg>
              <select aria-label={t(STRINGS, 'language')} value={lang || ''} onChange={(e) => { setOpen(false); setLang(e.target.value); }}>
                {languages.map((l) => <option key={l} value={l} lang={l}>{LANGUAGE_NAMES[l]}</option>)}
              </select>
            </LangPick>
            <Langs aria-label={t(STRINGS, 'language')}>
              {languages.map((l) => (
                <Lang key={l} type="button" lang={l} $on={l === lang} $solid={solid} aria-pressed={l === lang} aria-label={LANGUAGE_NAMES[l]} onClick={() => setLang(l)}>
                  {LANGUAGE_LABELS[l]}
                </Lang>
              ))}
            </Langs>
          </LangWrap>
        )}
        {items.length > 0 && (
          <Burger ref={burgerRef} type="button" $open={open} $solid={solid} aria-expanded={open} aria-controls={menuId}
            aria-label={t(STRINGS, open ? 'closeMenu' : 'menu')} onClick={toggleMenu}>
            <span aria-hidden="true" />
          </Burger>
        )}
      </Right>
    </Bar>
  );
}
export default Navigation;
