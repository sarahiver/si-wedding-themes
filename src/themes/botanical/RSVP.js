import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--forest);
  position: relative;
  overflow: hidden;
`;

const BgLeaf = styled.div`
  position: absolute;
  width: ${p => p.size}px;
  opacity: 0.05;
  top: ${p => p.top};
  left: ${p => p.left};
  right: ${p => p.right};
  animation: ${float} ${p => p.duration}s ease-in-out infinite;
  pointer-events: none;
  
  svg { width: 100%; fill: var(--sage-light); }
`;

const Container = styled.div`
  max-width: 550px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--cream);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: rgba(245,241,235,0.7);
  line-height: 1.7;
`;

const Form = styled.form`
  background: rgba(245,241,235,0.05);
  border: 1px solid rgba(139,157,131,0.2);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--sage-light);
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--cream);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(139,157,131,0.3);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    background: rgba(255,255,255,0.08);
  }
  
  &::placeholder { color: rgba(245,241,235,0.4); }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--cream);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(139,157,131,0.3);
  border-radius: var(--radius-md);
  cursor: pointer;
  
  &:focus { outline: none; border-color: var(--sage); }
  option { background: var(--forest); color: var(--cream); }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--cream);
  padding: 0.75rem 1.25rem;
  background: ${p => p.checked ? 'rgba(139,157,131,0.2)' : 'transparent'};
  border: 1px solid ${p => p.checked ? 'var(--sage)' : 'rgba(139,157,131,0.3)'};
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--sage-light);
  }
  
  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(139,157,131,0.5);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    
    &:checked {
      border-color: var(--sage);
      &::after {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 8px; height: 8px;
        background: var(--sage);
        border-radius: 50%;
      }
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--cream);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(139,157,131,0.3);
  border-radius: var(--radius-md);
  min-height: 100px;
  resize: vertical;
  
  &:focus { outline: none; border-color: var(--sage); }
  &::placeholder { color: rgba(245,241,235,0.4); }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 1.2rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--forest);
  background: var(--sage);
  border: none;
  border-radius: var(--radius-xl);
  margin-top: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139,157,131,0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  animation: ${fadeInUp} 0.6s ease;
  
  .icon { 
    font-size: 4rem; 
    margin-bottom: 1.5rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  h3 { 
    font-family: 'Playfair Display', serif; 
    font-size: 2rem; 
    color: var(--sage); 
    margin-bottom: 1rem; 
  }
  p { 
    font-family: 'Lato', sans-serif; 
    color: rgba(245,241,235,0.7);
    font-size: 1.1rem;
    line-height: 1.7;
  }
`;

const Deadline = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: rgba(245,241,235,0.5);
  
  strong { color: var(--sage-light); }
`;

// SVG
const LeafSVG = () => <svg viewBox="0 0 100 100"><path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" /></svg>;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function RSVP({
  deadline = '15. Mai 2025',
  menuOptions = ['Vegetarisch', 'Vegan', 'Fleisch', 'Fisch'],
  onSubmit = (data) => console.log('RSVP:', data),
}) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    attendance: '', 
    guests: '1', 
    menu: '', 
    allergies: '', 
    message: '' 
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); }, 
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Section ref={sectionRef} id="rsvp">
        <Container>
          <SuccessMessage>
            <div className="icon">🌸</div>
            <h3>Wunderbar!</h3>
            <p>
              {formData.attendance === 'yes' 
                ? 'Wir freuen uns riesig, euch am großen Tag dabei zu haben!' 
                : 'Schade, dass ihr nicht dabei sein könnt – ihr werdet uns fehlen.'}
            </p>
          </SuccessMessage>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="rsvp">
      <BgLeaf size={120} top="10%" left="5%" duration={8}><LeafSVG /></BgLeaf>
      <BgLeaf size={80} top="70%" right="8%" duration={10}><LeafSVG /></BgLeaf>
      
      <Container>
        <Header visible={visible}>
          <Eyebrow>RSVP</Eyebrow>
          <Title>Seid ihr dabei?</Title>
          <Subtitle>Lasst uns wissen, ob wir euch erwarten dürfen.</Subtitle>
        </Header>
        
        <Form visible={visible} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name *</Label>
            <Input 
              type="text" 
              placeholder="Euer Name" 
              value={formData.name} 
              onChange={(e) => updateField('name', e.target.value)} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label>E-Mail *</Label>
            <Input 
              type="email" 
              placeholder="eure@email.de" 
              value={formData.email} 
              onChange={(e) => updateField('email', e.target.value)} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Kommt ihr? *</Label>
            <RadioGroup>
              <RadioLabel checked={formData.attendance === 'yes'}>
                <input 
                  type="radio" 
                  name="attendance" 
                  value="yes" 
                  checked={formData.attendance === 'yes'} 
                  onChange={(e) => updateField('attendance', e.target.value)} 
                  required 
                /> 
                🎉 Ja, wir kommen!
              </RadioLabel>
              <RadioLabel checked={formData.attendance === 'no'}>
                <input 
                  type="radio" 
                  name="attendance" 
                  value="no" 
                  checked={formData.attendance === 'no'} 
                  onChange={(e) => updateField('attendance', e.target.value)} 
                /> 
                😢 Leider nicht
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          {formData.attendance === 'yes' && (
            <>
              <FormGroup>
                <Label>Anzahl Personen</Label>
                <Select 
                  value={formData.guests} 
                  onChange={(e) => updateField('guests', e.target.value)}
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Menüwahl *</Label>
                <Select 
                  value={formData.menu} 
                  onChange={(e) => updateField('menu', e.target.value)} 
                  required
                >
                  <option value="">Bitte wählen</option>
                  {menuOptions.map((opt, i) => (
                    <option key={i} value={opt.toLowerCase()}>{opt}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Allergien / Unverträglichkeiten</Label>
                <Input 
                  type="text" 
                  placeholder="z.B. Nüsse, Laktose, Gluten" 
                  value={formData.allergies} 
                  onChange={(e) => updateField('allergies', e.target.value)} 
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <Label>Nachricht (optional)</Label>
            <Textarea 
              placeholder="Möchtet ihr uns etwas mitteilen?" 
              value={formData.message} 
              onChange={(e) => updateField('message', e.target.value)} 
            />
          </FormGroup>
          
          <SubmitBtn type="submit">
            Antwort senden
          </SubmitBtn>
        </Form>
        
        <Deadline>Bitte antwortet bis <strong>{deadline}</strong></Deadline>
      </Container>
    </Section>
  );
}

export default RSVP;
