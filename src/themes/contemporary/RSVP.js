import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, var(--coral), var(--electric));
  position: relative;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
`;

const Card = styled.div`
  background: var(--white);
  padding: 3rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-xl);
  
  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
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
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    height: 4px;
    background: var(--coral);
    transform: translateY(-50%);
    z-index: 1;
    width: ${p => ((p.$step - 1) / (p.$total - 1)) * 100}%;
    transition: width 0.5s ease;
  }
`;

const StepDot = styled.div`
  width: 40px;
  height: 40px;
  background: ${p => p.$active ? 'var(--coral)' : p.$completed ? 'var(--electric)' : 'var(--gray-200)'};
  border: 3px solid var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${p => (p.$active || p.$completed) ? 'var(--white)' : 'var(--gray-500)'};
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
`;

const StepDotActive = styled(StepDot)`
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const StepContent = styled.div`
  animation: ${slideIn} 0.4s ease;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  cursor: pointer;
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const ToggleGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ToggleButton = styled.button`
  padding: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${p => p.$active ? (p.$yes ? 'var(--electric)' : 'var(--coral)') : 'var(--gray-100)'};
  color: ${p => p.$active ? 'var(--white)' : 'var(--gray-600)'};
  border: 3px solid var(--black);
  box-shadow: ${p => p.$active ? 'var(--shadow-md)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.$yes ? 'var(--electric)' : 'var(--coral)'};
    color: var(--white);
  }
  
  .emoji {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavBtn = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$primary ? 'var(--coral)' : 'var(--white)'};
  color: ${p => p.$primary ? 'var(--white)' : 'var(--black)'};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-md);
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
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
`;

function RSVP() {
  const { content, projectId } = useWedding();
  const rsvpData = content?.rsvp || {};
  const onSubmit = (data) => console.log("Submit", data);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', attending: null, guests: '1', menu: '', dietary: '', song: '', message: ''
  });
  const sectionRef = useRef(null);
  const totalSteps = 3;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const canProceed = () => {
    if (step === 1) return formData.name && formData.email;
    if (step === 2) return formData.attending !== null;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (onSubmit) await onSubmit(formData);
    setSubmitted(true);
  };

  const renderStepDot = (i) => {
    const isActive = step === i;
    const isCompleted = step > i;
    
    if (isActive) {
      return <StepDotActive key={i} $active={true}>{i}</StepDotActive>;
    }
    return <StepDot key={i} $completed={isCompleted}>{isCompleted ? '✓' : i}</StepDot>;
  };

  if (submitted) {
    return (
      <Section ref={sectionRef} id="rsvp">
        <Container>
          <Card>
            <SuccessState>
              <SuccessEmoji>🎉</SuccessEmoji>
              <SuccessTitle>Epic!</SuccessTitle>
              <SuccessText>Deine Antwort ist eingegangen. Wir freuen uns auf dich!</SuccessText>
            </SuccessState>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="rsvp">
      <Container>
        <Header>
          <Title $visible={visible}>RSVP</Title>
        </Header>
        
        <Card>
          <ProgressBar $step={step} $total={totalSteps}>
            {[1, 2, 3].map(i => renderStepDot(i))}
          </ProgressBar>
          
          <StepContent key={step}>
            {step === 1 && (
              <>
                <StepTitle>Wer bist du?</StepTitle>
                <FormGroup>
                  <Label>Name</Label>
                  <Input type="text" placeholder="Max Mustermann" value={formData.name} onChange={e => updateField('name', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input type="email" placeholder="max@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                </FormGroup>
              </>
            )}
            
            {step === 2 && (
              <>
                <StepTitle>Kommst du?</StepTitle>
                <ToggleGroup>
                  <ToggleButton $yes $active={formData.attending === true} onClick={() => updateField('attending', true)}>
                    <span className="emoji">🎉</span>
                    Hell Yeah!
                  </ToggleButton>
                  <ToggleButton $active={formData.attending === false} onClick={() => updateField('attending', false)}>
                    <span className="emoji">😢</span>
                    Can't make it
                  </ToggleButton>
                </ToggleGroup>
                
                {formData.attending === true && (
                  <>
                    <FormGroup style={{ marginTop: '2rem' }}>
                      <Label>Anzahl Gäste</Label>
                      <Select value={formData.guests} onChange={e => updateField('guests', e.target.value)}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Menüwahl</Label>
                      <Select value={formData.menu} onChange={e => updateField('menu', e.target.value)}>
                        <option value="">Bitte wählen...</option>
                        <option value="fleisch">🥩 Fleisch</option>
                        <option value="fisch">🐟 Fisch</option>
                        <option value="veggie">🥗 Vegetarisch</option>
                        <option value="vegan">🌱 Vegan</option>
                      </Select>
                    </FormGroup>
                  </>
                )}
              </>
            )}
            
            {step === 3 && (
              <>
                <StepTitle>Noch was?</StepTitle>
                <FormGroup>
                  <Label>Songwunsch (optional)</Label>
                  <Input type="text" placeholder="Welcher Song bringt dich auf die Tanzfläche?" value={formData.song} onChange={e => updateField('song', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label>Nachricht (optional)</Label>
                  <Textarea placeholder="Grüße, Wünsche, Allergien..." value={formData.message} onChange={e => updateField('message', e.target.value)} />
                </FormGroup>
              </>
            )}
          </StepContent>
          
          <NavButtons>
            <NavBtn onClick={handleBack} disabled={step === 1}>← Back</NavBtn>
            <NavBtn $primary onClick={handleNext} disabled={!canProceed()}>
              {step === totalSteps ? 'Submit →' : 'Next →'}
            </NavBtn>
          </NavButtons>
        </Card>
      </Container>
    </Section>
  );
}

export default RSVP;
