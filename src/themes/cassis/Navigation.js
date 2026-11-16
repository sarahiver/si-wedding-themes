// src/themes/cassis/Navigation.js
// Kopfzeile: Schriftzug links, Menü in der Mitte, Sprachwahl rechts.
// Über dem Startfoto durchsichtig, beim Scrollen dezent hinterlegt und fixiert.
// Auf dem Handy: Schriftzug, Sprachwahl und ein Menü zum Aufklappen.
import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent, LANGUAGE_LABELS, LANGUAGE_NAMES } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SCRIPT, HEADER } from './shared';

// Reihenfolge wie auf der Seite; angezeigt wird nur, was dort tatsächlich steht
const ITEMS = [
  { id: 'timeline', key: 'navTimeline' }, { id: 'countdown', key: 'navCountdown' }, { id: 'rsvp', key: 'navRsvp' },
  { id: 'directions', key: 'navDirections' }, { id: 'faq', key: 'navFaq' }, { id: 'witnesses', key: 'navWitnesses' },
];
const WIDE = '@media (min-width: 1024px)';
const NARROW = '@media (max-width: 1023px)';

const Bar = styled.header`
  position: fixed; z-index: 50; top: 0; left: 0; right: 0; box-sizing: border-box; height: ${HEADER};
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0 clamp(1rem, 4vw, 3.5rem); font-family: ${FONT};
  color: ${(p) => (p.$solid ? C.ink : C.white)};
  background: ${(p) => (p.$solid ? 'rgba(240,236,237,0.94)' : 'rgba(240,236,237,0)')};
  box-shadow: ${(p) => (p.$solid ? `0 1px 0 ${C.line}` : '0 1px 0 rgba(51,53,63,0)')};
  backdrop-filter: ${(p) => (p.$solid ? 'saturate(1.1) blur(10px)' : 'none')};
  transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  @media (prefers-reduced-motion: reduce) { transition: none; }
  @media print { position: absolute; }
`;
const Mark = styled.a`
  display: block; flex: none; color: inherit; text-decoration: none; line-height: 1;
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
    display: flex; align-items: center; gap: clamp(1rem, 2.2vw, 2.75rem); margin: 0 auto;
    a { ${link} min-height: 2.75rem; font-size: clamp(0.9375rem, 1.05vw, 1.0625rem); letter-spacing: 0.06em; white-space: nowrap; text-shadow: ${(p) => (p.$solid ? 'none' : '0 0 12px rgba(51,53,63,0.45)')}; }
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
const Right = styled.div`display: flex; align-items: center; gap: 0.25rem; flex: none; margin-right: -0.5rem;`;
const LangWrap = styled.div`position: relative;`;
const iconButton = `
  display: inline-flex; align-items: center; justify-content: center; min-width: 2.75rem; height: 2.75rem; padding: 0 0.5rem; border: none; background: transparent; color: inherit; cursor: pointer;
  font-family: ${FONT}; font-size: 0.9375rem; letter-spacing: 0.08em;
  &:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
`;
const LangToggle = styled.button`
  ${iconButton} gap: 0.35rem; text-shadow: ${(p) => (p.$solid ? 'none' : '0 0 12px rgba(51,53,63,0.45)')};
  svg { width: 0.6rem; height: 0.6rem; transition: transform 0.2s ease; transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'none')}; }
  ${WIDE} { display: none; }
`;
const Langs = styled.nav`
  ${WIDE} { display: flex; gap: 0.1rem; }
  ${NARROW} {
    position: absolute; top: calc(100% + 0.6rem); right: 0; display: grid; min-width: 4.5rem; background: ${C.shell}; color: ${C.ink}; box-shadow: 0 0 0 1px ${C.line}, 0 12px 24px rgba(51,53,63,0.14);
    visibility: ${(p) => (p.$open ? 'visible' : 'hidden')}; opacity: ${(p) => (p.$open ? 1 : 0)}; transform: ${(p) => (p.$open ? 'none' : 'translateY(-6px)')};
    transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
    @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
  }
`;
const Lang = styled.button`
  ${iconButton} position: relative; opacity: ${(p) => (p.$on ? 1 : 0.74)}; transition: opacity 0.2s ease;
  &::after { content: ''; position: absolute; left: 0.5rem; right: 0.5rem; bottom: 0.55rem; height: 1px; background: currentColor; opacity: ${(p) => (p.$on ? 1 : 0)}; }
  &:hover { opacity: 1; }
  ${WIDE} { text-shadow: ${(p) => (p.$solid ? 'none' : '0 0 12px rgba(51,53,63,0.45)')}; }
  ${NARROW} { width: 100%; height: 3rem; opacity: 1; font-weight: ${(p) => (p.$on ? 400 : 300)}; }
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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [present, setPresent] = useState([]);
  const menuId = useId();
  const langId = useId();
  const burgerRef = useRef(null);
  const menuRef = useRef(null);

  // Über dem Foto durchsichtig, danach hinterlegt
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Nur Bereiche anbieten, die auf der Seite wirklich stehen (aktiv und mit Inhalt)
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const ids = ITEMS.map((i) => i.id).filter((id) => document.getElementById(id));
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
    if (!open && !langOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (open && burgerRef.current) burgerRef.current.focus();
      setOpen(false); setLangOpen(false);
    };
    document.addEventListener('keydown', onKey);
    let restore = null;
    if (open) {
      const root = document.documentElement; const prev = root.style.overflow;
      root.style.overflow = 'hidden';
      restore = () => { root.style.overflow = prev; };
    }
    return () => { document.removeEventListener('keydown', onKey); if (restore) restore(); };
  }, [open, langOpen]);

  // Wird das Fenster breit, gibt es kein Aufklappmenü mehr
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) { setOpen(false); setLangOpen(false); } };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', onChange); else mq.removeListener(onChange); };
  }, []);

  // Tippen außerhalb schließt die Sprachliste
  useEffect(() => {
    if (!langOpen) return undefined;
    const onDown = (e) => { if (!e.target.closest || !e.target.closest('[data-cassis-lang]')) setLangOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [langOpen]);

  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = names.length ? names.join(' ') : (coupleNames || '');
  const solid = scrolled || open;
  const items = ITEMS.filter((i) => present.includes(i.id));
  const multi = enabled && languages.length > 1;

  const toggleMenu = () => {
    setLangOpen(false);
    setOpen((v) => {
      // nach dem Öffnen den ersten Menüpunkt ansteuern (Tastatur, Screenreader)
      if (!v) window.requestAnimationFrame(() => { const first = menuRef.current && menuRef.current.querySelector('a'); if (first) first.focus({ preventScroll: true }); });
      return !v;
    });
  };
  const choose = (l) => { setLang(l); setLangOpen(false); };

  return (
    <Bar $solid={solid} data-solid={solid ? 'true' : 'false'}>
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
          <LangWrap data-cassis-lang>
            <LangToggle type="button" $solid={solid} $open={langOpen} aria-haspopup="true" aria-expanded={langOpen} aria-controls={langId}
              aria-label={`${t(STRINGS, 'language')}: ${LANGUAGE_NAMES[lang] || ''}`} onClick={() => { setOpen(false); setLangOpen((v) => !v); }}>
              {LANGUAGE_LABELS[lang]}
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 3 L5 7 L9 3" /></svg>
            </LangToggle>
            <Langs id={langId} aria-label={t(STRINGS, 'language')} $open={langOpen}>
              {languages.map((l) => (
                <Lang key={l} type="button" lang={l} $on={l === lang} $solid={solid} aria-pressed={l === lang} aria-label={LANGUAGE_NAMES[l]} onClick={() => choose(l)}>
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
