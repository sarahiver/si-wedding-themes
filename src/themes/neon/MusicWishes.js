// src/components/MusicWishes.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255,0,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(255,0,255,0.5); }
`;

const equalizerBounce = keyframes`
  0%, 100% { height: 10px; }
  50% { height: 30px; }
`;

const vinylSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 150px 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,0,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,0,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1000px;
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

const VinylIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  border: 3px solid #ff00ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${vinylSpin} 4s linear infinite;
  box-shadow: 0 0 30px rgba(255,0,255,0.3);
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    background: #ff00ff;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(255,0,255,0.3);
    border-radius: 50%;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  
  span {
    color: #ff00ff;
    text-shadow: 0 0 20px rgba(255,0,255,0.5);
  }
`;

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 20px;
`;

const Equalizer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 30px 0;
`;

const EqualizerBar = styled.div`
  width: 8px;
  background: linear-gradient(to top, #ff00ff, #00ffff);
  animation: ${equalizerBounce} ${p => 0.4 + p.$delay * 0.1}s ease-in-out infinite;
  animation-delay: ${p => p.$delay * 0.1}s;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,0,255,0.2);
  padding: 40px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #ff00ff;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,0,255,0.1);
`;

const TerminalDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27c93f; }
`;

const TerminalTitle = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  margin-left: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: #ff00ff;
  
  &::before {
    content: '$ ';
    opacity: 0.5;
  }
`;

const Input = styled.input`
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,0,255,0.2);
  padding: 15px 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: #fff;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff00ff;
    box-shadow: 0 0 20px rgba(255,0,255,0.2);
  }
  
  &::placeholder {
    color: rgba(255,255,255,0.2);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 30px;
  background: transparent;
  border: 2px solid #ff00ff;
  color: #ff00ff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: #ff00ff;
    color: #0a0a0f;
  }
`;

const WishlistSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 10px;
  
  &::before {
    content: '// ';
    color: #00ffff;
  }
`;

const SongItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(0,0,0,0.3);
  border-left: 3px solid ${p => p.$color || '#00ffff'};
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0,255,255,0.05);
    transform: translateX(5px);
  }
`;

const SongNumber = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: ${p => p.$color || '#00ffff'};
  min-width: 30px;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: #fff;
`;

const SongArtist = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
`;

const SongRequester = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  
  &::before {
    content: 'by ';
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 30px;
  animation: ${fadeInUp} 0.5s ease;
  
  svg {
    width: 50px;
    height: 50px;
    color: #00ff88;
    margin-bottom: 15px;
  }
  
  h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.3rem;
    color: #00ff88;
    margin-bottom: 10px;
  }
  
  p {
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
  }
`;

function MusicWishes({ projectId, title }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    song: '',
    artist: ''
  });

  // Fetch wishes from Supabase
  useEffect(() => {
    const fetchWishes = async () => {
      if (!projectId) return;
      try {
        const { getMusicWishes } = await import('../../lib/supabase');
        const data = await getMusicWishes(projectId);
        if (data) setWishes(data);
      } catch (err) {
        console.error('Failed to fetch music wishes:', err);
      }
    };
    fetchWishes();
  }, [projectId]);

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
    if (!formData.name || !formData.song) return;
    
    setLoading(true);
    try {
      if (projectId) {
        const { submitMusicWish } = await import('../../lib/supabase');
        const newWish = await submitMusicWish(projectId, {
          name: formData.name,
          song_title: formData.song,
          artist: formData.artist
        });
        if (newWish) {
          setWishes(prev => [newWish, ...prev]);
        }
      }
      setSubmitted(true);
      setFormData({ name: '', song: '', artist: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to submit music wish:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // Assign colors to wishes
  const colors = ['#ff00ff', '#00ffff', '#00ff88', '#b347ff'];
  const wishesWithColors = wishes.map((wish, i) => ({
    id: wish.id,
    title: wish.song_title,
    artist: wish.artist,
    requester: wish.name,
    color: colors[i % colors.length]
  }));

  return (
    <Section ref={sectionRef} id="music">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <VinylIcon />
          <Title>Musik<span>wünsche</span></Title>
          <Subtitle>Welche Songs bringen euch zum Tanzen?</Subtitle>
          
          <Equalizer>
            {[...Array(12)].map((_, i) => (
              <EqualizerBar key={i} $delay={i} />
            ))}
          </Equalizer>
        </Header>
        
        <ContentGrid>
          <FormSection>
            <TerminalHeader>
              <TerminalDot className="red" />
              <TerminalDot className="yellow" />
              <TerminalDot className="green" />
              <TerminalTitle>dj_request.exe</TerminalTitle>
            </TerminalHeader>
            
            {!submitted ? (
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>your_name</Label>
                  <Input 
                    type="text"
                    placeholder="Dein Name..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>song_title</Label>
                  <Input 
                    type="text"
                    placeholder="Songtitel..."
                    value={formData.song}
                    onChange={(e) => setFormData({...formData, song: e.target.value})}
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>artist_name</Label>
                  <Input 
                    type="text"
                    placeholder="Künstler/Band (optional)..."
                    value={formData.artist}
                    onChange={(e) => setFormData({...formData, artist: e.target.value})}
                  />
                </InputGroup>
                
                <SubmitButton type="submit">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  Song vorschlagen
                </SubmitButton>
              </Form>
            ) : (
              <SuccessMessage>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <h3>Song Added!</h3>
                <p>Danke für deinen Vorschlag! 🎵</p>
              </SuccessMessage>
            )}
          </FormSection>
          
          <WishlistSection>
            <SectionLabel>Aktuelle Playlist</SectionLabel>
            
            {wishesWithColors.map((wish, i) => (
              <SongItem key={wish.id} $color={wish.color} $delay={`${i * 0.1}s`}>
                <SongNumber $color={wish.color}>
                  {String(i + 1).padStart(2, '0')}
                </SongNumber>
                <SongInfo>
                  <SongTitle>{wish.title}</SongTitle>
                  <SongArtist>{wish.artist}</SongArtist>
                </SongInfo>
                <SongRequester>{wish.requester}</SongRequester>
              </SongItem>
            ))}
            {wishesWithColors.length === 0 && (
              <SongItem $color="#00ffff" $delay="0s">
                <SongInfo style={{ textAlign: 'center', width: '100%', opacity: 0.5 }}>
                  <SongTitle>Noch keine Wünsche</SongTitle>
                  <SongArtist>Sei der Erste!</SongArtist>
                </SongInfo>
              </SongItem>
            )}
          </WishlistSection>
        </ContentGrid>
      </Container>
    </Section>
  );
}

export default MusicWishes;
