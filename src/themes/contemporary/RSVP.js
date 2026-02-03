// Contemporary RSVP - Multi-Step Wizard with Multi-Person Support
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: linear-gradient(135deg, var(--coral), var(--electric));
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.5rem;
`;

const Card = styled.div`
  background: var(--white);
  padding: clamp(2rem, 5vw, 3rem);
  border: 4px solid var(--black);
  box-shadow: 12px 12px 0 var(--black);
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gray-200);
    transform: translateY(-50%);
  }
`;

const ProgressStep = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${p => p.$active ? 'var(--coral)' : p.$done ? 'var(--electric)' : 'var(--gray-200)'};
  color: ${p => (p.$active || p.$done) ? 'var(--white)' : 'var(--gray-400)'};
  border: 4px solid var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  z-index: 1;
`;

const StepContent = styled.div`
  animation: ${slideIn} 0.3s ease;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: var(--gray-100);
  border: 3px solid var(--black);
  
  &:focus {
    outline: none;
    border-color: var(--coral);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: var(--gray-100);
  border: 3px solid var(--black);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--coral);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: var(--gray-100);
  border: 3px solid var(--black);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--coral);
  }
`;

const AttendanceButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const AttendanceBtn = styled.button`
  padding: 1.5rem;
  background: ${p => p.$selected ? (p.$yes ? 'var(--electric)' : 'var(--coral)') : 'var(--white)'};
  color: ${p => p.$selected ? 'var(--white)' : 'var(--black)'};
  border: 4px solid var(--black);
  box-shadow: ${p => p.$selected ? 'none' : '6px 6px 0 var(--black)'};
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    ${p => !p.$selected && 'transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--black);'}
  }
  
  .emoji {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const GuestCards = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GuestCard = styled.div`
  background: var(--gray-100);
  border: 3px solid var(--black);
  padding: 1rem;
`;

const GuestHeader = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.75rem;
`;

const GuestFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const SmallInput = styled(Input)`
  padding: 0.75rem;
  font-size: 0.9rem;
`;

