// src/themes/cassis/Countdown.js – Countdown als Kalenderblatt, mit „Im Kalender speichern"
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { zonedToUtcMs, remaining, monthGrid, eventTimes, buildIcs, downloadIcs } from '../../lib/calendar';
import STRINGS, { LOCALES } from './strings';
import { C, FONT, SERIF, Section, DESK, G, italic, reveal, useReveal } from './shared';
import { formatTimeLeft, OWN_TITLE } from './helpers';

// Die Zahl der Tage steht als große, helle Fläche; das Kalenderblatt liegt darauf.
// Darunter laufen Stunden, Minuten und Sekunden – die Tage stehen schon groß darüber,
// das Datum zeigt das Kalenderblatt.
const Layout = styled.div`
  ${DESK} { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: end; }
`;
const Num = styled.strong`
  display: block; font-family: ${SERIF}; font-weight: 300; font-size: 58vw; line-height: 0.72; letter-spacing: -0.04em; color: ${C.haze}; margin-left: -0.05em;
  font-variant-numeric: lining-nums; user-select: none; white-space: nowrap;
  &[data-clock='true'] { font-size: 34vw; }
  ${DESK} { grid-column: 1 / 9; grid-row: 1; font-size: 39vw; margin-left: -0.06em; &[data-clock='true'] { font-size: 24vw; } }
  ${reveal}
  &[data-reveal='armed'] { transform: translateX(-3vw); }
  &[data-reveal='in'] { transition: opacity 1s ease, transform 1.1s cubic-bezier(.2,.6,.2,1); }
`;
const Label = styled.div`
  margin: 1.25rem 0 2.5rem;
  p { margin: 0; ${italic} }
  p.count { font-family: ${FONT}; font-style: normal; font-size: 1.125rem; line-height: 1.6; font-variant-numeric: tabular-nums; }
  /* Nur für Screenreader: die tickende Zeile würde sonst jede Sekunde neu vorgelesen */
  .sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  ${DESK} { grid-column: 1 / 6; grid-row: 2; margin: 2.25rem 0 0; }
`;
const Save = styled.button`
  display: inline-flex; align-items: center; min-height: 2.75rem; margin-top: 0.5rem; padding: 0; border: 0; background: none; cursor: pointer;
  color: ${C.ink}; font-family: ${FONT}; font-size: 1rem; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.3em;
  &:hover { text-decoration-thickness: 2px; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
`;
const Sheet = styled.div`
  position: relative; z-index: 2; min-width: 0; background: ${C.pearl}; padding: 1.5rem 1.25rem; margin: 0 calc(${G} * -1 + 0.75rem) -1rem ${G};
  box-shadow: 0 30px 60px -30px rgba(63,66,79,0.35);
  ${DESK} { grid-column: 7 / 13; grid-row: 1 / 3; align-self: end; margin: 0 0 -2rem; padding: clamp(1.5rem, 3.4vw, 3.5rem); }
  ${reveal}
  &[data-reveal='in'] { transition-delay: 0.18s; }
`;
const Month = styled.h2`
  margin: 0 0 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid ${C.ink};
  font-family: ${SERIF}; font-weight: 400; font-size: clamp(2rem, 3.4vw, 3.75rem); line-height: 1; text-transform: capitalize; font-variant-numeric: lining-nums;
`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center;`;
const Weekday = styled.div`font-size: 0.8125rem; color: ${C.inkSoft}; padding-bottom: 0.75rem; text-transform: capitalize;`;
const Day = styled.div`
  position: relative; height: clamp(2.5rem, 4.6vw, 5rem); display: flex; align-items: center; justify-content: center;
  font-weight: 300; font-size: clamp(1.0625rem, 1.7vw, 1.875rem); font-variant-numeric: tabular-nums;
  svg { position: absolute; left: 50%; top: 50%; width: 150%; max-width: 7rem; height: 90%; transform: translate(-50%, -50%) rotate(-6deg); }
  span { position: relative; }
