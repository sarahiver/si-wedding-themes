// src/components/LoveStory.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
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
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;

  span {
    font-style: italic;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-40px'});
  transition: all 1s ease 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: -20px;
    bottom: -20px;
    border: 1px solid #B8976A;
    z-index: -1;
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.5s ease;

  &:hover {
    filter: grayscale(0%);
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 30px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease ${p => 0.3 + p.$index * 0.15}s;
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 500px) {
    grid-template-columns: 50px 1fr;
    gap: 20px;
  }
`;

const Number = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.8rem;
  font-style: italic;
  color: #B8976A;
`;

const ItemContent = styled.div``;

const ItemTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 15px;
`;

const ItemText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #666;
`;

const ItemDate = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #B8976A;
  margin-top: 15px;
`;

function LoveStory() {
  const [isVisible, setIsVisible] = useState(false);
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

  const milestones = [
    {
      number: '01',
      title: 'Das erste Treffen',
      text: 'Ein zufälliger Blick in der Kaffeeschlange, ein Lächeln, das alles veränderte. Wir haben sofort gemerkt, dass da etwas Besonderes ist.',
      date: 'März 2019'
    },
    {
      number: '02',
      title: 'Das erste Date',
      text: 'Ein spontaner Spaziergang durch die Stadt, der bis tief in die Nacht dauerte. Die Stunden vergingen wie Minuten.',
      date: 'April 2019'
    },
    {
      number: '03',
      title: 'Der Antrag',
      text: 'Bei Sonnenuntergang, an unserem Lieblingsort. Mit zitternden Knien und einem Ring, der perfekt passte – genau wie wir.',
      date: 'Dezember 2024'
    }
  ];

  return (
    <Section ref={sectionRef} id="story">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Unsere Geschichte</Eyebrow>
          <Title>Wir sind <span>Sarah & Max</span></Title>
        </Header>

        <Content>
          <ImageWrapper $visible={isVisible}>
            <Image 
              src="https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg" 
              alt="Sarah & Max"
            />
          </ImageWrapper>

          <Timeline>
            {milestones.map((milestone, index) => (
              <TimelineItem key={index} $visible={isVisible} $index={index}>
                <Number>{milestone.number}</Number>
                <ItemContent>
                  <ItemTitle>{milestone.title}</ItemTitle>
                  <ItemText>{milestone.text}</ItemText>
                  <ItemDate>{milestone.date}</ItemDate>
                </ItemContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Content>
      </Container>
    </Section>
  );
}

export default LoveStory;
