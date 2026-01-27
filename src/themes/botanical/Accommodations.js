import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   ACCOMMODATIONS - BOTANICAL THEME
   Übernachtungsmöglichkeiten für Hochzeitsgäste
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const Section = styled.section`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--cream) 0%, var(--sage-lightest) 50%, var(--cream) 100%);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.12;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const HotelIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sage);
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
`;

const AccommodationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const AccommodationCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 20px 60px rgba(139, 157, 131, 0.12);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay || '0.2s'};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 80px rgba(139, 157, 131, 0.18);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background: linear-gradient(135deg, var(--sage-lightest) 0%, var(--cream) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, rgba(255,255,255,0.85), transparent);
  }
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--sage);
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 50px;
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const HotelName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const HotelDistance = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: var(--sage);
  margin-bottom: 1rem;
`;

const HotelDescription = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const HotelMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const MetaTag = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: var(--sage-dark);
  background: var(--sage-lightest);
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
`;

const PriceRange = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--forest);
  font-weight: 500;
  margin-bottom: 1rem;
  
  span {
    color: var(--text-muted);
    font-weight: 400;
    font-size: 0.8rem;
  }
`;

const CardButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: white;
  background: var(--sage);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage-dark);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(139, 157, 131, 0.3);
  }
`;

const TipSection = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const TipCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, var(--sage-lightest) 100%);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 157, 131, 0.2);
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TipIcon = styled.div`
  font-size: 3rem;
  flex-shrink: 0;
`;

const TipContent = styled.div`
  flex: 1;
`;

const TipTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const TipText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.8;
`;

const CodeBox = styled.div`
  display: inline-block;
  background: white;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  color: var(--sage-dark);
  margin-top: 0.5rem;
  border: 2px dashed var(--sage);
`;

const Accommodations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const accommodations = [
    {
      name: 'Hotel Waldhaus',
      icon: '🏨',
      distance: '0,5 km',
      description: 'Direkt neben der Location! Gemütliches Landhotel mit rustikalem Charme und hervorragendem Frühstück.',
      tags: ['Frühstück inkl.', 'Parkplatz', 'WLAN'],
      price: '89-129€',
      priceNote: 'pro Nacht / DZ',
      link: '#',
      recommended: true
    },
    {
      name: 'Boutique Hotel Rosengarten',
      icon: '🌹',
      distance: '2 km',
      description: 'Elegantes Boutique-Hotel mit wunderschönem Garten. Perfekt für alle, die es etwas luxuriöser mögen.',
      tags: ['Spa', 'Restaurant', 'Garten'],
      price: '139-189€',
      priceNote: 'pro Nacht / DZ',
      link: '#',
      recommended: false
    },
    {
      name: 'Pension Sonnenschein',
      icon: '🏡',
      distance: '1,5 km',
      description: 'Familiär geführte Pension mit großen Zimmern und herzlicher Gastfreundschaft. Preis-Leistung top!',
      tags: ['Familiär', 'Garten', 'Parkplatz'],
      price: '65-85€',
      priceNote: 'pro Nacht / DZ',
      link: '#',
      recommended: false
    }
  ];

  return (
    <Section ref={sectionRef} id="accommodations">
      <FloatingElement $top="8%" $left="5%" $size="2.5rem" $duration="7s">🏨</FloatingElement>
      <FloatingElement $top="25%" $right="8%" $size="2rem" $duration="5s" $delay="1s">🌿</FloatingElement>
      <FloatingElement $top="60%" $left="3%" $size="2rem" $duration="8s" $delay="2s">🛏️</FloatingElement>
      <FloatingElement $bottom="15%" $right="5%" $size="2.5rem" $duration="6s" $delay="0.5s">✨</FloatingElement>

      <Container>
        <Header $visible={isVisible}>
          <HotelIcon>🛏️</HotelIcon>
          <Eyebrow>Wo übernachten?</Eyebrow>
          <Title>Unter<span>künfte</span></Title>
          <Subtitle>
            Für alle, die länger feiern und entspannt übernachten möchten – 
            hier sind unsere Empfehlungen für Unterkünfte in der Nähe.
          </Subtitle>
        </Header>

        <AccommodationGrid>
          {accommodations.map((hotel, index) => (
            <AccommodationCard key={index} $visible={isVisible} $delay={`${0.2 + index * 0.1}s`}>
              <CardImage>
                {hotel.icon}
                {hotel.recommended && <RecommendedBadge>Empfohlen</RecommendedBadge>}
              </CardImage>
              <CardContent>
                <HotelName>{hotel.name}</HotelName>
                <HotelDistance>📍 {hotel.distance} zur Location</HotelDistance>
                <HotelDescription>{hotel.description}</HotelDescription>
                <HotelMeta>
                  {hotel.tags.map((tag, i) => (
                    <MetaTag key={i}>{tag}</MetaTag>
                  ))}
                </HotelMeta>
                <PriceRange>
                  {hotel.price} <span>{hotel.priceNote}</span>
                </PriceRange>
                <CardButton href={hotel.link} target="_blank" rel="noopener noreferrer">
                  🔗 Zur Website
                </CardButton>
              </CardContent>
            </AccommodationCard>
          ))}
        </AccommodationGrid>

        <TipSection $visible={isVisible}>
          <TipCard>
            <TipIcon>💡</TipIcon>
            <TipContent>
              <TipTitle>Tipp: Sonderkonditionen für unsere Gäste</TipTitle>
              <TipText>
                Wir haben für euch bei den empfohlenen Hotels Sonderkonditionen ausgehandelt! 
                Nennt bei der Buchung einfach das Stichwort für einen Rabatt von 10-15%. 
                Bitte bucht zeitnah, da die Zimmerkapazitäten begrenzt sind.
              </TipText>
              <CodeBox>🌿 Hochzeit Olivia & Benjamin</CodeBox>
            </TipContent>
          </TipCard>
        </TipSection>
      </Container>
    </Section>
  );
};

export default Accommodations;
