/**
 * Trauzeugen (Witnesses) — geteilte Typen, Config und Helfer.
 *
 * Use-Case: Ansprechpartner für den Hochzeitstag (Trauzeugen, Orga/Eltern).
 * Pro Person: Name, Rolle, optional Foto, Kontaktwege (Telefon/E-Mail/
 * WhatsApp) und optional ein persönlicher Satz (intro, NUR Variante C).
 *
 * ⚠ SPAM-SCHUTZ (KRITISCH):
 * Telefon/E-Mail/WhatsApp dürfen NIE als Klartext oder tel:/mailto:-Links
 * im gerenderten HTML stehen. Sie werden SERVERSEITIG base64-kodiert
 * (encodeContact, via Buffer — btoa ist im SSR nicht verfügbar) und liegen
 * nur im data-c-Attribut. Erst der Klick-Handler dekodiert (client, atob)
 * und löst die Aktion aus. Bots sehen nur "Anrufen", keine Adresse.
 *
 * content-Schema:
 *   eyebrow?, title?, description?  (Texte; title mit em-Tags)
 *   persons?: Person[]
 */

export interface Person {
  id: string;
  name: string;
  role: string;
  photo?: string | null;
  phone?: string;
  email?: string;
  whatsapp?: string;
  intro?: string; // nur Variante C
}

export interface WitnessesContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  persons?: Person[];
}

export const WITNESSES_DEFAULTS = {
  eyebrow: 'Für den großen Tag',
  title: 'Unsere <em>Trauzeugen</em>',
  description:
    'Ihr habt Fragen zur Überraschung, zur Orga oder einfach so? Wendet euch jederzeit an unsere Trauzeugen — sie helfen euch gern weiter.',
} as const;

export function readPersons(content: Record<string, unknown>): Person[] {
  const raw = content.persons;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (p): p is Person =>
        typeof p === 'object' && p !== null && typeof (p as Person).name === 'string',
    )
    .map((p, i) => ({
      id: typeof p.id === 'string' && p.id ? p.id : `p${i + 1}`,
      name: p.name,
      role: typeof p.role === 'string' ? p.role : '',
      photo: typeof p.photo === 'string' ? p.photo : null,
      phone: typeof p.phone === 'string' ? p.phone : '',
      email: typeof p.email === 'string' ? p.email : '',
      whatsapp: typeof p.whatsapp === 'string' ? p.whatsapp : '',
      intro: typeof p.intro === 'string' ? p.intro : '',
    }));
}

export function renderTitleWithEm(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return escaped.replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
}

/** Initialen (2 Buchstaben) für den Foto-Platzhalter. */
export function initialsOf(name: string): string {
  return (
    String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('') || '–'
  );
}

/**
 * SERVERSEITIGE base64-Kodierung (UTF-8-safe). Läuft beim SSR-Render, sodass
 * im ausgelieferten HTML nur der kodierte Wert in data-c steht. Nutzt Buffer
 * (Node), mit btoa-Fallback falls doch im Browser ausgeführt.
 */
export function encodeContact(value: string): string {
  if (!value) return '';
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf-8').toString('base64');
  }
  // Fallback (Browser): UTF-8 → Latin1 → base64
  return btoa(unescape(encodeURIComponent(value)));
}

export type ContactKind = 'tel' | 'mail' | 'wa';

export interface ContactDef {
  kind: ContactKind;
  encoded: string;
  label: string;
  revealLabel: string;
  ariaLabel: string;
}

/** Baut die (kodierte) Kontakt-Definition-Liste für eine Person. */
export function buildContacts(p: Person): ContactDef[] {
  const out: ContactDef[] = [];
  if (p.phone) {
    out.push({
      kind: 'tel',
      encoded: encodeContact(p.phone),
      label: 'Anrufen',
      revealLabel: 'Telefon wird geöffnet …',
      ariaLabel: 'Anrufen',
    });
  }
  if (p.email) {
    out.push({
      kind: 'mail',
      encoded: encodeContact(p.email),
      label: 'E-Mail',
      revealLabel: 'E-Mail wird geöffnet …',
      ariaLabel: 'E-Mail',
    });
  }
  if (p.whatsapp) {
    out.push({
      kind: 'wa',
      encoded: encodeContact(p.whatsapp),
      label: 'WhatsApp',
      revealLabel: 'WhatsApp wird geöffnet …',
      ariaLabel: 'WhatsApp',
    });
  }
  return out;
}
