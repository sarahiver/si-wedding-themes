// src/lib/calendar.js
// Zeitzonenfeste Termine: Countdown-Ziel und Kalenderdatei (ICS).
// Die Hochzeit hat eine feste Ortszeit (z. B. 15:00 Uhr in Europe/Paris) –
// unabhängig davon, in welcher Zeitzone das Gerät des Gasts steht.

/** Abstand der Zeitzone zu UTC in Millisekunden zu einem Zeitpunkt. */
export function tzOffsetMs(utcMs, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const v = {}; parts.forEach((p) => { v[p.type] = p.value; });
  const asUtc = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute, +v.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Ortszeit (Datum 'YYYY-MM-DD', Uhrzeit 'HH:MM') → Zeitpunkt in UTC-Millisekunden. */
export function zonedToUtcMs(date, time, timeZone) {
  const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date || ''));
  if (!d) return null;
  const t = /^(\d{1,2}):(\d{2})/.exec(String(time || '')) || [null, '0', '0'];
  const guess = Date.UTC(+d[1], +d[2] - 1, +d[3], +t[1], +t[2], 0);
  try {
    // zwei Schritte: der Abstand kann sich an Umstellungstagen ändern
    const first = guess - tzOffsetMs(guess, timeZone);
    return guess - tzOffsetMs(first, timeZone);
  } catch {
    return guess;
  }
}

/** Restzeit bis zum Ziel; nach dem Termin überall 0, nie negativ. */
export function remaining(targetMs, nowMs = Date.now()) {
  const diff = targetMs == null ? 0 : Math.max(0, targetMs - nowMs);
  return {
    total: diff,
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
    seconds: Math.floor((diff % 6e4) / 1e3),
    past: targetMs != null && diff === 0,
  };
}

/** Monatsblatt, Woche beginnt am Montag. Leere Felder sind null. */
export function monthGrid(year, month /* 1–12 */) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 = Sonntag
  const lead = (first + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return cells;
}

const pad = (n) => String(n).padStart(2, '0');
const icsText = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');
const utcStamp = (ms) => { const d = new Date(ms); return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`; };
// Zeilen über 75 Zeichen umbrechen (RFC 5545)
const fold = (line) => { const out = []; let rest = line; while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = ' ' + rest.slice(74); } out.push(rest); return out.join('\r\n'); };

/**
 * Kalenderdatei für einen Termin. Beginn und Ende als UTC-Zeitpunkte:
 * das ist eindeutig und wird von jedem Kalender in die Zeitzone des Geräts umgerechnet.
 * @returns {string|null} null, wenn kein gültiger Beginn vorliegt
 */
export function buildIcs({ uid, title, startMs, endMs, location, description, url, nowMs = Date.now() }) {
  if (startMs == null || Number.isNaN(startMs)) return null;
  const end = endMs != null && endMs > startMs ? endMs : startMs + 60 * 60 * 1000;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//S&I.//Wedding//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${icsText(uid || `${startMs}@siwedding.de`)}`,
    `DTSTAMP:${utcStamp(nowMs)}`,
    `DTSTART:${utcStamp(startMs)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${icsText(title)}`,
    location ? `LOCATION:${icsText(location)}` : null,
    description ? `DESCRIPTION:${icsText(description)}` : null,
    url ? `URL:${icsText(url)}` : null,
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean);
  return lines.map(fold).join('\r\n') + '\r\n';
}

/**
 * Beginn und Ende aus den Angaben des Countdown-Bereichs.
 * Ohne Endzeit: 02:00 Uhr am Folgetag (im Dashboard änderbar).
 */
export function eventTimes({ date, time, endDate, endTime, timeZone = 'Europe/Paris' }) {
  const startMs = zonedToUtcMs(date, time || '00:00', timeZone);
  if (startMs == null) return { startMs: null, endMs: null };
  let eDate = endDate;
  const eTime = endTime || '02:00';
  if (!eDate) {
    const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    const startMinutes = (() => { const t = /^(\d{1,2}):(\d{2})/.exec(time || '00:00'); return +t[1] * 60 + +t[2]; })();
    const endMinutes = (() => { const t = /^(\d{1,2}):(\d{2})/.exec(eTime); return +t[1] * 60 + +t[2]; })();
    const next = new Date(Date.UTC(+d[1], +d[2] - 1, +d[3] + (endMinutes <= startMinutes ? 1 : 0)));
    eDate = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
  }
  return { startMs, endMs: zonedToUtcMs(eDate, eTime, timeZone) };
}

/** Datei im Browser speichern (öffnet auf dem Handy den Kalender). */
export function downloadIcs(ics, filename = 'hochzeit.ics') {
  if (!ics || typeof document === 'undefined') return false;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href; a.download = filename; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
  return true;
}
