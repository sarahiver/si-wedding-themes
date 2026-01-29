// Video Theme - RSVP Section
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP } from '../../lib/supabase';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Content = styled.div`text-align: center; max-width: 500px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;
`;

const Input = styled.input`
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--video-white);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--video-accent);
    background: rgba(255,255,255,0.08);
  }
  
  &::placeholder { color: var(--video-gray); }
`;

const Select = styled.select`
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--video-white);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  cursor: pointer;
  
  &:focus { outline: none; border-color: var(--video-accent); }
  
  option { background: var(--video-charcoal); }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--video-white);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  min-height: 80px;
  resize: vertical;
  
  &:focus { outline: none; border-color: var(--video-accent); }
  &::placeholder { color: var(--video-gray); }
`;

const RadioGroup = styled.div`display: flex; gap: 1rem;`;
const RadioLabel = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.$checked ? 'var(--video-white)' : 'var(--video-gray)'};
  background: ${p => p.$checked ? 'var(--video-accent)' : 'rgba(255,255,255,0.05)'};
  border: 1px solid ${p => p.$checked ? 'var(--video-accent)' : 'rgba(255,255,255,0.15)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  input { display: none; }
  &:hover { border-color: var(--video-accent); }
`;

const SubmitBtn = styled.button`
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-white);
  background: var(--video-accent);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { background: var(--video-accent-light); }
  &:disabled { background: var(--video-gray); cursor: not-allowed; }
`;

const Success = styled.div`text-align: center; padding: 2rem; opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessTitle = styled.h3`font-family: var(--font-accent); font-size: 2rem; font-style: italic; color: var(--video-white); margin-bottom: 0.5rem;`;
const SuccessText = styled.p`font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-silver);`;

function RSVP({ background }) {
  const { project, content } = useWedding();
  const title = content?.rsvp?.title || 'Zusagen';
  
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', attending: 'yes', guests: '1', dietary: '', message: '' });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    try {
      await submitRSVP(project.id, { name: formData.name, email: formData.email, attending: formData.attending === 'yes', guest_count: parseInt(formData.guests), dietary_requirements: formData.dietary, message: formData.message });
      setSubmitted(true);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <SectionWrapper id="rsvp" background={background}>
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Antworten</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        
        {submitted ? (
          <Success><SuccessTitle>Vielen Dank</SuccessTitle><SuccessText>Wir haben eure Antwort erhalten.</SuccessText></Success>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <Input type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} required />
            <RadioGroup>
              <RadioLabel $checked={formData.attending === 'yes'}><input type="radio" name="attending" value="yes" checked={formData.attending === 'yes'} onChange={handleChange} />Zusage</RadioLabel>
              <RadioLabel $checked={formData.attending === 'no'}><input type="radio" name="attending" value="no" checked={formData.attending === 'no'} onChange={handleChange} />Absage</RadioLabel>
            </RadioGroup>
            {formData.attending === 'yes' && (
              <>
                <Select name="guests" value={formData.guests} onChange={handleChange}>
                  <option value="1">1 Person</option>
                  <option value="2">2 Personen</option>
                  <option value="3">3 Personen</option>
                </Select>
                <Input type="text" name="dietary" placeholder="Ernaehrungswuensche (optional)" value={formData.dietary} onChange={handleChange} />
              </>
            )}
            <TextArea name="message" placeholder="Nachricht (optional)" value={formData.message} onChange={handleChange} />
            <SubmitBtn type="submit" disabled={loading}>{loading ? 'Wird gesendet...' : 'Absenden'}</SubmitBtn>
          </Form>
        )}
      </Content>
    </SectionWrapper>
  );
}

export default RSVP;
