// Luxe RSVP - Elegant Dark Form
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: 550px; margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Subtitle = styled.p`font-family: var(--font-body); font-size: 0.9rem; color: var(--luxe-pearl); margin-top: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;

const Form = styled.form`opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.3s;`;
const FormGroup = styled.div`margin-bottom: 1.5rem;`;
const Label = styled.label`display: block; font-family: var(--font-body); font-size: 0.6rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-slate); margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; font-weight: 300; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); transition: border-color 0.3s ease; &:focus { outline: none; border-color: var(--luxe-gold); } &::placeholder { color: var(--luxe-slate); }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; font-weight: 300; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); min-height: 100px; resize: vertical; transition: border-color 0.3s ease; &:focus { outline: none; border-color: var(--luxe-gold); }`;
const Select = styled.select`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); cursor: pointer; &:focus { outline: none; border-color: var(--luxe-gold); }`;

const RadioGroup = styled.div`display: flex; gap: 2rem; margin-top: 0.5rem;`;
const RadioLabel = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: var(--font-body); font-size: 0.9rem; color: var(--luxe-pearl); cursor: pointer; input { width: 16px; height: 16px; accent-color: var(--luxe-gold); }`;

const SubmitBtn = styled.button`width: 100%; padding: 1.25rem; font-family: var(--font-body); font-size: 0.7rem; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; color: var(--luxe-void); background: var(--luxe-gold); border: none; cursor: pointer; margin-top: 1rem; transition: background 0.3s ease; &:hover { background: var(--luxe-champagne); } &:disabled { background: var(--luxe-graphite); cursor: not-allowed; }`;

const Success = styled.div`text-align: center; padding: 3rem 0; opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessTitle = styled.h3`font-family: var(--font-display); font-size: 2.5rem; font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 1rem;`;
const SuccessText = styled.p`font-family: var(--font-body); font-size: 0.95rem; color: var(--luxe-pearl);`;

function RSVP() {
  const { project, content } = useWedding();
  const rsvpData = content?.rsvp || {};
  const title = rsvpData.title || 'Zusagen';
  const customQuestion = rsvpData.custom_question || '';

  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', attending: 'yes', guests: '1', dietary: '', message: '', customAnswer: '' });
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
      await submitRSVP(project.id, { name: formData.name, email: formData.email, attending: formData.attending === 'yes', guest_count: parseInt(formData.guests), dietary_requirements: formData.dietary, message: formData.message, custom_answer: formData.customAnswer });
      setSubmitted(true);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <Section ref={sectionRef} id="rsvp">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Antworten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>Wir freuen uns auf eure Rueckmeldung</Subtitle>
        </Header>
        
        {submitted ? (
          <Success><SuccessTitle>Vielen Dank</SuccessTitle><SuccessText>Wir haben eure Antwort erhalten und freuen uns auf euch.</SuccessText></Success>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <FormGroup><Label>Name *</Label><Input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Vor- und Nachname" /></FormGroup>
            <FormGroup><Label>E-Mail *</Label><Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@beispiel.de" /></FormGroup>
            <FormGroup><Label>Teilnahme</Label>
              <RadioGroup>
                <RadioLabel><input type="radio" name="attending" value="yes" checked={formData.attending === 'yes'} onChange={handleChange} />Ich komme gerne</RadioLabel>
                <RadioLabel><input type="radio" name="attending" value="no" checked={formData.attending === 'no'} onChange={handleChange} />Leider nicht</RadioLabel>
              </RadioGroup>
            </FormGroup>
            {formData.attending === 'yes' && (
              <>
                <FormGroup><Label>Anzahl Gaeste</Label><Select name="guests" value={formData.guests} onChange={handleChange}><option value="1">1 Person</option><option value="2">2 Personen</option><option value="3">3 Personen</option><option value="4">4 Personen</option></Select></FormGroup>
                <FormGroup><Label>Ernaehrungswuensche</Label><Input type="text" name="dietary" value={formData.dietary} onChange={handleChange} placeholder="Vegetarisch, Allergien, etc." /></FormGroup>
              </>
            )}
            {customQuestion && (
              <FormGroup><Label>{customQuestion}</Label><TextArea name="customAnswer" value={formData.customAnswer} onChange={handleChange} placeholder="Deine Antwort..." /></FormGroup>
            )}
            <FormGroup><Label>Nachricht (optional)</Label><TextArea name="message" value={formData.message} onChange={handleChange} placeholder="Eine persoenliche Nachricht..." /></FormGroup>
            <SubmitBtn type="submit" disabled={loading}>{loading ? 'Wird gesendet...' : 'Absenden'}</SubmitBtn>
          </Form>
        )}
      </Container>
    </Section>
  );
}

export default RSVP;
