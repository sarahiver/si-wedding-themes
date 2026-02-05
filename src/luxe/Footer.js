import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const FooterSection = styled.footer`padding: 5rem var(--section-padding-x); background: var(--luxe-void); text-align: center;`;
const Names = styled.h2`font-family: var(--font-display); font-size: clamp(3rem, 8vw, 6rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 1rem;`;
const DateText = styled.p`font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-slate); margin-bottom: 2rem;`;
const Tagline = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--luxe-pearl); margin-bottom: 0.5rem;`;
const Hashtag = styled.p`font-family: var(--font-display); font-size: 1.25rem; font-style: italic; color: var(--luxe-gold); margin-bottom: 2rem;`;
const AdminBtn = styled.button`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-graphite); margin-top: 2rem; &:hover { color: var(--luxe-gold); }`;
const Copyright = styled.p`font-family: var(--font-body); font-size: 0.65rem; color: var(--luxe-graphite); margin-top: 2rem;`;
const PoweredBy = styled.a`display: block; font-family: var(--font-body); font-size: 0.6rem; color: var(--luxe-graphite); margin-top: 1rem; text-decoration: none; &:hover { color: var(--luxe-gold); }`;

const Overlay = styled.div`position: fixed; inset: 0; background: rgba(10,10,10,0.95); z-index: 2000; display: ${p => p.$open ? 'flex' : 'none'}; align-items: center; justify-content: center;`;
const Modal = styled.div`background: var(--luxe-charcoal); padding: 3rem; max-width: 400px; width: 90%;`;
const ModalTitle = styled.h3`font-family: var(--font-display); font-size: 1.5rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 2rem; text-align: center;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; background: var(--luxe-anthracite); border: 1px solid var(--luxe-graphite); color: var(--luxe-cream); margin-bottom: 1rem; &:focus { outline: none; border-color: var(--luxe-gold); }`;
const LoginBtn = styled.button`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; background: var(--luxe-gold); color: var(--luxe-void); &:hover { background: var(--luxe-champagne); }`;
const CloseBtn = styled.button`position: absolute; top: 2rem; right: 2rem; font-size: 1.5rem; color: var(--luxe-cream);`;

function Footer({ onAdminLogin }) {
  const { project, content } = useWedding();
  const footerData = content?.footer || {};
  const name1 = project?.partner1_name || 'Alexandra';
  const name2 = project?.partner2_name || 'Benjamin';
  const date = project?.wedding_date;
  const hashtag = footerData.hashtag;
  const tagline = footerData.tagline;
  
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const handleLogin = (e) => {
    e.preventDefault();
    if (onAdminLogin) onAdminLogin(username, password);
    setShowLogin(false);
  };

  return (
    <FooterSection>
      <Names>{name1} & {name2}</Names>
      {formattedDate && <DateText>{formattedDate}</DateText>}
      {tagline && <Tagline>{tagline}</Tagline>}
      {hashtag && <Hashtag>#{hashtag}</Hashtag>}
      <AdminBtn onClick={() => setShowLogin(true)}>Admin</AdminBtn>
      <Copyright>© {new Date().getFullYear()} {name1} & {name2}</Copyright>
      <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener noreferrer">Powered by S&I.</PoweredBy>
      
      <Overlay $open={showLogin} onClick={() => setShowLogin(false)}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalTitle>Admin Login</ModalTitle>
          <form onSubmit={handleLogin}>
            <Input type="text" placeholder="Benutzername" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
            <Input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            <LoginBtn type="submit">Anmelden</LoginBtn>
          </form>
        </Modal>
        <CloseBtn onClick={() => setShowLogin(false)}>×</CloseBtn>
      </Overlay>
    </FooterSection>
  );
}

export default Footer;
