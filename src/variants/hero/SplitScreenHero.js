// src/variants/hero/SplitScreenHero.js
// TEST-KOMPONENTE für Varianten-System
// Kann später durch echtes Design ersetzt werden

import styled from 'styled-components'

const TestWrapper = styled.section`
  min-height: 100vh;
  display: flex;
  border: 8px dashed #C41E3A;
  background: linear-gradient(135deg, #1a1a1a 50%, #2d2d2d 50%);
`

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
`

const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255,255,255,0.05);
  color: white;
`

const TestBadge = styled.div`
  background: #C41E3A;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
`

const Names = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 400;
  margin: 0;
`

const Date = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  opacity: 0.8;
`

const InfoBox = styled.div`
  border: 2px solid rgba(255,255,255,0.3);
  padding: 2rem;
  text-align: center;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    opacity: 0.6;
  }

  p {
    margin: 0;
    font-size: 1rem;
  }
`

export default function SplitScreenHero({ config, data }) {
  const name1 = config?.name1 || data?.name1 || 'Partner 1'
  const name2 = config?.name2 || data?.name2 || 'Partner 2'
  const date = config?.weddingDateDisplay || 'Datum folgt'
  const location = config?.location || data?.location || 'Location'

  return (
    <TestWrapper id="hero">
      <LeftSide>
        <TestBadge>⚡ Split Screen Variante ⚡</TestBadge>
        <Names>{name1}</Names>
        <Names>&</Names>
        <Names>{name2}</Names>
        <Date>{date}</Date>
      </LeftSide>
      <RightSide>
        <InfoBox>
          <h3>Location</h3>
          <p>{location}</p>
        </InfoBox>
        <div style={{ marginTop: '2rem', fontSize: '0.75rem', opacity: 0.5 }}>
          TEST: Varianten-System funktioniert! 🎉
        </div>
      </RightSide>
    </TestWrapper>
  )
}
