// src/lib/customDomain.js
// Ordnet eine Custom Domain dem passenden Projekt zu.
//
// Ohne diese Auflösung landet hannahleon-hochzeit.de auf der Landingpage,
// weil die App den Slug bisher ausschließlich aus dem Pfad liest.
//
// Ablauf:
//   www.hannahleon-hochzeit.de  →  Supabase: projects.custom_domain
//                               →  slug "hannah-leon"
//                               →  App rendert wie /hannah-leon
//
// Die bestehenden Slug-URLs bleiben unberührt: Läuft die Seite unter
// siwedding.de, greift diese Datei gar nicht erst.
import { getProjectBySlugOrDomain } from './supabase';

// Eigene Domains der Plattform — hier soll NICHT aufgelöst werden.
const PLATFORM_HOSTS = [
  'siwedding.de',
  'si-wedding-themes.vercel.app',
  'localhost',
];

// Vergleichsform: ohne www., ohne Port, klein geschrieben.
// Nötig, weil im SuperAdmin "hannahleon-hochzeit.de" steht, Vercel aber auf
// "www.hannahleon-hochzeit.de" weiterleitet.
export function normalizeHost(host) {
  return String(host || '')
    .toLowerCase()
    .replace(/:\d+$/, '')
    .replace(/^www\./, '');
}

export function isPlatformHost(host = window.location.hostname) {
  const h = normalizeHost(host);
  return PLATFORM_HOSTS.some(p => h === p || h.endsWith(`.${p}`));
}

// Gibt den Slug zurück oder null. null heißt: normale Slug-Route verwenden.
export async function resolveSlugFromHost(host = window.location.hostname) {
  if (isPlatformHost(host)) return null;

  const h = normalizeHost(host);

  // Die Backend-Funktion sucht bereits nach Slug UND custom_domain.
  // Beide Schreibweisen probieren: im SuperAdmin steht die Domain ohne
  // "www.", Vercel leitet aber auf "www." um.
  for (const candidate of [h, `www.${h}`]) {
    const { data } = await getProjectBySlugOrDomain(candidate);
    if (data?.slug) return data.slug;
  }
  return null;
}
