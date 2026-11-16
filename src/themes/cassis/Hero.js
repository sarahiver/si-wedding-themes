// src/themes/cassis/Hero.js – Foto, Schriftzug, „Wir sagen Ja", Datum, Ort, Route und Kalender
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { eventTimes, buildIcs, downloadIcs } from '../../lib/calendar';
import STRINGS, { LOCALES } from './strings';
import { C, FONT, SCRIPT, Section, Inner, Watermark, Button, fadeIn } from './shared';

const Photo = styled.header`
  position: relative; background: ${C.blue}; overflow: hidden;
  height: min(150vw, 92vh); min-height: 26rem;
  img.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${(p) => p.$focal || '50% 30%'}; }
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(47,52,66,0) 45%, rgba(47,52,66,0.28)); }
`;
const Names = styled.h1`
  position: absolute; z-index: 1; left: 0; right: 0; bottom: 8%; margin: 0; padding: 0 4%; ${fadeIn}
  img { display: block; width: min(100%, 44rem); height: auto; margin: 0 auto; }
  span.text { display: block; text-align: center; font-family: ${SCRIPT}; font-weight: 400; color: ${C.white}; font-size: clamp(4rem, 21vw, 9rem); line-height: 0.95; text-shadow: 0 1px 18px rgba(47,52,66,0.35); }
  span.text span { display: block; }
  span.text span:last-child { padding-left: 1.6em; }
`;
const Tagline = styled.p`
  position: relative; margin: 0; text-align: right; font-family: ${FONT}; font-weight: 300; font-size: clamp(2rem, 9.5vw, 3.25rem); line-height: 1.12; white-space: pre-line;
`;
const DateLine = styled.p`margin: 0 0 2rem; text-align: right; font-size: clamp(2rem, 9.5vw, 3rem); line-height: 1.1; color: ${C.inkSoft};`;
const Place = styled.p`margin: 0; text-align: right; font-size: clamp(1.9rem, 9vw, 2.75rem); line-height: 1.1; color: ${C.inkSoft};`;
const Address = styled.address`margin: 0.4rem 0 0; text-align: right; font-style: normal; white-space: pre-line; color: ${C.inkSoft}; font-size: 1.125rem; line-height: 1.5;`;
const Illustration = styled.img`display: block; width: 100%; height: auto; margin: 1.5rem 0 0.5rem; opacity: 0.9;`;
const Actions = styled.div`display: grid; gap: 0.6rem; margin-top: 2rem;`;

export function formatWeddingDate(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  return new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)));
}

function Hero() {
  const { project, coupleNames, weddingDate, slug } = useWedding();
  const { lang, t } = useLanguage();
  const hero = useLocalizedContent('hero');
  const countdown = useLocalizedContent('countdown');
  const directions = useLocalizedContent('directions');

  const date = countdown.target_date || weddingDate;
  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = coupleNames || names.join(' & ');
  const address = directions.address || '';
  const mapsUrl = directions.maps_url
    || (directions.lat && directions.lng ? `https://www.google.com/maps?q=${directions.lat},${directions.lng}`
      : (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project?.location || ''} ${address}`.trim())}` : ''));

  const saveToCalendar = (e) => {
    e.preventDefault();
    const { startMs, endMs } = eventTimes({ date, time: countdown.target_time, endDate: countdown.end_date, endTime: countdown.end_time, timeZone: countdown.timezone || 'Europe/Paris' });
    const ics = buildIcs({
      uid: `${slug || 'wedding'}@siwedding.de`, title: `${t(STRINGS, 'weMarry')}: ${label}`, startMs, endMs,
      location: [project?.location, address.replace(/\n/g, ', ')].filter(Boolean).join(', '),
      url: typeof window !== 'undefined' ? window.location.href.split('#')[0] : '',
    });
    downloadIcs(ics, `${slug || 'wedding'}.ics`);
  };

  return (
    <>
      <Photo id="top" $focal={hero.background_focal ? `${hero.background_focal.x ?? 50}% ${hero.background_focal.y ?? 30}%` : null}>
        {hero.background_image && <img className="bg" src={hero.background_image} alt="" />}
        <Names aria-label={label}>
          {hero.name_image
            ? <img src={hero.name_image} alt={label} />
            : <span className="text" aria-hidden="true">{(names.length ? names : [label]).map((n) => <span key={n}>{n}</span>)}</span>}
        </Names>
      </Photo>

      <Section $tone="blue" style={{ paddingTop: 'clamp(5rem, 22vw, 9rem)', paddingBottom: 'clamp(5rem, 22vw, 9rem)' }}>
        <Watermark aria-hidden="true" $top="18%">Yes</Watermark>
        <Inner><Tagline>{hero.tagline || t(STRINGS, 'weMarry')}</Tagline></Inner>
      </Section>

      <Section $tone="paper">
        <Inner>
          {date && <DateLine><time dateTime={date}>{formatWeddingDate(date, lang)}</time></DateLine>}
          {project?.location && <Place>{project.location}</Place>}
          {address && <Address>{address}</Address>}
          {directions.image && <Illustration src={directions.image} alt="" />}
          <Actions>
            {mapsUrl && <Button href={mapsUrl} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'route')}</Button>}
            {date && <Button as="button" type="button" $dark onClick={saveToCalendar}>{t(STRINGS, 'calendar')}</Button>}
          </Actions>
        </Inner>
      </Section>
    </>
  );
}
export default Hero;
