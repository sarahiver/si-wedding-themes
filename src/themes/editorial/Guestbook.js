import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%) rotateX(-80deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-white);
  overflow: hidden;
  position: relative;
`;

const BackgroundQuote = styled.div`
  position: absolute;
  top: 5%;
  left: -5%;
  font-family: var(--font-serif);
  font-size: clamp(15rem, 40vw, 35rem);
  font-style: italic;
  color: var(--editorial-light-gray);
  opacity: 0.4;
  line-height: 0.8;
  pointer-events: none;
  z-index: 0;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  margin-bottom: clamp(4rem, 8vw, 6rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.85;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.15em;
  
  .word {
    display: inline-flex;
    white-space: nowrap;
  }
  
  .letter {
    display: inline-block;
    opacity: 0;
    
    ${p => p.$visible && css`
      animation: ${letterReveal} 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
    `}
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 2rem;
  max-width: 500px;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 4rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FormSection = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const FormCard = styled.div`
  background: var(--editorial-light-gray);
  padding: clamp(2rem, 4vw, 3rem);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--editorial-red);
  }
`;

const FormTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: var(--editorial-light-gray);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: var(--editorial-white);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: var(--editorial-white);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: var(--editorial-black);
  color: var(--editorial-white);
  border: none;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--editorial-red);
    transition: left 0.3s ease;
    z-index: 0;
  }
  
  &:hover::before {
    left: 0;
  }
  
  span {
    position: relative;
    z-index: 1;
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
    animation-delay: 0.5s;
  `}
`;

const EntriesHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const EntriesTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
`;

const EntriesCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-gray);
  padding: 0.3rem 0.8rem;
  background: var(--editorial-light-gray);
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin-bottom: 2rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.7s;
  `}
`;

const EntriesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    flex-direction: row;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const EntryCard = styled.article`
  position: relative;
  padding: 2rem;
  padding-left: 2.5rem;
  background: var(--editorial-light-gray);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${slideInLeft} 0.6s ease forwards;
    animation-delay: ${0.8 + p.$index * 0.1}s;
  `}
  
  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-family: var(--font-serif);
    font-size: 4rem;
    color: var(--editorial-red);
    line-height: 1;
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 85vw;
    max-width: 350px;
    scroll-snap-align: start;
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const EntryName = styled.h4`
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
`;

const EntryDate = styled.span`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-gray);
`;

const EntryMessage = styled.p`
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-style: italic;
  color: var(--editorial-gray);
  line-height: 1.8;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--editorial-light-gray);
`;

const EmptyIcon = styled.span`
  font-size: 4rem;
  display: block;
  margin-bottom: 1.5rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-family: var(--font-headline);
  font-size: 1.2rem;
  text-transform: uppercase;
  color: var(--editorial-gray);
`;

// ============================================
// COMPONENT
// ============================================

function Guestbook() {
  const { content } = useWedding();
  const guestbookData = content?.guestbook || {};
  
  const title = guestbookData.title || 'Gästebuch';
  const subtitle = guestbookData.subtitle || 'Hinterlasst uns eure Wünsche und Grüße';
  
  const { entries, formData, submitting, error, success, updateField, submitEntry } = useGuestbook();
  
  const [visible, setVisible] = useState(false);
  const [visibleEntries, setVisibleEntries] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);
  const entryRefs = useRef([]);

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
    const observers = entryRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleEntries(prev => [...new Set([...prev, i])]);
          }
        },
        { threshold: 0.2 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [approvedEntries.length]);

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

  const renderTitle = () => {
    const words = title.split(' ');
    let letterIndex = 0;
    
    return words.map((word, wi) => (
      <span key={wi} className="word">
        {word.split('').map((letter, li) => {
          const delay = 0.1 + letterIndex * 0.05;
          letterIndex++;
          return (
            <span key={li} className="letter" style={{ animationDelay: `${delay}s` }}>
              {letter}
            </span>
          );
        })}
      </span>
    ));
  };

  return (
    <Section id="guestbook" ref={sectionRef}>
      <BackgroundQuote>"</BackgroundQuote>
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Eure Worte</Eyebrow>
          <Title $visible={visible}>{renderTitle()}</Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <ContentGrid>
          <FormSection $visible={visible}>
            <FormCard>
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
                  <span>{submitting ? 'Wird gesendet...' : 'Absenden'}</span>
                </SubmitButton>
              </form>
            </FormCard>
          </FormSection>
          
          <EntriesSection $visible={visible}>
            <EntriesHeader>
              <EntriesTitle>Einträge</EntriesTitle>
              <EntriesCount>{approvedEntries.length}</EntriesCount>
            </EntriesHeader>
            <Divider $visible={visible} />
            
            {approvedEntries.length > 0 ? (
              <EntriesGrid>
                {approvedEntries.map((entry, i) => (
                  <EntryCard 
                    key={entry.id} 
                    ref={el => entryRefs.current[i] = el}
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
