import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 700px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;`;
const Card = styled.div`text-align: center; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
const Avatar = styled.div`width: 80px; height: 80px; margin: 0 auto 1rem; background: ${p => p.$image ? 'url(' + p.$image + ') center/cover' : 'rgba(255,255,255,0.1)'}; filter: ${p => p.$image ? 'grayscale(100%)' : 'none'}; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.5rem; color: var(--video-gray); transition: filter 0.4s ease; &:hover { filter: grayscale(0%); }`;
const PersonName = styled.h3`font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.25rem;`;
const Role = styled.p`font-family: var(--font-primary); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem;`;
const ContactLink = styled.a`display: block; font-family: var(--font-primary); font-size: 0.8rem; color: var(--video-gray); margin-bottom: 0.25rem; transition: color 0.3s ease; &:hover { color: var(--video-accent); }`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const title = data.title || 'Trauzeugen';
  const persons = data.persons || [];


  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keine Defaults - nur rendern wenn Personen vorhanden
  if (persons.length === 0) return null;

  const getWhatsAppNumber = (person) => (person.whatsapp || person.phone || '').replace(/\D/g, '');

  return (
    <SectionWrapper id="witnesses">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Ansprechpartner</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid>
          {persons.map((person, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Avatar $image={person.image ? optimizedUrl.avatar(person.image) : null}>{!person.image && person.name.charAt(0)}</Avatar>
              <PersonName>{person.name}</PersonName>
              <Role>{person.role}</Role>
              {getWhatsAppNumber(person) && <ContactLink href={'https://wa.me/' + getWhatsAppNumber(person)} target="_blank" rel="noopener noreferrer">WhatsApp</ContactLink>}
              {person.phone && <ContactLink href={'tel:' + person.phone.replace(/\s/g, '')}>Anrufen</ContactLink>}
              {person.email && <ContactLink href={'mailto:' + person.email}>E-Mail</ContactLink>}
            </Card>
          ))}
        </Grid>
      </Content>
    </SectionWrapper>
  );
}

export default ContactWitnesses;
