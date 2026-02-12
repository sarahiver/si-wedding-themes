import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-white);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`;
const Card = styled.div`text-align: center; padding: 2rem; background: var(--classic-cream); opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.6s ease forwards; animation-delay: ${p.$delay};`}`;
const Avatar = styled.img`width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 3px solid var(--classic-beige);`;
const Name = styled.h3`font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; margin-bottom: 0.25rem;`;
const Role = styled.p`font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 0.75rem;`;
const Phone = styled.a`display: block; font-size: 0.85rem; color: var(--classic-text-light); margin-bottom: 0.25rem; text-decoration: none; &:hover { color: var(--classic-gold-dark); }`;

const DEFAULT_WITNESSES = [
  { name: 'Lisa Müller', role: 'Trauzeugin', phone: '+49 170 1234567', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Tom Schmidt', role: 'Trauzeuge', phone: '+49 171 7654321', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
];

function ContactWitnesses() {
  const { content } = useWedding();
  const cw = content?.witnesses || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = cw.title || 'Trauzeugen';
  const witnesses = cw.items?.length ? cw.items : DEFAULT_WITNESSES;
  return (
    <Section id="witnesses" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Eure Ansprechpartner</Eyebrow><Title $v={visible}>{title}</Title></Header>
        <Grid>{witnesses.map((w, i) => (
          <Card key={i} $v={visible} $delay={`${0.3 + i * 0.15}s`}>
            <Avatar src={w.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&size=200&background=C4A87C&color=fff`} alt={w.name} />
            <Name>{w.name}</Name><Role>{w.role || w.rolle}</Role>
            {w.phone && <Phone href={`tel:${w.phone}`}>{w.phone}</Phone>}
            {w.email && <Phone href={`mailto:${w.email}`}>{w.email}</Phone>}
          </Card>
        ))}</Grid>
      </Container>
    </Section>
  );
}
export default ContactWitnesses;
