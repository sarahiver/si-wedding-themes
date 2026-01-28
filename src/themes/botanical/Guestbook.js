import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const Form = styled.form`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid var(--sage-light);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  
  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

const Button = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  
  &:hover { background: var(--sage-dark); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const EntryCard = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--sage-light);
`;

const EntryName = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const EntryMessage = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
`;

function Guestbook({ content = {} }) {
  const { projectId } = useWedding();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });

  const title = content.title || 'Gästebuch';

  useEffect(() => {
    if (projectId) loadEntries();
  }, [projectId]);

  const loadEntries = async () => {
    const { data } = await getGuestbookEntries(projectId, true);
    setEntries(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitGuestbookEntry(projectId, formData);
      setFormData({ name: '', message: '' });
      loadEntries();
    } catch (err) {
      console.error('Guestbook error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="guestbook">
      <Container>
        <Header>
          <Title>{title}</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input 
              placeholder="Euer Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required 
            />
          </FormGroup>
          <FormGroup>
            <Textarea 
              placeholder="Eure Nachricht..."
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              required 
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Wird gesendet...' : 'Eintragen'}
          </Button>
        </Form>
        
        {entries.map(entry => (
          <EntryCard key={entry.id}>
            <EntryName>{entry.name}</EntryName>
            <EntryMessage>{entry.message}</EntryMessage>
          </EntryCard>
        ))}
      </Container>
    </Section>
  );
}

export default Guestbook;
