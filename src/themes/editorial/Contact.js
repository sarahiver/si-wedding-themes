// src/components/Contact.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
  position: relative;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #FFFFFF;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px 40px;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease ${p => 0.2 + p.$index * 0.15}s;

  &:hover {
    border-color: rgba(184, 151, 106, 0.3);
  }

  @media (max-width: 500px) {
    padding: 40px 25px;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 25px;
  border: 3px solid #B8976A;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.5s ease;

    ${ContactCard}:hover & {
      filter: grayscale(0%);
    }
  }
`;

const Role = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 15px;
`;

const Name = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.8rem;
  color: #FFFFFF;
  margin-bottom: 10px;
`;

const Relation = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 25px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;

  &:hover {
    color: #B8976A;
  }

  span {
    font-size: 1.1rem;
  }
`;

const Note = styled.p`
  text-align: center;
  margin-top: 60px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.3rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease 0.5s;
`;

function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const contacts = [
    {
      role: 'Trauzeugin',
      name: 'Lisa Müller',
      relation: 'Beste Freundin der Braut',
      phone: '+49 170 1234567',
      email: 'lisa@beispiel.de',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg'
    },
    {
      role: 'Trauzeuge',
      name: 'Tom Schmidt',
      relation: 'Bester Freund des Bräutigams',
      phone: '+49 171 7654321',
      email: 'tom@beispiel.de',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg'
    }
  ];

  return (
    <Section ref={sectionRef} id="contact">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Kontakt</Eyebrow>
          <Title>Eure <span>Ansprechpartner</span></Title>
          <Subtitle>Bei Fragen rund um die Hochzeit sind unsere Trauzeugen für euch da</Subtitle>
        </Header>

        <Grid>
          {contacts.map((contact, index) => (
            <ContactCard key={index} $visible={isVisible} $index={index}>
              <Avatar>
                <img src={contact.image} alt={contact.name} />
              </Avatar>
              <Role>{contact.role}</Role>
              <Name>{contact.name}</Name>
              <Relation>{contact.relation}</Relation>
              <ContactInfo>
                <ContactLink href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                  <span>📞</span> {contact.phone}
                </ContactLink>
                <ContactLink href={`mailto:${contact.email}`}>
                  <span>✉️</span> {contact.email}
                </ContactLink>
              </ContactInfo>
            </ContactCard>
          ))}
        </Grid>

        <Note $visible={isVisible}>
          „Wir freuen uns darauf, mit euch diesen besonderen Tag zu feiern!"
        </Note>
      </Container>
    </Section>
  );
}

export default Contact;
