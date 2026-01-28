import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
`;

const typing = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--gray-100);
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const ChatWindow = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: var(--black);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--coral);
  border: 2px solid var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ChatInfo = styled.div``;

const ChatName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--white);
`;

const ChatStatus = styled.div`
  font-size: 0.7rem;
  color: var(--electric);
`;

const ChatMessages = styled.div`
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
`;

const QuestionTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--gray-100);
  border-top: 2px solid var(--gray-200);
`;

const QuestionTab = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${p => p.$active ? 'var(--white)' : 'var(--gray-600)'};
  background: ${p => p.$active ? 'var(--coral)' : 'var(--white)'};
  padding: 0.5rem 1rem;
  border: 2px solid var(--black);
  box-shadow: ${p => p.$active ? 'var(--shadow-sm)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.$active ? 'var(--coral)' : 'var(--yellow)'};
  }
`;

const MessageGroup = styled.div`
  margin-bottom: 1.5rem;
  animation: ${popIn} 0.4s ease;
`;

const QuestionBubble = styled.div`
  background: var(--gray-100);
  padding: 1rem 1.25rem;
  max-width: 85%;
  margin-bottom: 0.75rem;
  border: 2px solid var(--gray-300);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: -10px;
    top: 15px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 10px solid var(--gray-300);
  }
`;

const AnswerBubble = styled.div`
  background: var(--coral);
  color: var(--white);
  padding: 1rem 1.25rem;
  max-width: 85%;
  margin-left: auto;
  border: 2px solid var(--black);
  box-shadow: var(--shadow-sm);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 15px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 10px solid var(--black);
  }
`;

const BubbleText = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

const BubbleTime = styled.span`
  display: block;
  font-size: 0.65rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  text-align: right;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 1rem;
  background: var(--coral);
  width: fit-content;
  margin-left: auto;
  border: 2px solid var(--black);
`;

const TypingDot = styled.span`
  width: 8px;
  height: 8px;
  background: var(--white);
  animation: ${typing} 1.4s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const ContactBox = styled.div`
  background: var(--yellow);
  padding: 1.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  text-align: center;
`;

const ContactText = styled.p`
  font-size: 0.9rem;
  color: var(--black);
  margin-bottom: 1rem;
`;

const ContactButton = styled.a`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  background: var(--black);
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--black);
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--coral);
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--black);
  }
`;

function FAQ() {
  const { content, projectId } = useWedding();
  const faqData = content?.faq || {};
  const questions = faqData.questions || [];
  const [visible, setVisible] = useState(false);
  const [activeQ, setActiveQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const sectionRef = useRef(null);

  const defaultQuestions = [
    { q: 'Was ist der Dresscode?', a: 'Smart Casual bis Festlich. Hauptsache, ihr fühlt euch wohl und seid bereit zu tanzen!' },
    { q: 'Kann ich +1 mitbringen?', a: 'Bitte nur, wenn auf eurer Einladung explizit erwähnt. Meldet euch bei uns, falls Fragen!' },
    { q: 'Sind Kinder willkommen?', a: 'Wir feiern adults-only, damit alle richtig feiern können. Danke für euer Verständnis!' },
    { q: 'Wo kann ich parken?', a: 'Kostenlose Parkplätze direkt vor der Location. Alternativ: Taxi-Service ab 23 Uhr.' },
    { q: 'Bis wann muss ich zusagen?', a: 'Bitte bis spätestens 4 Wochen vor der Hochzeit. Hilft uns bei der Planung enorm!' },
  ];

  const items = questions.length > 0 ? questions : defaultQuestions;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setShowAnswer(false);
    const timer = setTimeout(() => setShowAnswer(true), 800);
    return () => clearTimeout(timer);
  }, [activeQ]);

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>❓ FAQ</Eyebrow>
          <Title $visible={visible}>Got Questions?</Title>
        </Header>
        
        <ChatWindow>
          <ChatHeader>
            <ChatAvatar>💍</ChatAvatar>
            <ChatInfo>
              <ChatName>Sophie & Max</ChatName>
              <ChatStatus>● Online</ChatStatus>
            </ChatInfo>
          </ChatHeader>
          
          <ChatMessages>
            <MessageGroup key={activeQ}>
              <QuestionBubble>
                <BubbleText>{items[activeQ].q}</BubbleText>
                <BubbleTime>Jetzt</BubbleTime>
              </QuestionBubble>
              
              {showAnswer ? (
                <AnswerBubble>
                  <BubbleText>{items[activeQ].a}</BubbleText>
                  <BubbleTime>✓✓</BubbleTime>
                </AnswerBubble>
              ) : (
                <TypingIndicator>
                  <TypingDot $delay="0s" />
                  <TypingDot $delay="0.2s" />
                  <TypingDot $delay="0.4s" />
                </TypingIndicator>
              )}
            </MessageGroup>
          </ChatMessages>
          
          <QuestionTabs>
            {items.map((item, i) => (
              <QuestionTab key={i} $active={activeQ === i} onClick={() => setActiveQ(i)}>
                {item.q.split(' ').slice(0, 3).join(' ')}...
              </QuestionTab>
            ))}
          </QuestionTabs>
        </ChatWindow>
        
        <ContactBox>
          <ContactText>Noch mehr Fragen? Schreib uns!</ContactText>
          <ContactButton href="mailto:hallo@sophie-max.de">Email senden →</ContactButton>
        </ContactBox>
      </Container>
    </Section>
  );
}

export default FAQ;
