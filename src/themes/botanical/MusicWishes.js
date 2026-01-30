import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 60vh;
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
  margin-bottom: 1rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: var(--zen-text-light);
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Input = styled.input`
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--zen-text);
  background: transparent;
  border: 1px solid var(--zen-line);
  text-align: center;
  outline: none;
  &:focus { border-color: var(--zen-text); }
`;

const Submit = styled.button`
  padding: 1rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--zen-bg);
  background: var(--zen-text);
  border: none;
  cursor: pointer;
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.4; }
`;

const Success = styled.p`
  font-size: 0.9rem;
  color: var(--zen-text-light);
  margin-top: 2rem;
`;

function MusicWishes() {
  const { content } = useWedding();
  const data = content?.musicwishes || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ song: '', name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const title = data.title || 'Musikwünsche';
  const subtitle = data.subtitle || 'Welcher Song bringt euch auf die Tanzfläche?';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.song) return;
    setSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 500));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Section id="musicwishes" ref={sectionRef}>
        <Content>
          <Title className="visible">{title}</Title>
          <Success>Danke für deinen Musikwunsch!</Success>
        </Content>
      </Section>
    );
  }

  return (
    <Section id="musicwishes" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Subtitle className={visible ? 'visible' : ''}>{subtitle}</Subtitle>
        <Form className={visible ? 'visible' : ''} onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Song / Interpret" 
            value={formData.song} 
            onChange={e => setFormData(p => ({...p, song: e.target.value}))} 
          />
          <Input 
            type="text" 
            placeholder="Dein Name (optional)" 
            value={formData.name} 
            onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
          />
          <Submit type="submit" disabled={!formData.song || submitting}>
            {submitting ? 'Senden...' : 'Wünschen'}
          </Submit>
        </Form>
      </Content>
    </Section>
  );
}

export default MusicWishes;
