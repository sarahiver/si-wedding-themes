import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--gray-100);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--white);
  padding: 2.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.15}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: ${p => p.$color};
  border: 3px solid var(--black);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const RoleBadge = styled.div`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
  background: var(--coral);
  padding: 0.4rem 1rem;
  border: 2px solid var(--black);
  margin-bottom: 1rem;
`;

const Name = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const Relation = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: 1.5rem;
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--gray-600);
  padding: 0.75rem;
  background: var(--gray-100);
  border: 2px solid var(--gray-300);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--yellow);
    border-color: var(--black);
  }
`;

const InfoBox = styled.div`
  background: var(--purple);
  padding: 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.5s;
`;

const InfoTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
  margin: 0;
`;

function Contact() {
  const { content, projectId } = useWedding();
  const contactData = content?.contact || {};
  const witnesses = [];
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultWitnesses = [
    { role: 'Trauzeugin', name: 'Lisa Schneider', relation: 'Beste Freundin der Braut', phone: '+49 176 12345678', email: 'lisa@email.de', color: 'var(--coral)', emoji: '👰' },
    { role: 'Trauzeuge', name: 'Thomas Weber', relation: 'Bester Freund des Bräutigams', phone: '+49 171 87654321', email: 'thomas@email.de', color: 'var(--electric)', emoji: '🤵' },
  ];

  const items = witnesses.length > 0 ? witnesses : defaultWitnesses;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="contact">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📞 Kontakt</Eyebrow>
          <Title $visible={visible}>Got Questions?</Title>
        </Header>
        
        <Grid>
          {items.map((person, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <Avatar $color={person.color}>{person.emoji}</Avatar>
              <RoleBadge>{person.role}</RoleBadge>
              <Name>{person.name}</Name>
              <Relation>{person.relation}</Relation>
              <ContactLinks>
                <ContactItem href={`tel:${person.phone}`}>📱 {person.phone}</ContactItem>
                <ContactItem href={`mailto:${person.email}`}>✉️ {person.email}</ContactItem>
              </ContactLinks>
            </Card>
          ))}
        </Grid>
        
        <InfoBox $visible={visible}>
          <InfoTitle>🎉 Überraschungen</InfoTitle>
          <InfoText>Plant ihr eine Überraschung? Sprecht euch mit unseren Trauzeugen ab!</InfoText>
        </InfoBox>
      </Container>
    </Section>
  );
}

export default Contact;
