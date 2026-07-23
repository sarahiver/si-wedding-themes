// src/components/shared/DemoOverlay.js
// Overlay für Demo-Seiten: kennzeichnet die Seite als Demo und führt
// per CTA zum Kontaktformular auf sarahiver.com.
// Wird angezeigt wenn: status === 'demo' (SuperAdmin) ODER der Slug "demo" enthält.
// Minimierbar (nicht schließbar) — die Kennzeichnung soll bestehen bleiben.
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDemoConsent, setDemoConsent, loadDemoAnalytics, removeDemoAnalytics } from '../../lib/demoAnalytics';

const CONTACT_URL = 'https://www.sarahiver.com/#contact';

const Bar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.7rem 1rem calc(0.7rem + env(safe-area-inset-bottom, 0px));
  background: rgba(15, 15, 15, 0.96);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-family: 'Josefin Sans', -apple-system, sans-serif;
  transform: translateY(${p => (p.$minimized ? '110%' : '0')});
  transition: transform 0.3s ease;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0.6rem 0.8rem calc(0.6rem + env(safe-area-inset-bottom, 0px));
  }
`;

const Badge = styled.span`
  flex-shrink: 0;
  background: #c41e3a;
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
`;

const Text = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.82rem;
  font-weight: 300;
  letter-spacing: 0.02em;

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }

  @media (max-width: 420px) {
    display: none;
  }
`;

const CTA = styled.a`
  flex-shrink: 0;
  display: inline-block;
  background: #fdfcfa;
  color: #1a1a1a;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 3px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const MinimizeBtn = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  line-height: 1;

  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    color: #ffffff;
  }
`;

const RestorePill = styled.button`
  position: fixed;
  right: 14px;
  bottom: calc(14px + env(safe-area-inset-bottom, 0px));
  z-index: 99999;
  display: ${p => (p.$visible ? 'inline-flex' : 'none')};
  align-items: center;
  gap: 0.5rem;
  background: rgba(15, 15, 15, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-family: 'Josefin Sans', -apple-system, sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.55rem 0.9rem;
  border-radius: 99px;
  cursor: pointer;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #c41e3a;
  }
`;

const ConsentRow = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem calc(0.7rem + env(safe-area-inset-bottom, 0px));
  background: #0f0f0f;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font-family: 'Josefin Sans', -apple-system, sans-serif;
`;

const ConsentText = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.75rem;
  font-weight: 300;

  a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: underline;
  }
`;

const ConsentBtn = styled.button`
  background: ${p => (p.$primary ? '#fdfcfa' : 'transparent')};
  color: ${p => (p.$primary ? '#1a1a1a' : 'rgba(255,255,255,0.8)')};
  border: 1px solid ${p => (p.$primary ? '#fdfcfa' : 'rgba(255,255,255,0.35)')};
  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.45rem 0.9rem;
  border-radius: 3px;
  cursor: pointer;
`;

const DemoOverlay = ({ theme, slug }) => {
  const [minimized, setMinimized] = useState(false);
  const [consent, setConsent] = useState(() => getDemoConsent());

  // Wiederkehrende Besucher mit bestehender Einwilligung: GA direkt laden
  useEffect(() => {
    if (consent === 'accepted') {
      loadDemoAnalytics();
    }
  }, [consent]);

  const handleAccept = () => {
    setDemoConsent('accepted');
    setConsent('accepted');
  };

  const handleDecline = () => {
    setDemoConsent('declined');
    setConsent('declined');
    removeDemoAnalytics();
  };

  const handleCTAClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'demo_overlay_cta', {
        event_category: 'engagement',
        event_label: theme || slug || 'unknown',
        demo_slug: slug,
      });
    }
  };

  if (consent === null) {
    return (
      <ConsentRow role="dialog" aria-label="Cookie-Einwilligung für Demo-Statistik">
        <ConsentText>
          Diese Demo nutzt anonyme Statistik (Google Analytics), um zu verstehen, welche Designs euch gefallen.{' '}
          <a href="https://www.sarahiver.com/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz</a>
        </ConsentText>
        <ConsentBtn onClick={handleDecline}>Nur nötige</ConsentBtn>
        <ConsentBtn $primary onClick={handleAccept}>Einverstanden</ConsentBtn>
      </ConsentRow>
    );
  }

  return (
    <>
      <Bar $minimized={minimized} role="complementary" aria-label="Demo-Hinweis">
        <Badge>Demo</Badge>
        <Text>So könnte eure Hochzeitswebsite aussehen — voll funktionsfähig, live klickbar.</Text>
        <CTA href={CONTACT_URL} onClick={handleCTAClick}>
          Unverbindlich anfragen
        </CTA>
        <MinimizeBtn
          onClick={() => setMinimized(true)}
          aria-label="Demo-Hinweis minimieren"
          title="Minimieren"
        >
          ✕
        </MinimizeBtn>
      </Bar>
      <RestorePill
        $visible={minimized}
        onClick={() => setMinimized(false)}
        aria-label="Demo-Hinweis wieder anzeigen"
      >
        <span />
        Demo · Anfragen
      </RestorePill>
    </>
  );
};

export default DemoOverlay;
