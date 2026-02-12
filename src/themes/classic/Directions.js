import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeInUp = keyframes\`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }\`;
const lineGrow = keyframes\`from { transform: scaleX(0); } to { transform: scaleX(1); }\`;

const Section = styled.section\`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: \${p => p.$bg || 'var(--classic-white)'};\`;
const Container = styled.div\`max-width: \${p => p.$w || 'var(--content-width)'}; margin: 0 auto;\`;
const Header = styled.div\`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);\`;
const Eyebrow = styled.p\`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; \${p => p.$v && css\`animation: \${fadeInUp} 0.8s ease forwards;\`}\`;
const Title = styled.h2\`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; \${p => p.$v && css\`animation: \${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;\`}\`;
const Desc = styled.p\`font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); margin-top: 1rem; max-width: 550px; margin-left: auto; margin-right: auto; opacity: 0; \${p => p.$v && css\`animation: \${fadeInUp} 0.8s ease forwards; animation-delay: 0.25s;\`}\`;
const InfoGrid = styled.div\`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; opacity: 0; ${p => p.$v && css\`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;\`}\`;
const InfoCard = styled.div\`background: var(--classic-cream); padding: 2rem; text-align: center;\`;
const CardIcon = styled.div\`font-size: 1.5rem; margin-bottom: 1rem;\`;
const CardTitle = styled.h3\`font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; margin-bottom: 0.75rem;\`;
const CardText = styled.p\`font-size: 0.85rem; font-weight: 300; color: var(--classic-text-light); line-height: 1.7;\`;
const MapBtn = styled.a\`display: inline-block; margin-top: 1.5rem; padding: 0.75rem 2rem; border: 1px solid var(--classic-gold); color: var(--classic-gold-dark); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; &:hover { background: var(--classic-gold); color: #fff; }\`;

function Directions() {
  const { content } = useWedding();
  const dir = content?.directions || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = dir.title || 'Anfahrt';
  const description = dir.description || 'So findet ihr zu uns.';
  const transport = dir.transport || [
    { icon: '🚗', title: 'Mit dem Auto', text: 'Parkplätze stehen vor Ort zur Verfügung.' },
    { icon: '🚆', title: 'Mit der Bahn', text: 'Die nächste S-Bahn-Station ist 10 Min. Fußweg entfernt.' },
    { icon: '🚕', title: 'Taxi', text: 'Wir organisieren einen Shuttle-Service für euch.' },
  ];
  return (
    <Section id="directions" $bg="var(--classic-white)" ref={ref}>
      <Container $w="900px">
        <Header><Eyebrow $v={visible}>Anreise</Eyebrow><Title $v={visible}>{title}</Title><Desc $v={visible}>{description}</Desc></Header>
        <InfoGrid $v={visible}>
          {transport.map((t, i) => (<InfoCard key={i}><CardIcon>{t.icon}</CardIcon><CardTitle>{t.title || t.titel}</CardTitle><CardText>{t.text || t.beschreibung}</CardText></InfoCard>))}
        </InfoGrid>
        {dir.maps_url && <div style={{textAlign:'center',marginTop:'2rem'}}><MapBtn href={dir.maps_url} target="_blank" rel="noopener">Route anzeigen →</MapBtn></div>}
      </Container>
    </Section>
  );
}
export default Directions;