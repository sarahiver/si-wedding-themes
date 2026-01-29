import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-cream); color: var(--luxe-anthracite);`;
const Container = styled.div`max-width: 450px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Links = styled.div`display: flex; flex-direction: column; gap: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const Link = styled.a`font-family: var(--font-body); font-size: 1rem; color: var(--luxe-graphite); transition: color 0.3s ease; &:hover { color: var(--luxe-gold); }`;

function Contact() {
  const { project, content } = useWedding();
  const title = content?.contact?.title || 'Kontakt';
  const email = content?.contact?.email || project?.couple_email || 'hallo@hochzeit.de';
  const phone = content?.contact?.phone || project?.couple_phone || '+49 170 1234567';
  
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
        <Eyebrow $visible={visible}>Fragen?</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Links $visible={visible}>
          <Link href={`mailto:${email}`}>{email}</Link>
          <Link href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link>
        </Links>
      </Container>
    </Section>
  );
}

export default Contact;
