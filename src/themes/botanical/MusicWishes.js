import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
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
  line-height: 1.7;
`;

const Form = styled.form`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--sage-light);
  margin-bottom: 3rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  transition: all 0.3s ease;
  
  &:focus { 
    outline: none; 
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const Button = styled.button`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) { 
    background: var(--sage-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(192, 57, 43, 0.1);
  border-radius: 6px;
`;

const WishesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WishCard = styled.div`
  background: var(--cream-light);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--sage-light);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WishIcon = styled.div`
  width: 50px;
  height: 50px;
  background: var(--sage-muted);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const WishContent = styled.div`
  flex: 1;
`;

const WishSong = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: var(--forest);
  margin-bottom: 0.25rem;
`;

const WishArtist = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
`;

const WishFrom = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  
  .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
  p { font-family: 'Lato', sans-serif; }
`;

const SectionTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  text-align: center;
`;

function MusicWishes() {
  const { content } = useWedding();
  const musicwishesData = content?.musicwishes || {};

  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  
  const {
    wishes,
    loading,
    submitting,
    error,
    success,
    formData,
    updateField,
    submitWish,
  } = useMusicWishes();

  const title = musicwishesData.title || 'Musikwünsche';
  const description = musicwishesData.description || 'Welche Songs dürfen auf unserer Hochzeit nicht fehlen? Teilt uns eure Lieblingssongs mit!';

  // Show modal on success
  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Danke für deinen Musikwunsch! 🎵',
      });
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitWish();
  };

  return (
    <Section id="music">
      <Container>
        <Header>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Dein Name</Label>
            <Input 
              type="text"
              placeholder="Wie heißt du?"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              required
            />
          </FormGroup>
          
          <InputRow>
            <FormGroup>
              <Label>Künstler / Band</Label>
              <Input 
                type="text"
                placeholder="z.B. ABBA"
                value={formData.artist}
                onChange={e => updateField('artist', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Songtitel</Label>
              <Input 
                type="text"
                placeholder="z.B. Dancing Queen"
                value={formData.songTitle}
                onChange={e => updateField('songTitle', e.target.value)}
                required
              />
            </FormGroup>
          </InputRow>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Wird gesendet...' : 'Musikwunsch absenden'}
          </Button>
        </Form>
        
        {wishes.length > 0 && (
          <>
            <SectionTitle>Eure Wünsche</SectionTitle>
            <WishesList>
              {wishes.map(wish => (
                <WishCard key={wish.id}>
                  <WishIcon>🎵</WishIcon>
                  <WishContent>
                    <WishSong>{wish.song_title}</WishSong>
                    <WishArtist>{wish.artist}</WishArtist>
                    <WishFrom>von {wish.name}</WishFrom>
                  </WishContent>
                </WishCard>
              ))}
            </WishesList>
          </>
        )}
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={2500}
      />
    </Section>
  );
}

export default MusicWishes;
