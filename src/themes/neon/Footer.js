import React from 'react';
import styled, { keyframes } from 'styled-components';

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 20px var(--neon-cyan); }
  50% { opacity: 0.8; box-shadow: 0 0 40px var(--neon-cyan); }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const FooterSection = styled.footer`
  background: var(--neon-bg);
  padding: 80px 5vw 40px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 60px;
  margin-bottom: 60px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const BrandSection = styled.div``;

const Logo = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
  
  span {
    color: var(--neon-pink);
    text-shadow: 
      0 0 10px rgba(255, 0, 255, 0.8),
      0 0 30px rgba(255, 0, 255, 0.4);
  }
`;

const Tagline = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 300px;
  
  &::before {
    content: '// ';
    color: var(--neon-cyan);
  }
`;

const LinkSection = styled.div``;

const SectionTitle = styled.h4`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--neon-cyan);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 25px;
  
  &::before {
    content: '> ';
    color: var(--neon-pink);
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 12px;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    color: var(--neon-cyan);
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    transform: translateX(5px);
    
    &::before {
      content: '→ ';
      color: var(--neon-cyan);
    }
  }
`;

const LoginSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
`;

const LoginHeader = styled.div`
  background: rgba(0, 255, 255, 0.1);
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const LoginTitle = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  margin-left: 10px;
`;

const LoginBody = styled.div`
  padding: 20px;
`;

const LoginLabel = styled.label`
  display: block;
  color: var(--neon-green);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  margin-bottom: 8px;
  
  &::before {
    content: '$ ';
    color: var(--neon-cyan);
  }
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: var(--neon-cyan);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: var(--neon-cyan);
    color: var(--neon-bg);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;

const LoginError = styled.p`
  color: #ff5f56;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  margin-top: 10px;
  
  &::before {
    content: '[ERROR] ';
    color: #ff5f56;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 255, 0.3),
    rgba(255, 0, 255, 0.3),
    transparent
  );
  margin-bottom: 30px;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  
  span {
    color: var(--neon-cyan);
  }
`;

const TechStack = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TechItem = styled.span`
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  
  &::before {
    content: '▸ ';
    color: var(--neon-green);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--neon-green);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-green);
  animation: ${glowPulse} 2s infinite;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--neon-cyan);
  margin-left: 3px;
  animation: ${blink} 1s infinite;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: var(--neon-cyan);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--neon-cyan);
    color: var(--neon-bg);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
`;

const Footer = ({ config = {} }) => {
  const {
    coupleName = "Alex & Jordan",
    weddingDate = "15.08.2025"
  } = config;
  
  const handleAdminClick = () => {
    window.location.href = '/admin';
  };
  
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Countdown', href: '#countdown' },
    { label: 'Love Story', href: '#lovestory' },
    { label: 'Locations', href: '#locations' },
    { label: 'RSVP', href: '#rsvp' }
  ];
  
  const infoLinks = [
    { label: 'Dresscode', href: '#dresscode' },
    { label: 'Anfahrt', href: '#directions' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontakt', href: '#contact' }
  ];
  
  return (
    <FooterSection>
      <GridOverlay />
      
      <Container>
        <TopSection>
          <BrandSection>
            <Logo>
              {coupleName.split(' & ')[0]} <span>&</span> {coupleName.split(' & ')[1]}
            </Logo>
            <Tagline>
              Loading happiness.exe... Wedding initialized for {weddingDate}
            </Tagline>
            <SocialLinks>
              <SocialLink href="#" aria-label="Instagram">♡</SocialLink>
              <SocialLink href="#" aria-label="Email">@</SocialLink>
              <SocialLink href="#" aria-label="Share">↗</SocialLink>
            </SocialLinks>
          </BrandSection>
          
          <LinkSection>
            <SectionTitle>Navigation</SectionTitle>
            <LinkList>
              {quickLinks.map((link, index) => (
                <LinkItem key={index}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </LinkItem>
              ))}
            </LinkList>
          </LinkSection>
          
          <LinkSection>
            <SectionTitle>Infos</SectionTitle>
            <LinkList>
              {infoLinks.map((link, index) => (
                <LinkItem key={index}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </LinkItem>
              ))}
            </LinkList>
          </LinkSection>
          
          <LoginSection>
            <LoginHeader>
              <Dot color="#ff5f56" />
              <Dot color="#ffbd2e" />
              <Dot color="#27ca40" />
              <LoginTitle>admin_access.sh</LoginTitle>
            </LoginHeader>
            <LoginBody>
              <LoginLabel>admin_panel:</LoginLabel>
              <LoginButton type="button" onClick={handleAdminClick}>
                Authenticate →
              </LoginButton>
            </LoginBody>
          </LoginSection>
        </TopSection>
        
        <Divider />
        
        <BottomSection>
          <Copyright>
            © {currentYear} <span>{coupleName}</span> // All rights reserved
            <Cursor />
          </Copyright>
          
          <TechStack>
            <TechItem>React</TechItem>
            <TechItem>Styled</TechItem>
            <TechItem>Supabase</TechItem>
          </TechStack>
          
          <StatusIndicator>
            <StatusDot />
            System Online
          </StatusIndicator>
        </BottomSection>
      </Container>
    </FooterSection>
  );
};

export default Footer;
