import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  padding: var(--section-padding) 0;
  min-height: 100vh;
  overflow: hidden;
`;

const VideoBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const Deadline = styled.div`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-red);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const Form = styled.form`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const AttendanceToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ToggleButton = styled.button`
  padding: 1.5rem 2rem;
  background: ${p => p.$active 
    ? (p.$yes ? 'rgba(76, 175, 80, 0.9)' : 'rgba(196, 30, 58, 0.9)') 
    : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${p => p.$active 
    ? (p.$yes ? 'rgba(76, 175, 80, 1)' : 'var(--editorial-red)') 
    : 'rgba(255, 255, 255, 0.2)'};
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: clamp(0.85rem, 2vw, 1.1rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${p => p.$yes ? 'rgba(76, 175, 80, 0.8)' : 'rgba(196, 30, 58, 0.8)'};
    border-color: ${p => p.$yes ? 'rgba(76, 175, 80, 1)' : 'var(--editorial-red)'};
    transform: translateY(-2px);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-white);
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  background: var(--editorial-light-gray);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
    background: var(--editorial-white);
  }
  
  &::placeholder {
    color: var(--editorial-gray);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  background: var(--editorial-light-gray);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  background: var(--editorial-light-gray);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
    background: var(--editorial-white);
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: var(--editorial-red);
  margin: 2rem 0;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.7s;
  `}
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.5rem 2rem;
  background: var(--editorial-black);
  color: var(--editorial-white);
  border: none;
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--editorial-red);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${p => p.$submitting && css`
    animation: ${pulse} 1s ease infinite;
  `}
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(196, 30, 58, 0.1);
  border-left: 3px solid var(--editorial-red);
  color: var(--editorial-red);
  font-family: var(--font-body);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

// ============================================
// COMPONENT
// ============================================

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'RSVP';
  const description = rsvpData.description || 'Bitte gebt uns bis zum Stichtag Bescheid, ob ihr dabei seid.';
  const deadline = rsvpData.deadline || '';
  const askDietary = rsvpData.ask_dietary !== false;
  const askAllergies = rsvpData.ask_allergies !== false;
  const askSongWish = rsvpData.ask_song_wish || false;
  
  const {
    formData,
    submitting,
    error,
    success,
    updateField,
    submitRSVP,
  } = useRSVP();
  
  const [visible, setVisible] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: formData.attending 
          ? 'Vielen Dank! Wir freuen uns auf euch!' 
          : 'Schade, dass ihr nicht dabei sein könnt. Danke für die Rückmeldung!',
      });
    }
  }, [success, formData.attending]);

  useEffect(() => {
    if (error) {
      setModalState({
        isOpen: true,
        type: 'error',
        message: error,
      });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitRSVP();
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Video URL
  const videoUrl = rsvpData.video_background || 
    'https://res.cloudinary.com/si-weddings/video/upload/v1769608965/212698_small_yvnkfr.mp4';

  return (
    <Section id="rsvp" ref={sectionRef}>
      <VideoBackground>
        <video autoPlay muted loop playsInline>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </VideoBackground>
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Seid ihr dabei?</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
          {deadline && (
            <Deadline $visible={visible}>
              Bitte antwortet bis {formatDeadline(deadline)}
            </Deadline>
          )}
        </Header>
        
        <Form $visible={visible} onSubmit={handleSubmit}>
          <AttendanceToggle>
            <ToggleButton
              type="button"
              $active={formData.attending === true}
              $yes
              onClick={() => updateField('attending', true)}
            >
              Ja, ich bin dabei
            </ToggleButton>
            <ToggleButton
              type="button"
              $active={formData.attending === false}
              onClick={() => updateField('attending', false)}
            >
              Leider nicht
            </ToggleButton>
          </AttendanceToggle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGrid>
            <FormGroup>
              <Label>Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Vor- und Nachname"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>E-Mail *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="email@beispiel.de"
                required
              />
            </FormGroup>
            
            {formData.attending && (
              <>
                <FormGroup>
                  <Label>Anzahl Personen</Label>
                  <Select
                    value={formData.persons}
                    onChange={(e) => updateField('persons', parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                    ))}
                  </Select>
                </FormGroup>
                
                {askDietary && (
                  <FormGroup>
                    <Label>Ernährung</Label>
                    <Select
                      value={formData.dietary}
                      onChange={(e) => updateField('dietary', e.target.value)}
                    >
                      <option value="">Keine besonderen Wünsche</option>
                      <option value="vegetarisch">Vegetarisch</option>
                      <option value="vegan">Vegan</option>
                      <option value="andere">Andere</option>
                    </Select>
                  </FormGroup>
                )}
                
                {askAllergies && (
                  <FormGroup className="full-width">
                    <Label>Allergien / Unverträglichkeiten</Label>
                    <Input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => updateField('allergies', e.target.value)}
                      placeholder="z.B. Nüsse, Laktose..."
                    />
                  </FormGroup>
                )}
                
                {askSongWish && (
                  <FormGroup className="full-width">
                    <Label>Musikwunsch</Label>
                    <Input
                      type="text"
                      value={formData.songWish}
                      onChange={(e) => updateField('songWish', e.target.value)}
                      placeholder="Welcher Song bringt dich auf die Tanzfläche?"
                    />
                  </FormGroup>
                )}
              </>
            )}
            
            <FormGroup className="full-width">
              <Label>Nachricht (optional)</Label>
              <TextArea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Möchtet ihr uns noch etwas mitteilen?"
              />
            </FormGroup>
          </FormGrid>
          
          <Divider $visible={visible} />
          
          <SubmitButton type="submit" disabled={submitting} $submitting={submitting}>
            {submitting ? 'Wird gesendet...' : 'Absenden'}
          </SubmitButton>
        </Form>
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={modalState.type === 'success' ? 4000 : 0}
      />
    </Section>
  );
}

export default RSVP;
