// Botanical Guestbook - Nature Journal Style
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const sway = keyframes`
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-cream);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.08};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const WriteCard = styled.div`
  background: linear-gradient(135deg, var(--green-fern) 0%, var(--green-forest) 100%);
  padding: 2rem;
  border-radius: 40px 40px 35px 45px / 35px 45px 40px 40px;
  box-shadow: var(--shadow-medium);
`;

const WriteTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--bg-cream);
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--green-mint);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 20px;
  color: var(--text-dark);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 20px;
  color: var(--text-dark);
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--bg-cream);
  color: var(--green-forest);
  border: none;
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: var(--accent-sunlight);
  color: var(--green-forest);
  padding: 1rem;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease;
`;

const EntriesCard = styled.div`
  background: var(--bg-fog);
  border-radius: 40px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  max-height: 550px;
  display: flex;
  flex-direction: column;
`;

const EntriesHeader = styled.div`
  background: var(--green-mint);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EntriesTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.25rem;
  color: var(--green-forest);
`;

const EntriesCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--green-forest);
  background: var(--bg-cream);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
`;

const EntriesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const Entry = styled.div`
  background: var(--bg-cream);
  padding: 1.25rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-soft);
  animation: ${fadeIn} 0.4s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const EntryAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--green-sage);
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
`;

const EntryName = styled.p`
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--green-forest);
  flex: 1;
`;

const EntryDate = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const EntryMessage = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-medium);
  line-height: 1.7;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
  
  .emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Section id="guestbook">
      <DecoLeaf $size="150px" $color="var(--green-mint)" $opacity={0.06} style={{ top: '10%', right: '-4%' }} />
      <DecoLeaf $size="100px" $color="var(--green-sage)" $opacity={0.05} style={{ bottom: '15%', left: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>💌 Hinterlasst uns eine Nachricht</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          <WriteCard>
            <WriteTitle>Eintrag schreiben</WriteTitle>
            {success && <SuccessMessage>🌿 Danke für deinen Eintrag!</SuccessMessage>}
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Dein Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Wie heißt du?"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Deine Nachricht</Label>
                <TextArea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Deine Wünsche an das Brautpaar..."
                  required
                />
              </FormGroup>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Wird gesendet...' : '🌿 Absenden'}
              </SubmitButton>
            </form>
          </WriteCard>
          
          <EntriesCard>
            <EntriesHeader>
              <EntriesTitle>Einträge</EntriesTitle>
              <EntriesCount>{entries.length}</EntriesCount>
            </EntriesHeader>
            <EntriesList>
              {entries.length === 0 ? (
                <EmptyState>
                  <span className="emoji">🌱</span>
                  <p>Noch keine Einträge.</p>
                  <p>Sei der Erste!</p>
                </EmptyState>
              ) : (
                entries.map((entry, i) => (
                  <Entry key={i}>
                    <EntryHeader>
                      <EntryAvatar>{getInitials(entry.name)}</EntryAvatar>
                      <EntryName>{entry.name}</EntryName>
                      <EntryDate>
                        {new Date(entry.created_at).toLocaleDateString('de-DE')}
                      </EntryDate>
                    </EntryHeader>
                    <EntryMessage>{entry.message}</EntryMessage>
                  </Entry>
                ))
              )}
            </EntriesList>
          </EntriesCard>
        </Grid>
      </Container>
    </Section>
  );
}

export default Guestbook;
