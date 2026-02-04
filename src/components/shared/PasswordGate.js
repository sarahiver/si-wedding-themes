// src/components/shared/PasswordGate.js
// Passwortschutz-Screen mit theme-spezifischen Designs
import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { verifyProjectPassword } from '../../lib/supabase';

// ============================================
// ANIMATIONS
// ============================================
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

// ============================================
// THEME STYLES
// ============================================
const themeStyles = {
  botanical: css`
    background: linear-gradient(180deg, #040804 0%, #0a1f0a 100%);
    
    .content {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }
    
    .title {
      font-family: 'Cormorant Garamond', serif;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
      font-style: italic;
    }
    
    .subtitle {
      font-family: 'Montserrat', sans-serif;
      color: rgba(255, 255, 255, 0.5);
    }
    
    input {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      border-radius: 50px;
      
      &:focus {
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.12);
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }
    
    button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 50px;
      font-family: 'Montserrat', sans-serif;
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }
    
    .error {
      color: #ff6b6b;
    }
    
    .decoration {
      color: rgba(255, 255, 255, 0.1);
      font-size: 4rem;
    }
  `,
  
  editorial: css`
    background: #FAFAFA;
    
    .content {
      background: #fff;
      border: 3px solid #0A0A0A;
    }
    
    .title {
      font-family: 'Oswald', sans-serif;
      color: #0A0A0A;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .subtitle {
      font-family: 'Source Serif 4', serif;
      color: #666;
      font-style: italic;
    }
    
    input {
      background: #FAFAFA;
      border: 2px solid #0A0A0A;
      color: #0A0A0A;
      font-family: 'Inter', sans-serif;
      
      &:focus {
        background: #fff;
      }
      
      &::placeholder {
        color: #999;
      }
    }
    
    button {
      background: #C41E3A;
      border: none;
      color: #fff;
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      
      &:hover {
        background: #0A0A0A;
      }
    }
    
    .error {
      color: #C41E3A;
      font-family: 'Inter', sans-serif;
    }
    
    .decoration {
      color: #C41E3A;
      font-family: 'Oswald', sans-serif;
      font-size: 6rem;
      font-weight: 700;
      opacity: 0.1;
    }
  `,
  
  contemporary: css`
    background: #FAFAFA;
    
    .content {
      background: #fff;
      border: 4px solid #0D0D0D;
      box-shadow: 8px 8px 0 #FF6B6B;
    }
    
    .title {
      font-family: 'Space Grotesk', sans-serif;
      color: #0D0D0D;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .subtitle {
      font-family: 'Space Grotesk', sans-serif;
      color: #666;
    }
    
    input {
      background: #fff;
      border: 3px solid #0D0D0D;
      color: #0D0D0D;
      font-family: 'Space Grotesk', sans-serif;
      
      &:focus {
        box-shadow: 4px 4px 0 #4ECDC4;
      }
      
      &::placeholder {
        color: #999;
      }
    }
    
    button {
      background: #0D0D0D;
      border: 3px solid #0D0D0D;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      text-transform: uppercase;
      font-weight: 700;
      
      &:hover {
        background: #FF6B6B;
        border-color: #FF6B6B;
      }
    }
    
    .error {
      color: #FF6B6B;
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .decoration {
      font-size: 5rem;
    }
  `,
  
  luxe: css`
    background: linear-gradient(180deg, #0A0A0A 0%, #1a1a1a 100%);
    
    .content {
      background: rgba(10, 10, 10, 0.8);
      border: 1px solid rgba(201, 169, 98, 0.3);
    }
    
    .title {
      font-family: 'Cormorant', serif;
      color: #C9A962;
      font-weight: 300;
      font-style: italic;
    }
    
    .subtitle {
      font-family: 'Outfit', sans-serif;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 0.3em;
      text-transform: uppercase;
      font-size: 0.7rem;
    }
    
    input {
      background: transparent;
      border: 1px solid rgba(201, 169, 98, 0.3);
      color: #F8F6F3;
      font-family: 'Outfit', sans-serif;
      letter-spacing: 0.1em;
      
      &:focus {
        border-color: #C9A962;
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }
    
    button {
      background: transparent;
      border: 1px solid #C9A962;
      color: #C9A962;
      font-family: 'Outfit', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-size: 0.75rem;
      
      &:hover {
        background: #C9A962;
        color: #0A0A0A;
      }
    }
    
    .error {
      color: #C41E3A;
      font-family: 'Outfit', sans-serif;
    }
    
    .decoration {
      color: rgba(201, 169, 98, 0.1);
      font-family: 'Cormorant', serif;
      font-size: 8rem;
      font-style: italic;
    }
  `,
  
  neon: css`
    background: #0a0a0f;
    
    .content {
      background: rgba(10, 10, 15, 0.9);
      border: 2px solid rgba(0, 255, 255, 0.3);
      animation: ${glow} 3s ease-in-out infinite;
    }
    
    .title {
      font-family: 'Space Grotesk', sans-serif;
      color: #fff;
      font-weight: 700;
      text-transform: uppercase;
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    }
    
    .subtitle {
      font-family: 'Space Grotesk', sans-serif;
      color: rgba(255, 255, 255, 0.5);
    }
    
    input {
      background: rgba(0, 255, 255, 0.05);
      border: 2px solid rgba(0, 255, 255, 0.3);
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      
      &:focus {
        border-color: #00ffff;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }
    
    button {
      background: transparent;
      border: 2px solid #ff00ff;
      color: #ff00ff;
      font-family: 'Space Grotesk', sans-serif;
      text-transform: uppercase;
      font-weight: 700;
      
      &:hover {
        background: #ff00ff;
        color: #0a0a0f;
        box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
      }
    }
    
    .error {
      color: #ff00ff;
    }
    
    .decoration {
      color: rgba(0, 255, 255, 0.1);
      font-size: 5rem;
      animation: ${pulse} 2s ease-in-out infinite;
    }
  `,
  
  video: css`
    background: #0D0D0D;
    
    .content {
      background: rgba(13, 13, 13, 0.95);
      border: 1px solid rgba(107, 140, 174, 0.3);
    }
    
    .title {
      font-family: 'Manrope', sans-serif;
      color: #fff;
      font-weight: 800;
    }
    
    .subtitle {
      font-family: 'Inter', sans-serif;
      color: #888;
    }
    
    input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(107, 140, 174, 0.3);
      color: #fff;
      font-family: 'Inter', sans-serif;
      
      &:focus {
        border-color: #6B8CAE;
      }
      
      &::placeholder {
        color: #666;
      }
    }
    
    button {
      background: #6B8CAE;
      border: none;
      color: #fff;
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      
      &:hover {
        background: #8BA5C4;
      }
    }
    
    .error {
      color: #ff6b6b;
    }
    
    .decoration {
      color: rgba(107, 140, 174, 0.1);
      font-size: 4rem;
    }
  `,
};

