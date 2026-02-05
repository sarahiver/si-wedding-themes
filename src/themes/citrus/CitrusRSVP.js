// src/themes/citrus/CitrusRSVP.js
// RSVP Form with fresh citrus styling
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from './GlobalStyles';

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusRSVP = ({
  title = 'Sagt uns Bescheid',
  subtitle = 'Wir freuen uns auf eure Zusage',
  onSubmit,
  deadline = '01. Juni 2026'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    attending: '',
    dietary: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <SectionWrapper id="rsvp">
        <Container>
          <SuccessCard>
            <SuccessIcon>🍋</SuccessIcon>
            <SuccessTitle>Vielen Dank!</SuccessTitle>
            <SuccessText>
              Eure Antwort ist bei uns angekommen. Wir freuen uns auf euch!
            </SuccessText>
          </SuccessCard>
        </Container>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="rsvp">
      <DecoPattern />

      <Container>
        <Header>
          <Eyebrow>RSVP</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>

        <FormCard>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="name">Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Euer Name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@beispiel.de"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="guests">Anzahl Gäste</Label>
                <Select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Personen</option>
                  <option value="3">3 Personen</option>
                  <option value="4">4 Personen</option>
                  <option value="5">5+ Personen</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Kommt ihr? *</Label>
                <RadioGroup>
                  <RadioLabel>
                    <RadioInput
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={handleChange}
                      required
                    />
                    <RadioCustom $checked={formData.attending === 'yes'} />
                    <span>Ja, wir kommen!</span>
                  </RadioLabel>
                  <RadioLabel>
                    <RadioInput
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={handleChange}
                    />
                    <RadioCustom $checked={formData.attending === 'no'} />
                    <span>Leider nicht</span>
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="dietary">Unverträglichkeiten / Allergien</Label>
              <Input
                type="text"
                id="dietary"
                name="dietary"
                value={formData.dietary}
                onChange={handleChange}
                placeholder="z.B. Vegetarisch, Glutenfrei, Nussallergie..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Nachricht an uns</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Wir freuen uns über eine persönliche Nachricht..."
                rows={4}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <>
                  <span>Absenden</span>
                  <ButtonIcon>🍃</ButtonIcon>
                </>
              )}
            </SubmitButton>
          </Form>

          <Deadline>
            Bitte antwortet bis zum <strong>{deadline}</strong>
          </Deadline>
        </FormCard>
      </Container>
    </SectionWrapper>
  );
};

export default CitrusRSVP;

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const SectionWrapper = styled.section`
  position: relative;
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: ${colors.leafGreen};
  overflow: hidden;
`;

const DecoPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  background-image: radial-gradient(circle at 20% 50%, ${colors.lime} 2px, transparent 2px),
                    radial-gradient(circle at 80% 30%, ${colors.lemon} 3px, transparent 3px),
                    radial-gradient(circle at 60% 80%, ${colors.lime} 2px, transparent 2px);
  background-size: 100px 100px;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: ${colors.warmWhite};
`;

const Eyebrow = styled.p`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const Title = styled.h2`
  font-family: ${fonts.heading};
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 400;
  font-style: italic;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: ${fonts.accent};
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  opacity: 0.9;
`;

const FormCard = styled.div`
  background: ${colors.warmWhite};
  border-radius: 24px;
  padding: clamp(2rem, 5vw, 3rem);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: ${fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.charcoal};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  font-family: ${fonts.body};
  font-size: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid ${colors.sand};
  border-radius: 12px;
  background: ${colors.cream};
  color: ${colors.charcoal};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.lime};
    box-shadow: 0 0 0 4px ${colors.lime}20;
  }

  &::placeholder {
    color: ${colors.charcoal}50;
  }
`;

const Select = styled.select`
  font-family: ${fonts.body};
  font-size: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid ${colors.sand};
  border-radius: 12px;
  background: ${colors.cream};
  color: ${colors.charcoal};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.lime};
    box-shadow: 0 0 0 4px ${colors.lime}20;
  }
`;

const Textarea = styled.textarea`
  font-family: ${fonts.body};
  font-size: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid ${colors.sand};
  border-radius: 12px;
  background: ${colors.cream};
  color: ${colors.charcoal};
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.lime};
    box-shadow: 0 0 0 4px ${colors.lime}20;
  }

  &::placeholder {
    color: ${colors.charcoal}50;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: ${fonts.body};
  font-size: 0.95rem;
  color: ${colors.charcoal};
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const RadioCustom = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${p => p.$checked ? colors.lime : colors.sand};
  background: ${p => p.$checked ? colors.lime : 'transparent'};
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.warmWhite};
    opacity: ${p => p.$checked ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: ${fonts.heading};
  font-size: 1.1rem;
  font-weight: 500;
  padding: 1.25rem 2.5rem;
  background: ${colors.citrusGradient};
  color: ${colors.charcoal};
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(164, 210, 51, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${colors.charcoal}30;
  border-top-color: ${colors.charcoal};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Deadline = styled.p`
  text-align: center;
  font-family: ${fonts.body};
  font-size: 0.9rem;
  color: ${colors.charcoal};
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.sand};

  strong {
    color: ${colors.leafGreen};
  }
`;

const SuccessCard = styled.div`
  background: ${colors.warmWhite};
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SuccessTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 2rem;
  font-style: italic;
  color: ${colors.charcoal};
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: ${fonts.body};
  font-size: 1.1rem;
  color: ${colors.charcoal};
  opacity: 0.8;
`;
