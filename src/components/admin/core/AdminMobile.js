// core/AdminMobile.js
// Theme-übergreifende Mobile-Fixes für das Admin-Dashboard.
// Wird einmal in AdminShell gerendert und greift über die Klasse `.si-admin`
// auf den Root-Container (DashboardContainer / LoginContainer) zu.
//
// Bewusst NICHT in den 8 Theme-Style-Dateien dupliziert – ein zentraler Ort,
// damit jeder Editor automatisch profitiert.

import styled, { createGlobalStyle } from 'styled-components';

export const AdminMobileStyles = createGlobalStyle`
  /* --------------------------------------------------------------
     1) iOS-Zoom verhindern.
     Safari auf iPhone zoomt das Viewport rein, sobald ein Feld mit
     font-size < 16px fokussiert wird. Praktisch alle Editor-Felder
     liegen bei 0.8–0.95rem -> bei jedem Tippen würde reingezoomt.
     16px ist die Schwelle; nur auf Touch-/kleinen Screens erzwungen,
     damit das Desktop-Sizing der Themes unverändert bleibt.
     !important schlägt auch Inline-Styles in einzelnen Editoren.
  ----------------------------------------------------------------- */
  @media (max-width: 768px) {
    .si-admin input:not([type='checkbox']):not([type='radio']):not([type='range']),
    .si-admin textarea,
    .si-admin select {
      font-size: 16px !important;
    }
  }

  /* --------------------------------------------------------------
     2) Kein horizontales Auslaufen.
     Editoren dürfen die Seite auf dem Handy nie nach links/rechts
     schieben. Medien + Tabellen auf Containerbreite begrenzen,
     lange E-Mails/URLs umbrechen statt scrollen.
  ----------------------------------------------------------------- */
  .si-admin {
    overflow-x: hidden;
  }
  .si-admin img,
  .si-admin video,
  .si-admin canvas,
  .si-admin table,
  .si-admin pre {
    max-width: 100%;
  }
  .si-admin td,
  .si-admin a,
  .si-admin p,
  .si-admin h1,
  .si-admin h2,
  .si-admin h3 {
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* --------------------------------------------------------------
     3) Body einfrieren, solange das Slide-in-Menü offen ist.
     Verhindert das "Durchscrollen" der Seite hinter dem Menü.
  ----------------------------------------------------------------- */
  body.si-admin-menu-open {
    overflow: hidden;
    touch-action: none;
  }
`;

// Halbtransparenter Hintergrund hinter dem aufgeklappten Mobil-Menü.
// z-index 99 -> liegt unter Sidebar (100) und Toggle (101).
// Tap schließt das Menü.
export const SidebarBackdrop = styled.div`
  display: none;

  @media (max-width: 968px) {
    display: ${p => (p.$open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.5);
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    animation: si-admin-backdrop-in 0.2s ease;
  }

  @keyframes si-admin-backdrop-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