// ============================================
// STYLED COMPONENTS
// ============================================
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  ${props => themeStyles[props.$theme] || themeStyles.botanical}
`;

const Content = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 3rem 2.5rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
  }
`;

const Decoration = styled.div`
  margin-bottom: 1rem;
  line-height: 1;
  user-select: none;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  ${props => props.$error && css`
    animation: ${shake} 0.5s ease;
  `}
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const LockIcon = styled.span`
  display: block;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

// ============================================
// COMPONENT
// ============================================
export default function PasswordGate({ slug, theme = 'botanical', coupleNames, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Bitte Passwort eingeben');
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await verifyProjectPassword(slug, password);
      
      if (result.success) {
        // Speichere Zugang in sessionStorage (gilt für diese Browser-Session)
        sessionStorage.setItem(`pw_access_${slug}`, 'granted');
        onSuccess();
      } else {
        setError('Falsches Passwort');
        setHasError(true);
        setTimeout(() => setHasError(false), 500);
        setPassword('');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme-spezifische Dekoration
  const getDecoration = () => {
    switch (theme) {
      case 'botanical': return '🌿';
      case 'editorial': return '✦';
      case 'contemporary': return '◆';
      case 'luxe': return '♦';
      case 'neon': return '⚡';
      case 'video': return '▶';
      default: return '🔒';
    }
  };

  return (
    <Container $theme={theme}>
      <Content className="content">
        <LockIcon>🔐</LockIcon>
        
        <Decoration className="decoration">
          {getDecoration()}
        </Decoration>
        
        <Title className="title">
          {coupleNames || 'Private Hochzeit'}
        </Title>
        
        <Subtitle className="subtitle">
          Diese Hochzeitsseite ist passwortgeschützt.
          <br />
          Bitte gib das Passwort ein, das ihr von uns erhalten habt.
        </Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Passwort eingeben..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            $error={hasError}
            disabled={isLoading}
            autoFocus
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Prüfe...' : 'Eintreten'}
          </Button>
          
          {error && (
            <ErrorMessage className="error">
              {error}
            </ErrorMessage>
          )}
        </Form>
      </Content>
    </Container>
  );
}
