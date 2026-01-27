import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; height: 40px; }
  50% { opacity: 1; height: 50px; }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--luxe-white, #FFFFFF);
  padding: 2rem;
  position: relative;
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  width: 180px;
  height: 240px;
  background: var(--luxe-cream, #FDFCFA);
  border: 1px solid var(--luxe-border, #ECEAE6);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: 'Photo';
    font-family: var(--font-sans, 'Montserrat', sans-serif);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--luxe-text-muted, #9A9A9A);
  }
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ImageLeft = styled(ImagePlaceholder)`
  top: 15%;
  left: 8%;
  transform: rotate(-3deg);
  animation: ${fadeIn} 1s ease 0.8s both;
`;

const ImageRight = styled(ImagePlaceholder)`
  bottom: 15%;
  right: 8%;
  transform: rotate(3deg);
  animation: ${fadeIn} 1s ease 1s both;
`;

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  padding: 3.5rem 3rem;
  background: var(--luxe-cream, #FDFCFA);
  text-align: center;
  animation: ${fadeIn} 1s ease forwards;
  position: relative;
  z-index: 1;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--luxe-gold, #C8B88A), transparent);
  margin: 0 auto 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
  margin-bottom: 1.5rem;
`;

const Names = styled.h1`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-text-heading, #4A4A4A);
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  span {
    display: block;
  }
  
  .ampersand {
    font-size: 0.5em;
    color: var(--luxe-gold, #C8B88A);
  }
`;

const DateText = styled.p`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-text, #5A5A5A);
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
  margin-bottom: 2.5rem;
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
`;

const CountdownItem = styled.div``;

const CountdownNumber = styled.span`
  display: block;
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: 2rem;
  font-style: italic;
  color: var(--luxe-text-heading, #4A4A4A);
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const CountdownLabel = styled.span`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.5rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
`;

const Message = styled.p`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: 1rem;
  font-style: italic;
  color: var(--luxe-text-light, #7A7A7A);
  margin-bottom: 2.5rem;
  line-height: 1.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const PrimaryButton = styled.a`
  display: inline-block;
  padding: 1rem 2.5rem;
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-white, #FFFFFF);
  background: var(--luxe-text-heading, #4A4A4A);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--luxe-gold, #C8B88A);
  }
`;

const SecondaryButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-text-light, #7A7A7A);
  background: transparent;
  border: 1px solid var(--luxe-border, #ECEAE6);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--luxe-gold, #C8B88A);
    color: var(--luxe-gold, #C8B88A);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 1s ease 1.2s both;
`;

const ScrollText = styled.span`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.5rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--luxe-gold, #C8B88A), transparent);
  animation: ${pulse} 2s ease-in-out infinite;
`;

function SaveTheDate({ config = {} }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const {
    name1 = "Dave",
    name2 = "Kalle",
    weddingDateDisplay = "October 20, 2026",
    weddingDateISO = "2026-10-20T14:00:00",
    location = "Château de Lumière",
  } = config;
  
  useEffect(() => {
    const targetDate = new Date(weddingDateISO);
    
    const calculate = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [weddingDateISO]);
  
  const downloadCalendar = () => {
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${weddingDateISO.replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Wedding ${name1} & ${name2}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'save-the-date.ics';
    link.click();
  };
  
  const pad = n => String(n).padStart(2, '0');
  
  return (
    <Page>
      <ImageLeft />
      <ImageRight />
      
      <Card>
        <GoldLine />
        <Eyebrow>Save the Date</Eyebrow>
        
        <Names>
          <span>{name1}</span>
          <span className="ampersand">&</span>
          <span>{name2}</span>
        </Names>
        
        <DateText>{weddingDateDisplay}</DateText>
        <Location>{location}</Location>
        
        <CountdownGrid>
          <CountdownItem>
            <CountdownNumber>{pad(timeLeft.days)}</CountdownNumber>
            <CountdownLabel>Days</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{pad(timeLeft.hours)}</CountdownNumber>
            <CountdownLabel>Hours</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{pad(timeLeft.minutes)}</CountdownNumber>
            <CountdownLabel>Minutes</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{pad(timeLeft.seconds)}</CountdownNumber>
            <CountdownLabel>Seconds</CountdownLabel>
          </CountdownItem>
        </CountdownGrid>
        
        <Message>
          We are delighted to share our special day with you.<br />
          Formal invitation to follow.
        </Message>
        
        <ButtonGroup>
          <PrimaryButton href="/">View Website</PrimaryButton>
          <SecondaryButton onClick={downloadCalendar}>Add to Calendar</SecondaryButton>
        </ButtonGroup>
      </Card>
      
      <ScrollIndicator>
        <ScrollText>Scroll</ScrollText>
        <ScrollLine />
      </ScrollIndicator>
    </Page>
  );
}

export default SaveTheDate;