const SmallSelect = styled(Select)`
  padding: 0.75rem;
  font-size: 0.9rem;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavBtn = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${p => p.$primary ? 'var(--coral)' : 'var(--white)'};
  color: ${p => p.$primary ? 'var(--white)' : 'var(--black)'};
  border: 4px solid var(--black);
  box-shadow: ${p => p.$primary ? '6px 6px 0 var(--black)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessEmoji = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: var(--white);
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--coral);
  border: 3px solid var(--black);
  font-weight: 600;
`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'RSVP';
  const description = rsvpData.description || 'Wir freuen uns auf deine Antwort!';
  const askDietary = rsvpData.ask_dietary !== false;
  const askAllergies = rsvpData.ask_allergies !== false;
  const customQuestion = rsvpData.custom_question || '';
  
  const {
    formData,
    submitting,
    submitted,
    error,
    updateField,
    submit,
  } = useRSVP();
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const canProceed = () => {
    if (step === 1) return formData.name && formData.email;
    if (step === 2) return formData.attending !== null && formData.attending !== undefined;
    return true;
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await submit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePersonsChange = (newCount) => {
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
  };

  const updateGuest = (index, field, value) => {
    const newGuests = [...(formData.guests || [])];
    if (!newGuests[index]) newGuests[index] = { name: '', dietary: '', allergies: '' };
    newGuests[index] = { ...newGuests[index], [field]: value };
    updateField('guests', newGuests);
  };

  if (submitted) {
    return (
      <Section id="rsvp">
        <Container>
          <Card>
            <SuccessState>
              <SuccessEmoji>{formData.attending ? '🎉' : '💌'}</SuccessEmoji>
              <SuccessTitle>{formData.attending ? 'Danke!' : 'Schade!'}</SuccessTitle>
              <SuccessText>
                {formData.attending 
                  ? 'Wir freuen uns riesig auf euch!' 
                  : 'Danke für die Rückmeldung. Wir werden euch vermissen!'}
              </SuccessText>
            </SuccessState>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="rsvp">
      <Container>
        <Header>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <Card>
          <ProgressBar>
            {[1, 2, 3].map(s => (
              <ProgressStep key={s} $active={step === s} $done={step > s}>
                {step > s ? '✓' : s}
              </ProgressStep>
            ))}
          </ProgressBar>
          
          {step === 1 && (
            <StepContent key="step1">
              <StepTitle>Wer bist du?</StepTitle>
              <FormGroup>
                <Label>Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Vor- und Nachname"
                />
              </FormGroup>
              <FormGroup>
                <Label>E-Mail *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="email@beispiel.de"
                />
              </FormGroup>
            </StepContent>
          )}
          
          {step === 2 && (
            <StepContent key="step2">
              <StepTitle>Bist du dabei?</StepTitle>
              <AttendanceButtons>
                <AttendanceBtn
                  $yes
                  $selected={formData.attending === true}
                  onClick={() => updateField('attending', true)}
                >
                  <span className="emoji">🎉</span>
                  Ja, klar!
                </AttendanceBtn>
                <AttendanceBtn
                  $selected={formData.attending === false}
                  onClick={() => updateField('attending', false)}
                >
                  <span className="emoji">😢</span>
                  Leider nicht
                </AttendanceBtn>
              </AttendanceButtons>
              
              {formData.attending && (
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label>Wie viele Personen?</Label>
                  <Select
                    value={formData.persons}
                    onChange={e => handlePersonsChange(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                    ))}
                  </Select>
                </FormGroup>
              )}
            </StepContent>
          )}
          
          {step === 3 && (
            <StepContent key="step3">
              <StepTitle>Fast geschafft!</StepTitle>
              
              {formData.attending && (askDietary || askAllergies) && (
                <>
                  {formData.persons === 1 ? (
                    <>
                      {askDietary && (
                        <FormGroup>
                          <Label>Ernährung</Label>
                          <Select
                            value={formData.dietary}
                            onChange={e => updateField('dietary', e.target.value)}
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
                          <Label>Allergien</Label>
                          <Input
                            type="text"
                            value={formData.allergies}
                            onChange={e => updateField('allergies', e.target.value)}
                            placeholder="z.B. Nüsse, Laktose..."
                          />
                        </FormGroup>
                      )}
                    </>
                  ) : (
                    <GuestCards>
                      {Array.from({ length: formData.persons }, (_, i) => {
                        const guest = formData.guests?.[i] || {};
                        return (
                          <GuestCard key={i}>
                            <GuestHeader>Person {i + 1}{i === 0 ? ' (du)' : ''}</GuestHeader>
                            <GuestFields>
                              {i > 0 && (
                                <SmallInput
                                  type="text"
                                  value={guest.name || ''}
                                  onChange={e => updateGuest(i, 'name', e.target.value)}
                                  placeholder="Name"
                                />
                              )}
                              {askDietary && (
                                <SmallSelect
                                  value={i === 0 ? formData.dietary : guest.dietary || ''}
                                  onChange={e => i === 0 
                                    ? updateField('dietary', e.target.value)
                                    : updateGuest(i, 'dietary', e.target.value)
                                  }
                                >
                                  <option value="">Ernährung</option>
                                  <option value="vegetarisch">Vegetarisch</option>
                                  <option value="vegan">Vegan</option>
                                  <option value="andere">Andere</option>
                                </SmallSelect>
                              )}
                              {askAllergies && (
                                <SmallInput
                                  type="text"
                                  value={i === 0 ? formData.allergies : guest.allergies || ''}
                                  onChange={e => i === 0
                                    ? updateField('allergies', e.target.value)
                                    : updateGuest(i, 'allergies', e.target.value)
                                  }
                                  placeholder="Allergien"
                                />
                              )}
                            </GuestFields>
                          </GuestCard>
                        );
                      })}
                    </GuestCards>
                  )}
                </>
              )}
              
              {customQuestion && (
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label>{customQuestion}</Label>
                  <TextArea
                    value={formData.customAnswer || ''}
                    onChange={e => updateField('customAnswer', e.target.value)}
                    placeholder="Deine Antwort..."
                  />
                </FormGroup>
              )}

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Nachricht (optional)</Label>
                <TextArea
                  value={formData.message}
                  onChange={e => updateField('message', e.target.value)}
                  placeholder="Möchtest du uns noch etwas mitteilen?"
                />
              </FormGroup>
            </StepContent>
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <NavButtons>
            {step > 1 && <NavBtn onClick={handleBack}>← Zurück</NavBtn>}
            <NavBtn 
              $primary 
              onClick={handleNext}
              disabled={!canProceed() || submitting}
            >
              {submitting ? 'Senden...' : step === totalSteps ? 'Absenden →' : 'Weiter →'}
            </NavBtn>
          </NavButtons>
        </Card>
      </Container>
    </Section>
  );
}

export default RSVP;
