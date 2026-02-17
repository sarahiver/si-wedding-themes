// Neon RSVP - Cyberpunk multi-step form with per-person dietary/allergies
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,255,255,0.5); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #0a0a0f;
  padding: 100px 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;

  &:nth-child(1) {
    background: #00ffff;
    top: -100px;
    left: -100px;
  }

  &:nth-child(2) {
    background: #ff00ff;
    bottom: -100px;
    right: -100px;
  }
`;

const Container = styled.div`
  max-width: 700px;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;

  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 50px;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.8s ease 0.2s;

  @media (max-width: 500px) {
    gap: 30px;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const StepCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid ${p => p.$active ? '#00ffff' : p.$completed ? '#00ff88' : 'rgba(255,255,255,0.2)'};
  background: ${p => p.$completed ? '#00ff88' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${p => p.$active ? '#00ffff' : p.$completed ? '#0a0a0f' : 'rgba(255,255,255,0.3)'};
  transition: all 0.3s ease;

  ${p => p.$active && css`
    box-shadow: 0 0 20px rgba(0,255,255,0.5);
  `}
`;

const StepLabel = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$active ? '#00ffff' : 'rgba(255,255,255,0.3)'};
`;

const FormCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.2);
  padding: 50px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent);
    animation: ${scanline} 4s linear infinite;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const FormStep = styled.div`
  display: ${p => p.$active ? 'block' : 'none'};
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(0,255,255,0.2);
  color: #fff;
  padding: 18px 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.3);
  }

  &::placeholder {
    color: rgba(255,255,255,0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(0,255,255,0.2);
  color: #fff;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.3);
  }

  option {
    background: #0a0a0f;
    color: #fff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(0,255,255,0.2);
  color: #fff;
  padding: 18px 20px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.3);
  }
`;

const AttendanceToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const ToggleOption = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 25px;
  background: ${p => p.$selected ? (p.$yes ? '#00ff88' : '#ff00ff') : 'rgba(255,255,255,0.02)'};
  border: 2px solid ${p => p.$selected ? (p.$yes ? '#00ff88' : '#ff00ff') : 'rgba(255,255,255,0.1)'};
  color: ${p => p.$selected ? '#0a0a0f' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${p => p.$yes ? '#00ff88' : '#ff00ff'};
    ${p => p.$selected && css`
      box-shadow: 0 0 30px ${p.$yes ? 'rgba(0,255,136,0.5)' : 'rgba(255,0,255,0.5)'};
    `}
  }
`;

const GuestSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,255,255,0.2);
`;

const GuestSectionTitle = styled.h4`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #00ffff;
  margin-bottom: 1.5rem;
`;

const GuestCard = styled.div`
  background: rgba(0,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.15);
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

const GuestNumber = styled.span`
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 1rem;
`;

const GuestFields = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const SmallInput = styled(Input)`
  padding: 14px 16px;
  font-size: 0.9rem;
`;

const SmallSelect = styled(Select)`
  padding: 14px 16px;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
`;

const Button = styled.button`
  flex: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 20px 30px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$primary ? css`
    background: #00ffff;
    border: none;
    color: #0a0a0f;
    box-shadow: 0 0 20px rgba(0,255,255,0.4);

    &:hover:not(:disabled) {
      box-shadow: 0 0 40px rgba(0,255,255,0.6);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  ` : css`
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.6);

    &:hover {
      border-color: rgba(255,255,255,0.4);
      color: #fff;
    }
  `}
