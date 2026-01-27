import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 550px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 30px;
  background: var(--luxe-gold);
  margin: 0 auto 1.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  background: var(--luxe-white);
  border: 1px solid var(--luxe-border);
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: var(--luxe-gold);
  }
  
  &::placeholder {
    color: var(--luxe-text-muted);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  background: var(--luxe-white);
  border: 1px solid var(--luxe-border);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--luxe-gold);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  cursor: pointer;
  
  input {
    accent-color: var(--luxe-gold);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text);
  background: transparent;
  border: 1px solid var(--luxe-border);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Success = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: var(--luxe-white);
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
`;

function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: 'yes',
    guests: '1',
    dietary: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Demo: In production, save to backend
      console.log('RSVP submitted:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (submitted) {
    return (
      <Section id="rsvp">
        <Container>
          <Success>
            <GoldLine style={{margin: '0 auto 1.5rem'}} />
            <SuccessTitle>Vielen Dank!</SuccessTitle>
            <SuccessText>
              Wir haben eure Antwort erhalten und freuen uns auf euch.
            </SuccessText>
          </Success>
        </Container>
      </Section>
    );
  }
  
  return (
    <Section id="rsvp">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Anmeldung</Eyebrow>
          <Title>RSVP</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Euer Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>E-Mail</Label>
            <Input
              type="email"
              placeholder="eure@email.de"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Teilnahme</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={formData.attendance === 'yes'}
                  onChange={e => setFormData({ ...formData, attendance: e.target.value })}
                />
                Ja, ich komme
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={formData.attendance === 'no'}
                  onChange={e => setFormData({ ...formData, attendance: e.target.value })}
                />
                Leider nicht
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          {formData.attendance === 'yes' && (
            <>
              <FormGroup>
                <Label>Anzahl Personen</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={e => setFormData({ ...formData, guests: e.target.value })}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Besonderheiten bei der Ernährung</Label>
                <Input
                  type="text"
                  placeholder="Vegetarisch, Allergien, etc."
                  value={formData.dietary}
                  onChange={e => setFormData({ ...formData, dietary: e.target.value })}
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <Label>Nachricht an uns</Label>
            <Textarea
              placeholder="Optional"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Wird gesendet...' : 'Absenden'}
          </SubmitButton>
        </Form>
      </Container>
    </Section>
  );
}

export default RSVP;
