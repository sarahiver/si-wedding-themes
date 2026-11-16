// src/lib/i18n.js
// Mehrsprachigkeit als Opt-in je Projekt (projects.features.i18n).
//
// Projekte ohne Sprachen bleiben einsprachig: languages = [] und alle
// Funktionen hier geben die Inhalte unverändert zurück.
//
// Speicherung der Übersetzungen: im JSON des jeweiligen Bereichs unter `i18n`,
//   { title: 'Schedule', events: [{ time: '15:00', title: 'Ceremony' }],
//     i18n: { de: { title: 'Ablauf', events: [{ title: 'Trauung' }] } } }
// Die Felder des Bereichs selbst sind die Hauptsprache. Sprachneutrale Angaben
// (Uhrzeiten, Bilder, Adressen) stehen nur einmal dort.
import { useSyncExternalStore, useCallback, useEffect } from 'react';
import { useWedding } from '../context/WeddingContext';

export const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr'];
export const LANGUAGE_LABELS = { en: 'ENG', tr: 'TR', de: 'DE', fr: 'FR' };
export const LANGUAGE_NAMES = { en: 'English', tr: 'Türkçe', de: 'Deutsch', fr: 'Français' };

/** Sprachen eines Projekts: { languages: string[], master: string|null } */
export function projectLanguages(project) {
  const i18n = project && project.features && typeof project.features === 'object' ? project.features.i18n : null;
  const raw = i18n && Array.isArray(i18n.languages) ? i18n.languages : [];
  const languages = [...new Set(raw.filter((l) => SUPPORTED_LANGUAGES.includes(l)))];
  const master = languages.includes(i18n && i18n.default) ? i18n.default : (languages.includes('en') ? 'en' : languages[0] || null);
  return { languages, master };
}

/**
 * Sprache beim Öffnen: gespeicherte Wahl → Gerätesprache → Englisch → Hauptsprache.
 * Regionale Varianten (de-DE, fr-FR, tr-TR) zählen als ihre Grundsprache.
 */
export function pickLanguage({ languages, master, stored, preferred }) {
  if (!languages || languages.length === 0) return null;
  if (stored && languages.includes(stored)) return stored;
  for (const p of preferred || []) {
    const base = String(p || '').toLowerCase().split('-')[0];
    if (languages.includes(base)) return base;
  }
  if (languages.includes('en')) return 'en';
  return master || languages[0];
}

const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
// Leerer oder nur aus Leerzeichen bestehender Text gilt als „nicht übersetzt"
const isBlank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

function overlay(base, tr) {
  if (isBlank(tr)) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(tr)) return base;
    // Listen folgen der Hauptsprache: Anzahl und Reihenfolge bleiben, je Eintrag wird überlagert
    return base.map((item, i) => overlay(item, tr[i]));
  }
  if (isPlain(base)) {
    if (!isPlain(tr)) return base;
    const out = { ...base };
    for (const k of Object.keys(tr)) {
      if (k === 'i18n') continue;
      out[k] = k in base ? overlay(base[k], tr[k]) : (isBlank(tr[k]) ? base[k] : tr[k]);
    }
    return out;
  }
  // Nur Texte werden übersetzt; Zahlen, Schalter und Bilder bleiben sprachneutral
  if (typeof base === 'string' || base === undefined || base === null) return typeof tr === 'string' ? tr : base;
  return base;
}

/** Inhalt eines Bereichs in der gewählten Sprache; fehlende Texte kommen aus der Hauptsprache. */
export function localizeContent(content, lang, master) {
  if (!isPlain(content)) return content || {};
  const { i18n, ...base } = content;
  if (!lang || lang === master || !isPlain(i18n) || !isPlain(i18n[lang])) return base;
  return overlay(base, i18n[lang]);
}

// ---- gewählte Sprache je Projekt (ohne Provider, für alle Bereiche einer Seite gleich) ----
const chosen = new Map();
const listeners = new Set();
const storageKey = (slug) => `si_lang_${slug}`;
const readStored = (slug) => { try { return localStorage.getItem(storageKey(slug)); } catch { return null; } };
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function setLanguage(slug, lang) {
  chosen.set(slug, lang);
  try { localStorage.setItem(storageKey(slug), lang); } catch { /* Speicher gesperrt */ }
  listeners.forEach((fn) => fn());
}

function currentLanguage(slug, languages, master) {
  if (!languages.length) return null;
  if (chosen.has(slug) && languages.includes(chosen.get(slug))) return chosen.get(slug);
  const preferred = typeof navigator !== 'undefined' ? (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) : [];
  // Gerätesprache nur vorschlagen, nicht speichern: gespeichert wird erst die bewusste Wahl
  const lang = pickLanguage({ languages, master, stored: readStored(slug), preferred });
  chosen.set(slug, lang);
  return lang;
}

/**
 * Sprache der Seite. Einsprachige Projekte: enabled = false, lang = null.
 * t(dict, key, vars) liest feste Texte aus einem Wörterbuch { en: {...}, de: {...} }.
 */
export function useLanguage() {
  const { project, slug } = useWedding();
  const { languages, master } = projectLanguages(project);
  const key = slug || 'default';
  const lang = useSyncExternalStore(subscribe, () => currentLanguage(key, languages, master), () => master);
  const enabled = languages.length > 0;

  useEffect(() => {
    if (enabled && lang && typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [enabled, lang]);

  const setLang = useCallback((l) => { if (languages.includes(l)) setLanguage(key, l); }, [key, languages]);
  const t = useCallback((dict, k, vars) => {
    const table = (lang && dict[lang]) || {};
    const fallback = dict[master] || dict.en || dict.de || {};
    let s = table[k];
    if (isBlank(s)) s = fallback[k];
    if (isBlank(s)) s = (dict.en || {})[k];
    if (isBlank(s)) return '';
    return vars ? String(s).replace(/\{(\w+)\}/g, (_, v) => (vars[v] ?? '')) : s;
  }, [lang, master]);

  return { enabled, lang, master, languages, setLang, t };
}

/** Inhalt eines Bereichs in der aktuellen Sprache. */
export function useLocalizedContent(component) {
  const { content } = useWedding();
  const { lang, master } = useLanguage();
  return localizeContent(content ? content[component] : null, lang, master);
}
