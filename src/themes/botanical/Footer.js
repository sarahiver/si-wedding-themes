import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); }`;
const sway = keyframes`0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }`;

const FooterSection = styled.footer`
  padding: 4rem 2rem;
  background: linear-gradient(180deg, var(--botanical-mint) 0%, var(--botanical-sage) 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ForestRow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 3rem;
  opacity: 0.2;
  white-space: nowrap;
  overflow: hidden;
`;

const Tree = styled.span`
  display: inline-block;
  animation: ${sway} ${p => 3 + p.$i * 0.5}s ease-in-out infinite;
  animation-delay: ${p => p.$i * 0.3}s;
`;

const Names = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 600;
  color: var(--botanical-forest);
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const DateText = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--botanical-olive);
  margin-bottom: 1.5rem;
`;

const Hashtag = styled.p`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: var(--botanical-forest);
  margin-bottom: 2rem;
  
  span { animation: ${float} 2s ease-in-out infinite; display: inline-block; }
`;

const AdminBtn = styled.button`
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--botanical-olive);
  margin-top: 1rem;
  
  &:hover { color: var(--botanical-forest); }
`;

const Copyright = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--botanical-olive);
  margin-top: 2rem;
`;

// Modal
const Overlay = styled.div`position: fixed; inset: 0; background: rgba(45, 90, 74, 0.9); z-index: 2000; display: ${p => p.$open ? 'flex' : 'none'}; align-items: center; justify-content: center;`;
const Modal = styled.div`background: var(--botanical-cream); border-radius: 24px; padding: 2.5rem; max-width: 400px; width: 90%;`;
const ModalTitle = styled.h3`font-family: var(--font-handwritten); font-size: 2rem; color: var(--botanical-forest); margin-bottom: 1.5rem; text-align: center;`;
const Input = styled.input`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; background: white; border: 2px solid var(--botanical-mint); border-radius: 12px; margin-bottom: 1rem; &:focus { outline: none; border-color: var(--botanical-sage); }`;
const LoginBtn = styled.button`width: 100%; padding: 1rem; font-family: var(--font-handwritten); font-size: 1.1rem; color: white; background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive)); border-radius: 12px; &:hover { transform: translateY(-2px); }`;
const CloseBtn = styled.button`position: absolute; top: 1.5rem; right: 1.5rem; font-size: 1.5rem; color: white;`;

function Footer({ onAdminLogin }) {
  const { project } = useWedding();
  const name1 = project?.partner1_name || 'Emma';
  const name2 = project?.partner2_name || 'Noah';
  const date = project?.wedding_date;
  const hashtag = project?.hashtag;
  
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const trees = ['🌲', '🌳', '🌿', '🌴', '🌱', '🍃', '🌲', '🌳', '🌿', '🌴', '🌱', '🍃'];

  const handleLogin = (e) => {
    e.preventDefault();
    if (onAdminLogin) onAdminLogin(username, password);
    setShowLogin(false);
  };

  return (
    <FooterSection>
      <ForestRow>
        {trees.map((tree, i) => <Tree key={i} $i={i}>{tree}</Tree>)}
      </ForestRow>
      
      <Names>{name1} & {name2}</Names>
      {formattedDate && <DateText>{formattedDate}</DateText>}
      {hashtag && <Hashtag><span>🌿</span> #{hashtag} <span>🌿</span></Hashtag>}
      <AdminBtn onClick={() => setShowLogin(true)}>Admin Login</AdminBtn>
      <Copyright>Mit 💚 gestaltet</Copyright>
      
      <Overlay $open={showLogin} onClick={() => setShowLogin(false)}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalTitle>🌿 Admin Login</ModalTitle>
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
