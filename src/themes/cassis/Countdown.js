// src/themes/cassis/Countdown.js – Countdown als Kalenderblatt
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { zonedToUtcMs, remaining, monthGrid } from '../../lib/calendar';
import STRINGS, { LOCALES } from './strings';
import { C, Section, Inner } from './shared';

const Head = styled.div`display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;`;
const Month = styled.h2`margin: 0; font-weight: 300; font-size: clamp(1.9rem, 8vw, 2.75rem); line-height: 1.1; text-transform: capitalize;`;
const Rule = styled.svg`display: block; width: 100%; height: 12px; margin: 0.25rem 0 1.25rem; overflow: visible;`;
const Rings = styled.svg`flex: none; width: 5.25rem; height: 3.25rem; margin-bottom: -1.1rem;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center;`;
const Weekday = styled.div`font-size: 0.8125rem; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.inkSoft}; padding-bottom: 0.5rem;`;
const Day = styled.div`
  position: relative; height: clamp(2.6rem, 11vw, 3.4rem); display: flex; align-items: center; justify-content: center; font-size: clamp(1.15rem, 5vw, 1.6rem);
  svg { position: absolute; left: 50%; top: 50%; width: 150%; max-width: 5.25rem; height: 92%; transform: translate(-50%, -50%) rotate(-6deg); }
  span { position: relative; }
`;
const Count = styled.p`
  margin: 2rem 0 0; text-align: center; font-size: 0.9375rem; letter-spacing: 0.26em; text-transform: uppercase; color: ${C.inkSoft};
  strong { display: block; font-weight: 300; font-size: clamp(3rem, 15vw, 4.5rem); letter-spacing: 0; line-height: 1; color: ${C.ink}; margin-bottom: 0.4rem; }
`;

function weekdayNames(lang) {
  const f = new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { weekday: 'short', timeZone: 'UTC' });
  // 5. Januar 2026 ist ein Montag
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2026, 0, 5 + i))).replace('.', ''));
}

function Countdown() {
  const { weddingDate } = useWedding();
  const { lang, t } = useLanguage();
  const cd = useLocalizedContent('countdown');
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

  let count = null;
  if (left) {
    if (left.past) count = <Count>{t(STRINGS, 'past')}</Count>;
    else if (left.days === 0) count = <Count><strong>{left.hours}:{String(left.minutes).padStart(2, '0')}</strong>{t(STRINGS, 'today')}</Count>;
    else count = <Count><strong>{left.days}</strong>{t(STRINGS, left.days === 1 ? 'dayLeft' : 'daysLeft')}</Count>;
  }

  return (
    <Section id="countdown" $tone="paper" aria-label={cd.title || t(STRINGS, 'countdownTitle')}>
      <Inner>
        <Head>
          <Month>{monthLabel}</Month>
          <Rings viewBox="0 0 92 56" fill="none" stroke={C.ink} strokeWidth="1.3" aria-hidden="true">
            <ellipse cx="32" cy="28" rx="22" ry="14" transform="rotate(-32 32 28)" /><ellipse cx="32" cy="28" rx="18" ry="10.5" transform="rotate(-32 32 28)" />
            <ellipse cx="60" cy="30" rx="22" ry="14" transform="rotate(-24 60 30)" /><ellipse cx="60" cy="30" rx="18" ry="10.5" transform="rotate(-24 60 30)" />
          </Rings>
        </Head>
        <Rule viewBox="0 0 1000 12" preserveAspectRatio="none" fill="none" stroke={C.ink} strokeWidth="1.2" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" d="M0 5 C120 8 260 3 420 6 S640 9 760 5 S900 2 1000 6" />
        </Rule>
        <Grid aria-hidden="true">{weekdayNames(lang).map((w) => <Weekday key={w}>{w}</Weekday>)}</Grid>
        <Grid role="img" aria-label={`${monthLabel}: ${day}`}>
          {cells.map((d, i) => (
            <Day key={i} data-wedding-day={d === day ? 'true' : undefined}>
              {d === day && (
                <svg viewBox="0 0 100 60" fill="none" stroke={C.ink} strokeWidth="1.6" aria-hidden="true">
                  <path d="M52 6 C24 4 6 16 7 31 C8 47 30 56 54 54 C78 52 95 41 93 27 C91 13 70 5 44 8" />
                </svg>
              )}
              <span>{d || ''}</span>
            </Day>
          ))}
        </Grid>
        <div aria-live="polite">{count}</div>
      </Inner>
    </Section>
  );
}
export default Countdown;