`;

function weekdayNames(lang) {
  const f = new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { weekday: 'short', timeZone: 'UTC' });
  // 5. Januar 2026 ist ein Montag
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2026, 0, 5 + i))).replace('.', ''));
}

function Countdown() {
  const { project, coupleNames, weddingDate, slug } = useWedding();
  const { lang, t } = useLanguage();
  const cd = useLocalizedContent('countdown', OWN_TITLE);
  const directions = useLocalizedContent('directions');
  const date = cd.target_date || weddingDate;
  const target = zonedToUtcMs(date, cd.target_time || '00:00', cd.timezone || 'Europe/Paris');

  // Erst nach dem Laden rechnen: die Uhr des Geräts steht nur im Browser fest
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const numRef = useReveal();
  const sheetRef = useReveal();
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date || ''));
  if (!m) return null;
  const [year, month, day] = [+m[1], +m[2], +m[3]];
  const cells = monthGrid(year, month);
  const monthLabel = new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, 1, 12)));
  const left = now === null ? null : remaining(target, now);

  const saveToCalendar = () => {
    const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
    const label = names.length ? names.join(' ') : (coupleNames || '');
    const { startMs, endMs } = eventTimes({ date, time: cd.target_time, endDate: cd.end_date, endTime: cd.end_time, timeZone: cd.timezone || 'Europe/Paris' });
    const ics = buildIcs({
      uid: `${slug || 'wedding'}@siwedding.de`, title: `${t(STRINGS, 'weMarry')}: ${label}`, startMs, endMs,
      location: [project?.location, String(directions.address || '').replace(/\n/g, ', ')].filter(Boolean).join(', '),
      url: typeof window !== 'undefined' ? window.location.href.split('#')[0] : '',
    });
    downloadIcs(ics, `${slug || 'wedding'}.ics`);
  };

  // Große Zahl (Schmuck) und derselbe Stand als lesbarer Satz
  let big = null; let line = null; let spoken = null;
  if (left) {
    if (left.past) line = t(STRINGS, 'past');
    else if (left.days === 0) { big = `${left.hours}:${String(left.minutes).padStart(2, '0')}`; line = t(STRINGS, 'today'); }
    else { big = String(left.days); line = formatTimeLeft(left, lang); spoken = t(STRINGS, 'timeLeft', { time: formatTimeLeft(left, lang, ['days', 'hours', 'minutes']) }); }
  }

  return (
    <Section id="countdown" $tone="shell" aria-label={cd.title || t(STRINGS, 'countdownTitle')}>
      <Layout>
        <Num ref={numRef} aria-hidden="true" data-clock={left && left.days === 0 && !left.past ? 'true' : undefined}>{big}</Num>
        <Label>
          {spoken
            ? <p className="count"><span aria-hidden="true">{line}</span><span className="sr">{spoken}</span></p>
            : <p className="count" aria-live="polite">{line}</p>}
          {!(left && left.past) && <Save type="button" onClick={saveToCalendar}>{t(STRINGS, 'calendar')}</Save>}
        </Label>
        <Sheet ref={sheetRef}>
          <Month>{monthLabel}</Month>
          <Grid aria-hidden="true">{weekdayNames(lang).map((w) => <Weekday key={w}>{w}</Weekday>)}</Grid>
          <Grid role="img" aria-label={`${monthLabel}: ${day}`}>
            {cells.map((d, i) => (
              <Day key={i} data-wedding-day={d === day ? 'true' : undefined}>
                {d === day && (
                  <svg viewBox="0 0 100 60" fill="none" stroke={C.ink} strokeWidth="1.5" aria-hidden="true">
                    <path d="M52 6 C24 4 6 16 7 31 C8 47 30 56 54 54 C78 52 95 41 93 27 C91 13 70 5 44 8" />
                  </svg>
                )}
                <span>{d || ''}</span>
              </Day>
            ))}
          </Grid>
        </Sheet>
      </Layout>
    </Section>
  );
}
export default Countdown;
