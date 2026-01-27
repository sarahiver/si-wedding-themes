// src/components/MusicWishes.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
  overflow: hidden;
`;

const FloatingNotes = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const Note = styled.span`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.1;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
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

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #888;
  margin-top: 15px;
`;

const Form = styled.form`
  background: #FFFFFF;
  padding: 50px;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.08);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease 0.2s;

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;

  &:last-of-type {
    margin-bottom: 30px;
  }
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 20px;
  background: #FAF8F5;
  border: 1px solid #E0E0E0;
  color: #1A1A1A;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #AAA;
  }

  &:focus {
    outline: none;
    border-color: #B8976A;
    background: #FFFFFF;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 18px 20px;
  background: #FAF8F5;
  border: 1px solid #E0E0E0;
  color: #1A1A1A;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: #AAA;
  }

  &:focus {
    outline: none;
    border-color: #B8976A;
    background: #FFFFFF;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 20px;
  background: #B8976A;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: all 0.4s ease;

  &:hover {
    background: #1A1A1A;
  }
`;

const WishesList = styled.div`
  margin-top: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.4s;
`;

const WishesTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  color: #1A1A1A;
  text-align: center;
  margin-bottom: 30px;
`;

const WishCard = styled.div`
  background: #FFFFFF;
  padding: 25px 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const WishIcon = styled.span`
  font-size: 1.5rem;
`;

const WishContent = styled.div`
  flex: 1;
`;

const WishSong = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.2rem;
  color: #1A1A1A;
`;

const WishFrom = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #888;
`;

function MusicWishes() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', song: '', artist: '', message: '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission
    console.log('Music wish:', formData);
    setFormData({ name: '', song: '', artist: '', message: '' });
  };

  // Example wishes
  const existingWishes = [
    { song: 'Perfect', artist: 'Ed Sheeran', from: 'Lisa & Tom' },
    { song: 'Marry You', artist: 'Bruno Mars', from: 'Familie Schmidt' },
    { song: 'Can\'t Help Falling in Love', artist: 'Elvis', from: 'Oma Gertrud' },
  ];

  const notes = [
    { char: '♪', x: '10%', y: '20%', size: '3rem', duration: '8s', delay: '0s' },
    { char: '♫', x: '85%', y: '15%', size: '2.5rem', duration: '7s', delay: '1s' },
    { char: '♪', x: '90%', y: '60%', size: '2rem', duration: '9s', delay: '2s' },
    { char: '♫', x: '5%', y: '70%', size: '3.5rem', duration: '6s', delay: '0.5s' },
  ];

  return (
    <Section ref={sectionRef} id="music">
      <FloatingNotes>
        {notes.map((note, i) => (
          <Note
            key={i}
            style={{ left: note.x, top: note.y }}
            $size={note.size}
            $duration={note.duration}
            $delay={note.delay}
          >
            {note.char}
          </Note>
        ))}
      </FloatingNotes>

      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Musikwünsche</Eyebrow>
          <Title>Eure <span>Lieblingssongs</span></Title>
          <Subtitle>Welche Musik bringt euch auf die Tanzfläche?</Subtitle>
        </Header>

        <Form $visible={isVisible} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Euer Name</Label>
            <Input
              type="text"
              placeholder="Max Mustermann"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Songtitel</Label>
            <Input
              type="text"
              placeholder="z.B. Perfect"
              value={formData.song}
              onChange={(e) => setFormData({ ...formData, song: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Interpret</Label>
            <Input
              type="text"
              placeholder="z.B. Ed Sheeran"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Warum dieser Song? (optional)</Label>
            <Textarea
              placeholder="Erzählt uns, warum euch dieser Song wichtig ist..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </FormGroup>

          <SubmitButton type="submit">
            Song vorschlagen 🎵
          </SubmitButton>
        </Form>

        <WishesList $visible={isVisible}>
          <WishesTitle>Bisherige Wünsche</WishesTitle>
          {existingWishes.map((wish, index) => (
            <WishCard key={index}>
              <WishIcon>🎵</WishIcon>
              <WishContent>
                <WishSong>{wish.song} – {wish.artist}</WishSong>
                <WishFrom>von {wish.from}</WishFrom>
              </WishContent>
            </WishCard>
          ))}
        </WishesList>
      </Container>
    </Section>
  );
}

export default MusicWishes;
