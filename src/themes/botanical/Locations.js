// Botanical Locations - Garden Venue Cards
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); }`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, var(--botanical-mint) 0%, var(--botanical-paper) 100%);
`;

const Container = styled.div`max-width: 1100px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;`;

const Card = styled.div`
  background: var(--botanical-cream);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(107, 127, 94, 0.15);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.15}s;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(107, 127, 94, 0.2);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16/10;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive))'};
`;

const TypeBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--botanical-forest);
  background: var(--botanical-cream);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardContent = styled.div`padding: 1.5rem;`;

const CardTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--botanical-forest);
  margin-bottom: 0.5rem;
`;

const CardAddress = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--botanical-brown);
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-line;
`;

const CardTime = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--botanical-sage);
  background: var(--botanical-mint);
  padding: 0.5rem 1rem;
  border-radius: 20px;
`;

const MapLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--botanical-olive);
  
  &:hover { color: var(--botanical-forest); }
`;

function Locations() {
  const { content } = useWedding();
  const data = content?.locations || {};
  const title = data.title || 'Die Locations';
  const locations = data.locations || [
    { name: 'Botanischer Garten', type: 'Zeremonie', address: 'Koenigin-Luise-Str. 6-8\n14195 Berlin', time: '15:00 Uhr', icon: '🌳', image: '' },
    { name: 'Glashaus Pavillon', type: 'Empfang & Dinner', address: 'Unter den Eichen 87\n12203 Berlin', time: '17:00 Uhr', icon: '🏡', image: '' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="locations">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📍 Wo wir feiern</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        <Grid>
          {locations.map((loc, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <ImageWrapper $image={loc.image}>
                <TypeBadge>{loc.icon} {loc.type}</TypeBadge>
              </ImageWrapper>
              <CardContent>
                <CardTitle>{loc.name}</CardTitle>
                <CardAddress>{loc.address}</CardAddress>
                <CardTime>🕐 {loc.time}</CardTime>
                {loc.maps_url && <MapLink href={loc.maps_url} target="_blank">Route anzeigen →</MapLink>}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Locations;
