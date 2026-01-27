import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE COUNTDOWN - Animated Horizontal Timeline
// Shows journey from Jan 2026 → Today → Wedding Day
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--luxe-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const TimelineWrapper = styled.div`
  position: relative;
  padding: 3rem 0;
`;

const TimelineLine = styled.div`
  position: relative;
  height: 2px;
  background: var(--luxe-border);
  margin: 0 60px;
`;

const fillAnimation = keyframes`
  from { width: 0; }
  to { width: var(--fill-width); }
`;

const TimelineProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--luxe-gold), var(--luxe-gold-soft));
  width: 0;
  
  ${p => p.$animate && css`
    animation: ${fillAnimation} 2s ease-out forwards;
    --fill-width: ${p.$progress}%;
  `}
`;

const markerPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(200, 184, 138, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(200, 184, 138, 0); }
`;

const Marker = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-white)'};
  border: 2px solid ${p => p.$passed ? 'var(--luxe-gold)' : 'var(--luxe-border)'};
  z-index: 10;
  transition: all 0.3s ease;
  
  ${p => p.$today && css`
    width: 20px;
    height: 20px;
    animation: ${markerPulse} 2s ease-in-out infinite;
  `}
`;

const MarkerLabel = styled.div`
  position: absolute;
  top: ${p => p.$above ? 'auto' : '30px'};
  bottom: ${p => p.$above ? '30px' : 'auto'};
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
`;

const MarkerDate = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$highlight ? 'var(--luxe-gold)' : 'var(--luxe-text-muted)'};
  margin-bottom: 0.25rem;
`;

const MarkerText = styled.p`
  font-family: var(--font-serif);
  font-size: 0.9rem;
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const CountdownDisplay = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 5rem;
  
  @media (max-width: 600px) {
    gap: 1.5rem;
  }
`;

const CountdownItem = styled.div`
  text-align: center;
`;

const countIn = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

const CountdownNumber = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-style: italic;
  color: var(--luxe-text-heading);
  line-height: 1;
  margin-bottom: 0.5rem;
  
  ${p => p.$animate && css`
    animation: ${countIn} 0.5s ease-out ${p.$delay}s both;
  `}
`;

const CountdownLabel = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
`;

const Message = styled.p`
  text-align: center;
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--luxe-text-light);
  margin-top: 3rem;
`;

function Countdown({ weddingDate }) {
  const [animate, setAnimate] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sectionRef = useRef(null);
  
  // Wedding date: 20. Oktober 2026
  const wedding = new Date(weddingDate || '2026-10-20T14:00:00');
  const startOfYear = new Date('2026-01-01');
  const today = new Date();
  
  // Calculate progress percentage
  const totalDuration = wedding - startOfYear;
  const elapsed = today - startOfYear;
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  
  // Calculate position for today marker (between 0 and 100)
  const todayPosition = progress;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = wedding - now;
      
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
  }, [wedding]);
  
  const pad = n => String(n).padStart(2, '0');
  
  return (
    <Section id="countdown" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow>Die Reise</Eyebrow>
          <Title>Bis zum großen Tag</Title>
        </Header>
        
        <TimelineWrapper>
          <TimelineLine>
            <TimelineProgress $animate={animate} $progress={progress} />
            
            {/* Start marker: Jan 2026 */}
            <Marker style={{ left: '0%' }} $passed={true}>
              <MarkerLabel $above>
                <MarkerDate>Januar 2026</MarkerDate>
                <MarkerText>Beginn</MarkerText>
              </MarkerLabel>
            </Marker>
            
            {/* Today marker */}
            <Marker style={{ left: `${todayPosition}%` }} $today $active>
              <MarkerLabel>
                <MarkerDate $highlight>Heute</MarkerDate>
                <MarkerText>{today.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</MarkerText>
              </MarkerLabel>
            </Marker>
            
            {/* Wedding marker */}
            <Marker style={{ left: '100%' }}>
              <MarkerLabel $above>
                <MarkerDate>20. Oktober 2026</MarkerDate>
                <MarkerText>Hochzeit</MarkerText>
              </MarkerLabel>
            </Marker>
          </TimelineLine>
        </TimelineWrapper>
        
        <CountdownDisplay>
          <CountdownItem>
            <CountdownNumber $animate={animate} $delay={0.5}>{pad(timeLeft.days)}</CountdownNumber>
            <CountdownLabel>Tage</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber $animate={animate} $delay={0.6}>{pad(timeLeft.hours)}</CountdownNumber>
            <CountdownLabel>Stunden</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber $animate={animate} $delay={0.7}>{pad(timeLeft.minutes)}</CountdownNumber>
            <CountdownLabel>Minuten</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber $animate={animate} $delay={0.8}>{pad(timeLeft.seconds)}</CountdownNumber>
            <CountdownLabel>Sekunden</CountdownLabel>
          </CountdownItem>
        </CountdownDisplay>
        
        <Message>Jeder Tag bringt uns näher zusammen</Message>
      </Container>
    </Section>
  );
}

export default Countdown;
