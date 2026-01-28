import { useWedding } from '../../context/WeddingContext';
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px var(--neon-cyan); }
  50% { box-shadow: 0 0 40px var(--neon-cyan), 0 0 60px var(--neon-cyan); }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--neon-bg);
  padding: 120px 5vw;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const InfoSection = styled.div``;

const CommandLine = styled.div`
  font-family: 'Space Grotesk', monospace;
  color: var(--neon-green);
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s ease;
  
  &::before {
    content: '$ ';
    color: var(--neon-cyan);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-family: 'Space Grotesk', sans-serif;
  margin-bottom: 40px;
  line-height: 1.7;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color};
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: ${props => props.color};
    box-shadow: 0 0 20px ${props => props.color}30;
    
    &::before {
      opacity: 1;
      box-shadow: 0 0 10px ${props => props.color};
    }
  }
`;

const IconBox = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.color};
  color: ${props => props.color};
  font-size: 1.5rem;
`;

const ContactText = styled.div``;

const ContactLabel = styled.span`
  display: block;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContactValue = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: white;
`;

const FormSection = styled.div``;

const TerminalWindow = styled.div`
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid var(--neon-cyan);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.2),
    inset 0 0 30px rgba(0, 255, 255, 0.05);
`;

const TerminalHeader = styled.div`
  background: rgba(0, 255, 255, 0.1);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 8px ${props => props.color};
`;

const TerminalTitle = styled.span`
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  margin-left: 12px;
  opacity: 0.8;
`;

const TerminalBody = styled.div`
  padding: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: var(--neon-green);
  margin-bottom: 8px;
  
  &::before {
    content: '> ';
    color: var(--neon-cyan);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  padding: 18px 40px;
  background: transparent;
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: var(--neon-cyan);
    color: var(--neon-bg);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  padding: 15px 20px;
  background: ${props => props.success ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 95, 86, 0.1)'};
  border: 1px solid ${props => props.success ? 'var(--neon-green)' : '#ff5f56'};
  color: ${props => props.success ? 'var(--neon-green)' : '#ff5f56'};
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  
  &::before {
    content: '${props => props.success ? '[SUCCESS]' : '[ERROR]'} ';
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 18px;
  background: var(--neon-cyan);
  margin-left: 5px;
  animation: ${blink} 1s infinite;
  vertical-align: middle;
`;

const ResponseTime = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 15px;
  text-align: center;
  
  span {
    color: var(--neon-cyan);
  }
`;

const Contact = ({ config = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  
  const {
    email = 'kontakt@hochzeit.de',
    phone = '+49 123 456 789',
    instagram = '@unsere_hochzeit'
  } = config;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({ success: true, message: 'Nachricht erfolgreich gesendet! Wir melden uns bald.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ success: false, message: 'Fehler beim Senden. Bitte versuche es erneut.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Section ref={sectionRef} id="contact">
      <GridOverlay />
      
      <Container>
        <InfoSection>
          <CommandLine visible={visible}>
            ./contact --init
          </CommandLine>
          <Title>Kontakt</Title>
          <Subtitle>
            Habt ihr Fragen? Wir sind für euch da! 
            Schreibt uns eine Nachricht oder nutzt die Kontaktdaten unten.
          </Subtitle>
          
          <ContactInfo>
            <ContactItem href={`mailto:${email}`} color="var(--neon-cyan)">
              <IconBox color="var(--neon-cyan)">@</IconBox>
              <ContactText>
                <ContactLabel>Email</ContactLabel>
                <ContactValue>{email}</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem href={`tel:${phone.replace(/\s/g, '')}`} color="var(--neon-pink)">
              <IconBox color="var(--neon-pink)">☎</IconBox>
              <ContactText>
                <ContactLabel>Telefon</ContactLabel>
                <ContactValue>{phone}</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" color="var(--neon-purple)">
              <IconBox color="var(--neon-purple)">♡</IconBox>
              <ContactText>
                <ContactLabel>Instagram</ContactLabel>
                <ContactValue>{instagram}</ContactValue>
              </ContactText>
            </ContactItem>
          </ContactInfo>
        </InfoSection>
        
        <FormSection>
          <TerminalWindow>
            <TerminalHeader>
              <Dot color="#ff5f56" />
              <Dot color="#ffbd2e" />
              <Dot color="#27ca40" />
              <TerminalTitle>send_message.sh</TerminalTitle>
            </TerminalHeader>
            
            <TerminalBody>
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>name:</Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dein Name"
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>email:</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="deine@email.de"
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>subject:</Label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Betreff"
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>message:</Label>
                  <TextArea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Deine Nachricht..."
                    required
                  />
                </InputGroup>
                
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? (
                    <>Sende...<Cursor /></>
                  ) : (
                    'Nachricht senden →'
                  )}
                </SubmitButton>
                
                {status && (
                  <StatusMessage success={status.success}>
                    {status.message}
                  </StatusMessage>
                )}
              </Form>
              
              <ResponseTime>
                Durchschnittliche Antwortzeit: <span>{'< 24h'}</span>
              </ResponseTime>
            </TerminalBody>
          </TerminalWindow>
        </FormSection>
      </Container>
    </Section>
  );
};

export default Contact;
