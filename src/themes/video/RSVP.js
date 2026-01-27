// src/components/RSVP.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
  position: relative;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.15;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #FFFFFF;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 15px;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease 0.2s;

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 40px;
  }
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #B8976A;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23B8976A' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 20px center;

  &:focus {
    outline: none;
    border-color: #B8976A;
  }

  option {
    background: #1A1A1A;
    color: #FFFFFF;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #B8976A;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 15px 25px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;

  &:has(input:checked) {
    border-color: #B8976A;
    background: rgba(184, 151, 106, 0.1);
  }

  input {
    display: none;
  }

  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #FFFFFF;
  }

  &::before {
    content: '';
    width: 18px;
    height: 18px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  &:has(input:checked)::before {
    border-color: #B8976A;
    background: #B8976A;
    box-shadow: inset 0 0 0 4px #1A1A1A;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 20px;
  background: #B8976A;
  color: #1A1A1A;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: all 0.4s ease;

  &:hover {
    background: #D4AF37;
    transform: translateY(-2px);
  }

  &:disabled {
    background: rgba(184, 151, 106, 0.5);
    cursor: not-allowed;
    transform: none;
  }
`;

const Deadline = styled.p`
  text-align: center;
  margin-top: 30px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);

  strong {
    color: #B8976A;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 60px 40px;
  background: rgba(184, 151, 106, 0.1);
  border: 1px solid rgba(184, 151, 106, 0.3);

  h3 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    color: #FFFFFF;
    margin-bottom: 15px;
  }

  p {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

function RSVP() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    attendance: 'yes',
    dietary: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Section ref={sectionRef} id="rsvp">
      <BackgroundVideo autoPlay muted loop playsInline>
        <source 
          src="https://res.cloudinary.com/si-weddings/video/upload/v1769070616/si_comming_soon_video_hero_xga2ia.mp4" 
          type="video/mp4" 
        />
      </BackgroundVideo>

      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>RSVP</Eyebrow>
          <Title>Seid ihr <span>dabei?</span></Title>
          <Subtitle>Wir freuen uns auf eure Zusage!</Subtitle>
        </Header>

        {submitted ? (
          <SuccessMessage>
            <h3>Vielen Dank!</h3>
            <p>Wir haben eure Antwort erhalten und freuen uns auf euch.</p>
          </SuccessMessage>
        ) : (
          <Form $visible={isVisible} onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Euer Name</Label>
              <Input 
                type="text" 
                name="name"
                placeholder="Max & Maria Mustermann"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>E-Mail Adresse</Label>
              <Input 
                type="email" 
                name="email"
                placeholder="email@beispiel.de"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Seid ihr dabei?</Label>
              <RadioGroup>
                <RadioLabel>
                  <input 
                    type="radio" 
                    name="attendance" 
                    value="yes"
                    checked={formData.attendance === 'yes'}
                    onChange={handleChange}
                  />
                  <span>Ja, wir kommen!</span>
                </RadioLabel>
                <RadioLabel>
                  <input 
                    type="radio" 
                    name="attendance" 
                    value="no"
                    checked={formData.attendance === 'no'}
                    onChange={handleChange}
                  />
                  <span>Leider nicht</span>
                </RadioLabel>
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label>Anzahl Gäste</Label>
              <Select name="guests" value={formData.guests} onChange={handleChange}>
                <option value="1">1 Person</option>
                <option value="2">2 Personen</option>
                <option value="3">3 Personen</option>
                <option value="4">4 Personen</option>
                <option value="5">5+ Personen</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Unverträglichkeiten / Allergien</Label>
              <Input 
                type="text" 
                name="dietary"
                placeholder="z.B. Laktoseintoleranz, Nussallergie"
                value={formData.dietary}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Nachricht an uns (optional)</Label>
              <Textarea 
                name="message"
                placeholder="Eure persönliche Nachricht..."
                value={formData.message}
                onChange={handleChange}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Wird gesendet...' : 'Antwort absenden →'}
            </SubmitButton>
          </Form>
        )}

        <Deadline>
          Bitte antwortet bis <strong>1. Mai 2025</strong>
        </Deadline>
      </Container>
    </Section>
  );
}

export default RSVP;
