// Luxe RSVP - Elegant Form
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP } from '../../lib/supabase';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-charcoal);
  margin-top: 1rem;
`;

const Form = styled.form`
  opacity: 0;
  animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: 0.2s;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-charcoal);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--luxe-black);
  background: var(--luxe-cream);
  border: 1px solid var(--luxe-sand);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--luxe-olive);
  }
  
  &::placeholder {
    color: var(--luxe-taupe);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--luxe-black);
  background: var(--luxe-cream);
  border: 1px solid var(--luxe-sand);
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--luxe-olive);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--luxe-black);
  background: var(--luxe-cream);
  border: 1px solid var(--luxe-sand);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--luxe-olive);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-charcoal);
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    accent-color: var(--luxe-olive);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-white);
  background: var(--luxe-black);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: var(--luxe-charcoal);
  }
  
  &:disabled {
    background: var(--luxe-taupe);
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--luxe-charcoal);
`;

function RSVP() {
  const { project, content } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'Zusagen';
  
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    guests: '1',
    dietary: '',
    message: ''
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    
    setLoading(true);
    try {
      await submitRSVP(project.id, {
        name: formData.name,
        email: formData.email,
        attending: formData.attending === 'yes',
        guest_count: parseInt(formData.guests),
        dietary_requirements: formData.dietary,
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      console.error('RSVP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section ref={sectionRef} id="rsvp">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Antworten</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>Wir freuen uns auf eure Rueckmeldung</Subtitle>
        </Header>
        
        {submitted ? (
          <SuccessMessage>
            <SuccessTitle>Vielen Dank!</SuccessTitle>
            <SuccessText>Wir haben eure Antwort erhalten und freuen uns auf euch.</SuccessText>
          </SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <FormGroup>
              <Label>Name *</Label>
              <Input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
                placeholder="Vor- und Nachname"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>E-Mail *</Label>
              <Input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="email@beispiel.de"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Teilnahme</Label>
              <RadioGroup>
                <RadioLabel>
                  <input 
                    type="radio" 
                    name="attending" 
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={handleChange}
                  />
                  Ich komme gerne
                </RadioLabel>
                <RadioLabel>
                  <input 
                    type="radio" 
                    name="attending" 
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={handleChange}
                  />
                  Leider nicht
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
            
            {formData.attending === 'yes' && (
              <>
                <FormGroup>
                  <Label>Anzahl Gaeste</Label>
                  <Select name="guests" value={formData.guests} onChange={handleChange}>
                    <option value="1">1 Person</option>
                    <option value="2">2 Personen</option>
                    <option value="3">3 Personen</option>
                    <option value="4">4 Personen</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label>Ernaehrungswuensche</Label>
                  <Input 
                    type="text" 
                    name="dietary" 
                    value={formData.dietary}
                    onChange={handleChange}
                    placeholder="Vegetarisch, Allergien, etc."
                  />
                </FormGroup>
              </>
            )}
            
            <FormGroup>
              <Label>Nachricht (optional)</Label>
              <TextArea 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                placeholder="Eine persoenliche Nachricht an uns..."
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Wird gesendet...' : 'Absenden'}
            </SubmitButton>
          </Form>
        )}
      </Container>
    </Section>
  );
}

export default RSVP;
