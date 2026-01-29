// Botanical RSVP - Garden Invitation Style
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const sway = keyframes`0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, var(--botanical-paper) 0%, var(--botanical-mint) 100%);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`position: absolute; font-size: ${p => p.$size}; opacity: 0.15; animation: ${sway} ${p => p.$duration} ease-in-out infinite; top: ${p => p.$top}; left: ${p => p.$left}; right: ${p => p.$right}; bottom: ${p => p.$bottom};`;

const Container = styled.div`max-width: 550px; margin: 0 auto; position: relative; z-index: 1;`;
const Header = styled.div`text-align: center; margin-bottom: 2rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;
const Subtitle = styled.p`font-family: var(--font-body); font-size: 0.95rem; color: var(--botanical-brown); margin-top: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s;`;

const Form = styled.form`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(107, 127, 94, 0.15);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 0.3s;
`;

const FormGroup = styled.div`margin-bottom: 1.25rem;`;
const Label = styled.label`display: block; font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-charcoal); background: var(--botanical-paper); border: 2px solid var(--botanical-mint); border-radius: 12px; transition: all 0.3s ease; &:focus { outline: none; border-color: var(--botanical-sage); background: white; }`;
const TextArea = styled.textarea`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-charcoal); background: var(--botanical-paper); border: 2px solid var(--botanical-mint); border-radius: 12px; min-height: 100px; resize: vertical; &:focus { outline: none; border-color: var(--botanical-sage); }`;
const Select = styled.select`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-charcoal); background: var(--botanical-paper); border: 2px solid var(--botanical-mint); border-radius: 12px; cursor: pointer; &:focus { outline: none; border-color: var(--botanical-sage); }`;

const RadioGroup = styled.div`display: flex; gap: 1rem; margin-top: 0.5rem;`;
const RadioLabel = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: ${p => p.$checked ? 'white' : 'var(--botanical-forest)'};
  background: ${p => p.$checked ? 'var(--botanical-sage)' : 'var(--botanical-paper)'};
  border: 2px solid ${p => p.$checked ? 'var(--botanical-sage)' : 'var(--botanical-mint)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  input { display: none; }
  &:hover { border-color: var(--botanical-sage); }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-handwritten);
  font-size: 1.25rem;
  color: white;
  background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive));
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(107, 127, 94, 0.3); }
  &:disabled { background: var(--botanical-gray); cursor: not-allowed; transform: none; }
`;

const Success = styled.div`text-align: center; padding: 3rem 2rem; background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(107, 127, 94, 0.15); opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessIcon = styled.div`font-size: 4rem; margin-bottom: 1rem;`;
const SuccessTitle = styled.h3`font-family: var(--font-handwritten); font-size: 2.5rem; color: var(--botanical-forest); margin-bottom: 0.5rem;`;
const SuccessText = styled.p`font-family: var(--font-body); font-size: 1rem; color: var(--botanical-brown);`;

function RSVP() {
  const { project, content } = useWedding();
  const title = content?.rsvp?.title || 'Seid ihr dabei?';
  
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', attending: 'yes', guests: '1', dietary: '', message: '' });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    try {
      await submitRSVP(project.id, { name: formData.name, email: formData.email, attending: formData.attending === 'yes', guest_count: parseInt(formData.guests), dietary_requirements: formData.dietary, message: formData.message });
      setSubmitted(true);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <Section ref={sectionRef} id="rsvp">
      <DecoLeaf $top="10%" $left="5%" $size="4rem" $duration="5s">🌿</DecoLeaf>
      <DecoLeaf $top="30%" $right="8%" $size="3rem" $duration="4s">🍃</DecoLeaf>
      <DecoLeaf $bottom="20%" $left="10%" $size="3.5rem" $duration="6s">🌱</DecoLeaf>
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>💌 Antworten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>Wir freuen uns auf eure Rueckmeldung!</Subtitle>
        </Header>
        
        {submitted ? (
          <Success>
            <SuccessIcon>🌸</SuccessIcon>
            <SuccessTitle>Wunderbar!</SuccessTitle>
            <SuccessText>Vielen Dank fuer eure Antwort. Wir freuen uns auf euch!</SuccessText>
          </Success>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <FormGroup><Label>Name *</Label><Input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Vor- und Nachname" /></FormGroup>
            <FormGroup><Label>E-Mail *</Label><Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@beispiel.de" /></FormGroup>
            <FormGroup>
              <Label>Teilnahme</Label>
              <RadioGroup>
                <RadioLabel $checked={formData.attending === 'yes'}><input type="radio" name="attending" value="yes" checked={formData.attending === 'yes'} onChange={handleChange} />🎉 Wir kommen!</RadioLabel>
                <RadioLabel $checked={formData.attending === 'no'}><input type="radio" name="attending" value="no" checked={formData.attending === 'no'} onChange={handleChange} />😢 Leider nicht</RadioLabel>
              </RadioGroup>
            </FormGroup>
            {formData.attending === 'yes' && (
              <>
                <FormGroup><Label>Anzahl Personen</Label><Select name="guests" value={formData.guests} onChange={handleChange}><option value="1">1 Person</option><option value="2">2 Personen</option><option value="3">3 Personen</option><option value="4">4 Personen</option></Select></FormGroup>
                <FormGroup><Label>Ernaehrungswuensche</Label><Input type="text" name="dietary" value={formData.dietary} onChange={handleChange} placeholder="Vegetarisch, Allergien, etc." /></FormGroup>
              </>
            )}
            <FormGroup><Label>Nachricht (optional)</Label><TextArea name="message" value={formData.message} onChange={handleChange} placeholder="Eine liebe Nachricht an uns..." /></FormGroup>
            <SubmitBtn type="submit" disabled={loading}>{loading ? '🌱 Wird gesendet...' : '🌿 Absenden'}</SubmitBtn>
          </Form>
        )}
      </Container>
    </Section>
  );
}

export default RSVP;
