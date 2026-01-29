import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-mint);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem;`;
const Card = styled.div`text-align: center; background: white; border-radius: 24px; padding: 2rem; box-shadow: 0 4px 20px rgba(107, 127, 94, 0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
const Avatar = styled.div`width: 80px; height: 80px; margin: 0 auto 1rem; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--botanical-sage)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;`;
const PersonName = styled.h3`font-family: var(--font-handwritten); font-size: 1.5rem; color: var(--botanical-forest); margin-bottom: 0.25rem;`;
const Role = styled.p`font-family: var(--font-body); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--botanical-sage); margin-bottom: 1rem;`;
const Link = styled.a`display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--botanical-brown); margin-bottom: 0.25rem; &:hover { color: var(--botanical-sage); }`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const title = data.title || 'Trauzeugen';
  const persons = data.persons || [
    { name: 'Lisa Mueller', role: 'Trauzeugin', email: 'lisa@example.de', phone: '+49 170 1111111', image: '' },
    { name: 'Max Schmidt', role: 'Trauzeuge', email: 'max@example.de', phone: '+49 170 2222222', image: '' }
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
        <Header><Eyebrow $visible={visible}>👫 Ansprechpartner</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {persons.map((person, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Avatar $image={person.image}>{!person.image && '🌿'}</Avatar>
              <PersonName>{person.name}</PersonName>
              <Role>{person.role}</Role>
              {person.email && <Link href={`mailto:${person.email}`}>📧 {person.email}</Link>}
              {person.phone && <Link href={`tel:${person.phone.replace(/\s/g, '')}`}>📞 {person.phone}</Link>}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
