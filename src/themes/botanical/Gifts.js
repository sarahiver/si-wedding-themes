import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.7;
`;

const Card = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--sage-light);
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
  white-space: pre-line;
`;

function Gifts({ content = {} }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const title = content.title || 'Geschenke';
  const description = content.description || 'Das größte Geschenk ist eure Anwesenheit.';
  const bankDetails = content.bank_details || '';
  const paypalLink = content.paypal_link || '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Header $visible={visible}>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>
        
        {bankDetails && (
          <Card>
            <CardTitle>Bankverbindung</CardTitle>
            <CardText>{bankDetails}</CardText>
          </Card>
        )}
        
        {paypalLink && (
          <Card>
            <CardTitle>PayPal</CardTitle>
            <CardText>
              <a href={paypalLink} target="_blank" rel="noopener noreferrer" 
                style={{ color: 'var(--sage)', textDecoration: 'none' }}>
                Über PayPal schenken →
              </a>
            </CardText>
          </Card>
        )}
      </Container>
    </Section>
  );
}

export default Gifts;
