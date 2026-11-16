// src/themes/cassis/Countdown.js – Countdown als Kalenderblatt, mit „Im Kalender speichern"
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { zonedToUtcMs, remaining, monthGrid, eventTimes, buildIcs, downloadIcs } from '../../lib/calendar';
import STRINGS, { LOCALES } from './strings';
import { C, Section, Inner, Aside, Button, DESK } from './shared';

const Sheet = styled.div`min-width: 0; max-width: 30rem; ${DESK} { max-width: 46rem; }`;
const Head = styled.div`display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;`;
const Month = styled.h2`margin: 0; font-weight: 300; font-size: clamp(1.875rem, 6.5vw, 2.5rem); line-height: 1.15; letter-spacing: 0.01em; text-transform: capitalize; ${DESK} { font-size: clamp(2.5rem, 3.7vw, 4.5rem); }`;
const Rule = styled.svg`display: block; width: 100%; height: 12px; margin: 0.35rem 0 1.5rem; overflow: visible; ${DESK} { margin: 0.75rem 0 2.25rem; }`;
const Rings = styled.svg`flex: none; width: 4.5rem; height: 2.75rem; margin-bottom: -0.95rem; ${DESK} { width: clamp(5.5rem, 7vw, 8rem); height: clamp(3.4rem, 4.3vw, 4.9rem); margin-bottom: -1.5rem; }`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center;`;
const Weekday = styled.div`font-size: 0.875rem; color: ${C.inkSoft}; padding-bottom: 0.6rem; text-transform: capitalize; ${DESK} { font-size: clamp(1rem, 1.1vw, 1.25rem); padding-bottom: 1rem; }`;
const Day = styled.div`
  position: relative; height: clamp(2.6rem, 11vw, 3.25rem); display: flex; align-items: center; justify-content: center;
  font-weight: 300; font-size: clamp(1.125rem, 4.8vw, 1.375rem); font-variant-numeric: tabular-nums;
  ${DESK} { height: clamp(3.75rem, 5.4vw, 6.5rem); font-size: clamp(1.5rem, 2vw, 2.375rem); svg { max-width: 8rem; } }
  svg { position: absolute; left: 50%; top: 50%; width: 150%; max-width: 4.75rem; height: 92%; transform: translate(-50%, -50%) rotate(-6deg); }
  span { position: relative; }
`;
const Count = styled.p`
  margin: 0; font-size: 1.0625rem; line-height: 1.5; color: ${C.inkSoft};
  strong { display: block; font-weight: 300; font-size: clamp(4.5rem, 20vw, 7rem); letter-spacing: -0.01em; line-height: 0.95; color: ${C.ink}; margin-bottom: 0.5rem; font-variant-numeric: tabular-nums; }
  ${DESK} { font-size: clamp(1.25rem, 1.5vw, 1.75rem); strong { font-size: clamp(8rem, 15vw, 18rem); line-height: 0.85; margin-bottom: 0.12em; margin-left: -0.04em; } }
`;
const Actions = styled.div`margin-top: 2rem; ${DESK} { margin-top: 3rem; }`;

function weekdayNames(lang) {
  const f = new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { weekday: 'short', timeZone: 'UTC' });
  // 5. Januar 2026 ist ein Montag
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2026, 0, 5 + i))).replace('.', ''));
}

function Countdown() {
  const { project, coupleNames, weddingDate, slug } = useWedding();
  const { lang, t } = useLanguage();
  const cd = useLocalizedContent('countdown');
  const directions = useLocalizedContent('directions');
  const date = cd.target_date || weddingDate;
  const target = zonedToUtcMs(date, cd.target_time || '00:00', cd.timezone || 'Europe/Paris');

  // Erst nach dem Laden rechnen: die Uhr des Geräts steht nur im Browser fest
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

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

  let count = null;
  if (left) {
    if (left.past) count = <Count>{t(STRINGS, 'past')}</Count>;
    else if (left.days === 0) count = <Count><strong>{left.hours}:{String(left.minutes).padStart(2, '0')}</strong>{t(STRINGS, 'today')}</Count>;
    else count = <Count><strong>{left.days}</strong>{t(STRINGS, left.days === 1 ? 'dayLeft' : 'daysLeft')}</Count>;
  }

  return (
    <Section id="countdown" $tone="shell" aria-label={cd.title || t(STRINGS, 'countdownTitle')}>
      <Inner>
        <Aside>
          <div aria-live="polite">{count}</div>
          {!(left && left.past) && <Actions><Button as="button" type="button" onClick={saveToCalendar}>{t(STRINGS, 'calendar')}</Button></Actions>}
        </Aside>
        <Sheet>
          <Head>
            <Month>{monthLabel}</Month>
            <Rings viewBox="0 0 92 56" fill="none" stroke={C.ink} strokeWidth="1.2" aria-hidden="true">
              <ellipse cx="32" cy="28" rx="22" ry="14" transform="rotate(-32 32 28)" /><ellipse cx="32" cy="28" rx="18" ry="10.5" transform="rotate(-32 32 28)" />
              <ellipse cx="60" cy="30" rx="22" ry="14" transform="rotate(-24 60 30)" /><ellipse cx="60" cy="30" rx="18" ry="10.5" transform="rotate(-24 60 30)" />
            </Rings>
          </Head>
          <Rule viewBox="0 0 1000 12" preserveAspectRatio="none" fill="none" stroke={C.ink} strokeWidth="1" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" d="M0 5 C120 8 260 3 420 6 S640 9 760 5 S900 2 1000 6" />
          </Rule>
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
      </Inner>
    </Section>
  );
}
export default Countdown;
