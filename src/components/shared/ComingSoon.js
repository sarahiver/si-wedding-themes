// src/components/shared/ComingSoon.js
// Seite für Projekte, die noch nicht veröffentlicht sind (Entwurf / in Bearbeitung):
// „Hier entsteht eine neue Hochzeitswebsite für …" – im Aussehen des gewählten Themes.
// Drei schnelle Klicks auf „S&I." öffnen die Anmeldung für die Vorschau.
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { gateTheme, GATE_TEXT, gateLanguage, gateDate } from './gateThemes';

function LoginModal({ show, onClose, onSubmit, accent, error, isLoading }) {
  const [password, setPassword] = useState('');
  
  if (!show) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };
  
  // Inline styles als Fallback falls styled-components nicht laden
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  };
  
  const boxStyle = {
    background: '#1a1a1a',
    border: `1px solid ${accent}`,
    padding: '2.5rem',
    width: '90%',
    maxWidth: '340px',
    position: 'relative',
  };
  
  const titleStyle = {
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: accent,
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
  };
  
  const inputStyle = {
    width: '100%',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    background: accent,
    border: 'none',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  };
  
  const closeStyle = {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    lineHeight: 1,
  };
  
  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: "'Inter', -apple-system, sans-serif",
  };
  
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={e => e.stopPropagation()}>
        <button style={closeStyle} onClick={onClose}>×</button>
        <h3 style={titleStyle}>Admin Vorschau</h3>
        <form onSubmit={handleSubmit}>
          {error && <div style={errorStyle}>{error}</div>}
          <input
            style={inputStyle}
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button style={buttonStyle} type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Vorschau öffnen'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// SEITE – Farben und Schriften kommen aus gateThemes.js
// ============================================
const Page = styled.main`
  min-height: 100vh; min-height: 100svh; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
  padding: 2.5rem 1.5rem; background: ${(p) => p.$t.bg}; color: ${(p) => p.$t.fg}; font-family: ${(p) => p.$t.body}; text-align: center;
`;
const Sheet = styled.div`
  position: relative; box-sizing: border-box; width: 100%; max-width: 44rem;
  ${(p) => p.$t.card && `background: ${p.$t.card}; padding: clamp(2.5rem, 7vw, 4.5rem) clamp(1.5rem, 6vw, 4rem); box-shadow: 0 30px 60px -32px rgba(51,53,63,0.55); outline: 1px solid rgba(51,53,63,0.18); outline-offset: -0.7rem;`}
`;
const Mark = styled.button`
  display: inline-block; margin: 0 0 2rem; padding: 0.5rem 0.75rem; border: 0; background: none; cursor: default; user-select: none;
  color: ${(p) => p.$t.soft}; font-family: ${(p) => p.$t.body}; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.08em;
  &:focus-visible { outline: 2px solid ${(p) => p.$t.fg}; outline-offset: 2px; }
`;
const Lead = styled.p`margin: 0 0 1.25rem; font-size: clamp(1rem, 2.4vw, 1.1875rem); line-height: 1.5; color: ${(p) => p.$t.soft};`;
const Names = styled.h1`
  margin: 0; font-family: ${(p) => p.$t.head}; font-size: clamp(2.5rem, 9vw, 5.5rem); line-height: 1.05; font-weight: 400; overflow-wrap: anywhere;
  ${(p) => p.$t.headCss}
`;
const Rule = styled.div`width: 3.5rem; height: 1px; margin: 2rem auto; background: ${(p) => p.$t.accent};`;
const DateLine = styled.p`margin: 0; font-size: clamp(1rem, 2.4vw, 1.25rem); letter-spacing: 0.04em; font-variant-numeric: lining-nums;`;
const Note = styled.p`margin: 1.25rem 0 0; font-size: 0.9375rem; color: ${(p) => p.$t.soft};`;

export default function ComingSoon({ onAdminAccess }) {
  const { project, slug } = useWedding();
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setClickCount] = useState(0);

  const handleLogoClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowLogin(true);
        return 0;
      }
      setTimeout(() => setClickCount(0), 1000);
      return newCount;
    });
  }, []);

  const handleLogin = useCallback(async (password) => {
    setError('');
    setIsLoading(true);

    try {
      const { verifyPreviewPassword } = await import('../../lib/supabase');
      const result = await verifyPreviewPassword(slug, password);
      
      if (result.success) {
        sessionStorage.setItem(`admin_preview_${project.id}`, 'true');
        setShowLogin(false);
        if (onAdminAccess) onAdminAccess();
        else window.location.reload();
      } else {
        setError('Falsches Passwort');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  }, [project, onAdminAccess, slug]);

  const t = gateTheme(project && project.theme);
  const lang = gateLanguage(project);
  const tx = GATE_TEXT[lang] || GATE_TEXT.de;
  const pair = [project && project.partner1_name, project && project.partner2_name].filter(Boolean);
  // Nur echte Angaben des Projekts – kein Platzhalter, wenn noch keine Namen eingetragen sind
  const names = pair.length === 2 ? `${pair[0]} & ${pair[1]}` : String((project && project.couple_names) || '').trim();
  const date = gateDate(project && project.wedding_date, lang);

  return (
    <>
      <Page $t={t} lang={lang}>
        <Sheet $t={t}>
          <Mark type="button" $t={t} onClick={handleLogoClick} aria-label="S&I.">S&I.</Mark>
          <Lead $t={t}>{names ? tx.soonLead : tx.soonLeadPlain}</Lead>
          {names && <Names $t={t}>{names}</Names>}
          <Rule $t={t} />
          {date && <DateLine>{date}</DateLine>}
          <Note $t={t}>{tx.soonNote}</Note>
        </Sheet>
      </Page>
      <LoginModal 
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSubmit={handleLogin}
        accent="#FFFFFF"
        error={error}
        isLoading={isLoading}
      />
    </>
  );
}
