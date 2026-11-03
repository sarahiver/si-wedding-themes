// Tests für Demo-Tracking (Audit Nov 2026)
import { designIdFor, contactUrlFor } from '../../components/shared/DemoOverlay';

const GA = 'G-G9DKBTJRJJ';
const fresh = () => { let m; jest.isolateModules(() => { m = require('../demoAnalytics'); }); return m; };
const cmds = () => (window.dataLayer || []).map((a) => Array.from(a));

beforeEach(() => {
  localStorage.clear();
  document.head.innerHTML = '';
  delete window.gtag; delete window.dataLayer; delete window.__siDemoGaInit;
  delete window[`ga-disable-${GA}`];
});

test('ohne Einwilligung: kein GA, keine Events', () => {
  const m = fresh();
  m.initDemoConsentMode();
  m.trackDemoEvent('demo_overlay_cta', { demo: 'classic' });
  expect(document.querySelector('script[src*="gtag/js"]')).toBeNull();
  expect(window.dataLayer).toBeUndefined();
});

test('nach Einwilligung: config (= page_view) wird gesendet', () => {
  const m = fresh();
  m.setDemoConsent('accepted');
  m.loadDemoAnalytics();
  const c = cmds();
  expect(c[0][0]).toBe('consent');
  expect(c[0][2].analytics_storage).toBe('granted');
  const cfg = c.filter((x) => x[0] === 'config' && x[1] === GA);
  expect(cfg).toHaveLength(1);
  expect(cfg[0][2].send_page_view).toBe(true);
  m.trackDemoEvent('demo_overlay_cta', { demo: 'classic' });
  expect(cmds().find((x) => x[1] === 'demo_overlay_cta')[2].demo).toBe('classic');
});

test('Ablehnen: stummgeschaltet', () => {
  const m = fresh();
  m.setDemoConsent('accepted'); m.loadDemoAnalytics();
  m.removeDemoAnalytics();
  const n = cmds().length;
  m.trackDemoEvent('demo_overlay_cta', {});
  expect(cmds().length).toBe(n);
});

test('CTA-Ziel enthält das Design in der Form, die das Formular kennt', () => {
  expect(designIdFor('parallax')).toBe('modern');
  expect(designIdFor('Classic')).toBe('classic');
  expect(contactUrlFor('editorial')).toBe('https://www.sarahiver.com/#contact?theme=editorial');
  expect(contactUrlFor('')).toBe('https://www.sarahiver.com/#contact');
});
