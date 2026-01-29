import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-cream);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Links = styled.div`display: flex; flex-direction: column; gap: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s;`;
const Link = styled.a`display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem 2rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-forest); background: white; border-radius: 50px; box-shadow: 0 4px 15px rgba(107, 127, 94, 0.1); transition: all 0.3s ease; &:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(107, 127, 94, 0.15); background: var(--botanical-mint); }`;

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
        <Eyebrow $visible={visible}>💬 Fragen?</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Links $visible={visible}>
          <Link href={`mailto:${email}`}>📧 {email}</Link>
          <Link href={`tel:${phone.replace(/\s/g, '')}`}>📞 {phone}</Link>
        </Links>
      </Container>
    </Section>
  );
}

export default Contact;
