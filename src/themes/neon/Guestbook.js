// src/components/Guestbook.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const scanlineAnim = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const glitchFlicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.7; transform: translateX(-2px); }
  94% { opacity: 1; transform: translateX(0); }
  97% { opacity: 0.9; transform: translateX(1px); }
  98% { opacity: 1; transform: translateX(0); }
`;

const typewriterCursor = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 150px 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const TerminalTag = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: #00ff88;
  margin-bottom: 20px;
  
  &::before {
    content: '> ';
    color: #ff00ff;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  animation: ${glitchFlicker} 5s ease-in-out infinite;
  
  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 15px;
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.2);
  padding: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00ffff, #ff00ff, #00ff88);
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,255,255,0.1);
`;

const TerminalDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27c93f; }
`;

const TerminalTitle = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  margin-left: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: #00ffff;
  
  &::before {
    content: '$ ';
    color: #ff00ff;
  }
`;

const Input = styled.input`
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(0,255,255,0.2);
  padding: 15px 20px;
  font-family: 'Space Grotesk', monospace;
  font-size: 1rem;
  color: #fff;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.2);
  }
  
  &::placeholder {
    color: rgba(255,255,255,0.2);
  }
`;

const Textarea = styled.textarea`
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(0,255,255,0.2);
  padding: 15px 20px;
  font-family: 'Space Grotesk', monospace;
  font-size: 1rem;
  color: #fff;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.2);
  }
  
  &::placeholder {
    color: rgba(255,255,255,0.2);
  }
`;

const SubmitButton = styled.button`
  background: transparent;
  border: 2px solid #00ffff;
  padding: 18px 40px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #00ffff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #00ffff;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    color: #0a0a0f;
    text-shadow: none;
    
    &::before {
      transform: translateX(0);
    }
  }
  
  &::after {
    content: ' →';
  }
`;

const MessagesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0,255,255,0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-radius: 3px;
  }
`;

const MessageCard = styled.div`
  background: rgba(0,0,0,0.3);
  border-left: 3px solid ${p => p.$color || '#00ffff'};
  padding: 25px;
  position: relative;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${p => p.$color || '#00ffff'}50, transparent);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const MessageAuthor = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${p => p.$color || '#00ffff'};
  text-shadow: 0 0 10px ${p => p.$color || '#00ffff'}50;
`;

const MessageDate = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
`;

const MessageText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px;
  
  svg {
    width: 60px;
    height: 60px;
    color: #00ff88;
    margin-bottom: 20px;
  }
  
  h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    color: #00ff88;
    margin-bottom: 10px;
    text-shadow: 0 0 20px rgba(0,255,136,0.5);
  }
  
  p {
    color: rgba(255,255,255,0.5);
  }
`;

const StatusLine = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  margin-top: 30px;
  text-align: center;
  
  span {
    color: #00ff88;
  }
`;

function Guestbook() {
  const { content, project } = useWedding();
  const guestbookData = content?.guestbook || {};
  
  const projectId = project?.id;
  const title = guestbookData.title || 'Gästebuch';
  
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });

  // Fetch entries from Supabase
  useEffect(() => {
    const fetchEntries = async () => {
      if (!projectId) return;
      try {
        const { getGuestbookEntries } = await import('../../lib/supabase');
        const data = await getGuestbookEntries(projectId);
        if (data) setEntries(data);
      } catch (err) {
        console.error('Failed to fetch guestbook entries:', err);
      }
    };
    fetchEntries();
  }, [projectId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    setLoading(true);
    try {
      if (projectId) {
        const { submitGuestbookEntry } = await import('../../lib/supabase');
        const newEntry = await submitGuestbookEntry(projectId, {
          name: formData.name,
          message: formData.message
        });
        if (newEntry) {
          setEntries(prev => [newEntry, ...prev]);
        }
      }
      setSubmitted(true);
      setFormData({ name: '', message: '' });
      // Reset form after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to submit guestbook entry:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // Assign colors to entries
  const colors = ['#00ffff', '#ff00ff', '#00ff88', '#b347ff'];
  const entriesWithColors = entries.map((entry, i) => ({
    ...entry,
    color: colors[i % colors.length],
    date: entry.created_at ? new Date(entry.created_at).toLocaleDateString('de-DE') : ''
  }));

  return (
    <Section ref={sectionRef} id="guestbook">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <TerminalTag>guestbook.init()</TerminalTag>
          <Title>Leave a <span>Message</span></Title>
          <Subtitle>Hinterlasst uns einen lieben Gruß für unseren großen Tag</Subtitle>
        </Header>
        
        <FormSection>
          <FormCard>
            <TerminalHeader>
              <TerminalDot className="red" />
              <TerminalDot className="yellow" />
              <TerminalDot className="green" />
              <TerminalTitle>new_message.exe</TerminalTitle>
            </TerminalHeader>
            
            {!submitted ? (
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>enter_name</Label>
                  <Input 
                    type="text"
                    placeholder="Dein Name..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>enter_message</Label>
                  <Textarea 
                    placeholder="Deine Nachricht an uns..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </InputGroup>
                
                <SubmitButton type="submit">
                  SUBMIT MESSAGE
                </SubmitButton>
              </Form>
            ) : (
              <SuccessMessage>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <h3>Message Sent!</h3>
                <p>Danke für deine lieben Worte! 💚</p>
              </SuccessMessage>
            )}
            
            <StatusLine>
              $ status: <span>ready</span> | protocol: <span>encrypted</span>
            </StatusLine>
          </FormCard>
          
          <MessagesSection>
            {entriesWithColors.map((msg, i) => (
              <MessageCard key={msg.id} $color={msg.color} $delay={`${i * 0.15}s`}>
                <MessageHeader>
                  <MessageAuthor $color={msg.color}>{msg.name}</MessageAuthor>
                  <MessageDate>{msg.date}</MessageDate>
                </MessageHeader>
                <MessageText>{msg.message}</MessageText>
              </MessageCard>
            ))}
            {entriesWithColors.length === 0 && (
              <MessageCard $color="#00ffff" $delay="0s">
                <MessageText style={{ textAlign: 'center', opacity: 0.5 }}>
                  Noch keine Einträge - sei der Erste!
                </MessageText>
              </MessageCard>
            )}
          </MessagesSection>
        </FormSection>
      </Container>
    </Section>
  );
}

export default Guestbook;
