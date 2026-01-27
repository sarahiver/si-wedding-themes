import React, { useState } from 'react';
import styled from 'styled-components';

const FooterSection = styled.footer`
  padding: 4rem 2rem 2rem;
  background: var(--luxe-cream);
  border-top: 1px solid var(--luxe-border);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--luxe-border);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const ColumnText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-light);
  line-height: 1.8;
`;

const FooterLink = styled.a`
  display: block;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-light);
  margin-bottom: 0.5rem;
  
  &:hover { color: var(--luxe-gold); }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Copyright = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--luxe-text-muted);
`;

const AdminButton = styled.button`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--luxe-text-muted);
  
  &:hover { color: var(--luxe-gold); }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${p => p.$isOpen ? 1 : 0};
  visibility: ${p => p.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: var(--luxe-white);
  padding: 3rem;
  max-width: 350px;
  width: 100%;
  border: 1px solid var(--luxe-border);
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: var(--luxe-text-light);
`;

const ModalTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoginInput = styled.input`
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  background: var(--luxe-cream);
  border: 1px solid var(--luxe-border);
  
  &:focus { border-color: var(--luxe-gold); outline: none; }
`;

const LoginButton = styled.button`
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-text);
  background: transparent;
  border: 1px solid var(--luxe-border);
  cursor: pointer;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const ErrorMessage = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: #B8786D;
  text-align: center;
`;

function Footer({ name1 = 'Dave', name2 = 'Kalle', weddingDate = '14. September 2025', onAdminLogin }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'luxe2025') {
      setModalOpen(false);
      if (onAdminLogin) onAdminLogin();
    } else {
      setError('Ungültige Anmeldedaten');
    }
  };
  
  return (
    <FooterSection>
      <Container>
        <FooterTop>
          <FooterColumn>
            <ColumnTitle>{name1} & {name2}</ColumnTitle>
            <ColumnText>
              {weddingDate}<br />
              Wir freuen uns auf euch.
            </ColumnText>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Navigation</ColumnTitle>
            <FooterLink href="#home">Home</FooterLink>
            <FooterLink href="#story">Unsere Geschichte</FooterLink>
            <FooterLink href="#timeline">Ablauf</FooterLink>
            <FooterLink href="#rsvp">RSVP</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Kontakt</ColumnTitle>
            <ColumnText>
              Bei Fragen meldet euch<br />
              gerne bei unseren Trauzeugen.
            </ColumnText>
          </FooterColumn>
        </FooterTop>
        
        <FooterBottom>
          <Copyright>© {new Date().getFullYear()} {name1} & {name2}</Copyright>
          <AdminButton onClick={() => setModalOpen(true)}>Admin</AdminButton>
        </FooterBottom>
      </Container>
      
      <Modal $isOpen={modalOpen} onClick={() => setModalOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>Admin Login</ModalTitle>
          <LoginForm onSubmit={handleLogin}>
            <LoginInput
              type="text"
              placeholder="Benutzername"
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            />
            <LoginInput
              type="password"
              placeholder="Passwort"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <LoginButton type="submit">Anmelden</LoginButton>
          </LoginForm>
        </ModalContent>
      </Modal>
    </FooterSection>
  );
}

export default Footer;
