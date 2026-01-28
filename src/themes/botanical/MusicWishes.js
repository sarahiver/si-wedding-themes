import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.7;
`;

const Form = styled.form`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--sage-light);
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const Input = styled.input`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  
  &:focus { outline: none; border-color: var(--sage); }
`;

const Button = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 1rem 2rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  
  &:hover { background: var(--sage-dark); }
`;

const Success = styled.div`
  padding: 2rem;
  text-align: center;
  .icon { font-size: 3rem; margin-bottom: 1rem; }
`;

function MusicWishes({ content = {} }) {
  const { projectId } = useWedding();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', artist: '', songTitle: '' });

  const title = content.title || 'Musikwünsche';
  const description = content.description || 'Welche Songs sollen auf keinen Fall fehlen?';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitMusicWish(projectId, formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Music wish error:', err);
    }
  };

  return (
    <Section id="music">
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        <Form onSubmit={handleSubmit}>
          {submitted ? (
            <Success>
              <div className="icon">🎵</div>
              <p>Danke für deinen Musikwunsch!</p>
            </Success>
          ) : (
            <>
              <Input 
                placeholder="Dein Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                style={{ marginBottom: '1rem' }}
              />
              <InputRow>
                <Input 
                  placeholder="Künstler"
                  value={formData.artist}
                  onChange={e => setFormData({...formData, artist: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Songtitel"
                  value={formData.songTitle}
                  onChange={e => setFormData({...formData, songTitle: e.target.value})}
                  required
                />
              </InputRow>
              <Button type="submit">Absenden</Button>
            </>
          )}
        </Form>
      </Container>
    </Section>
  );
}

export default MusicWishes;
