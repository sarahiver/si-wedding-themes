// Luxe Contact
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-cream);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;

const Header = styled.div`margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const ContactLinks = styled.div`display: flex; flex-direction: column; gap: 1.5rem; opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s;`;
const ContactLink = styled.a`font-family: var(--font-sans); font-size: 1rem; color: var(--luxe-charcoal); transition: color 0.3s ease; &:hover { color: var(--luxe-gold); }`;

function Contact() {
  const { project, content } = useWedding();
  const data = content?.contact || {};
  const title = data.title || 'Kontakt';
  const email = data.email || project?.couple_email || 'hallo@emmaundjames.de';
  const phone = data.phone || project?.couple_phone || '+49 170 1234567';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="contact">
      <Container>
        <Header $visible={visible}><Eyebrow>Fragen?</Eyebrow><Title>{title}</Title></Header>
        <ContactLinks $visible={visible}>
          <ContactLink href={`mailto:${email}`}>{email}</ContactLink>
          <ContactLink href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</ContactLink>
        </ContactLinks>
      </Container>
    </Section>
  );
}

export default Contact;
