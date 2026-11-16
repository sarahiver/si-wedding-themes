// src/themes/cassis/Childcare.js – Kinderbetreuung (eigener Inhaltsblock)
import React from 'react';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { Section, Inner, Title, Lead, Watermark } from './shared';

function Childcare() {
  const { t } = useLanguage();
  const c = useLocalizedContent('childcare');
  return (
    <Section id="childcare" $tone="light">
      <Watermark aria-hidden="true" $color="rgba(47,52,66,0.2)" $top="0.02em" $left="0.02em">{c.watermark || 'Kids'}</Watermark>
      <Inner style={{ paddingTop: 'clamp(4rem, 22vw, 8rem)' }}>
        <Title style={{ color: '#fff' }}>{c.title || t(STRINGS, 'childcare')}</Title>
        <Lead>{c.description || `[${t(STRINGS, 'placeholder')}]`}</Lead>
      </Inner>
    </Section>
  );
}
export default Childcare;
