// src/themes/citrus/CitrusTimeline.js
// Wedding Day Timeline with citrus styling
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from './GlobalStyles';

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_SCHEDULE = [
  { time: '14:00', title: 'Empfang', description: 'Sektempfang im Garten mit frischen Cocktails', icon: '🥂' },
  { time: '14:30', title: 'Trauung', description: 'Die freie Trauung unter dem Zitronenbaum', icon: '💒' },
  { time: '15:30', title: 'Gratulation', description: 'Zeit für Glückwünsche und Fotos', icon: '📸' },
  { time: '16:30', title: 'Kaffee & Kuchen', description: 'Leckere Torte und frische Limonade', icon: '🎂' },
  { time: '18:30', title: 'Abendessen', description: 'Ein sommerliches Festmenü erwartet euch', icon: '🍽️' },
  { time: '21:00', title: 'Eröffnungstanz', description: 'Das Brautpaar eröffnet die Tanzfläche', icon: '💃' },
  { time: '22:00', title: 'Party', description: 'Tanzen bis die Sonne aufgeht!', icon: '🎉' },
];

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusTimeline = ({
  title = 'Unser Tag',
  subtitle = 'Der Ablaufplan',
  schedule = DEFAULT_SCHEDULE
}) => {
  return (
    <SectionWrapper id="timeline">
      <Container>
        <Header>
          <Subtitle>{subtitle}</Subtitle>
          <Title>{title}</Title>
        </Header>

        <TimelineContainer>
          {schedule.map((item, index) => (
            <TimelineItem key={index} $delay={index * 0.1}>
              <TimeColumn>
                <TimeBox>
                  <Time>{item.time}</Time>
                </TimeBox>
              </TimeColumn>

              <CenterColumn>
                <IconCircle>
                  <Icon>{item.icon}</Icon>
                </IconCircle>
                {index < schedule.length - 1 && <ConnectorLine />}
              </CenterColumn>

              <ContentColumn>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ContentColumn>
            </TimelineItem>
          ))}
        </TimelineContainer>

        {/* Note */}
        <Note>
          <NoteIcon>🍋</NoteIcon>
          <NoteText>
            Änderungen am Ablauf sind möglich. Wir halten euch auf dem Laufenden!
          </NoteText>
        </Note>
      </Container>

      {/* Background Decorations */}
      <DecoCircle $position="top-left" />
      <DecoCircle $position="bottom-right" />
    </SectionWrapper>
  );
};

export default CitrusTimeline;

// ============================================
// ANIMATIONS
// ============================================
const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const growDown = keyframes`
  from { height: 0; }
  to { height: 100%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const SectionWrapper = styled.section`
  position: relative;
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: linear-gradient(180deg, ${colors.sand} 0%, ${colors.cream} 100%);
  overflow: hidden;
`;

const DecoCircle = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 2px dashed ${colors.lime}30;
  pointer-events: none;

  ${p => p.$position === 'top-left' ? `
    top: -100px;
    left: -100px;
  ` : `
    bottom: -100px;
    right: -100px;
  `}

  @media (max-width: 768px) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Subtitle = styled.p`
  font-family: ${fonts.accent};
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: ${colors.lime};
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: ${fonts.heading};
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  font-style: italic;
  color: ${colors.charcoal};
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 100px auto 1fr;
  gap: 1.5rem;
  min-height: 100px;
  animation: ${fadeInLeft} 0.6s ease forwards;
  animation-delay: ${p => p.$delay}s;
  opacity: 0;

  @media (max-width: 600px) {
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
`;

const TimeColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;

  @media (max-width: 600px) {
    display: none;
  }
`;

const TimeBox = styled.div`
  background: ${colors.lime};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(164, 210, 51, 0.3);
`;

const Time = styled.span`
  font-family: ${fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.charcoal};
`;

const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${colors.warmWhite};
  border: 3px solid ${colors.lime};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${() => Math.random() * 2}s;
`;

const Icon = styled.span`
  font-size: 1.3rem;
`;

const ConnectorLine = styled.div`
  width: 3px;
  flex: 1;
  background: linear-gradient(180deg, ${colors.lime} 0%, ${colors.lime}50 100%);
  margin: -5px 0;
`;

const ContentColumn = styled.div`
  padding: 0.5rem 0 2rem;
`;

const ItemTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 500;
  color: ${colors.charcoal};
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    &::before {
      content: attr(data-time);
      display: block;
      font-family: ${fonts.body};
      font-size: 0.8rem;
      font-weight: 700;
      color: ${colors.lime};
      margin-bottom: 0.25rem;
    }
  }
`;

const ItemDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.charcoal};
  opacity: 0.7;
  line-height: 1.6;
`;

const Note = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  background: ${colors.warmWhite};
  border-radius: 16px;
  border: 2px dashed ${colors.lime}50;
`;

const NoteIcon = styled.span`
  font-size: 1.5rem;
`;

const NoteText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.95rem;
  color: ${colors.charcoal};
  opacity: 0.8;
`;
