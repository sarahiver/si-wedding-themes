import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 2.5rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 0;
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--zen-text);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--zen-line);
  text-align: center;
  outline: none;
  transition: border-color 0.3s;
  &:focus { border-color: var(--zen-text); }
  &::placeholder { color: var(--zen-text-muted); }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1px;
  background: var(--zen-line);
`;

const RadioBtn = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: ${p => p.$active ? 'var(--zen-bg)' : 'var(--zen-text-light)'};
  background: ${p => p.$active ? 'var(--zen-text)' : 'var(--zen-bg)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: ${p => p.$active ? 'var(--zen-text)' : 'var(--zen-bg-alt)'}; }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--zen-text);
  background: var(--zen-bg);
  border: 1px solid var(--zen-line);
  text-align: center;
  outline: none;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--zen-text);
  background: transparent;
  border: 1px solid var(--zen-line);
  text-align: center;
  outline: none;
  resize: none;
  min-height: 80px;
  &:focus { border-color: var(--zen-text); }
  &::placeholder { color: var(--zen-text-muted); }
`;

const Submit = styled.button`
  padding: 1.2rem 2.5rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--zen-bg);
  background: var(--zen-text);
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Success = styled.div`
  text-align: center;
  padding: 3rem 0;
  h3 {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }
  p { color: var(--zen-text-light); margin: 0; }
`;

function RSVP() {
  const { content } = useWedding();
  const data = content?.rsvp || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: null,
    persons: 1,
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const title = data.title || 'Zusagen';
  const canSubmit = formData.name && formData.email && formData.attending !== null;

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
    if (!canSubmit) return;
    setSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Section id="rsvp" ref={sectionRef}>
        <Content>
          <Success>
            <h3>{formData.attending ? 'Wunderbar!' : 'Schade!'}</h3>
            <p>{formData.attending ? 'Wir freuen uns auf euch.' : 'Danke für die Rückmeldung.'}</p>
          </Success>
        </Content>
      </Section>
    );
  }

  return (
    <Section id="rsvp" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Form className={visible ? 'visible' : ''} onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Name" 
            value={formData.name} 
            onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
          />
          <Input 
            type="email" 
            placeholder="E-Mail" 
            value={formData.email} 
            onChange={e => setFormData(p => ({...p, email: e.target.value}))} 
          />
          <RadioGroup>
            <RadioBtn 
              type="button" 
              $active={formData.attending === true} 
              onClick={() => setFormData(p => ({...p, attending: true}))}
            >
              Ja, gerne
            </RadioBtn>
            <RadioBtn 
              type="button" 
              $active={formData.attending === false} 
              onClick={() => setFormData(p => ({...p, attending: false}))}
            >
              Leider nicht
            </RadioBtn>
          </RadioGroup>
          {formData.attending && (
            <Select 
              value={formData.persons} 
              onChange={e => setFormData(p => ({...p, persons: parseInt(e.target.value)}))}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n} Person{n > 1 ? 'en' : ''}</option>
              ))}
            </Select>
          )}
          <TextArea 
            placeholder="Nachricht (optional)" 
            value={formData.message} 
            onChange={e => setFormData(p => ({...p, message: e.target.value}))} 
          />
          <Submit type="submit" disabled={!canSubmit || submitting}>
            {submitting ? 'Senden...' : 'Absenden'}
          </Submit>
        </Form>
      </Content>
    </Section>
  );
}

export default RSVP;
