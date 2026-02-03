// Contemporary FAQ - Chat Messenger Style
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const typing = keyframes`
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--gray-100);
  position: relative;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
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
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

// Browser Window
const BrowserWindow = styled.div`
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: 12px 12px 0 var(--black);
  overflow: hidden;
`;

const BrowserHeader = styled.div`
  background: var(--black);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BrowserDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 2px solid rgba(255,255,255,0.3);
`;

const BrowserTitle = styled.div`
  flex: 1;
  text-align: center;
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ChatArea = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 1.5rem;
  background: var(--gray-100);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray-200);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: 4px;
  }
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${p => p.$sent ? 'flex-end' : 'flex-start'};
  animation: ${slideIn} 0.3s ease;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 1rem 1.25rem;
  background: ${p => p.$sent ? 'var(--coral)' : 'var(--white)'};
  color: ${p => p.$sent ? 'var(--white)' : 'var(--black)'};
  border: 3px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  font-size: 0.95rem;
  line-height: 1.5;
  position: relative;
  
  ${p => p.$sent ? `
    border-radius: 20px 20px 4px 20px;
  ` : `
    border-radius: 20px 20px 20px 4px;
  `}
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  color: ${p => p.$sent ? 'rgba(255,255,255,0.7)' : 'var(--gray-400)'};
  margin-top: 0.5rem;
  text-align: ${p => p.$sent ? 'right' : 'left'};
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 1rem;
  background: var(--white);
  border: 3px solid var(--black);
  border-radius: 20px;
  width: fit-content;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--gray-400);
  border-radius: 50%;
  animation: ${typing} 1.4s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
`;

// Question Buttons
const QuestionsBar = styled.div`
  background: var(--white);
  border-top: 4px solid var(--black);
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 180px;
  overflow-y: auto;
`;

const QuestionButton = styled.button`
  padding: 0.6rem 1rem;
  background: ${p => p.$asked ? 'var(--gray-200)' : 'var(--yellow)'};
  border: 3px solid var(--black);
  box-shadow: ${p => p.$asked ? 'none' : '3px 3px 0 var(--black)'};
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: ${p => p.$asked ? 'default' : 'pointer'};
  opacity: ${p => p.$asked ? 0.5 : 1};
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    ${p => !p.$asked && `
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0 var(--black);
    `}
  }
  
  &:active {
    ${p => !p.$asked && `
      transform: translate(0, 0);
      box-shadow: 3px 3px 0 var(--black);
    `}
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--gray-400);
  padding: 3rem;
  
  span {
    display: block;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'FAQ';
  const items = faqData.questions || [];

  const [messages, setMessages] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Keine Default-FAQs - zeige nichts wenn keine Fragen angelegt
  if (items.length === 0) return null;

  const askQuestion = (item, index) => {
    if (askedQuestions.has(index)) return;
    
    // Add question message
    const newMessages = [...messages, { type: 'sent', text: item.question }];
    setMessages(newMessages);
    setAskedQuestions(new Set([...askedQuestions, index]));
    
    // Show typing indicator
    setIsTyping(true);
    
    // Add answer after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'received', text: item.answer }]);
    }, 1000 + Math.random() * 1000);
  };

  const getTime = () => {
    return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Section id="faq">
      <Container>
        <Header>
          <Eyebrow>💬 Fragen & Antworten</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <BrowserWindow>
          <BrowserHeader>
            <BrowserDot $color="var(--coral)" />
            <BrowserDot $color="var(--yellow)" />
            <BrowserDot $color="var(--electric)" />
            <BrowserTitle>Wedding Chat</BrowserTitle>
          </BrowserHeader>
          
          <ChatArea ref={chatRef}>
            {messages.length === 0 && !isTyping && (
              <EmptyState>
                <span>👇</span>
                Klicke unten auf eine Frage!
              </EmptyState>
            )}
            
            {messages.map((msg, i) => (
              <MessageRow key={i} $sent={msg.type === 'sent'}>
                <Message $sent={msg.type === 'sent'}>
                  {msg.text}
                  <MessageTime $sent={msg.type === 'sent'}>{getTime()}</MessageTime>
                </Message>
              </MessageRow>
            ))}
            
            {isTyping && (
              <MessageRow $sent={false}>
                <TypingIndicator>
                  <TypingDot $delay={0} />
                  <TypingDot $delay={0.2} />
                  <TypingDot $delay={0.4} />
                </TypingIndicator>
              </MessageRow>
            )}
          </ChatArea>
          
          <QuestionsBar>
            {items.map((item, index) => (
              <QuestionButton 
                key={index}
                $asked={askedQuestions.has(index)}
                onClick={() => askQuestion(item, index)}
              >
                {item.question}
              </QuestionButton>
            ))}
          </QuestionsBar>
        </BrowserWindow>
      </Container>
    </Section>
  );
}

export default FAQ;
