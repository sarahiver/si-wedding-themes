import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const imgReveal = keyframes`from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0); }`;
const lineExp = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const S = styled.section`padding: var(--section-pad) 0; background: var(--c-white); overflow: hidden;`;
const Container = styled.div`max-width: var(--content-w); margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 4rem);`;

const Header = styled.div`text-align: center; margin-bottom: clamp(5rem, 10vw, 8rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const SubTitle = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--c-text-muted); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.25s;`}`;
const Line = styled.div`width: 60px; height: 1px; background: var(--c-gold); margin: 1.5rem auto 0; transform: scaleX(0); ${p => p.$v && css`animation: ${lineExp} 0.6s var(--ease) forwards; animation-delay: 0.35s;`}`;

/* Overlapping block layout */
const Block = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$rev ? '1fr 55%' : '55% 1fr'};
  align-items: center;
  margin-bottom: clamp(5rem, 10vw, 8rem);
  position: relative;

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImgWrap = styled.div`
  overflow: hidden; position: relative; z-index: 1;
  grid-column: ${p => p.$rev ? '2' : '1'};
  grid-row: 1;
  opacity: 0;
  ${p => p.$v && css`animation: ${imgReveal} 1.2s var(--ease) forwards; animation-delay: 0.2s;`}

  @media(max-width: 768px) {
    grid-column: 1;
  }
`;

const Img = styled.img`
  width: 100%; aspect-ratio: 3/4; object-fit: cover;
  filter: grayscale(25%);
  transition: filter 0.6s ease;
  &:hover { filter: grayscale(0%); }
`;

const TextWrap = styled.div`
  position: relative; z-index: 2;
  grid-column: ${p => p.$rev ? '1' : '2'};
  grid-row: 1;
  background: var(--c-white);
  padding: clamp(2rem, 4vw, 3.5rem);
  box-shadow: 0 20px 60px rgba(0,0,0,0.07);
  /* Overlap the image */
  margin-left: ${p => p.$rev ? '0' : 'calc(var(--overlap) * -1)'};
  margin-right: ${p => p.$rev ? 'calc(var(--overlap) * -1)' : '0'};
  align-self: center;
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.5s;`}

  @media(max-width: 768px) {
    grid-column: 1;
    grid-row: 2;
    margin: calc(var(--overlap-mobile) * -1) 1rem 0;
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const Year = styled.span`
  font-family: var(--font-display); font-size: 4rem; font-weight: 300;
  color: rgba(0,0,0,0.04); position: absolute; top: -0.5rem; right: 1.5rem;
  line-height: 1; pointer-events: none;
`;
const StoryTitle = styled.h3`font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 400; margin-bottom: 1rem;`;
const StoryText = styled.p`font-family: var(--font-body); font-size: 0.85rem; font-weight: 300; line-height: 1.9; color: var(--c-text-sec); max-width: var(--text-w);`;
const YearLabel = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 0.75rem;`;

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, [threshold]);
  return [ref, v];
}

const DEFAULTS = [
  { year: '2020', title: 'Der erste Blick', text: 'Auf einer Gartenparty trafen sich unsere Blicke zum ersten Mal. Was als zufälliges Treffen begann, entwickelte sich schnell zu etwas ganz Besonderem.', image: 'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg' },
  { year: '2022', title: 'Unser Abenteuer', text: 'Gemeinsam haben wir die Welt entdeckt. Jede Reise, jeder gemeinsame Moment hat uns näher zusammengebracht und gezeigt, dass wir füreinander bestimmt sind.', image: 'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg' },
  { year: '2025', title: 'Die große Frage', text: 'An einem magischen Abend stellte sich die Frage aller Fragen – und die Antwort war ein überglückliches Ja! Seitdem planen wir den schönsten Tag unseres Lebens.', image: 'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg' },
];

function LoveStory() {
  const { content } = useWedding();
  const ls = content?.lovestory || {};
  const [hRef, hV] = useInView();
  const stories = ls.stories?.length ? ls.stories : DEFAULTS;

  return (
    <S id="lovestory">
      <Container>
        <Header ref={hRef}>
          <Eye $v={hV}>Über uns</Eye>
          <Title $v={hV}>{ls.title || 'Unsere Geschichte'}</Title>
          <SubTitle $v={hV}>{ls.subtitle || 'Wie alles begann'}</SubTitle>
          <Line $v={hV} />
        </Header>
        {stories.map((s, i) => {
          const [ref, v] = useInView(0.12);
          const rev = i % 2 === 1;
          return (
            <Block key={i} ref={ref} $rev={rev}>
              <ImgWrap $v={v} $rev={rev}>
                <Img src={s.image} alt={s.title} loading="lazy" />
              </ImgWrap>
              <TextWrap $v={v} $rev={rev}>
                <Year>{s.year}</Year>
                <YearLabel>{s.year}</YearLabel>
                <StoryTitle>{s.title}</StoryTitle>
                <StoryText>{s.text}</StoryText>
              </TextWrap>
            </Block>
          );
        })}
      </Container>
    </S>
  );
}
export default LoveStory;
