import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT - BOTANICAL THEME
   Kontaktmöglichkeiten zum Brautpaar und Trauzeugen
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--cream);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.12;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const ContactIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sage);
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 20px 60px rgba(139, 157, 131, 0.12);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay || '0.2s'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 80px rgba(139, 157, 131, 0.18);
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--sage-lightest);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const CardRole = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 1.5rem;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  background: rgba(139, 157, 131, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage);
    color: white;
    transform: translateX(5px);
  }
`;

const WitnessSection = styled.div`
  margin-top: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.4s;
`;

const WitnessTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: var(--forest);
  text-align: center;
  margin-bottom: 2rem;
`;

const WitnessGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WitnessCard = styled.div`
  background: linear-gradient(135deg, var(--sage-lightest) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 2rem;
  border: 1px solid rgba(139, 157, 131, 0.15);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(139, 157, 131, 0.12);
  }
`;

const WitnessAvatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  border: 3px solid var(--sage-light);
`;

const WitnessName = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--forest);
  margin-bottom: 0.25rem;
`;

const WitnessRole = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 1rem;
`;

const WitnessContact = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--sage-dark);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--forest);
  }
`;

const EmergencySection = styled.div`
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const EmergencyCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(139, 157, 131, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  text-align: center;
`;

const EmergencyIcon = styled.span`
  font-size: 1.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const EmergencyText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  
  strong {
    color: var(--forest);
  }
`;

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const couple = [
    {
      name: 'Olivia',
      role: 'Die Braut',
      icon: '👰',
      contacts: [
        { type: 'phone', value: '+49 170 1234567', icon: '📱' },
        { type: 'email', value: 'olivia@email.de', icon: '✉️' }
      ]
    },
    {
      name: 'Benjamin',
      role: 'Der Bräutigam',
      icon: '🤵',
      contacts: [
        { type: 'phone', value: '+49 171 7654321', icon: '📱' },
        { type: 'email', value: 'benjamin@email.de', icon: '✉️' }
      ]
    }
  ];

  const witnesses = [
    {
      name: 'Maria Schmidt',
      role: 'Trauzeugin',
      icon: '👩',
      phone: '+49 172 1111111'
    },
    {
      name: 'Thomas Müller',
      role: 'Trauzeuge',
      icon: '👨',
      phone: '+49 173 2222222'
    }
  ];

  return (
    <Section ref={sectionRef} id="contact">
      <FloatingElement $top="8%" $left="5%" $size="2.5rem" $duration="7s">💌</FloatingElement>
      <FloatingElement $top="25%" $right="8%" $size="2rem" $duration="5s" $delay="1s">🌿</FloatingElement>
      <FloatingElement $top="60%" $left="3%" $size="2rem" $duration="8s" $delay="2s">📱</FloatingElement>
      <FloatingElement $bottom="15%" $right="5%" $size="2.5rem" $duration="6s" $delay="0.5s">✨</FloatingElement>

      <Container>
        <Header $visible={isVisible}>
          <ContactIcon>💌</ContactIcon>
          <Eyebrow>Meldet euch bei uns</Eyebrow>
          <Title>Kon<span>takt</span></Title>
          <Subtitle>
            Habt ihr Fragen? Wir sind für euch da! 
            Hier findet ihr alle Möglichkeiten, uns zu erreichen.
          </Subtitle>
        </Header>

        <ContactGrid>
          {couple.map((person, index) => (
            <ContactCard key={index} $visible={isVisible} $delay={`${0.2 + index * 0.1}s`}>
              <CardIcon>{person.icon}</CardIcon>
              <CardTitle>{person.name}</CardTitle>
              <CardRole>{person.role}</CardRole>
              <ContactList>
                {person.contacts.map((contact, i) => (
                  <ContactItem 
                    key={i}
                    href={contact.type === 'phone' ? `tel:${contact.value}` : `mailto:${contact.value}`}
                  >
                    {contact.icon} {contact.value}
                  </ContactItem>
                ))}
              </ContactList>
            </ContactCard>
          ))}
        </ContactGrid>

        <WitnessSection $visible={isVisible}>
          <WitnessTitle>🌿 Unsere Trauzeugen</WitnessTitle>
          <WitnessGrid>
            {witnesses.map((witness, index) => (
              <WitnessCard key={index}>
                <WitnessAvatar>{witness.icon}</WitnessAvatar>
                <WitnessName>{witness.name}</WitnessName>
                <WitnessRole>{witness.role}</WitnessRole>
                <WitnessContact href={`tel:${witness.phone}`}>
                  📱 {witness.phone}
                </WitnessContact>
              </WitnessCard>
            ))}
          </WitnessGrid>
        </WitnessSection>

        <EmergencySection $visible={isVisible}>
          <EmergencyCard>
            <EmergencyIcon>🆘</EmergencyIcon>
            <EmergencyText>
              <strong>Am Hochzeitstag:</strong> Bei dringenden Fragen am Tag der Hochzeit 
              wendet euch bitte an unsere Trauzeugen – wir werden beschäftigt sein! 😊
            </EmergencyText>
          </EmergencyCard>
        </EmergencySection>
      </Container>
    </Section>
  );
};

export default Contact;
