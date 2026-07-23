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

export const loadDemoAnalytics = () => {
  if (typeof window === 'undefined') return;
  if (window.gtag) return; // bereits geladen

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
    send_page_view: true,
  });
};

export const removeDemoAnalytics = () => {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
};
