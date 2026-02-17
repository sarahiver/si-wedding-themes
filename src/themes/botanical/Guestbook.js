import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
  overflow-x: hidden;
  
  @media (max-width: 800px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const Subtitle = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FormSection = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(1.5rem, 3vw, 2rem);
  position: relative;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
  
  /* Top highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.15) 20%, 
      rgba(255,255,255,0.25) 50%, 
      rgba(255,255,255,0.15) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
`;

const FormTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-light);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: var(--text-dim);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-light);
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: var(--text-dim);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EntriesSection = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const EntriesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const EntriesTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 400;
  color: var(--text-light);
`;

const EntriesCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
`;

const EntriesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
  
  @media (max-width: 800px) {
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
  }
`;

const EntryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  position: relative;
  opacity: 0;
  box-sizing: border-box;

  ${p => p.$visible && css`
    animation: ${slideIn} 0.6s ease forwards;
    animation-delay: ${0.5 + p.$index * 0.08}s;
  `}

  &::before {
    content: '"';
    position: absolute;
    top: 0.75rem;
    left: 1rem;
    font-family: var(--font-display);
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.1);
    line-height: 1;
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const EntryName = styled.h4`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-light);
`;

const EntryDate = styled.span`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
`;

const EntryMessage = styled.p`
  font-family: var(--font-display);
  font-size: 1rem;
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
`;

const EmptyIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--text-muted);
`;

// ============================================
// COMPONENT
// ============================================

function Guestbook() {
  const { content } = useWedding();
  const guestbookData = content?.guestbook || {};
  
  const title = guestbookData.title || 'Gästebuch';
  const subtitle = guestbookData.description || 'Hinterlasst uns eure Wünsche';
  
  const { entries, formData, submitting, error, success, updateField, submitEntry } = useGuestbook();
  
  const [visible, setVisible] = useState(false);
  const [visibleEntries, setVisibleEntries] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  const approvedEntries = entries.filter(e => e.approved);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && approvedEntries.length > 0) {
      setVisibleEntries(approvedEntries.map((_, i) => i));
    }
  }, [visible, approvedEntries.length]);

  useEffect(() => {
    if (success) {
      setModalState({ isOpen: true, type: 'success', message: 'Danke für deinen Eintrag!' });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setModalState({ isOpen: true, type: 'error', message: error });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitEntry();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Section id="guestbook" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Eure Worte</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <ContentGrid>
          <FormSection $visible={visible}>
            <GlassCard>
              <FormTitle>Eintrag schreiben</FormTitle>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Name *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Dein Name"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>E-Mail (optional)</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Für Rückfragen"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Nachricht *</Label>
                  <TextArea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Deine Glückwünsche..."
                    required
                  />
                </FormGroup>
                
                <SubmitButton type="submit" disabled={submitting}>
                  {submitting ? 'Wird gesendet...' : 'Absenden'}
                </SubmitButton>
              </form>
            </GlassCard>
          </FormSection>
          
          <EntriesSection $visible={visible}>
            <EntriesHeader>
              <EntriesTitle>Einträge</EntriesTitle>
              <EntriesCount>{approvedEntries.length}</EntriesCount>
            </EntriesHeader>
            
            {approvedEntries.length > 0 ? (
              <EntriesGrid>
                {approvedEntries.map((entry, i) => (
                  <EntryCard 
                    key={entry.id} 
                    $visible={visibleEntries.includes(i)}
                    $index={i}
                  >
                    <EntryHeader>
                      <EntryName>{entry.name}</EntryName>
                      <EntryDate>{formatDate(entry.created_at)}</EntryDate>
                    </EntryHeader>
                    <EntryMessage>{entry.message}</EntryMessage>
                  </EntryCard>
                ))}
              </EntriesGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>✍️</EmptyIcon>
                <EmptyText>Sei der Erste!</EmptyText>
              </EmptyState>
            )}
          </EntriesSection>
        </ContentGrid>
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={3000}
      />
    </Section>
  );
}

export default Guestbook;
