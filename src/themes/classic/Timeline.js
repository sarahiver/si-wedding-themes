import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const lineGrow = keyframes`from { transform: scaleY(0); } to { transform: scaleY(1); }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); }`;

const Section = styled.section`
  padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem);
  background: var(--classic-white);
`;

const Container = styled.div`max-width: 900px; margin: 0 auto;`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.p`
  font-family: var(--font-body); font-size: 0.65rem; font-weight: 400;
  letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold);
  margin-bottom: 1rem; opacity: 0;
  ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300; opacity: 0;
  ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}
`;

const TimelineWrapper = styled.div`position: relative; padding-left: 40px;
  @media (max-width: 768px) { padding-left: 30px; }
`;

const VerticalLine = styled.div`
  position: absolute; left: 8px; top: 0; bottom: 0; width: 1px;
  background: var(--classic-beige); transform-origin: top; transform: scaleY(0);
  ${p => p.$v && css`animation: ${lineGrow} 1.5s var(--ease-out-expo) forwards; animation-delay: 0.3s;`}
`;

const Item = styled.div`
  position: relative; padding-bottom: 3rem;
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeInUp} 0.6s ease forwards; animation-delay: ${p.$delay};`}
`;

const Dot = styled.div`
  position: absolute; left: -36px; top: 0.3rem; width: 12px; height: 12px;
  border-radius: 50%; border: 1px solid var(--classic-gold);
  background: var(--classic-white);
  opacity: 0;
  ${p => p.$v && css`animation: ${scaleIn} 0.4s ease forwards; animation-delay: ${p.$delay};`}
  @media (max-width: 768px) { left: -26px; }
`;

const Time = styled.p`
  font-family: var(--font-body); font-size: 0.6rem; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--classic-gold);
  margin-bottom: 0.3rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-display); font-size: 1.5rem; font-weight: 400;
  color: var(--classic-charcoal); margin-bottom: 0.5rem;
`;

const ItemDesc = styled.p`
  font-size: 0.85rem; font-weight: 300; color: var(--classic-text-light);
  line-height: 1.7;
`;

const DEFAULT_ITEMS = [
  { time: '14:00', title: 'Empfang', description: 'Ankunft der Gäste mit Sektempfang im Garten' },
  { time: '15:00', title: 'Trauung', description: 'Die freie Trauung unter freiem Himmel' },
  { time: '16:30', title: 'Kaffee & Kuchen', description: 'Genießt Kaffee, Kuchen und die Hochzeitstorte' },
  { time: '18:30', title: 'Dinner', description: 'Festliches Abendessen im großen Saal' },
  { time: '21:00', title: 'Party', description: 'Eröffnungstanz und Party bis in die Nacht' },
];

function Timeline() {
  const { content } = useWedding();
  const timeline = content?.timeline || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const title = timeline.title || 'Tagesablauf';
  const items = timeline.items?.length ? timeline.items : DEFAULT_ITEMS;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Section id="timeline" ref={ref}>
      <Container>
        <Header>
          <Eyebrow $v={visible}>Der große Tag</Eyebrow>
          <Title $v={visible}>{title}</Title>
        </Header>
        <TimelineWrapper>
          <VerticalLine $v={visible} />
          {items.map((item, i) => (
            <Item key={i} $v={visible} $delay={`${0.4 + i * 0.12}s`}>
              <Dot $v={visible} $delay={`${0.4 + i * 0.12}s`} />
              <Time>{item.time || item.zeit}</Time>
              <ItemTitle>{item.title || item.titel}</ItemTitle>
              {(item.description || item.beschreibung) && (
                <ItemDesc>{item.description || item.beschreibung}</ItemDesc>
              )}
            </Item>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
