import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 700px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const Witness = styled.div`
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const WitnessName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--zen-text);
  margin-bottom: 0.3rem;
`;

const WitnessRole = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--zen-text-muted);
  margin-bottom: 0.75rem;
`;

const WitnessContact = styled.a`
  font-size: 0.85rem;
  color: var(--zen-text-light);
  &:hover { color: var(--zen-text); opacity: 1; }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Trauzeugen';
  const witnesses = data.witnesses || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (witnesses.length === 0) return null;

  return (
    <Section id="witnesses" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Grid>
          {witnesses.map((w, i) => (
            <Witness key={i} className={visible ? 'visible' : ''} $delay={0.1 + i * 0.1}>
              <WitnessName>{w.name}</WitnessName>
              {w.role && <WitnessRole>{w.role}</WitnessRole>}
              {w.phone && <WitnessContact href={`tel:${w.phone}`}>{w.phone}</WitnessContact>}
              {w.email && <WitnessContact href={`mailto:${w.email}`} style={{display:'block'}}>{w.email}</WitnessContact>}
            </Witness>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default ContactWitnesses;
