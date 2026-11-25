// src/themes/cassis/Navigation.js
// Kopfzeile. Über dem Startbild ist sie durchsichtig, ohne eigenen Schriftzug (der große steht
// darunter), und hat dieselbe Farbe wie der Schriftzug (weiß oder schwarz, im Dashboard gewählt).
// Erst wenn das Startbild fast durchgescrollt ist, gleitet
// eine dezent hinterlegte, fixierte Fassung mit Schriftzug von oben herein. Beide Fassungen sind gleich hoch
// und liegen außerhalb des Textflusses: Der Wechsel verschiebt nichts.
// Auf dem Handy: Schriftzug, Sprachwahl (Auswahlfeld des Geräts) und ein Menü zum Aufklappen.
import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent, LANGUAGE_LABELS, LANGUAGE_NAMES } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SCRIPT, HEADER } from './shared';
import { heroTone } from './helpers';

// Angezeigt wird nur, was auf der Seite tatsächlich steht – in der Reihenfolge der Seite
const ITEMS = [
  { id: 'countdown', key: 'navCountdown' }, { id: 'timeline', key: 'navTimeline' }, { id: 'directions', key: 'navDirections' },
  { id: 'rsvp', key: 'navRsvp' }, { id: 'accommodations', key: 'navHotels' }, { id: 'dresscode', key: 'navDresscode' },
  { id: 'witnesses', key: 'navWitnesses' }, { id: 'faq', key: 'navFaq' },
];
// In em statt px: Bei vergrößerter Schrift im Browser passt die Menüzeile nicht mehr in die Breite –
// dann gilt schon früher das aufklappbare Menü. Bei üblicher Schriftgröße liegt die Grenze unverändert bei 1024 px.
const WIDE = '@media (min-width: 64em)';
const NARROW = '@media (max-width: 63.9375em)';

const Bar = styled.header`
  position: ${(p) => (p.$pinned ? 'fixed' : 'absolute')}; z-index: 50; top: 0; left: 0; right: 0; box-sizing: border-box; height: ${HEADER};
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0 clamp(1rem, 4vw, 3.5rem); font-family: ${FONT};
  color: ${(p) => (p.$solid || p.$tone === 'dark' ? C.ink : C.white)};
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
    /* Die Grafik ist weiß; auf dem hellen Grund der fixierten Kopfzeile dunkel eingefärbt */
    filter: brightness(0) opacity(0.82);
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
    /* Auf dem Foto hält ein weicher Schatten die Schrift auch vor unruhigen Motiven lesbar */
    ${(p) => !p.$solid && `a { filter: drop-shadow(0 0 5px ${shade(p.$tone, 0.6)}); }`}
  }
  ${NARROW} {
    position: absolute; top: 100%; left: 0; right: 0; box-sizing: border-box; max-height: calc(100vh - ${HEADER}); max-height: calc(100dvh - ${HEADER}); overflow-y: auto;
    display: grid; padding: 0.5rem clamp(1rem, 4vw, 3.5rem) 2rem; background: ${C.shell}; color: ${C.ink}; box-shadow: 0 1px 0 ${C.line}, 0 18px 30px rgba(51,53,63,0.12);
    visibility: ${(p) => (p.$open ? 'visible' : 'hidden')}; opacity: ${(p) => (p.$open ? 1 : 0)}; transform: ${(p) => (p.$open ? 'none' : 'translateY(-8px)')};
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    a { display: flex; align-items: center; min-height: 3.5rem; color: ${C.ink}; text-decoration: none; font-weight: 300; font-size: 1.5rem; border-bottom: 1px solid ${C.line}; }
    a:focus-visible { outline: 2px solid ${C.ink}; outline-offset: -2px; }
    @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
    /* Querformat mit wenig Höhe: zwei Spalten, damit das Menü ohne Scrollen passt */
    @media (orientation: landscape) and (max-height: 30rem) { grid-template-columns: 1fr 1fr; column-gap: clamp(1rem, 4vw, 3.5rem); a { min-height: 3rem; font-size: 1.25rem; } }
  }
`;
// Schatten über dem Foto: dunkel unter weißer, hell unter schwarzer Schrift
const shade = (tone, a) => (tone === 'dark' ? `rgba(248,246,246,${a})` : `rgba(51,53,63,${a})`);
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
  ${iconButton} position: relative; gap: 0.35rem; text-shadow: ${(p) => (p.$solid ? 'none' : `0 0 12px ${shade(p.$tone, 0.45)}`)};
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
  text-shadow: ${(p) => (p.$solid ? 'none' : `0 0 12px ${shade(p.$tone, 0.45)}`)};
`;
const Burger = styled.button`
  ${iconButton}
  span { position: relative; display: block; width: 1.375rem; height: 0.75rem; }
  span::before, span::after { content: ''; position: absolute; left: 0; right: 0; height: 1px; background: currentColor; transition: transform 0.22s ease, top 0.22s ease, bottom 0.22s ease; }
  span::before { top: ${(p) => (p.$open ? '50%' : '0')}; transform: ${(p) => (p.$open ? 'rotate(45deg)' : 'none')}; }
  span::after { bottom: ${(p) => (p.$open ? 'calc(50% - 1px)' : '0')}; transform: ${(p) => (p.$open ? 'rotate(-45deg)' : 'none')}; }
  filter: ${(p) => (p.$solid ? 'none' : `drop-shadow(0 0 6px ${shade(p.$tone, 0.5)})`)};
  ${WIDE} { display: none; }
  @media (prefers-reduced-motion: reduce) { span::before, span::after { transition: none; } }
