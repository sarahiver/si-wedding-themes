// src/lib/demoAnalytics.js
// GA4 NUR für Demo-Seiten (isDemo in App.js) — Kundenseiten werden NICHT getrackt.
// Gleiche Property wie sarahiver.com (Cross-Domain-Funnel), Laden erst nach
// Einwilligung über das DemoOverlay. Muster übernommen aus si-marketing.
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

// Consent Mode v2: GA lädt auf Demo-Seiten SOFORT (Aufruf im DemoOverlay-Mount),
// aber mit analytics_storage: 'denied' als Default. Ohne Einwilligung sendet GA
// nur cookielose, anonyme Pings — DSGVO-konform, aber im Funnel zählbar.
// url_passthrough hält den Cross-Domain-Linker (_gl) von sarahiver.com am Leben.
export const initDemoConsentMode = () => {
  if (typeof window === 'undefined') return;
  if (window.gtag) return; // bereits initialisiert

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  // MUSS vor js/config stehen: Default = alles verweigert
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('set', 'url_passthrough', true);
  window.gtag('set', 'ads_data_redaction', true);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
    send_page_view: true,
  });

  // Bestehende Einwilligung aus früherem Besuch direkt anwenden
  if (getDemoConsent() === 'accepted') {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
  }
};

// Bei "Einverstanden": auf volles Tracking hochstufen
export const loadDemoAnalytics = () => {
  if (typeof window === 'undefined') return;
  if (!window.gtag) initDemoConsentMode();
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
};

// Bei "Nur nötige": Consent auf denied (cookielose Pings laufen weiter —
// genau das erlaubt Consent Mode v2), vorhandene GA-Cookies aufräumen.
// Kein ga-disable mehr: das würde auch die erlaubten anonymen Pings stoppen.
export const removeDemoAnalytics = () => {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
};
