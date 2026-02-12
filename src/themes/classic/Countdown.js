import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const lineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const Section = styled.section`
  padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem);
  background: var(--classic-white);
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--classic-gold);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  color: var(--classic-charcoal);
  margin-bottom: 0.5rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}
`;

const ScriptText = styled.span`
  font-family: var(--font-script);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: var(--classic-gold);
  display: block;
  margin-bottom: 2rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;`}
`;

const Line = styled.div`
  width: 60px;
  height: 1px;
  background: var(--classic-gold);
  margin: 0 auto 3rem;
  transform: scaleX(0);
  ${p => p.$visible && css`animation: ${lineGrow} 0.6s ease forwards; animation-delay: 0.4s;`}
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(2rem, 5vw, 4rem);
  flex-wrap: wrap;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.5s;`}
`;

const Unit = styled.div`text-align: center;`;

const Number = styled.div`
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 300;
  color: var(--classic-charcoal);
  line-height: 1;
`;

const Label = styled.div`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--classic-text-light);
  margin-top: 0.5rem;
`;

function Countdown() {
  const { content, weddingDate } = useWedding();
  const countdown = content?.countdown || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const targetDate = countdown.target_date || weddingDate || '2026-08-15T14:00:00';
  const title = countdown.title || 'Bald ist es soweit';
  const subtitle = countdown.subtitle || 'bis zum großen Tag';

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate) - new Date());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <Section id="countdown" ref={ref}>
      <Eyebrow $visible={visible}>{title}</Eyebrow>
      <ScriptText $visible={visible}>{subtitle}</ScriptText>
      <Line $visible={visible} />
      <Grid $visible={visible}>
        <Unit><Number>{time.days}</Number><Label>Tage</Label></Unit>
        <Unit><Number>{time.hours}</Number><Label>Stunden</Label></Unit>
        <Unit><Number>{time.minutes}</Number><Label>Minuten</Label></Unit>
        <Unit><Number>{time.seconds}</Number><Label>Sekunden</Label></Unit>
      </Grid>
    </Section>
  );
}

export default Countdown;
