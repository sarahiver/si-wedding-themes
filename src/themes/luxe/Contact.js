import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 500px;
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
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  background: var(--luxe-white);
  border: 1px solid var(--luxe-border);
  
  &:focus { border-color: var(--luxe-gold); }
`;

const Textarea = styled.textarea`
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  background: var(--luxe-white);
  border: 1px solid var(--luxe-border);
  min-height: 120px;
  resize: vertical;
  
  &:focus { border-color: var(--luxe-gold); }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text);
  background: transparent;
  border: 1px solid var(--luxe-border);
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const Success = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--luxe-white);
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
`;

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Demo: In production, connect to backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <Section id="contact">
        <Container>
          <Success>
            <SuccessTitle>Nachricht gesendet!</SuccessTitle>
            <SuccessText>Wir melden uns bald bei euch.</SuccessText>
          </Success>
        </Container>
      </Section>
    );
  }
  
  return (
    <Section id="contact">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Kontakt</Eyebrow>
          <Title>Schreibt uns</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Euer Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="E-Mail"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Betreff"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <Textarea
            placeholder="Eure Nachricht..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <Button type="submit">Absenden</Button>
        </Form>
      </Container>
    </Section>
  );
}

export default Contact;
