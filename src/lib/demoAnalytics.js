// src/lib/demoAnalytics.js
// GA4 NUR für Demo-Seiten (isDemo in App.js) — Kundenseiten werden NICHT getrackt.
// Gleiche Property wie sarahiver.com (Cross-Domain-Funnel).
//
// Seit Nov 2026: GA wird erst NACH Einwilligung geladen (Consent Mode "basic").
// Vorher lud es sofort im Modus analytics_storage: 'denied' und schickte
// cookielose Pings. Zwei Folgen:
//   1. GA4-Anfragen ohne Einwilligung — widerspricht der Datenschutzvorgabe.
//   2. Der page_view ging beim Laden (ohne Einwilligung) raus und wurde nach
//      "Einverstanden" NICHT nachgeholt. Erstbesucher einer Demo tauchten in
//      GA4 deshalb nie als Demo-Besuch auf — nur ihre späteren Events.
// Jetzt sendet der config-Aufruf beim Start den page_view, und der Start
// passiert erst mit Einwilligung (gespeichert oder per Klick).
const GA_MEASUREMENT_ID = 'G-G9DKBTJRJJ';

export const CONSENT_KEY = 'si_demo_cookie_consent';

export const getDemoConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null
  } catch {
    return null;
  }
};

export const setDemoConsent = (value) => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* localStorage nicht verfügbar */
  }
};

// Startet GA genau einmal — nur mit gespeicherter Einwilligung.
export const initDemoConsentMode = () => {
  if (typeof window === 'undefined') return;
  if (getDemoConsent() !== 'accepted') return; // ohne Einwilligung: nichts laden
  if (window.__siDemoGaInit) return; // bereits gestartet
  window.__siDemoGaInit = true;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  if (!document.querySelector(`script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // Reihenfolge wichtig: consent → js → config
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('set', 'ads_data_redaction', true);
  window['ga-disable-' + GA_MEASUREMENT_ID] = false;

  window.gtag('js', new Date());
  // config sendet den page_view (page_location enthält ?src=… von sarahiver.com)
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
    send_page_view: true,
  });
};

// Bei "Einverstanden": Einwilligung ist schon gespeichert (DemoOverlay) → starten.
// War GA bereits aktiv (Widerruf und erneute Zustimmung), nur wieder freigeben.
export const loadDemoAnalytics = () => {
  if (typeof window === 'undefined') return;
  if (!window.__siDemoGaInit) {
    initDemoConsentMode();
    return;
  }
  window['ga-disable-' + GA_MEASUREMENT_ID] = false;
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
};

// Bei "Nur nötige": GA stummschalten (keine weiteren Anfragen) und
// vorhandene GA-Cookies aufräumen. Wurde GA nie geladen, gibt es nichts zu tun.
export const removeDemoAnalytics = () => {
  if (typeof window === 'undefined') return;
  window['ga-disable-' + GA_MEASUREMENT_ID] = true;
  if (window.__siDemoGaInit && window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
};

// Events von der Demo-Seite: nur mit Einwilligung (vorher feuerte z. B. der
// CTA-Klick auch ohne Einwilligung als cookieloser Ping).
export const trackDemoEvent = (name, params = {}) => {
  if (typeof window === 'undefined') return;
  if (!window.__siDemoGaInit || typeof window.gtag !== 'function') return;
  if (window['ga-disable-' + GA_MEASUREMENT_ID]) return;
  window.gtag('event', name, params);
};
