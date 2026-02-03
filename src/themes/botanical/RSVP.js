import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
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
  z-index: 10;
  padding: var(--section-padding) 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
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
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
`;

const Deadline = styled.div`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2rem, 4vw, 3rem);
  position: relative;
  overflow: hidden;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
  
  /* Top highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.2) 20%, 
      rgba(255,255,255,0.35) 50%, 
      rgba(255,255,255,0.2) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    border-radius: 22px;
    padding: 2rem 1.5rem;
  }
`;

const AttendanceToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ToggleButton = styled.button`
  padding: 1.25rem 1.5rem;
  background: ${p => p.$active 
    ? (p.$yes ? 'rgba(76, 175, 80, 0.25)' : 'rgba(196, 30, 58, 0.25)') 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${p => p.$active 
    ? (p.$yes ? 'rgba(76, 175, 80, 0.6)' : 'rgba(196, 30, 58, 0.6)') 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${p => p.$yes ? 'rgba(76, 175, 80, 0.2)' : 'rgba(196, 30, 58, 0.2)'};
    border-color: ${p => p.$yes ? 'rgba(76, 175, 80, 0.5)' : 'rgba(196, 30, 58, 0.5)'};
  }
  
  ${p => p.$active && css`
    animation: ${pulse} 0.5s ease;
  `}
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.25rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: var(--text-dim);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  option {
    background: var(--bg-dark);
    color: var(--text-light);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: var(--text-dim);
  }
`;

const GuestSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const GuestSectionTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const GuestCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const GuestNumber = styled.span`
  display: block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
`;

const GuestFields = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 1.25rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bg-dark);
  cursor: pointer;
  transition: all 0.4s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255,255,255,0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  background: rgba(196, 30, 58, 0.2);
  border: 1px solid rgba(196, 30, 58, 0.4);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
`;

// ============================================
// COMPONENT
// ============================================

function RSVP() {
  const { content, weddingId } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'Zusagen';
  const description = rsvpData.description || 'Wir freuen uns auf euch!';
  const deadline = rsvpData.deadline || null;
  const askDietary = rsvpData.ask_dietary !== false;
  const askAllergies = rsvpData.ask_allergies !== false;
  const customQuestion = rsvpData.custom_question || '';
  
  const {
    formData,
    updateField,
    submitting,
    error,
    submitted,
    submit,
  } = useRSVP(weddingId);
  
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
    if (submitted) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: formData.attending 
          ? 'Vielen Dank! Wir freuen uns auf euch!' 
          : 'Schade, dass ihr nicht dabei sein könnt. Danke für die Rückmeldung!',
      });
    }
  }, [submitted, formData.attending]);

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
    await submit();
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Section id="rsvp" ref={sectionRef}>
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
        
        <GlassCard $visible={visible}>
          <form onSubmit={handleSubmit}>
            <AttendanceToggle>
              <ToggleButton
                type="button"
                $active={formData.attending === true}
                $yes
                onClick={() => updateField('attending', true)}
              >
                ✓ Ja, ich bin dabei
              </ToggleButton>
              <ToggleButton
                type="button"
                $active={formData.attending === false}
                onClick={() => updateField('attending', false)}
              >
                ✗ Leider nicht
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
                      onChange={(e) => {
                        const newCount = parseInt(e.target.value);
                        updateField('persons', newCount);
                        const currentGuests = formData.guests || [];
                        if (newCount > currentGuests.length) {
                          const newGuests = [...currentGuests];
                          for (let i = currentGuests.length; i < newCount; i++) {
                            newGuests.push({ name: '', dietary: '', allergies: '' });
                          }
                          updateField('guests', newGuests);
                        } else {
                          updateField('guests', currentGuests.slice(0, newCount));
                        }
                      }}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  
                  {formData.persons === 1 && (
                    <>
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
                        <FormGroup>
                          <Label>Allergien / Unverträglichkeiten</Label>
                          <Input
                            type="text"
                            value={formData.allergies}
                            onChange={(e) => updateField('allergies', e.target.value)}
                            placeholder="z.B. Nüsse, Laktose..."
                          />
                        </FormGroup>
                      )}
                    </>
                  )}
                  
                  {formData.persons > 1 && (askDietary || askAllergies) && (
                    <GuestSection>
                      <GuestSectionTitle>Angaben pro Person</GuestSectionTitle>
                      {Array.from({ length: formData.persons }, (_, i) => {
                        const guest = formData.guests?.[i] || { name: '', dietary: '', allergies: '' };
                        const updateGuest = (field, value) => {
                          const newGuests = [...(formData.guests || [])];
                          if (!newGuests[i]) newGuests[i] = { name: '', dietary: '', allergies: '' };
                          newGuests[i] = { ...newGuests[i], [field]: value };
                          updateField('guests', newGuests);
                        };
                        
                        return (
                          <GuestCard key={i}>
                            <GuestNumber>Person {i + 1}{i === 0 ? ' (Hauptgast)' : ''}</GuestNumber>
                            <GuestFields>
                              {i > 0 && (
                                <Input
                                  type="text"
                                  value={guest.name}
                                  onChange={(e) => updateGuest('name', e.target.value)}
                                  placeholder={`Name Person ${i + 1}`}
                                />
                              )}
                              {askDietary && (
                                <Select
                                  value={i === 0 ? formData.dietary : guest.dietary}
                                  onChange={(e) => i === 0 
                                    ? updateField('dietary', e.target.value)
                                    : updateGuest('dietary', e.target.value)
                                  }
                                >
                                  <option value="">Keine besonderen Wünsche</option>
                                  <option value="vegetarisch">Vegetarisch</option>
                                  <option value="vegan">Vegan</option>
                                  <option value="andere">Andere</option>
                                </Select>
                              )}
                              {askAllergies && (
                                <Input
                                  type="text"
                                  value={i === 0 ? formData.allergies : guest.allergies}
                                  onChange={(e) => i === 0
                                    ? updateField('allergies', e.target.value)
                                    : updateGuest('allergies', e.target.value)
                                  }
                                  placeholder="Allergien"
                                />
                              )}
                            </GuestFields>
                          </GuestCard>
                        );
                      })}
                    </GuestSection>
                  )}
                </>
              )}
              
              {customQuestion && (
                <FormGroup>
                  <Label>{customQuestion}</Label>
                  <TextArea
                    value={formData.customAnswer || ''}
                    onChange={(e) => updateField('customAnswer', e.target.value)}
                    placeholder="Deine Antwort..."
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Nachricht (optional)</Label>
                <TextArea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Möchtet ihr uns noch etwas mitteilen?"
                />
              </FormGroup>
            </FormGrid>
            
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Wird gesendet...' : 'Absenden'}
            </SubmitButton>
          </form>
        </GlassCard>
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
