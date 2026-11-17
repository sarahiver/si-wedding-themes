// src/components/shared/NotFound.js
// Ruhige Hinweisseite, wenn es zu einer Adresse kein Projekt gibt oder das Laden scheitert.
// Sie nennt keine internen Meldungen und verrät nichts über vorhandene Projekte. Die Sprache
// des Besuchs ist hier unbekannt, deshalb stehen die Texte auf Deutsch und Englisch.
import React, { useEffect } from 'react';

const S = {
  page: { minHeight: '100vh', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: '#F7F5F4', color: '#33353F', fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", textAlign: 'center' },
  box: { maxWidth: '30rem' },
  h: { margin: '0 0 1rem', fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.15 },
  p: { margin: '0 0 0.5rem', fontSize: '1.0625rem', lineHeight: 1.6 },
  en: { margin: '0 0 0.5rem', fontSize: '1.0625rem', lineHeight: 1.6, color: '#5D5C66' },
  row: { marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' },
  btn: { minHeight: '3rem', padding: '0.6rem 1.5rem', border: '1px solid #33353F', background: 'transparent', color: '#33353F', font: 'inherit', fontSize: '1rem', cursor: 'pointer' },
};

export default function NotFound({ kind = 'missing' }) {
  const missing = kind === 'missing';
  useEffect(() => {
    const before = document.title;
    document.title = missing ? 'Seite nicht gefunden' : 'Seite nicht erreichbar';
    return () => { document.title = before; };
  }, [missing]);
  const canGoBack = typeof window !== 'undefined' && window.history.length > 1;
  return (
    <main style={S.page} data-testid="not-found">
      <div style={S.box}>
        <h1 style={S.h}>{missing ? 'Diese Seite gibt es nicht' : 'Die Seite ist gerade nicht erreichbar'}</h1>
        {missing ? (
          <>
            <p style={S.p}>Bitte prüft den Link aus eurer Einladung.</p>
            <p style={S.en} lang="en">This page does not exist. Please check the link in your invitation.</p>
          </>
        ) : (
          <>
            <p style={S.p}>Bitte versucht es in einem Moment noch einmal.</p>
            <p style={S.en} lang="en">The page cannot be reached right now. Please try again in a moment.</p>
          </>
        )}
        <div style={S.row}>
          {!missing && <button type="button" style={S.btn} onClick={() => window.location.reload()}>Erneut versuchen · Try again</button>}
          {canGoBack && <button type="button" style={S.btn} onClick={() => window.history.back()}>Zurück · Back</button>}
        </div>
      </div>
    </main>
  );
}
