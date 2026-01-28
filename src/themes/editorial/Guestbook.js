// src/components/Guestbook.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
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
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease 0.2s;

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
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
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #B8976A;
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
  margin-top: 10px;

  &:hover {
    background: #D4AF37;
  }
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const EntryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 35px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-30px'});
  transition: all 0.6s ease ${p => 0.3 + p.$index * 0.1}s;

  @media (max-width: 600px) {
    padding: 25px 20px;
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const EntryAuthor = styled.h4`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  color: #FFFFFF;
`;

const EntryDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
`;

const EntryMessage = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.2rem;
  font-style: italic;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);

  &::before {
    content: '„';
    color: #B8976A;
    font-size: 1.5rem;
  }

  &::after {
    content: '"';
    color: #B8976A;
    font-size: 1.5rem;
  }
`;

function Guestbook() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', relation: '', message: '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Guestbook entry:', formData);
    setFormData({ name: '', relation: '', message: '' });
  };

  const entries = [
    {
      name: 'Oma Gertrud',
      date: '15. Januar 2025',
      message: 'Meine liebsten Enkel, ich wünsche euch von ganzem Herzen eine wundervolle gemeinsame Zukunft voller Liebe, Lachen und Abenteuer. Ihr seid füreinander bestimmt!'
    },
    {
      name: 'Familie Schmidt',
      date: '12. Januar 2025',
      message: 'Wir freuen uns so sehr für euch beide! Möge eure Liebe jeden Tag wachsen und euer gemeinsamer Weg voller glücklicher Momente sein.'
    },
    {
      name: 'Lisa & Tom',
      date: '10. Januar 2025',
      message: 'Von den ersten Dates bis zur Hochzeit – wir waren dabei und sind so stolz auf euch! Auf viele weitere gemeinsame Abenteuer!'
    }
  ];

  return (
    <Section ref={sectionRef} id="guestbook">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Gästebuch</Eyebrow>
          <Title>Eure <span>Wünsche</span></Title>
          <Subtitle>Hinterlasst uns eine persönliche Nachricht</Subtitle>
        </Header>

        <Form $visible={isVisible} onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Euer Name</Label>
              <Input
                type="text"
                placeholder="Max Mustermann"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Beziehung zum Paar</Label>
              <Input
                type="text"
                placeholder="z.B. Freunde der Braut"
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Eure Nachricht</Label>
            <Textarea
              placeholder="Schreibt uns eure Glückwünsche..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </FormGroup>

          <SubmitButton type="submit">
            Nachricht hinterlassen ✨
          </SubmitButton>
        </Form>

        <EntriesList>
          {entries.map((entry, index) => (
            <EntryCard key={index} $visible={isVisible} $index={index}>
              <EntryHeader>
                <EntryAuthor>{entry.name}</EntryAuthor>
                <EntryDate>{entry.date}</EntryDate>
              </EntryHeader>
              <EntryMessage>{entry.message}</EntryMessage>
            </EntryCard>
          ))}
        </EntriesList>
      </Container>
    </Section>
  );
}

export default Guestbook;
