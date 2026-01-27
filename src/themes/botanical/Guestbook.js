import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   GUESTBOOK - BOTANICAL THEME
   Digitales Gästebuch für Glückwünsche und Nachrichten
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--cream);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.12;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const BookIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sage);
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 550px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 20px 60px rgba(139, 157, 131, 0.12);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
  height: fit-content;
`;

const FormTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--forest);
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 0.9rem 1.25rem;
  border: 2px solid rgba(139, 157, 131, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--forest);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    background: white;
    box-shadow: 0 0 0 4px rgba(139, 157, 131, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const Textarea = styled.textarea`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid rgba(139, 157, 131, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--forest);
  resize: vertical;
  min-height: 150px;
  transition: all 0.3s ease;
  line-height: 1.6;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    background: white;
    box-shadow: 0 0 0 4px rgba(139, 157, 131, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const SubmitButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1.1rem 2rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: var(--sage-dark);
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(139, 157, 131, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EntriesSection = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: 0.4s;
`;

const EntriesTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(139, 157, 131, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--sage-light);
    border-radius: 3px;
  }
`;

const EntryCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 157, 131, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(5px);
    box-shadow: 0 10px 30px rgba(139, 157, 131, 0.1);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const EntryAuthor = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: var(--forest);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EntryDate = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const EntryMessage = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
  font-style: italic;
  
  &::before {
    content: '„';
    color: var(--sage);
    font-size: 1.2rem;
  }
  
  &::after {
    content: '"';
    color: var(--sage);
    font-size: 1.2rem;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  animation: ${fadeInUp} 0.6s ease;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: 'Lato', sans-serif;
  color: var(--text-light);
  line-height: 1.7;
`;

const Guestbook = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const sectionRef = useRef(null);

  // Beispiel-Einträge (später aus Datenbank)
  const [entries] = useState([
    {
      name: 'Maria & Thomas',
      date: '15. März 2026',
      message: 'Wir freuen uns so sehr für euch! Möge eure Liebe jeden Tag wachsen und gedeihen wie ein wunderschöner Garten.'
    },
    {
      name: 'Familie Müller',
      date: '12. März 2026',
      message: 'Herzlichen Glückwunsch zur Verlobung! Wir können es kaum erwarten, diesen besonderen Tag mit euch zu feiern.'
    },
    {
      name: 'Lisa',
      date: '10. März 2026',
      message: 'Ihr seid einfach das perfekte Paar! Alles Liebe für eure gemeinsame Zukunft. 💚'
    },
    {
      name: 'Opa Heinrich',
      date: '8. März 2026',
      message: 'Meine liebsten Enkel, ich bin so stolz auf euch. Die Liebe, die ihr füreinander habt, erinnert mich an Oma und mich. Gottes Segen!'
    }
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gästebucheintrag:', formData);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Section ref={sectionRef} id="guestbook">
      <FloatingElement $top="5%" $left="3%" $size="3rem" $duration="8s">📖</FloatingElement>
      <FloatingElement $top="15%" $right="8%" $size="2rem" $duration="6s" $delay="1s">🌿</FloatingElement>
      <FloatingElement $top="50%" $left="5%" $size="2.5rem" $duration="7s" $delay="2s">💚</FloatingElement>
      <FloatingElement $bottom="20%" $right="5%" $size="2rem" $duration="5s" $delay="0.5s">✨</FloatingElement>

      <Container>
        <Header $visible={isVisible}>
          <BookIcon>📖</BookIcon>
          <Eyebrow>Eure Wünsche</Eyebrow>
          <Title>Gäste<span>buch</span></Title>
          <Subtitle>
            Hinterlasst uns eine liebe Nachricht, einen Wunsch oder eine Erinnerung. 
            Wir freuen uns über jeden Eintrag von Herzen!
          </Subtitle>
        </Header>

        <ContentGrid>
          <FormCard $visible={isVisible}>
            <FormTitle>✍️ Neuer Eintrag</FormTitle>
            {!submitted ? (
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>Euer Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Wie heißt ihr?"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Eure Nachricht</Label>
                  <Textarea
                    name="message"
                    placeholder="Schreibt uns eure Glückwünsche, Erinnerungen oder einen lieben Gruß..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>

                <SubmitButton type="submit">
                  💌 Eintrag absenden
                </SubmitButton>
              </Form>
            ) : (
              <SuccessMessage>
                <SuccessIcon>💚</SuccessIcon>
                <SuccessText>
                  Vielen herzlichen Dank für eure lieben Worte!<br />
                  Euer Eintrag wurde gespeichert.
                </SuccessText>
              </SuccessMessage>
            )}
          </FormCard>

          <EntriesSection $visible={isVisible}>
            <EntriesTitle>💌 Einträge ({entries.length})</EntriesTitle>
            <EntriesList>
              {entries.map((entry, index) => (
                <EntryCard key={index}>
                  <EntryHeader>
                    <EntryAuthor>🌿 {entry.name}</EntryAuthor>
                    <EntryDate>{entry.date}</EntryDate>
                  </EntryHeader>
                  <EntryMessage>{entry.message}</EntryMessage>
                </EntryCard>
              ))}
            </EntriesList>
          </EntriesSection>
        </ContentGrid>
      </Container>
    </Section>
  );
};

export default Guestbook;
