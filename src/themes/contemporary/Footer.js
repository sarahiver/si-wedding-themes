import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: var(--shadow-lg); }
  50% { transform: scale(1.03); box-shadow: 12px 12px 0 var(--black); }
`;

const Section = styled.footer`
  padding: 8rem 2rem 4rem;
  background: var(--black);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 400px;
    background: radial-gradient(ellipse, rgba(255,107,107,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const BigHeadline = styled.h2`
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 2rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--gray-400);
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.2s;
`;

const CTAButton = styled.a`
  display: inline-block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  background: var(--coral);
  padding: 1.5rem 4rem;
  border: 4px solid var(--black);
  box-shadow: var(--shadow-lg);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: ${pulse} 2s ease-in-out infinite;
  transition: all 0.2s ease;
  opacity: ${p => p.$visible ? 1 : 0};
  
  &:hover {
    background: var(--yellow);
    animation: none;
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 var(--black);
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 3px;
  background: var(--gray-800);
  margin: 5rem 0 3rem;
`;

const CoupleNames = styled.div`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  background: linear-gradient(90deg, var(--coral), var(--electric), var(--yellow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const FooterLink = styled.a`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--coral);
  }
`;

const AdminLink = styled.button`
  font-size: 0.75rem;
  color: var(--gray-600);
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 2rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--coral);
  }
`;

const Copyright = styled.p`
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-top: 2rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const Modal = styled.div`
  background: var(--white);
  padding: 2.5rem;
  border: 4px solid var(--black);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 3px solid var(--black);
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.$primary ? 'var(--coral)' : 'var(--white)'};
  color: ${p => p.$primary ? 'var(--white)' : 'var(--black)'};
  box-shadow: ${p => p.$primary ? 'var(--shadow-sm)' : 'none'};
  
  &:hover {
    transform: ${p => p.$primary ? 'translate(-2px, -2px)' : 'none'};
    box-shadow: ${p => p.$primary ? 'var(--shadow-md)' : 'none'};
    background: ${p => p.$primary ? 'var(--coral)' : 'var(--gray-100)'};
  }
`;

const ErrorMessage = styled.p`
  color: var(--coral);
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
`;

function Footer({ coupleNames = 'Sophie & Max', onAdminLogin }) {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'password') {
      if (onAdminLogin) onAdminLogin();
      setShowModal(false);
      setCredentials({ username: '', password: '' });
      setError('');
    } else {
      setError('Ungültige Anmeldedaten');
    }
  };

  return (
    <>
      <Section ref={sectionRef}>
        <Container>
          <BigHeadline $visible={visible}>See you<br />soon!</BigHeadline>
          <Subtitle $visible={visible}>Wir können es kaum erwarten, mit euch zu feiern</Subtitle>
          <CTAButton href="#rsvp" $visible={visible}>Jetzt zusagen →</CTAButton>
          
          <Divider />
          
          <CoupleNames>{coupleNames}</CoupleNames>
          
          <FooterLinks>
            <FooterLink href="#story">Story</FooterLink>
            <FooterLink href="#location">Location</FooterLink>
            <FooterLink href="#timeline">Ablauf</FooterLink>
            <FooterLink href="#faq">FAQ</FooterLink>
          </FooterLinks>
          
          <AdminLink onClick={() => setShowModal(true)}>
            🔐 Admin Login
          </AdminLink>
          
          <Copyright>
            © {new Date().getFullYear()} {coupleNames} • Made with ♥
          </Copyright>
        </Container>
      </Section>
      
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>🔐 Admin Login</ModalTitle>
            <form onSubmit={handleLogin}>
              <FormGroup>
                <Label>Benutzername</Label>
                <Input 
                  type="text" 
                  value={credentials.username}
                  onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Passwort</Label>
                <Input 
                  type="password" 
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </FormGroup>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <ModalButtons>
                <ModalButton type="button" onClick={() => setShowModal(false)}>Abbrechen</ModalButton>
                <ModalButton type="submit" $primary>Login</ModalButton>
              </ModalButtons>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
}

export default Footer;
