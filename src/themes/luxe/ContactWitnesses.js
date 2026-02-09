import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`overflow: hidden; padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem;
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 calc(-1 * var(--section-padding-x, 24px));
    padding: 0 var(--section-padding-x, 24px);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;
const Card = styled.div`text-align: center; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
// FIX: Only use url() when image exists and is not empty string
const Avatar = styled.div`width: 100px; height: 100px; margin: 0 auto 1.5rem; background: ${p => p.$image && p.$image.length > 0 ? `url(${p.$image}) center/cover` : 'var(--luxe-charcoal)'}; border-radius: 50%;`;
const PersonName = styled.h3`font-family: var(--font-display); font-size: 1.25rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.25rem;`;
const Role = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem;`;
const Link = styled.a`display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--luxe-pearl); margin-bottom: 0.5rem; &:hover { color: var(--luxe-gold); }`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const title = data.title || 'Trauzeugen';
  const persons = Array.isArray(data.persons) ? data.persons : [];
  const showDetails = data.showContactDetails || false;

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keine Defaults - nur rendern wenn Personen vorhanden
  if (persons.length === 0) return null;

  const getImageUrl = (img) => img?.url || img || '';
  const getWhatsAppNumber = (person) => (person.whatsapp || person.phone || '').replace(/\D/g, '');

  return (
    <Section ref={sectionRef} id="witnesses">
      <Container>
        <Header><Eyebrow $visible={visible}>Ansprechpartner</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {persons.map((person, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Avatar $image={getImageUrl(person.image)} />
              <PersonName>{person.name}</PersonName>
              <Role>{person.role}</Role>
              {getWhatsAppNumber(person) && <Link href={`https://wa.me/${getWhatsAppNumber(person)}`} target="_blank" rel="noopener noreferrer">WhatsApp</Link>}
              {person.phone && <Link href={`tel:${person.phone.replace(/\s/g, '')}`}>{showDetails ? person.phone : 'Anrufen'}</Link>}
              {person.email && <Link href={`mailto:${person.email}`}>{showDetails ? person.email : 'E-Mail'}</Link>}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
