import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRSVP } from '../../components/shared/RSVPCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

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

const Deadline = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-style: italic;
  color: var(--sage);
  margin-top: 0.5rem;
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
  padding: 0.75rem 1rem;
  background: ${p => p.$active ? 'var(--sage-muted)' : 'var(--cream)'};
  border: 1px solid ${p => p.$active ? 'var(--sage)' : 'var(--sage-light)'};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover { border-color: var(--sage); }
  
  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${p => p.$active ? 'var(--sage)' : 'var(--sage-light)'};
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    
    &:checked::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: var(--sage);
      border-radius: 50%;
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
  
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(192, 57, 43, 0.1);
  border-radius: 6px;
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
  p { font-family: 'Lato', sans-serif; color: var(--text-light); }
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  const [visible, setVisible] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  const { submitting, submitted, error, formData, updateField, toggleAttending, submit } = useRSVP();

  const title = rsvpData.title || 'Zusagen';
  const description = rsvpData.description || 'Wir freuen uns auf eure Rückmeldung.';
  const deadline = rsvpData.deadline || '';

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
    const result = await submit();
    if (result.success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: formData.attending ? 'Wunderbar! Wir freuen uns auf euch! 🌿' : 'Schade! Danke für eure Rückmeldung.',
      });
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
          {deadline && <Deadline>Bitte antwortet bis {deadline}</Deadline>}
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
                <Label>Name *</Label>
                <Input type="text" placeholder="Euer Name" value={formData.name} onChange={e => updateField('name', e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label>E-Mail *</Label>
                <Input type="email" placeholder="eure@email.de" value={formData.email} onChange={e => updateField('email', e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label>Teilnahme</Label>
                <RadioGroup>
                  <RadioLabel $active={formData.attending}>
                    <input type="radio" checked={formData.attending} onChange={() => toggleAttending(true)} />
                    Ja, wir kommen!
                  </RadioLabel>
                  <RadioLabel $active={!formData.attending}>
                    <input type="radio" checked={!formData.attending} onChange={() => toggleAttending(false)} />
                    Leider nicht
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>
              {formData.attending && (
                <>
                  <FormGroup>
                    <Label>Anzahl Personen</Label>
                    <Input type="number" min="1" max="10" value={formData.persons} onChange={e => updateField('persons', parseInt(e.target.value) || 1)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Ernährungshinweise</Label>
                    <Input type="text" placeholder="z.B. vegetarisch, Allergien..." value={formData.dietary} onChange={e => updateField('dietary', e.target.value)} />
                  </FormGroup>
                </>
              )}
              <FormGroup>
                <Label>Nachricht (optional)</Label>
                <Textarea placeholder="Möchtet ihr uns noch etwas mitteilen?" value={formData.message} onChange={e => updateField('message', e.target.value)} />
              </FormGroup>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <Button type="submit" disabled={submitting}>{submitting ? 'Wird gesendet...' : 'Absenden'}</Button>
            </>
          )}
        </Form>
      </Container>
      
      <FeedbackModal isOpen={modalState.isOpen} onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))} type={modalState.type} message={modalState.message} autoClose={3000} />
    </Section>
  );
}

export default RSVP;
