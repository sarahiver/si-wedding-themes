import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-light-gray);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 1.5rem;
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const ContactCard = styled.div`
  background: var(--editorial-white);
  padding: 2.5rem;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ContactImage = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  background: var(--editorial-light-gray);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: filter 0.3s ease;
  }
  
  ${ContactCard}:hover & img {
    filter: grayscale(0%);
  }
`;

const ContactPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const ContactRole = styled.span`
  display: block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 0.5rem;
`;

const ContactName = styled.h3`
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  width: 40px;
  height: 2px;
  background: var(--editorial-red);
  margin: 0 auto 1rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--editorial-gray);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--editorial-red);
  }
  
  span {
    font-size: 1rem;
  }
`;

// ============================================
// COMPONENT
// ============================================

function Contact() {
  const { content, coupleNames } = useWedding();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const description = contactData.description || 'Bei Fragen könnt ihr uns jederzeit erreichen.';
  const contacts = contactData.contacts || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Parse couple names for default contacts
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Braut', 'Bräutigam'];
  
  const defaultContacts = [
    { 
      name: names[0] || 'Braut', 
      role: 'Braut', 
      email: 'braut@beispiel.de', 
      phone: '+49 123 456789',
      image: null 
    },
    { 
      name: names[1] || 'Bräutigam', 
      role: 'Bräutigam', 
      email: 'braeutigam@beispiel.de', 
      phone: '+49 123 456789',
      image: null 
    },
  ];

  const displayContacts = contacts.length > 0 ? contacts : defaultContacts;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="contact" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Meldet euch</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <ContactGrid $visible={visible}>
          {displayContacts.map((contact, i) => (
            <ContactCard key={i}>
              <ContactImage>
                {contact.image ? (
                  <img src={contact.image} alt={contact.name} />
                ) : (
                  <ContactPlaceholder>
                    {contact.role === 'Braut' ? '👰' : '🤵'}
                  </ContactPlaceholder>
                )}
              </ContactImage>
              
              <ContactRole>{contact.role}</ContactRole>
              <ContactName>{contact.name}</ContactName>
              <Divider />
              
              <ContactInfo>
                {contact.email && (
                  <ContactLink href={`mailto:${contact.email}`}>
                    <span>✉️</span> {contact.email}
                  </ContactLink>
                )}
                {contact.phone && (
                  <ContactLink href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                    <span>📞</span> {contact.phone}
                  </ContactLink>
                )}
              </ContactInfo>
            </ContactCard>
          ))}
        </ContactGrid>
      </Container>
    </Section>
  );
}

export default Contact;
