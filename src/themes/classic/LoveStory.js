import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); }`;
const imageReveal = keyframes`from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); }`;
const lineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--classic-cream);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(4rem, 8vw, 6rem);
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
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  margin-bottom: 0.5rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}
`;

const ScriptAccent = styled.span`
  font-family: var(--font-script);
  font-size: 0.8em;
  color: var(--classic-gold);
`;

const Subtitle = styled.p`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--classic-text-light);
  max-width: 600px;
  margin: 1rem auto 0;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;`}
`;

const Line = styled.div`
  width: 60px;
  height: 1px;
  background: var(--classic-gold);
  margin: 1.5rem auto 0;
  transform: scaleX(0);
  ${p => p.$visible && css`animation: ${lineGrow} 0.6s ease forwards; animation-delay: 0.4s;`}
`;

const StoryBlock = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$reverse ? '1fr 1fr' : '1fr 1fr'};
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
  margin-bottom: clamp(4rem, 8vw, 6rem);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  opacity: 0;
  ${p => p.$visible && css`animation: ${imageReveal} 1s var(--ease-out-expo) forwards; animation-delay: ${p.$delay || '0.2s'};`}

  @media (max-width: 768px) {
    order: ${p => p.$reverse ? 0 : 0};
  }
`;

const StoryImage = styled.img`
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  transition: transform 0.6s var(--ease-smooth);

  &:hover { transform: scale(1.03); }
`;

const TextBlock = styled.div`
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: ${p.$delay || '0.3s'};`}

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const StoryYear = styled.p`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 300;
  color: var(--classic-beige);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StoryTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  margin-bottom: 1rem;
`;

const StoryText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.8;
  color: var(--classic-text-light);
`;

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const DEFAULT_STORIES = [
  { year: '2019', title: 'Wo alles begann', text: 'Es war ein ganz normaler Tag, als wir uns zum ersten Mal begegnet sind. Was als zufälliges Treffen begann, entwickelte sich schnell zu etwas ganz Besonderem.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80' },
  { year: '2021', title: 'Unser erstes Abenteuer', text: 'Zusammen haben wir die Welt entdeckt. Jede Reise, jeder gemeinsame Moment hat uns näher zusammengebracht und gezeigt, dass wir füreinander bestimmt sind.', image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800&q=80' },
  { year: '2025', title: 'Die große Frage', text: 'An einem magischen Abend stellte sich die Frage aller Fragen – und die Antwort war ein überglückliches Ja! Seitdem planen wir den schönsten Tag unseres Lebens.', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80' },
];

function LoveStory() {
  const { content } = useWedding();
  const lovestory = content?.lovestory || {};
  const [headerRef, headerVisible] = useInView();

  const title = lovestory.title || 'Unsere Geschichte';
  const subtitle = lovestory.subtitle || 'Wie alles begann';
  const stories = lovestory.stories?.length ? lovestory.stories : DEFAULT_STORIES;

  return (
    <Section id="lovestory">
      <Container>
        <Header ref={headerRef}>
          <Eyebrow $visible={headerVisible}>Über uns</Eyebrow>
          <Title $visible={headerVisible}>
            {title.split(' ').map((w, i) => i === 1 ? <ScriptAccent key={i}> {w} </ScriptAccent> : w)}
          </Title>
          <Subtitle $visible={headerVisible}>{subtitle}</Subtitle>
          <Line $visible={headerVisible} />
        </Header>

        {stories.map((story, i) => {
          const [ref, vis] = useInView(0.15);
          const reverse = i % 2 === 1;
          return (
            <StoryBlock key={i} ref={ref} $reverse={reverse}>
              {reverse ? (
                <>
                  <TextBlock $visible={vis} $delay="0.2s">
                    <StoryYear>{story.year}</StoryYear>
                    <StoryTitle>{story.title}</StoryTitle>
                    <StoryText>{story.text}</StoryText>
                  </TextBlock>
                  <ImageWrapper $visible={vis} $delay="0.4s">
                    <StoryImage src={story.image} alt={story.title} loading="lazy" />
                  </ImageWrapper>
                </>
              ) : (
                <>
                  <ImageWrapper $visible={vis} $delay="0.2s">
                    <StoryImage src={story.image} alt={story.title} loading="lazy" />
                  </ImageWrapper>
                  <TextBlock $visible={vis} $delay="0.4s">
                    <StoryYear>{story.year}</StoryYear>
                    <StoryTitle>{story.title}</StoryTitle>
                    <StoryText>{story.text}</StoryText>
                  </TextBlock>
                </>
              )}
            </StoryBlock>
          );
        })}
      </Container>
    </Section>
  );
}

export default LoveStory;
