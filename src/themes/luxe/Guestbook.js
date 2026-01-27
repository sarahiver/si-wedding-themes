import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 700px;
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
  margin-bottom: 3rem;
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
  min-height: 100px;
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
  align-self: flex-start;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const Entries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Entry = styled.div`
  padding: 1.5rem;
  background: var(--luxe-white);
`;

const EntryName = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const EntryMessage = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
  line-height: 1.7;
`;

function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  
  useEffect(() => {
    loadEntries();
  }, []);
  
  const loadEntries = async () => {
    // Demo data - in production, fetch from backend
    setEntries([
      { id: 1, name: 'Emma', message: 'So excited for you both! Cannot wait to celebrate!' },
      { id: 2, name: 'James', message: 'Wishing you a lifetime of love and happiness!' },
    ]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Demo: In production, save to backend
    console.log('Guestbook entry:', formData);
    setEntries(prev => [...prev, { id: Date.now(), ...formData }]);
    setFormData({ name: '', message: '' });
  };
  
  return (
    <Section id="guestbook">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Gästebuch</Eyebrow>
          <Title>Eure Wünsche</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Euer Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            placeholder="Eure Nachricht an uns..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <Button type="submit">Eintragen</Button>
        </Form>
        
        <Entries>
          {entries.map((entry, index) => (
            <Entry key={index}>
              <EntryName>{entry.name}</EntryName>
              <EntryMessage>{entry.message}</EntryMessage>
            </Entry>
          ))}
        </Entries>
      </Container>
    </Section>
  );
}

export default Guestbook;