`;

// Sprachwechsel mitten auf der Seite: Texte sind je Sprache verschieden lang. Damit die Stelle, die man
// gerade liest, stehen bleibt, wird ein sichtbares Element gemerkt und danach wieder an seinen Platz geschoben.
function readingAnchor() {
  if (typeof window === 'undefined' || window.scrollY < 4) return null;
  const sticky = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { if (getComputedStyle(e).position === 'sticky' || getComputedStyle(e).position === 'fixed') return true; } return false; };
  let best = null;
  for (const el of document.querySelectorAll('section h2, section h3, section li, section p, section summary, section address, section label, section fieldset, footer p')) {
    const r = el.getBoundingClientRect();
    if (r.top < 64 || r.top > window.innerHeight || r.height === 0) continue;
    // Am nächsten am oberen Fünftel des Fensters: dort liest man
    const d = Math.abs(r.top - window.innerHeight * 0.2);
    if (best && d >= best.d) continue;
    if (sticky(el)) continue;
    best = { el, top: r.top, d };
  }
  return best;
}
function keepReadingPlace(anchor) {
  if (!anchor) return;
  let last = window.scrollY;
  const fix = () => {
    // Hat inzwischen jemand selbst gescrollt, bleibt die Seite, wo sie ist
    if (!anchor.el.isConnected || Math.abs(window.scrollY - last) > 2) return;
    const d = anchor.el.getBoundingClientRect().top - anchor.top;
    if (Math.abs(d) > 1) { window.scrollBy({ top: d, behavior: 'instant' }); last = window.scrollY; }
  };
  requestAnimationFrame(() => { fix(); requestAnimationFrame(fix); });
  // Andere Sprachen laden teils weitere Schriftzeichen nach; danach rückt der Text noch einmal
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(fix));
  setTimeout(fix, 400);
}

function Navigation() {
  const { project, coupleNames } = useWedding();
  const { enabled, lang, languages, setLang: applyLang, t } = useLanguage();
  const setLang = (l) => { if (l === lang) return; const anchor = readingAnchor(); applyLang(l); keepReadingPlace(anchor); };
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
    const mq = window.matchMedia('(min-width: 64em)');
    const onChange = () => { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', onChange); else mq.removeListener(onChange); };
  }, []);

  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = names.length ? names.join(' ') : (coupleNames || '');
  const solid = pinned || open;
  const tone = heroTone(hero);
  const items = present.map((id) => ITEMS.find((i) => i.id === id)).filter(Boolean);
  const multi = enabled && languages.length > 1;

  // Das Startbild bleibt am oberen Rand stehen – für den Browser ist das Sprungziel „#top" deshalb
  // immer schon im Bild, ein gewöhnlicher Sprung täte nichts. Darum hier ausdrücklich an den Seitenanfang.
  const toTop = (e) => {
    e.preventDefault(); setOpen(false);
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    if (window.history && window.history.replaceState) window.history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  const toggleMenu = () => {
    setOpen((v) => {
      // nach dem Öffnen den ersten Menüpunkt ansteuern (Tastatur, Screenreader)
      if (!v) window.requestAnimationFrame(() => { const first = menuRef.current && menuRef.current.querySelector('a'); if (first) first.focus({ preventScroll: true }); });
      return !v;
    });
  };

  return (
    <Bar $solid={solid} $pinned={pinned} $tone={tone} data-solid={solid ? 'true' : 'false'} data-pinned={pinned ? 'true' : 'false'}>
      <Mark href="#top" aria-label={label} $solid={solid} onClick={toTop}>
        {hero.name_image ? <img src={hero.name_image} alt="" /> : <span aria-hidden="true">{label}</span>}
      </Mark>

      {items.length > 0 && (
        <Menu id={menuId} ref={menuRef} aria-label={t(STRINGS, 'menu')} $open={open} $solid={solid} $tone={tone}>
          {items.map((i) => <a key={i.id} href={`#${i.id}`} onClick={() => setOpen(false)}>{t(STRINGS, i.key)}</a>)}
        </Menu>
      )}

      <Right>
        {multi && (
          <LangWrap>
            <LangPick $solid={solid} $tone={tone}>
              <span aria-hidden="true">{LANGUAGE_LABELS[lang]}</span>
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 3 L5 7 L9 3" /></svg>
              <select aria-label={t(STRINGS, 'language')} value={lang || ''} onChange={(e) => { setOpen(false); setLang(e.target.value); }}>
                {languages.map((l) => <option key={l} value={l} lang={l}>{LANGUAGE_NAMES[l]}</option>)}
              </select>
            </LangPick>
            <Langs aria-label={t(STRINGS, 'language')}>
              {languages.map((l) => (
                <Lang key={l} type="button" lang={l} $on={l === lang} $solid={solid} $tone={tone} aria-pressed={l === lang} aria-label={`${LANGUAGE_LABELS[l]} – ${LANGUAGE_NAMES[l]}`} onClick={() => setLang(l)}>
                  {LANGUAGE_LABELS[l]}
                </Lang>
              ))}
            </Langs>
          </LangWrap>
        )}
        {items.length > 0 && (
          <Burger ref={burgerRef} type="button" $open={open} $solid={solid} $tone={tone} aria-expanded={open} aria-controls={menuId}
            aria-label={t(STRINGS, open ? 'closeMenu' : 'menu')} onClick={toggleMenu}>
            <span aria-hidden="true" />
          </Burger>
        )}
      </Right>
    </Bar>
  );
}
export default Navigation;
