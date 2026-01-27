// src/components/Accommodations.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
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
    color: rgba(184, 151, 106, 0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #FFFFFF;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const HotelCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease ${p => 0.1 + p.$index * 0.1}s;

  &:hover {
    border-color: rgba(184, 151, 106, 0.3);
  }
`;

const ImageWrapper = styled.div`
  aspect-ratio: 16/10;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%);
  transition: all 0.5s ease;

  ${HotelCard}:hover & {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: 30px;
`;

const HotelName = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  color: #FFFFFF;
  margin-bottom: 10px;
`;

const HotelDistance = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 15px;
`;

const HotelDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  margin-bottom: 20px;
`;

const PriceTag = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;

  strong {
    color: #FFFFFF;
    font-size: 1.1rem;
  }
`;

const BookButton = styled.a`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  padding: 12px 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #B8976A;
    border-color: #B8976A;
    color: #1A1A1A;
  }
`;

const Note = styled.p`
  text-align: center;
  margin-top: 50px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  strong {
    color: #B8976A;
  }
`;

function Accommodations() {
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

  const hotels = [
    {
      name: 'Hotel & Spa Elysium',
      distance: '2 km zur Location',
      description: 'Luxuriöses 4-Sterne-Hotel mit Wellness-Bereich und herrlichem Blick auf den See.',
      price: 'ab 139€',
      priceNote: 'pro Nacht / DZ',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
      url: '#'
    },
    {
      name: 'Landhaus am Park',
      distance: '3.5 km zur Location',
      description: 'Charmantes Boutique-Hotel mit gemütlichen Zimmern und hervorragendem Frühstück.',
      price: 'ab 89€',
      priceNote: 'pro Nacht / DZ',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
      url: '#'
    },
    {
      name: 'Pension Sonnenhof',
      distance: '4 km zur Location',
      description: 'Familiär geführte Pension mit persönlichem Service. Ideal für preisbewusste Gäste.',
      price: 'ab 59€',
      priceNote: 'pro Nacht / DZ',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
      url: '#'
    }
  ];

  return (
    <Section ref={sectionRef} id="accommodations">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Übernachtung</Eyebrow>
          <Title>Wo ihr <span>schlafen</span> könnt</Title>
          <Subtitle>Unsere Hotel-Empfehlungen in der Nähe der Location</Subtitle>
        </Header>

        <Grid>
          {hotels.map((hotel, index) => (
            <HotelCard key={index} $visible={isVisible} $index={index}>
              <ImageWrapper>
                <Image src={hotel.image} alt={hotel.name} />
              </ImageWrapper>
              <Content>
                <HotelDistance>{hotel.distance}</HotelDistance>
                <HotelName>{hotel.name}</HotelName>
                <HotelDescription>{hotel.description}</HotelDescription>
                <PriceTag>
                  <strong>{hotel.price}</strong> {hotel.priceNote}
                </PriceTag>
                <BookButton href={hotel.url} target="_blank" rel="noopener noreferrer">
                  Zur Website →
                </BookButton>
              </Content>
            </HotelCard>
          ))}
        </Grid>

        <Note $visible={isVisible}>
          Bucht bitte rechtzeitig – die Sommermonate sind schnell ausgebucht!<br/>
          Bei Fragen zur Unterkunft meldet euch gerne bei uns.
        </Note>
      </Container>
    </Section>
  );
}

export default Accommodations;
