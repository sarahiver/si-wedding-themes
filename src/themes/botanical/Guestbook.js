// Botanical Guestbook - Clean layout
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const WriteSection = styled.div`
  background: var(--forest-deep);
  padding: 2rem;
`;

const WriteTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--cream);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  background: rgba(255,255,255,0.95);
  border: none;
  color: var(--soft-black);
  
  &:focus {
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  background: rgba(255,255,255,0.95);
  border: none;
  color: var(--soft-black);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--gold);
  color: var(--bark-dark);
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--gold-light);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const SuccessMessage = styled.div`
  background: var(--gold-light);
  color: var(--bark-dark);
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EntriesSection = styled.div`
  background: var(--cream-dark);
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
`;

const EntriesTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--forest-deep);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EntryCount = styled.span`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--bark-light);
`;

const Entry = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid var(--cream);
  
  &:last-child {
    border-bottom: none;
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const EntryName = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--forest-deep);
`;

const EntryDate = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--bark-light);
`;

const EntryMessage = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--bark-medium);
  line-height: 1.6;
`;

const EmptyState = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--bark-light);
  text-align: center;
  padding: 2rem 0;
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
    if (project?.id) loadEntries();
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
    <Section id="guestbook" data-section="guestbook">
      <Content>
        <Header>
          <Eyebrow>Hinterlasst uns eine Nachricht</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          <WriteSection>
            <WriteTitle>Schreiben</WriteTitle>
            {success && <SuccessMessage>Danke für deinen Eintrag!</SuccessMessage>}
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dein Name"
                required
              />
              <TextArea
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Deine Nachricht..."
                required
              />
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
              </SubmitButton>
            </Form>
          </WriteSection>
          
          <EntriesSection>
            <EntriesTitle>
              Einträge
              <EntryCount>{entries.length}</EntryCount>
            </EntriesTitle>
            
            {entries.length === 0 ? (
              <EmptyState>Noch keine Einträge. Sei der Erste!</EmptyState>
            ) : (
              entries.map((entry, i) => (
                <Entry key={i}>
                  <EntryHeader>
                    <EntryName>{entry.name}</EntryName>
                    <EntryDate>
                      {new Date(entry.created_at).toLocaleDateString('de-DE')}
                    </EntryDate>
                  </EntryHeader>
                  <EntryMessage>{entry.message}</EntryMessage>
                </Entry>
              ))
            )}
          </EntriesSection>
        </Grid>
      </Content>
    </Section>
  );
}

export default Guestbook;
