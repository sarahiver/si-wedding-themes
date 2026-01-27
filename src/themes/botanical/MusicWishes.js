import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   MUSIC WISHES - BOTANICAL THEME
   Gäste können ihre Musikwünsche für die Party einreichen
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Section = styled.section`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--cream) 0%, var(--sage-lightest) 50%, var(--cream) 100%);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.15;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
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
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
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
  max-width: 500px;
  margin: 0 auto;
`;

const MusicIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 3rem;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 20px 60px rgba(139, 157, 131, 0.15);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--forest);
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(139, 157, 131, 0.2);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--forest);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    background: white;
    box-shadow: 0 0 0 4px rgba(139, 157, 131, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const SongInputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1.2rem 2.5rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  margin-top: 1rem;
  
  &:hover {
    background: var(--sage-dark);
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(139, 157, 131, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  animation: ${fadeInUp} 0.6s ease;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: 'Lato', sans-serif;
  color: var(--text-light);
  line-height: 1.7;
`;

const WishList = styled.div`
  margin-top: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.4s;
`;

const WishListTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  text-align: center;
  margin-bottom: 2rem;
`;

const WishItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(139, 157, 131, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(5px);
  }
`;

const WishIcon = styled.span`
  font-size: 1.5rem;
`;

const WishDetails = styled.div`
  flex: 1;
`;

const WishSong = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: var(--forest);
`;

const WishArtist = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--text-light);
`;

const WishFrom = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: var(--sage);
  font-style: italic;
`;

const MusicWishes = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    song: '',
    artist: ''
  });
  const sectionRef = useRef(null);

  // Beispiel-Wünsche (später aus Datenbank)
  const [wishes] = useState([
    { song: 'Perfect', artist: 'Ed Sheeran', from: 'Maria & Thomas' },
    { song: 'Cant Help Falling in Love', artist: 'Elvis Presley', from: 'Oma Helga' },
    { song: 'Uptown Funk', artist: 'Bruno Mars', from: 'Die Trauzeugen' }
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier später API-Call
    console.log('Musikwunsch:', formData);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Section ref={sectionRef} id="music">
      <FloatingLeaf $top="10%" $left="5%" $size="3rem" $duration="7s">🎵</FloatingLeaf>
      <FloatingLeaf $top="20%" $right="10%" $size="2rem" $duration="5s" $delay="1s">🎶</FloatingLeaf>
      <FloatingLeaf $top="60%" $left="8%" $size="2.5rem" $duration="8s" $delay="2s">🎼</FloatingLeaf>
      <FloatingLeaf $top="70%" $right="5%" $size="2rem" $duration="6s" $delay="0.5s">🌿</FloatingLeaf>

      <Container>
        <Header $visible={isVisible}>
          <MusicIcon>🎵</MusicIcon>
          <Eyebrow>Eure Wünsche</Eyebrow>
          <Title>Musik<span>wünsche</span></Title>
          <Subtitle>
            Welcher Song bringt euch auf die Tanzfläche? 
            Teilt uns eure Lieblingssongs mit und macht unsere Party unvergesslich!
          </Subtitle>
        </Header>

        <FormCard $visible={isVisible}>
          {!submitted ? (
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>Euer Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Wie heißt ihr?"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <SongInputRow>
                <InputGroup>
                  <Label>Songtitel</Label>
                  <Input
                    type="text"
                    name="song"
                    placeholder="z.B. Perfect"
                    value={formData.song}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Künstler / Band</Label>
                  <Input
                    type="text"
                    name="artist"
                    placeholder="z.B. Ed Sheeran"
                    value={formData.artist}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </SongInputRow>

              <SubmitButton type="submit">
                🎵 Wunsch absenden
              </SubmitButton>
            </Form>
          ) : (
            <SuccessMessage>
              <SuccessIcon>🎉</SuccessIcon>
              <SuccessTitle>Vielen Dank!</SuccessTitle>
              <SuccessText>
                Euer Musikwunsch wurde aufgenommen.<br />
                Wir freuen uns darauf, mit euch zu feiern!
              </SuccessText>
            </SuccessMessage>
          )}
        </FormCard>

        {wishes.length > 0 && (
          <WishList $visible={isVisible}>
            <WishListTitle>🎶 Aktuelle Wunschliste</WishListTitle>
            {wishes.map((wish, index) => (
              <WishItem key={index}>
                <WishIcon>🎵</WishIcon>
                <WishDetails>
                  <WishSong>{wish.song}</WishSong>
                  <WishArtist>{wish.artist}</WishArtist>
                </WishDetails>
                <WishFrom>von {wish.from}</WishFrom>
              </WishItem>
            ))}
          </WishList>
        )}
      </Container>
    </Section>
  );
};

export default MusicWishes;
