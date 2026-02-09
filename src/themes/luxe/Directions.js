import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-charcoal);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    margin: 0 calc(-1 * var(--section-padding-x));
    padding: 0 var(--section-padding-x);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const Block = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(212,175,55,0.1);

  @media (max-width: 768px) {
    flex: 0 0 85vw;
    max-width: 85vw;
    scroll-snap-align: center;
  }
`;

const BlockIcon = styled.div`font-size: 2rem; margin-bottom: 1rem;`;
const BlockTitle = styled.h4`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem;`;
const BlockText = styled.p`font-family: var(--font-body); font-size: 0.9rem; line-height: 1.8; color: var(--luxe-pearl);`;

const MapEmbed = styled.div`
  margin-top: 2.5rem;
  position: relative;
  padding-top: 45%;
  overflow: hidden;
  border: 1px solid rgba(212,175,55,0.15);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.3s;

  @media (max-width: 768px) { padding-top: 65%; }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(80%) sepia(20%) brightness(0.7) contrast(1.1);
    transition: filter 0.4s ease;
  }
  &:hover iframe { filter: grayscale(0%) sepia(0%) brightness(1) contrast(1); }
`;

const MapBtn = styled.a`display: inline-block; margin-top: 2rem; padding: 1rem 2rem; font-family: var(--font-body); font-size: 0.7rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-void); background: var(--luxe-gold); transition: background 0.3s ease; &:hover { background: var(--luxe-champagne); }`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  const title = data.title || 'Anfahrt';
  const mapsEmbed = data.maps_embed || '';
  const mapsUrl = data.maps_url || '';

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    { icon: '🚗', title: 'Mit dem Auto', description: 'Kostenlose Parkplätze stehen vor Ort zur Verfügung.' },
    { icon: '🚆', title: 'Öffentlich', description: 'Mit der S-Bahn bis Hauptbahnhof, dann Bus Linie 42.' },
  ];

  const getDisplayItems = () => {
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        icon: item.icon || '📍',
        title: item.title || '',
        description: item.description || ''
      }));
    }
    const legacyItems = [];
    if (data.car_info || data.parking_info) legacyItems.push({ icon: '🚗', title: 'Mit dem Auto', description: data.car_info || data.parking_info });
    if (data.public_transport) legacyItems.push({ icon: '🚆', title: 'Öffentlich', description: data.public_transport });
    if (data.taxi_info) legacyItems.push({ icon: '🚕', title: 'Taxi', description: data.taxi_info });
    return legacyItems.length > 0 ? legacyItems : defaultItems;
  };

  const displayItems = getDisplayItems();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="directions">
      <Container>
        <Header><Eyebrow $visible={visible}>So findet ihr uns</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Content $visible={visible}>
          {displayItems.map((item, i) => (
            <Block key={i}>
              <BlockIcon>{item.icon}</BlockIcon>
              <BlockTitle>{item.title}</BlockTitle>
              <BlockText>{item.description}</BlockText>
            </Block>
          ))}
        </Content>
        {mapsEmbed && (
          <MapEmbed $visible={visible}>
            <iframe src={mapsEmbed} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Anfahrtskarte" />
          </MapEmbed>
        )}
        {mapsUrl && <div style={{ textAlign: 'center' }}><MapBtn href={mapsUrl} target="_blank" rel="noopener">Route anzeigen</MapBtn></div>}
      </Container>
    </Section>
  );
}

export default Directions;
