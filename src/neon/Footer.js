// Footer.js - Neon Theme
// Cyberpunk terminal aesthetic
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const FooterSection = styled.footer`
  position: relative;
  padding: 80px 20px 40px;
  background: #0a0a0f;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;

  &.cyan {
    background: #00ffff;
    top: -100px;
    left: 20%;
  }

  &.magenta {
    background: #ff00ff;
    bottom: -100px;
    right: 20%;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const TerminalBox = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.2);
  padding: 40px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const Names = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const Tagline = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
`;

const Hashtag = styled.div`
  display: inline-block;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  color: #ff00ff;
  padding: 8px 20px;
  border: 1px solid rgba(255,0,255,0.3);
  background: rgba(255,0,255,0.05);
  text-shadow: 0 0 10px rgba(255,0,255,0.5);

  &::before {
    content: '# ';
    color: rgba(255,255,255,0.3);
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent);
  margin: 30px 0;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);

  span {
    color: #00ff88;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const AdminLink = styled.button`
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 6px 12px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  &:hover {
    color: #00ffff;
    border-color: rgba(0,255,255,0.3);
    box-shadow: 0 0 10px rgba(0,255,255,0.2);
  }
`;

const PoweredBy = styled.a`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #ff00ff;
    text-shadow: 0 0 10px rgba(255,0,255,0.5);
  }

  span {
    color: #ff00ff;
  }
`;

const StatusBar = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: center;
  gap: 30px;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.2);

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 15px;
  }
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ff88;
    box-shadow: 0 0 8px #00ff88;
    animation: ${glowPulse} 2s ease-in-out infinite;
  }

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .value {
    color: #00ffff;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #00ffff;
  margin-left: 5px;
  animation: ${blink} 1s step-end infinite;
`;

function Footer() {
  const { content, coupleNames, slug } = useWedding();
  const footerData = content?.footer || {};
  const hashtag = footerData.hashtag?.replace('#', '');
  const tagline = footerData.tagline;

  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Partner', 'Partner'];
  const year = new Date().getFullYear();

  const handleAdminClick = () => {
    const adminPath = slug ? `/${slug}/admin` : '/admin';
    window.location.href = adminPath;
  };

  return (
    <FooterSection id="footer">
      <GridBG />
      <GlowOrb className="cyan" />
      <GlowOrb className="magenta" />

      <Container>
        <TerminalBox>
          <Names>
            {names[0]} <span>&</span> {names[1]}
          </Names>
          {tagline && <Tagline>{tagline}</Tagline>}
          {hashtag && <Hashtag>{hashtag}</Hashtag>}
        </TerminalBox>

        <Divider />

        <BottomRow>
          <Copyright>
            <span>©</span> {year} // {names[0]} & {names[1]}
            <Cursor />
          </Copyright>

          <Links>
            <AdminLink onClick={handleAdminClick}>
              [Admin]
            </AdminLink>
            <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener">
              powered by <span>S&I.</span>
            </PoweredBy>
          </Links>
        </BottomRow>

        <StatusBar>
          <StatusItem>
            <div className="dot" />
            <span className="label">Status:</span>
            <span className="value">ONLINE</span>
          </StatusItem>
          <StatusItem>
            <span className="label">Build:</span>
            <span className="value">v2.0.25</span>
          </StatusItem>
          <StatusItem>
            <span className="label">Theme:</span>
            <span className="value">NEON</span>
          </StatusItem>
        </StatusBar>
      </Container>
    </FooterSection>
  );
}

export default Footer;
