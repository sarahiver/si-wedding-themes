import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP } from '../../lib/supabase';

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, var(--cream-dark) 0%, var(--cream) 100%);
  position: relative;
  overflow: hidden;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  opacity: 0.1;
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  animation: ${sway} 6s ease-in-out infinite;
  pointer-events: none;
  svg { width: 100%; height: 100%; fill: var(--sage); }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 1rem;
  line-height: 1.7;
`;

const Form = styled.form`
  background: var(--cream-light);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid var(--sage-light);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: 0.2s;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text);
  cursor: pointer;
  
  input {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--sage-light);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    
    &:checked {
      border-color: var(--sage);
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: var(--sage);
        border-radius: 50%;
      }
    }
  }
`;

const Button = styled.button`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1.25rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--sage-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Success = styled.div`
  text-align: center;
  padding: 3rem;
  
  .icon { font-size: 4rem; margin-bottom: 1rem; }
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: var(--forest);
    margin-bottom: 1rem;
  }
  p {
    font-family: 'Lato', sans-serif;
    color: var(--text-light);
  }
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function RSVP({ content = {} }) {
  const { projectId } = useWedding();
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', persons: 1, attending: true, dietary: '', message: ''
  });
  const sectionRef = useRef(null);

  const title = content.title || 'Zusagen';
  const description = content.description || 'Wir freuen uns auf eure Rückmeldung.';
  const deadline = content.deadline || '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitRSVP(projectId, formData);
      setSubmitted(true);
    } catch (err) {
      console.error('RSVP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section ref={sectionRef} id="rsvp">
      <FloatingLeaf $size={80} $top="10%" $left="5%"><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={60} $top="60%" $right="8%"><LeafSVG /></FloatingLeaf>
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Seid ihr dabei?</Eyebrow>
          <Title>{title}</Title>
          <Description>{description}</Description>
          {deadline && <Description style={{ fontStyle: 'italic' }}>Bitte antwortet bis {deadline}</Description>}
        </Header>
        
        <Form $visible={visible} onSubmit={handleSubmit}>
          {submitted ? (
            <Success>
              <div className="icon">🌿</div>
              <h3>Vielen Dank!</h3>
              <p>Eure Rückmeldung ist bei uns angekommen.</p>
            </Success>
          ) : (
            <>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </FormGroup>
              <FormGroup>
                <Label>E-Mail</Label>
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </FormGroup>
              <FormGroup>
                <Label>Anzahl Personen</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={formData.persons}
                  onChange={e => setFormData({...formData, persons: parseInt(e.target.value)})}
                />
              </FormGroup>
              <FormGroup>
                <Label>Teilnahme</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      checked={formData.attending}
                      onChange={() => setFormData({...formData, attending: true})}
                    />
                    Ja, wir kommen!
                  </RadioLabel>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      checked={!formData.attending}
                      onChange={() => setFormData({...formData, attending: false})}
                    />
                    Leider nicht
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>
              <FormGroup>
                <Label>Ernährungshinweise</Label>
                <Input 
                  type="text" 
                  placeholder="z.B. vegetarisch, Allergien..."
                  value={formData.dietary}
                  onChange={e => setFormData({...formData, dietary: e.target.value})}
                />
              </FormGroup>
              <FormGroup>
                <Label>Nachricht (optional)</Label>
                <Textarea 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </FormGroup>
              <Button type="submit" disabled={loading}>
                {loading ? 'Wird gesendet...' : 'Absenden'}
              </Button>
            </>
          )}
        </Form>
      </Container>
    </Section>
  );
}

export default RSVP;
