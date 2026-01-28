// Luxe ContactWitnesses
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-white);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem;`;
const Card = styled.div`text-align: center; opacity: 0; animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: ${p => 0.1 + p.$index * 0.15}s;`;
const Avatar = styled.div`width: 100px; height: 100px; margin: 0 auto 1.5rem; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-sand)'}; border-radius: 50%;`;
const PersonName = styled.h3`font-family: var(--font-serif); font-size: 1.25rem; color: var(--luxe-black); margin-bottom: 0.25rem;`;
const Role = styled.p`font-family: var(--font-sans); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem;`;
const ContactLink = styled.a`display: block; font-family: var(--font-sans); font-size: 0.85rem; color: var(--luxe-charcoal); margin-bottom: 0.5rem; &:hover { color: var(--luxe-gold); }`;

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
        <Header $visible={visible}><Eyebrow>Eure Ansprechpartner</Eyebrow><Title>{title}</Title></Header>
        <Grid>
          {persons.map((person, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Avatar $image={person.image} />
              <PersonName>{person.name}</PersonName>
              <Role>{person.role}</Role>
              {person.email && <ContactLink href={`mailto:${person.email}`}>{person.email}</ContactLink>}
              {person.phone && <ContactLink href={`tel:${person.phone.replace(/\s/g, '')}`}>{person.phone}</ContactLink>}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