`;

const ErrorMessage = styled.div`
  background: rgba(255,0,100,0.1);
  border: 1px solid rgba(255,0,100,0.3);
  color: #ff6b6b;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};

  const title = rsvpData.title || 'RSVP';
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
  } = useRSVP();

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
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
          ? "We can't wait to celebrate with you!"
          : "Thank you for letting us know. We'll be thinking of you!",
      });
    }
  }, [submitted, formData.attending]);

  useEffect(() => {
    if (error) {
      setModalState({ isOpen: true, type: 'error', message: error });
    }
  }, [error]);

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

  const steps = [
    { num: 1, label: 'Attendance' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Confirm' }
  ];

  return (
    <Section ref={sectionRef} id="rsvp">
      <GridBG />
      <GlowOrb />
      <GlowOrb />

      <Container>
        <Header $visible={visible}>
          <Eyebrow>// Respond Please</Eyebrow>
          <Title>Your <span>RSVP</span></Title>
        </Header>

        <ProgressSteps $visible={visible}>
          {steps.map(step => (
            <Step key={step.num}>
              <StepCircle
                $active={currentStep === step.num}
                $completed={currentStep > step.num}
              >
                {currentStep > step.num ? '✓' : step.num}
              </StepCircle>
              <StepLabel $active={currentStep === step.num}>{step.label}</StepLabel>
            </Step>
          ))}
        </ProgressSteps>

        <FormCard>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormStep $active={currentStep === 1}>
            <Label>Will you be joining us?</Label>
            <AttendanceToggle>
              <ToggleOption
                type="button"
                $yes
                $selected={formData.attending === true}
                onClick={() => updateField('attending', true)}
              >
                Hell Yeah!
              </ToggleOption>
              <ToggleOption
                type="button"
                $selected={formData.attending === false}
                onClick={() => updateField('attending', false)}
              >
                Can't Make It
              </ToggleOption>
            </AttendanceToggle>

            <ButtonGroup>
              <Button
                type="button"
                $primary
                disabled={formData.attending === null || formData.attending === undefined}
                onClick={() => setCurrentStep(2)}
              >
                Continue
              </Button>
            </ButtonGroup>
          </FormStep>

          <FormStep $active={currentStep === 2}>
            <InputGroup>
              <Label>Your Name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
              />
            </InputGroup>

            {formData.attending && (
              <InputGroup>
                <Label>Number of Guests</Label>
                <Select
                  value={formData.persons}
                  onChange={e => handlePersonsChange(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
                  ))}
                </Select>
              </InputGroup>
            )}

            <ButtonGroup>
              <Button type="button" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button
                type="button"
                $primary
                disabled={!formData.name || !formData.email}
                onClick={() => setCurrentStep(3)}
              >
                Continue
              </Button>
            </ButtonGroup>
          </FormStep>

          <FormStep $active={currentStep === 3}>
            {formData.attending && (askDietary || askAllergies) && (
              <>
                {formData.persons === 1 ? (
                  <>
                    {askDietary && (
                      <InputGroup>
                        <Label>Dietary Requirements</Label>
                        <Select
                          value={formData.dietary}
                          onChange={e => updateField('dietary', e.target.value)}
                        >
                          <option value="">No special requirements</option>
                          <option value="vegetarisch">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="andere">Other</option>
                        </Select>
                      </InputGroup>
                    )}
                    {askAllergies && (
                      <InputGroup>
                        <Label>Allergies / Intolerances</Label>
                        <Input
                          type="text"
                          placeholder="e.g. Nuts, Lactose..."
                          value={formData.allergies}
                          onChange={e => updateField('allergies', e.target.value)}
                        />
                      </InputGroup>
                    )}
                  </>
                ) : (
                  <GuestSection>
                    <GuestSectionTitle>Details per Person</GuestSectionTitle>
                    {Array.from({ length: formData.persons }, (_, i) => {
                      const guest = formData.guests?.[i] || { name: '', dietary: '', allergies: '' };
                      return (
                        <GuestCard key={i}>
                          <GuestNumber>Person {i + 1}{i === 0 ? ' (You)' : ''}</GuestNumber>
                          <GuestFields>
                            {i > 0 && (
                              <SmallInput
                                type="text"
                                value={guest.name}
                                onChange={e => updateGuest(i, 'name', e.target.value)}
                                placeholder={`Name Person ${i + 1}`}
                              />
                            )}
                            {askDietary && (
                              <SmallSelect
                                value={i === 0 ? formData.dietary : guest.dietary}
                                onChange={e => i === 0
                                  ? updateField('dietary', e.target.value)
                                  : updateGuest(i, 'dietary', e.target.value)
                                }
                              >
                                <option value="">No special requirements</option>
                                <option value="vegetarisch">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="andere">Other</option>
                              </SmallSelect>
                            )}
                            {askAllergies && (
                              <SmallInput
                                type="text"
                                value={i === 0 ? formData.allergies : guest.allergies}
                                onChange={e => i === 0
                                  ? updateField('allergies', e.target.value)
                                  : updateGuest(i, 'allergies', e.target.value)
                                }
                                placeholder="Allergies / Intolerances"
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
              <InputGroup>
                <Label>{customQuestion}</Label>
                <TextArea
                  placeholder="Your answer..."
                  value={formData.customAnswer || ''}
                  onChange={e => updateField('customAnswer', e.target.value)}
                />
              </InputGroup>
            )}

            <InputGroup>
              <Label>Message for the Couple (Optional)</Label>
              <TextArea
                placeholder="Share your wishes, song requests, or just say hi..."
                value={formData.message}
                onChange={e => updateField('message', e.target.value)}
              />
            </InputGroup>

            <ButtonGroup>
              <Button type="button" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button type="button" $primary onClick={submit} disabled={submitting}>
                {submitting ? 'Sending...' : 'Submit RSVP'}
              </Button>
            </ButtonGroup>
          </FormStep>
        </FormCard>
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
