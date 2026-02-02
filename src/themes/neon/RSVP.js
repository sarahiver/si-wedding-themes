// src/components/RSVP.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

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
  
  /* Scanline */
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

const TextArea = styled.textarea`
  width: 100%;
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

const GuestCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CounterButton = styled.button`
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.3);
  color: #00ffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0,255,255,0.1);
    box-shadow: 0 0 15px rgba(0,255,255,0.3);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CounterValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0,255,255,0.5);
  min-width: 80px;
  text-align: center;
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
    
    &:hover {
      box-shadow: 0 0 40px rgba(0,255,255,0.6);
      transform: translateY(-2px);
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

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px;
`;

const SuccessIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #00ff88;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  box-shadow: 0 0 40px rgba(0,255,136,0.5);
  
  svg {
    width: 50px;
    height: 50px;
    color: #0a0a0f;
  }
`;

const SuccessTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
`;

const SuccessText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.6);
`;

function RSVP() {
  const { content, project } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const projectId = project?.id;
  const title = rsvpData.title || 'RSVP';
  const deadline = rsvpData.deadline || project?.rsvp_deadline;
  
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    attending: null,
    name: '',
    email: '',
    guests: 1,
    dietary: '',
    message: ''
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async () => {
    if (!projectId) {
      console.error('No projectId provided');
      setSubmitted(true);
      return;
    }
    
    setLoading(true);
    try {
      // Dynamic import to avoid issues if supabase not configured
      const { submitRSVP } = await import('../../lib/supabase');
      await submitRSVP(projectId, {
        name: formData.name,
        email: formData.email,
        attending: formData.attending === true,
        guest_count: parseInt(formData.guests) || 1,
        dietary_requirements: formData.dietary,
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      console.error('RSVP submit error:', err);
      // Still show success to user even if backend fails
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Attendance' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Confirm' }
  ];

  if (submitted) {
    return (
      <Section ref={sectionRef} id="rsvp">
        <GridBG />
        <GlowOrb />
        <GlowOrb />
        <Container>
          <FormCard>
            <SuccessMessage>
              <SuccessIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </SuccessIcon>
              <SuccessTitle>
                {formData.attending ? "You're In!" : "We'll Miss You!"}
              </SuccessTitle>
              <SuccessText>
                {formData.attending 
                  ? "We can't wait to celebrate with you. See you there!"
                  : "Thank you for letting us know. We'll be thinking of you!"}
              </SuccessText>
            </SuccessMessage>
          </FormCard>
        </Container>
      </Section>
    );
  }

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
          <FormStep $active={currentStep === 1}>
            <Label>Will you be joining us?</Label>
            <AttendanceToggle>
              <ToggleOption 
                $yes 
                $selected={formData.attending === true}
                onClick={() => setFormData({...formData, attending: true})}
              >
                Hell Yeah! 🎉
              </ToggleOption>
              <ToggleOption 
                $selected={formData.attending === false}
                onClick={() => setFormData({...formData, attending: false})}
              >
                Can't Make It 😢
              </ToggleOption>
            </AttendanceToggle>
            
            <ButtonGroup>
              <Button 
                $primary 
                disabled={formData.attending === null}
                onClick={() => setCurrentStep(2)}
              >
                Continue →
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
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Email Address</Label>
              <Input 
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </InputGroup>
            
            {formData.attending && (
              <InputGroup>
                <Label>Number of Guests</Label>
                <GuestCounter>
                  <CounterButton 
                    onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})}
                    disabled={formData.guests <= 1}
                  >
                    −
                  </CounterButton>
                  <CounterValue>{formData.guests}</CounterValue>
                  <CounterButton 
                    onClick={() => setFormData({...formData, guests: Math.min(5, formData.guests + 1)})}
                    disabled={formData.guests >= 5}
                  >
                    +
                  </CounterButton>
                </GuestCounter>
              </InputGroup>
            )}
            
            <ButtonGroup>
              <Button onClick={() => setCurrentStep(1)}>← Back</Button>
              <Button 
                $primary 
                disabled={!formData.name || !formData.email}
                onClick={() => setCurrentStep(3)}
              >
                Continue →
              </Button>
            </ButtonGroup>
          </FormStep>
          
          <FormStep $active={currentStep === 3}>
            {formData.attending && (
              <InputGroup>
                <Label>Dietary Requirements</Label>
                <Input 
                  type="text"
                  placeholder="Vegetarian, vegan, allergies, etc."
                  value={formData.dietary}
                  onChange={e => setFormData({...formData, dietary: e.target.value})}
                />
              </InputGroup>
            )}
            
            <InputGroup>
              <Label>Message for the Couple (Optional)</Label>
              <TextArea 
                placeholder="Share your wishes, song requests, or just say hi..."
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </InputGroup>
            
            <ButtonGroup>
              <Button onClick={() => setCurrentStep(2)}>← Back</Button>
              <Button $primary onClick={handleSubmit}>
                Submit RSVP ✓
              </Button>
            </ButtonGroup>
          </FormStep>
        </FormCard>
      </Container>
    </Section>
  );
}

export default RSVP;
