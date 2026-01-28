// Luxe Footer
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const FooterSection = styled.footer`padding: 4rem 2rem; background: var(--luxe-black); text-align: center;`;
const Names = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 6vw, 4rem); font-weight: 300; font-style: italic; color: var(--luxe-white); margin-bottom: 1rem;`;
const DateText = styled.p`font-family: var(--font-sans); font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 2rem;`;
const Hashtag = styled.p`font-family: var(--font-serif); font-size: 1.25rem; font-style: italic; color: var(--luxe-gold); margin-bottom: 2rem;`;
const AdminBtn = styled.button`font-family: var(--font-sans); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-taupe); margin-top: 2rem; &:hover { color: var(--luxe-gold); }`;
const Copyright = styled.p`font-family: var(--font-sans); font-size: 0.7rem; color: var(--luxe-taupe); margin-top: 3rem;`;

// Simple Admin Login Modal
const Overlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: ${p => p.$open ? 'flex' : 'none'}; align-items: center; justify-content: center;`;
const Modal = styled.div`background: var(--luxe-cream); padding: 3rem; max-width: 400px; width: 90%;`;
const ModalTitle = styled.h3`font-family: var(--font-serif); font-size: 1.5rem; color: var(--luxe-black); margin-bottom: 2rem; text-align: center;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-sans); font-size: 1rem; border: 1px solid var(--luxe-sand); margin-bottom: 1rem; &:focus { outline: none; border-color: var(--luxe-olive); }`;
const LoginBtn = styled.button`width: 100%; padding: 1rem; font-family: var(--font-sans); font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; background: var(--luxe-black); color: var(--luxe-white); &:hover { background: var(--luxe-charcoal); }`;
const CloseBtn = styled.button`position: absolute; top: 1rem; right: 1rem; font-size: 1.5rem; color: var(--luxe-white);`;

function Footer({ onAdminLogin }) {
  const { project } = useWedding();
  const name1 = project?.partner1_name || 'Emma';
  const name2 = project?.partner2_name || 'James';
  const date = project?.wedding_date;
  const hashtag = project?.hashtag;
  
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
      {hashtag && <Hashtag>#{hashtag}</Hashtag>}
      <AdminBtn onClick={() => setShowLogin(true)}>Admin</AdminBtn>
      <Copyright>Mit Liebe gestaltet</Copyright>
      
      <Overlay $open={showLogin} onClick={() => setShowLogin(false)}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalTitle>Admin Login</ModalTitle>
          <form onSubmit={handleLogin}>
            <Input type="text" placeholder="Benutzername" value={username} onChange={e => setUsername(e.target.value)} />
            <Input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} />
            <LoginBtn type="submit">Anmelden</LoginBtn>
          </form>
        </Modal>
      </Overlay>
    </FooterSection>
  );
}

export default Footer;
