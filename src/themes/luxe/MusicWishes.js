import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 30px;
  background: var(--luxe-gold);
  margin: 0 auto 1.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  background: var(--luxe-cream);
  border: 1px solid var(--luxe-border);
  
  &:focus { border-color: var(--luxe-gold); }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text);
  background: transparent;
  border: 1px solid var(--luxe-border);
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const Success = styled.p`
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--luxe-gold);
  margin-top: 1rem;
`;

function MusicWishes() {
  const [formData, setFormData] = useState({ name: '', song: '', artist: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Demo: In production, save to backend
    console.log('Music wish:', formData);
    setSubmitted(true);
    setFormData({ name: '', song: '', artist: '' });
  };
  
  return (
    <Section id="music">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Playlist</Eyebrow>
          <Title>Musikwünsche</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Euer Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Song"
            value={formData.song}
            onChange={e => setFormData({ ...formData, song: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Künstler"
            value={formData.artist}
            onChange={e => setFormData({ ...formData, artist: e.target.value })}
          />
          <Button type="submit">Wünschen</Button>
        </Form>
        
        {submitted && <Success>Danke für deinen Musikwunsch!</Success>}
      </Container>
    </Section>
  );
}

export default MusicWishes;
