import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2rem, 4vw, 3rem);
  text-align: center;
  position: relative;
  overflow: hidden;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.2s;`}
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
    pointer-events: none;
  }
`;

const Message = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.15);
  }
`;

const ContactIcon = styled.span`
  font-size: 1.5rem;
`;

const ContactText = styled.span`
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
`;

function Contact() {
  const { content } = useWedding();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const message = contactData.message || 'Bei Fragen könnt ihr euch jederzeit bei uns melden.';
  const email = contactData.email || '';
  const phone = contactData.phone || '';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="contact" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Fragen?</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <GlassCard $visible={visible}>
          <Message>{message}</Message>
          
          <ContactInfo>
            {email && (
              <ContactItem href={`mailto:${email}`}>
                <ContactIcon>📧</ContactIcon>
                <ContactText>{email}</ContactText>
              </ContactItem>
            )}
            
            {phone && (
              <ContactItem href={`tel:${phone.replace(/\s/g, '')}`}>
                <ContactIcon>📞</ContactIcon>
                <ContactText>{phone}</ContactText>
              </ContactItem>
            )}
          </ContactInfo>
        </GlassCard>
      </Container>
    </Section>
  );
}

export default Contact;
