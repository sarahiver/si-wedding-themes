import { useWedding } from '../../context/WeddingContext';
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--neon-bg);
  padding: 120px 5vw;
  position: relative;
  overflow: hidden;
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
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

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

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const CommandLine = styled.div`
  font-family: 'Space Grotesk', monospace;
  color: var(--neon-green);
  font-size: 0.9rem;
  margin-bottom: 10px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &::before {
    content: '$ ';
    color: var(--neon-cyan);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-family: 'Space Grotesk', sans-serif;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FAQItem = styled.div`
  background: rgba(0, 255, 255, 0.03);
  border-left: 3px solid ${props => props.isOpen ? 'var(--neon-cyan)' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.06);
  }
`;

const Question = styled.button`
  width: 100%;
  padding: 20px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  text-align: left;
  
  &:focus {
    outline: none;
  }
`;

const QuestionNumber = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: ${props => props.isOpen ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.4)'};
  min-width: 40px;
  
  &::before {
    content: '[';
    color: rgba(255, 255, 255, 0.3);
  }
  
  &::after {
    content: ']';
    color: rgba(255, 255, 255, 0.3);
  }
`;

const QuestionText = styled.span`
  flex: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: ${props => props.isOpen ? 'var(--neon-cyan)' : 'white'};
  transition: color 0.3s ease;
  text-shadow: ${props => props.isOpen ? '0 0 10px rgba(0, 255, 255, 0.5)' : 'none'};
`;

const ToggleIcon = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 1.2rem;
  color: ${props => props.isOpen ? 'var(--neon-pink)' : 'var(--neon-cyan)'};
  transition: all 0.3s ease;
  text-shadow: 0 0 10px ${props => props.isOpen ? 'var(--neon-pink)' : 'var(--neon-cyan)'};
`;

const Answer = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AnswerContent = styled.div`
  padding: 0 20px 20px 75px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  
  &::before {
    content: '> ';
    color: var(--neon-green);
  }
`;

const SearchBox = styled.div`
  margin-bottom: 30px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 45px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-family: 'Space Grotesk', monospace;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--neon-cyan);
  font-size: 1.1rem;
`;

const StatusBar = styled.div`
  margin-top: 30px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
`;

const StatusText = styled.span`
  color: var(--neon-green);
  
  span {
    color: var(--neon-cyan);
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--neon-cyan);
  margin-left: 5px;
  animation: ${blink} 1s infinite;
`;

const NoResults = styled.div`
  padding: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Space Grotesk', monospace;
  
  &::before {
    content: '// ';
    color: var(--neon-pink);
  }
`;

const FAQ = ({ config = {} }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  
  const defaultFaqs = [
    {
      question: "Wann und wo findet die Hochzeit statt?",
      answer: "Die Zeremonie beginnt um 14:00 Uhr in der St. Marien Kirche. Die Feier findet anschließend ab 17:00 Uhr in der Eventlocation statt. Die genauen Adressen findet ihr unter 'Locations'."
    },
    {
      question: "Gibt es einen Dresscode?",
      answer: "Wir freuen uns über elegante Abendgarderobe. Bitte keine weißen oder cremefarbenen Outfits - das ist der Braut vorbehalten. Mehr Details findet ihr unter 'Dresscode'."
    },
    {
      question: "Kann ich eine Begleitung mitbringen?",
      answer: "Die Einladung gilt für die auf der Einladung genannten Personen. Falls ihr unsicher seid, kontaktiert uns gerne direkt."
    },
    {
      question: "Sind Kinder willkommen?",
      answer: "Wir haben uns für eine Feier nur mit Erwachsenen entschieden. Wir hoffen auf euer Verständnis und wünschen euch einen schönen Abend ohne die Kleinen."
    },
    {
      question: "Gibt es vegetarische/vegane Optionen?",
      answer: "Absolut! Bitte gebt bei eurer RSVP-Antwort eure Ernährungswünsche an. Unser Catering kann auf alle Bedürfnisse eingehen."
    },
    {
      question: "Wo kann ich parken?",
      answer: "Es gibt ausreichend kostenlose Parkplätze direkt an der Location. Details zur Anfahrt findet ihr unter 'Anfahrt'."
    },
    {
      question: "Gibt es eine Geschenkeliste?",
      answer: "Eure Anwesenheit ist das größte Geschenk! Falls ihr uns dennoch etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise. Details unter 'Geschenke'."
    },
    {
      question: "Bis wann muss ich zusagen?",
      answer: "Bitte gebt uns bis spätestens 6 Wochen vor der Hochzeit Bescheid. Das hilft uns bei der Planung enorm!"
    },
    {
      question: "Darf ich Fotos machen?",
      answer: "Während der Zeremonie bitten wir euch, die Handys wegzulassen - unser Fotograf hält alles fest. Bei der Feier könnt ihr nach Herzenslust knipsen und die Bilder gerne hochladen!"
    },
    {
      question: "An wen kann ich mich bei Fragen wenden?",
      answer: "Unsere Trauzeugen helfen euch gerne weiter. Kontaktdaten findet ihr unter 'Trauzeugen'. Für dringende Fragen könnt ihr uns auch direkt kontaktieren."
    }
  ];
  
  const faqs = config.faqs || defaultFaqs;
  
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
  
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <Section ref={sectionRef} id="faq">
      <GridOverlay />
      
      <Container>
        <TerminalWindow>
          <TerminalHeader>
            <Dot color="#ff5f56" />
            <Dot color="#ffbd2e" />
            <Dot color="#27ca40" />
            <TerminalTitle>faq_terminal.exe</TerminalTitle>
          </TerminalHeader>
          
          <TerminalBody>
            <Header>
              <CommandLine visible={visible}>
                cat frequently_asked_questions.md
              </CommandLine>
              <Title>FAQ</Title>
              <Subtitle>Alles was ihr wissen müsst</Subtitle>
            </Header>
            
            <SearchBox>
              <SearchIcon>⌕</SearchIcon>
              <SearchInput 
                type="text"
                placeholder="grep -i 'deine frage'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            
            <FAQList>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <FAQItem key={index} isOpen={openIndex === index}>
                    <Question onClick={() => toggleFaq(index)}>
                      <QuestionNumber isOpen={openIndex === index}>
                        {String(index + 1).padStart(2, '0')}
                      </QuestionNumber>
                      <QuestionText isOpen={openIndex === index}>
                        {faq.question}
                      </QuestionText>
                      <ToggleIcon isOpen={openIndex === index}>
                        {openIndex === index ? '−' : '+'}
                      </ToggleIcon>
                    </Question>
                    <Answer isOpen={openIndex === index}>
                      <AnswerContent>{faq.answer}</AnswerContent>
                    </Answer>
                  </FAQItem>
                ))
              ) : (
                <NoResults>Keine Ergebnisse gefunden</NoResults>
              )}
            </FAQList>
            
            <StatusBar>
              <StatusText>
                <span>{filteredFaqs.length}</span> von <span>{faqs.length}</span> Einträgen
              </StatusText>
              <StatusText>
                status: <span>ready</span>
                <Cursor />
              </StatusText>
            </StatusBar>
          </TerminalBody>
        </TerminalWindow>
      </Container>
    </Section>
  );
};

export default FAQ;
