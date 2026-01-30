import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  text-align: center;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  
  @media (max-width: 600px) {
    gap: 1.5rem;
  }
`;

const Unit = styled.div`
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Number = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 300;
  line-height: 1;
  color: var(--zen-text);
`;

const Label = styled.div`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--zen-text-light);
  margin-top: 0.8rem;
`;

const Separator = styled.div`
  font-family: var(--font-serif);
  font-size: 2rem;
  color: var(--zen-line);
  opacity: 0;
  transition: opacity 0.8s ease;
  transition-delay: 0.2s;
  
  &.visible {
    opacity: 1;
  }
  
  @media (max-width: 600px) {
    display: none;
  }
`;

function Countdown() {
  const { content, weddingDate } = useWedding();
  const data = content?.countdown || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });
  
  const targetDate = data.target_date || weddingDate;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          mins: Math.floor((diff % 3600000) / 60000),
        });
      }
    };
    
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Section id="countdown" ref={sectionRef}>
      <Content>
        <Grid>
          <Unit className={visible ? 'visible' : ''} $delay={0}>
            <Number>{time.days}</Number>
            <Label>Tage</Label>
          </Unit>
          
          <Separator className={visible ? 'visible' : ''}>:</Separator>
          
          <Unit className={visible ? 'visible' : ''} $delay={0.1}>
            <Number>{String(time.hours).padStart(2, '0')}</Number>
            <Label>Stunden</Label>
          </Unit>
          
          <Separator className={visible ? 'visible' : ''}>:</Separator>
          
          <Unit className={visible ? 'visible' : ''} $delay={0.2}>
            <Number>{String(time.mins).padStart(2, '0')}</Number>
            <Label>Minuten</Label>
          </Unit>
        </Grid>
      </Content>
    </Section>
  );
}

export default Countdown;
