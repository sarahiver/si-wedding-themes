import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, var(--purple), var(--pink));
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
`;

const FloatingNote1 = styled.span`
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: ${bounce} 3s ease-in-out infinite;
  top: 10%;
  left: 10%;
`;

const FloatingNote2 = styled.span`
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: 0.5s;
  top: 20%;
  right: 15%;
`;

const FloatingNote3 = styled.span`
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: 1s;
  bottom: 30%;
  left: 5%;
`;

const Form = styled.form`
  background: var(--white);
  padding: 2.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-xl);
  margin-bottom: 2rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.6s ease 0.2s;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  background: var(--purple);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
`;

const WishCard = styled.div`
  background: rgba(255,255,255,0.15);
  padding: 1.5rem;
  border: 2px solid rgba(255,255,255,0.3);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.5s ease ${p => 0.4 + p.$index * 0.1}s;
`;

const WishSong = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const WishArtist = styled.div`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 0.5rem;
`;

const WishBy = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
`;

const Success = styled.div`
  background: var(--white);
  padding: 3rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-xl);
  text-align: center;
`;

const SuccessEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

function MusicWishes() {
  const { content, projectId } = useWedding();
  const musicwishesData = content?.musicwishes || {};
  const wishes = [];
  const onSubmit = (data) => console.log("Music submit", data);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', song: '', artist: '', message: '' });
  const sectionRef = useRef(null);

  const defaultWishes = [
    { song: "I Gotta Feeling", artist: "Black Eyed Peas", by: "Müller" },
    { song: "Uptown Funk", artist: "Bruno Mars", by: "Schmidt" },
  ];

  const displayWishes = wishes.length > 0 ? wishes : defaultWishes;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) await onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', song: '', artist: '', message: '' });
    }, 3000);
  };

  return (
    <Section ref={sectionRef} id="music" style={{ position: 'relative' }}>
      <FloatingNote1>🎵</FloatingNote1>
      <FloatingNote2>🎶</FloatingNote2>
      <FloatingNote3>🎵</FloatingNote3>
      
      <Container>
        <Header>
          <Title $visible={visible}>🎵 Musikwünsche</Title>
        </Header>
        
        {submitted ? (
          <Success>
            <SuccessEmoji>🎉</SuccessEmoji>
            <SuccessTitle>Song notiert!</SuccessTitle>
          </Success>
        ) : (
          <Form $visible={visible} onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Dein Name</Label>
              <Input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>Song</Label>
                <Input type="text" value={formData.song} onChange={e => setFormData({ ...formData, song: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Künstler</Label>
                <Input type="text" value={formData.artist} onChange={e => setFormData({ ...formData, artist: e.target.value })} required />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Nachricht (optional)</Label>
              <Textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
            </FormGroup>
            <SubmitButton type="submit">Song wünschen 🎶</SubmitButton>
          </Form>
        )}
        
        {displayWishes.slice(0, 3).map((wish, i) => (
          <WishCard key={i} $index={i} $visible={visible}>
            <WishSong>🎵 {wish.song}</WishSong>
            <WishArtist>{wish.artist}</WishArtist>
            <WishBy>gewünscht von {wish.by}</WishBy>
          </WishCard>
        ))}
      </Container>
    </Section>
  );
}

export default MusicWishes;
