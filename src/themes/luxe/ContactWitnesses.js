import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem;`;
const Card = styled.div`text-align: center; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
const Avatar = styled.div`width: 100px; height: 100px; margin: 0 auto 1.5rem; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-charcoal)'}; border-radius: 50%;`;
const PersonName = styled.h3`font-family: var(--font-display); font-size: 1.25rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.25rem;`;
const Role = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem;`;
const Link = styled.a`display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--luxe-pearl); margin-bottom: 0.5rem; &:hover { color: var(--luxe-gold); }`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const title = data.title || 'Trauzeugen';
  const persons = data.persons || [
    { name: 'Sarah Mueller', role: 'Trauzeugin', email: 'sarah@example.de', phone: '+49 170 1111111', image: '' },
    { name: 'Michael Schmidt', role: 'Trauzeuge', email: 'michael@example.de', phone: '+49 170 2222222', image: '' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="witnesses">
      <Container>
        <Header><Eyebrow $visible={visible}>Ansprechpartner</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {persons.map((person, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Avatar $image={person.image} />
              <PersonName>{person.name}</PersonName>
              <Role>{person.role}</Role>
              {person.email && <Link href={`mailto:${person.email}`}>{person.email}</Link>}
              {person.phone && <Link href={`tel:${person.phone.replace(/\s/g, '')}`}>{person.phone}</Link>}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
