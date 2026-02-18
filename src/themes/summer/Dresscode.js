import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
const slideLeft = keyframes`from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:translateX(0)}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}`;

function useInView(th = 0.08) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

const S = styled.section`
  padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem);
  background: var(--c-bg-warm);
  position: relative;
  z-index: 2;
  overflow: hidden;
`;

/* Optional background image at 100vw/100vh */
const BgImg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.25) saturate(0.6);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(44,36,22,0.6) 0%, rgba(193,57,43,0.2) 100%);
  }
`;

const Inner = styled.div`
  max-width: var(--content-w);
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(3rem, 6vw, 6rem);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const TextSide = styled.div`
  opacity: 0;
  ${p => p.$v && css`animation: ${slideLeft} 0.9s var(--ease) forwards;`}
`;

const Eyebrow = styled.p`
  font-family: var(--font-b);
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${p => p.$onDark ? 'rgba(255,255,255,0.5)' : 'var(--c-accent)'};
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const H2 = styled.h2`
  font-family: var(--font-d);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: ${p => p.$onDark ? 'white' : 'var(--c-text)'};
  margin-bottom: 1rem;
`;

const StyleName = styled.p`
  font-family: var(--font-s);
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: ${p => p.$onDark ? 'rgba(255,255,255,0.85)' : 'var(--c-accent)'};
  margin-bottom: 1.5rem;
`;

const Desc = styled.p`
  font-family: var(--font-b);
  font-size: 0.9rem;
  line-height: 1.85;
  color: ${p => p.$onDark ? 'rgba(255,255,255,0.65)' : 'var(--c-text-sec)'};
  max-width: 420px;
  margin-bottom: 2rem;
`;

/* Color swatches */
const SwatchRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Swatch = styled.div`
  width: 36px; height: 36px;
  border-radius: 50%;
  background: ${p => p.$color};
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  position: relative;
  cursor: default;

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--c-text);
    color: white;
    font-family: var(--font-b);
    font-size: 0.65rem;
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
  }
`;

const SwatchLabel = styled.p`
  font-family: var(--font-b);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$onDark ? 'rgba(255,255,255,0.4)' : 'var(--c-text-muted)'};
  margin-bottom: 0.5rem;
`;

/* Do / Don't */
const DoDont = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const DDCol = styled.div``;

const DDLabel = styled.p`
  font-family: var(--font-d);
  font-size: 1rem;
  font-weight: 500;
  color: ${p => p.$onDark ? 'rgba(255,255,255,0.8)' : 'var(--c-text)'};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DDItem = styled.p`
  font-family: var(--font-b);
  font-size: 0.82rem;
  color: ${p => p.$onDark ? 'rgba(255,255,255,0.5)' : 'var(--c-text-muted)'};
  line-height: 1.8;
  padding-left: 1rem;
  position: relative;

  &::before {
    content: '${p => p.$type === 'do' ? '✓' : '✗'}';
    position: absolute;
    left: 0;
    color: ${p => p.$type === 'do' ? '#7CB87C' : '#C1392B'};
    font-size: 0.75rem;
  }
`;

/* Right: optional photo */
const PhotoSide = styled.div`
  opacity: 0;
  ${p => p.$v && css`animation: ${slideRight} 0.9s var(--ease) 0.2s forwards;`}

  img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    border-radius: var(--radius-md);
    box-shadow: 0 16px 48px rgba(44,36,22,0.15);
    border: 6px solid ${p => p.$onDark ? 'rgba(255,255,255,0.1)' : 'var(--c-cream)'};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const DEMO_SWATCHES = ['#F5DEB3', '#C17F24', '#8B6914', '#C1392B', '#DDA0DD', '#98D08E'];

function Dresscode() {
  const { content } = useWedding();
  const d = content?.dresscode || {};
  const [ref, v] = useInView();

  const hasBgImg = !!d.background_image;
  const onDark = hasBgImg;

  const swatches = d.color_palette?.length ? d.color_palette : DEMO_SWATCHES;
  const doItems = d.do_items || ['Leichte Sommerkleider', 'Erdtöne & Naturfarben', 'Boho-Prints'];
  const dontItems = d.dont_items || ['Weiß oder Cremeweiß', 'Formelle Abendgarderobe'];

  return (
    <S id="dresscode" data-theme-light ref={ref}>
      {hasBgImg && (
        <BgImg><img src={d.background_image} alt="" /></BgImg>
      )}

      <Inner>
        <TextSide $v={v}>
          <Eyebrow $onDark={onDark}>was ihr tragen dürft</Eyebrow>
          <H2 $onDark={onDark}>{d.title || 'Dresscode'}</H2>
          {d.style_name && <StyleName $onDark={onDark}>{d.style_name}</StyleName>}
          <Desc $onDark={onDark}>
            {d.description || 'Wir wünschen uns leichte, fröhliche Sommerkleidung. Fühlt euch wohl und denkt daran: Wir feiern draußen!'}
          </Desc>

          {swatches.length > 0 && (
            <>
              <SwatchLabel $onDark={onDark}>Farbpalette</SwatchLabel>
              <SwatchRow>
                {swatches.map((color, i) => (
                  <Swatch key={i} $color={color} title={color} />
                ))}
              </SwatchRow>
            </>
          )}

          <DoDont>
            <DDCol>
              <DDLabel $onDark={onDark}>✓ Passt super</DDLabel>
              {doItems.map((item, i) => <DDItem key={i} $type="do" $onDark={onDark}>{item}</DDItem>)}
            </DDCol>
            <DDCol>
              <DDLabel $onDark={onDark}>✗ Lieber nicht</DDLabel>
              {dontItems.map((item, i) => <DDItem key={i} $type="dont" $onDark={onDark}>{item}</DDItem>)}
            </DDCol>
          </DoDont>
        </TextSide>

        <PhotoSide $v={v} $onDark={onDark}>
          {d.image_url && <img src={d.image_url} alt="Dresscode" loading="lazy" />}
        </PhotoSide>
      </Inner>
    </S>
  );
}

export default Dresscode;
