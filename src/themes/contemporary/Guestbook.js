// Contemporary Guestbook
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--white);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  background: var(--electric);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  background: var(--white);
  border: 3px solid var(--black);
  
  &:focus {
    outline: none;
    box-shadow: var(--shadow-sm);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  background: var(--white);
  border: 3px solid var(--black);
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    box-shadow: var(--shadow-sm);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--black);
  color: var(--white);
  border: none;
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

const EntriesCard = styled.div`
  background: var(--gray-100);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  max-height: 500px;
  overflow-y: auto;
`;

const EntriesHeader = styled.div`
  background: var(--coral);
  padding: 1rem 1.5rem;
  border-bottom: 3px solid var(--black);
  position: sticky;
  top: 0;
`;

const EntriesTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const Entry = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid var(--gray-200);
  
  &:last-child {
    border-bottom: none;
  }
`;

const EntryName = styled.p`
  font-weight: 700;
  color: var(--black);
  margin-bottom: 0.25rem;
`;

const EntryMessage = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  line-height: 1.5;
`;

const EntryDate = styled.p`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: var(--yellow);
  border: 3px solid var(--black);
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  margin-bottom: 1rem;
`;

function Guestbook() {
  const { project, content } = useWedding();
  const guestbookData = content?.guestbook || {};
  
  const title = guestbookData.title || 'Gästebuch';
  
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (project?.id) {
      loadEntries();
    }
  }, [project?.id]);

  const loadEntries = async () => {
    const { data } = await getGuestbookEntries(project.id);
    if (data) setEntries(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message || !project?.id) return;
    
    setIsSubmitting(true);
    try {
      await submitGuestbookEntry(project.id, formData);
      setSuccess(true);
      setFormData({ name: '', message: '' });
      loadEntries();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="guestbook">
      <Container>
        <Header>
          <Eyebrow>💬 Hinterlasst uns eine Nachricht</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          <FormCard>
            <FormTitle>Eintrag schreiben</FormTitle>
            {success && <SuccessMessage>🎉 Danke für deinen Eintrag!</SuccessMessage>}
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Dein Name" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Nachricht</Label>
                <Textarea 
                  placeholder="Deine Wünsche an das Brautpaar..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </FormGroup>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Wird gesendet...' : 'Absenden →'}
              </Button>
            </form>
          </FormCard>
          
          <EntriesCard>
            <EntriesHeader>
              <EntriesTitle>Einträge ({entries.length})</EntriesTitle>
            </EntriesHeader>
            {entries.length === 0 ? (
              <Entry>
                <EntryMessage>Noch keine Einträge. Sei der/die Erste!</EntryMessage>
              </Entry>
            ) : (
              entries.map((entry, i) => (
                <Entry key={i}>
                  <EntryName>{entry.name}</EntryName>
                  <EntryMessage>{entry.message}</EntryMessage>
                  <EntryDate>
                    {new Date(entry.created_at).toLocaleDateString('de-DE')}
                  </EntryDate>
                </Entry>
              ))
            )}
          </EntriesCard>
        </Grid>
      </Container>
    </Section>
  );
}

export default Guestbook;
