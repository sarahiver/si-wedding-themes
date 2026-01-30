import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Text = styled.p`
  font-size: 0.95rem;
  color: var(--zen-text-light);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const ContactLink = styled.a`
  display: inline-block;
  font-size: 0.9rem;
  color: var(--zen-text);
  border-bottom: 1px solid var(--zen-line);
  padding-bottom: 2px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s;
  &.visible { opacity: 1; transform: translateY(0); }
  &:hover { opacity: 1; border-color: var(--zen-text); }
`;

function Contact() {
  const { content } = useWedding();
  const data = content?.contact || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Kontakt';
  const text = data.text || 'Bei Fragen erreicht ihr uns unter:';
  const email = data.email || '';
  const phone = data.phone || '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="contact" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Text className={visible ? 'visible' : ''}>{text}</Text>
        {email && <ContactLink className={visible ? 'visible' : ''} href={`mailto:${email}`}>{email}</ContactLink>}
        {phone && <ContactLink className={visible ? 'visible' : ''} href={`tel:${phone}`} style={{display: 'block', marginTop: '0.5rem'}}>{phone}</ContactLink>}
      </Content>
    </Section>
  );
}

export default Contact;
