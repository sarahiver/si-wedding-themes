// src/components/FAQ.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #FFFFFF;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
`;

const AccordionList = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease ${p => 0.1 + p.$index * 0.08}s;

  &:last-child {
    border-bottom: none;
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 30px;
  align-items: center;
  gap: 20px;
  padding: 25px 30px;
  background: ${p => p.$open ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
  text-align: left;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 600px) {
    grid-template-columns: 40px 1fr 25px;
    padding: 20px;
    gap: 15px;
  }
`;

const ItemNumber = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #B8976A;
`;

const ItemQuestion = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.3rem;
  color: #FFFFFF;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const ToggleIcon = styled.span`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease;
  transform: ${p => p.$open ? 'rotate(45deg)' : 'rotate(0)'};
`;

const AccordionContent = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const ContentInner = styled.div`
  padding: 0 30px 30px 100px;

  @media (max-width: 600px) {
    padding: 0 20px 25px 75px;
  }
`;

const Answer = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
`;

function FAQ() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: 'Dürfen wir Kinder mitbringen?',
      answer: 'Wir lieben Kinder, aber für diesen besonderen Tag wünschen wir uns eine Feier nur für Erwachsene. Wir hoffen auf euer Verständnis und bitten euch, Arrangements für eure Kleinen zu treffen.'
    },
    {
      question: 'Gibt es Parkplätze vor Ort?',
      answer: 'Ja, es stehen ausreichend kostenlose Parkplätze direkt an der Location zur Verfügung. Bitte folgt der Beschilderung vor Ort.'
    },
    {
      question: 'Was ist der Dresscode?',
      answer: 'Der Dresscode ist festlich elegant. Für die Herren empfehlen wir Anzug, für die Damen ein schickes Kleid oder Hosenanzug. Bitte vermeidet Weiß – das ist der Braut vorbehalten!'
    },
    {
      question: 'Dürfen wir Fotos machen?',
      answer: 'Während der Trauung bitten wir euch, die Handys und Kameras wegzulassen – unser Fotograf fängt alle wichtigen Momente ein. Bei der Feier freuen wir uns aber über eure Schnappschüsse!'
    },
    {
      question: 'Wie können wir euch beschenken?',
      answer: 'Eure Anwesenheit ist das schönste Geschenk! Falls ihr uns dennoch etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise.'
    },
    {
      question: 'Gibt es vegetarische Optionen?',
      answer: 'Ja, selbstverständlich! Bitte teilt uns bei eurer RSVP-Antwort eure Ernährungswünsche und eventuelle Allergien mit, damit wir das Menu entsprechend anpassen können.'
    },
    {
      question: 'Bis wann sollten wir zusagen?',
      answer: 'Bitte gebt uns bis zum 1. Mai 2025 Bescheid, ob ihr dabei sein könnt. Das hilft uns bei der Planung enorm!'
    }
  ];

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Fragen & Antworten</Eyebrow>
          <Title>Häufige <span>Fragen</span></Title>
          <Subtitle>Alles was ihr wissen müsst</Subtitle>
        </Header>

        <AccordionList>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} $visible={isVisible} $index={index}>
              <AccordionHeader 
                $open={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <ItemNumber>{String(index + 1).padStart(2, '0')}</ItemNumber>
                <ItemQuestion>{faq.question}</ItemQuestion>
                <ToggleIcon $open={openIndex === index}>+</ToggleIcon>
              </AccordionHeader>
              <AccordionContent $open={openIndex === index}>
                <ContentInner>
                  <Answer>{faq.answer}</Answer>
                </ContentInner>
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionList>
      </Container>
    </Section>
  );
}

export default FAQ;
