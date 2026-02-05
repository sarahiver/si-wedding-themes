// src/themes/citrus/CitrusLoveStory.js
// Love Story Timeline with citrus decorations
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from './GlobalStyles';
import { BouncingCitrus } from './components/LottieAnimation';

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_STORY = [
  {
    date: 'Juni 2020',
    title: 'Das erste Treffen',
    description: 'Bei einem sommerlichen Grillfest haben sich unsere Blicke zum ersten Mal getroffen. Es war Liebe auf den ersten Blick.',
    icon: '🍋'
  },
  {
    date: 'August 2020',
    title: 'Das erste Date',
    description: 'Ein Picknick im Park mit frischer Limonade und viel Gelächter. Der Beginn von etwas Wunderbarem.',
    icon: '🍊'
  },
  {
    date: 'Dezember 2022',
    title: 'Zusammengezogen',
    description: 'Unsere erste gemeinsame Wohnung. Ein neues Kapitel beginnt.',
    icon: '🏡'
  },
  {
    date: 'März 2025',
    title: 'Der Antrag',
    description: 'Unter einem blühenden Zitronenbaum in Italien hat er die große Frage gestellt. Sie hat JA gesagt!',
    icon: '💍'
  }
];

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusLoveStory = ({
  title = 'Unsere Geschichte',
  subtitle = 'Wie aus zwei Leben eines wurde',
  story = DEFAULT_STORY
}) => {
  return (
    <SectionWrapper id="lovestory">
      <Container>
        <Header>
          <Subtitle>{subtitle}</Subtitle>
          <Title>{title}</Title>
          <TitleDecoration>
            <DecoLine />
            <DecoIcon>🍃</DecoIcon>
            <DecoLine />
          </TitleDecoration>
        </Header>

        <Timeline>
          {story.map((item, index) => (
            <TimelineItem key={index} $isEven={index % 2 === 0}>
              <TimelineContent $isEven={index % 2 === 0}>
                <DateBadge>{item.date}</DateBadge>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </TimelineContent>

              <TimelineCenter>
                <TimelineIcon>{item.icon}</TimelineIcon>
                <TimelineLine $isLast={index === story.length - 1} />
              </TimelineCenter>

              <TimelineSpacer />
            </TimelineItem>
          ))}
        </Timeline>

        {/* Decorative bouncing citrus */}
        <DecorativeElements>
          <BouncingCitrus $color={colors.lime} $size={30} $delay={0} style={{ position: 'absolute', top: '10%', left: '5%' }} />
          <BouncingCitrus $color={colors.lemon} $size={25} $delay={0.3} style={{ position: 'absolute', top: '30%', right: '8%' }} />
          <BouncingCitrus $color={colors.orange} $size={20} $delay={0.6} style={{ position: 'absolute', bottom: '20%', left: '10%' }} />
        </DecorativeElements>
      </Container>
    </SectionWrapper>
  );
};

export default CitrusLoveStory;

// ============================================
// ANIMATIONS
// ============================================
const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
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

// ============================================
// STYLED COMPONENTS
// ============================================
const SectionWrapper = styled.section`
  position: relative;
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: linear-gradient(180deg, ${colors.cream} 0%, ${colors.sand} 50%, ${colors.cream} 100%);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
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

const TitleDecoration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DecoLine = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.lime};
`;

const DecoIcon = styled.span`
  font-size: 1.5rem;
`;

const Timeline = styled.div`
  position: relative;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr;
    gap: 1.5rem;

    > div:last-child {
      display: none;
    }
  }
`;

const TimelineContent = styled.div`
  padding: 2rem;
  background: ${colors.warmWhite};
  border-radius: 16px;
  border: 2px solid ${colors.lime}20;
  box-shadow: 0 10px 40px rgba(74, 124, 35, 0.1);
  transition: all 0.3s ease;
  order: ${p => p.$isEven ? 0 : 2};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(74, 124, 35, 0.15);
    border-color: ${colors.lime};
  }

  @media (max-width: 768px) {
    order: 1;
  }
`;

const TimelineSpacer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const TimelineCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  order: 1;

  @media (max-width: 768px) {
    order: 0;
  }
`;

const TimelineIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${colors.lime};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(164, 210, 51, 0.4);
  z-index: 2;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const TimelineLine = styled.div`
  width: 3px;
  flex: 1;
  min-height: 60px;
  background: linear-gradient(180deg, ${colors.lime} 0%, ${p => p.$isLast ? 'transparent' : colors.lime} 100%);
  margin-top: -5px;

  @media (max-width: 768px) {
    min-height: 40px;
  }
`;

const DateBadge = styled.span`
  display: inline-block;
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.warmWhite};
  background: ${colors.leafGreen};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 500;
  color: ${colors.charcoal};
  margin-bottom: 0.75rem;
`;

const ItemDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  line-height: 1.7;
  color: ${colors.charcoal};
  opacity: 0.8;
`;

const DecorativeElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;
