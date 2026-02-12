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
const Grid = styled.div\`display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;\`;
const Card = styled.div\`background: var(--classic-cream); overflow: hidden; opacity: 0; ${p => p.$v && css\`animation: ${fadeInUp} 0.6s ease forwards; animation-delay: ${p.$delay};\`}\`;
const CardImg = styled.div\`overflow: hidden; img { width: 100%; aspect-ratio: 16/10; object-fit: cover; transition: transform 0.6s; } &:hover img { transform: scale(1.05); }\`;
const CardBody = styled.div\`padding: 1.5rem;\`;
const CardTitle = styled.h3\`font-family: var(--font-display); font-size: 1.4rem; font-weight: 400; margin-bottom: 0.5rem;\`;
const CardText = styled.p\`font-size: 0.85rem; font-weight: 300; color: var(--classic-text-light); line-height: 1.7;\`;
const CardPrice = styled.p\`font-family: var(--font-display); font-size: 1.1rem; color: var(--classic-gold); margin-top: 0.5rem;\`;
const CardLink = styled.a\`display: inline-block; margin-top: 0.75rem; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--classic-gold-dark); border-bottom: 1px solid var(--classic-gold); padding-bottom: 2px;\`;
const DEFAULT_HOTELS = [
  { name: 'Hotel Gartenblick', description: 'Charmantes Boutique-Hotel direkt am Veranstaltungsort.', price: 'ab 120 € / Nacht', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', url: '' },
  { name: 'Landhaus am See', description: 'Ruhige Lage mit herrlichem Seeblick, 5 Min. entfernt.', price: 'ab 95 € / Nacht', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', url: '' },
];

function Accommodations() {
  const { content } = useWedding();
  const acc = content?.accommodations || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = acc.title || 'Unterkünfte';
  const description = acc.description || 'Hier könnt ihr übernachten.';
  const hotels = acc.hotels?.length ? acc.hotels : DEFAULT_HOTELS;
  return (
    <Section id="accommodations" $bg="var(--classic-white)" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Übernachten</Eyebrow><Title $v={visible}>{title}</Title><Desc $v={visible}>{description}</Desc></Header>
        <Grid>{hotels.map((h, i) => (<Card key={i} $v={visible} $delay={`${0.3+i*0.15}s`}><CardImg><img src={h.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} alt={h.name} loading="lazy" /></CardImg><CardBody><CardTitle>{h.name || h.titel}</CardTitle><CardText>{h.description || h.beschreibung}</CardText>{h.price && <CardPrice>{h.price || h.preis}</CardPrice>}{h.url && <CardLink href={h.url} target="_blank" rel="noopener">Website →</CardLink>}</CardBody></Card>))}</Grid>
      </Container>
    </Section>
  );
}
export default Accommodations;