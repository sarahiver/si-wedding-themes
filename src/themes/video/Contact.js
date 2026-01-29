import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 500px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Links = styled.div`display: flex; flex-direction: column; gap: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const Link = styled.a`font-family: var(--font-primary); font-size: 1rem; color: var(--video-silver); transition: color 0.3s ease; &:hover { color: var(--video-accent); }`;

function Contact() {
  const { project, content } = useWedding();
  const title = content?.contact?.title || 'Kontakt';
  const email = content?.contact?.email || project?.couple_email || 'hallo@hochzeit.de';
  const phone = content?.contact?.phone || project?.couple_phone || '+49 170 1234567';
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="contact">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Fragen?</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Links $visible={visible}>
          <Link href={`mailto:${email}`}>{email}</Link>
          <Link href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link>
        </Links>
      </Content>
    </SectionWrapper>
  );
}

export default Contact;
