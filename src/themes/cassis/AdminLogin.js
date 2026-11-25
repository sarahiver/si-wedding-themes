// src/themes/cassis/AdminLogin.js – Anmeldung zum Kundendashboard im Aussehen der Antwortkarte
import React, { useId, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { AdminMobileStyles } from '../../components/admin/core/AdminMobile';
import { C, FONT, HEADING, SCRIPT, Button } from './shared';

const ERR = '#6E1620';
const Page = styled.main`
  min-height: 100vh; min-height: 100svh; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
  padding: 2rem 1.25rem; background: ${C.mist}; color: ${C.ink}; font-family: ${FONT}; font-size: 1.0625rem; line-height: 1.5;
`;
const Card = styled.div`
  position: relative; box-sizing: border-box; width: 100%; max-width: 30rem; background: ${C.pearl}; padding: clamp(2.5rem, 7vw, 4rem) clamp(1.75rem, 6vw, 3.5rem);
  box-shadow: 0 30px 60px -32px rgba(51,53,63,0.55);
  &::before { content: ''; position: absolute; inset: 0.7rem; border: 1px solid ${C.haze}; pointer-events: none; }
  &::after { content: ''; position: absolute; inset: 1rem; border: 1px solid rgba(199,197,204,0.5); pointer-events: none; }
  > * { position: relative; z-index: 1; }
`;
const Mark = styled.div`
  text-align: center;
  img { display: block; width: min(62%, 14rem); height: auto; margin: 0 auto; filter: brightness(0) opacity(0.82); }
  span { font-family: ${SCRIPT}; font-size: clamp(2.25rem, 9vw, 3rem); line-height: 1.1; }
`;
const Title = styled.h1`margin: 1.75rem 0 0; text-align: center; font-family: ${HEADING}; font-weight: 400; font-size: clamp(1.75rem, 5vw, 2.25rem); line-height: 1.2;`;
const Rule = styled.div`width: 3.5rem; height: 1px; background: ${C.ink}; opacity: 0.6; margin: 1.5rem auto 2.25rem;`;
const Form = styled.form`display: grid; gap: 1.75rem;`;
const Field = styled.label`display: grid; gap: 0.5rem; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.inkSoft};`;
const Input = styled.input`
  box-sizing: border-box; width: 100%; min-height: 3rem; padding: 0.3rem 0; border: 0; border-bottom: 1px dotted ${C.ink}; border-radius: 0;
  background: transparent; color: ${C.ink}; font-family: ${FONT}; font-size: 1.125rem; letter-spacing: 0.08em;
  &:focus-visible { outline: 0; border-bottom-style: solid; box-shadow: 0 1px 0 ${C.ink}; }
  &[aria-invalid='true'] { border-bottom: 1px solid ${ERR}; box-shadow: 0 1px 0 ${ERR}; }
`;
const Err = styled.p`margin: 0; padding: 0.8rem 1rem; background: ${C.shell}; color: ${ERR}; font-size: 1rem; line-height: 1.45; border-left: 3px solid ${ERR};`;
const Back = styled.a`
  display: flex; align-items: center; justify-content: center; min-height: 2.75rem; margin-top: 1.5rem; color: ${C.ink}; font-size: 1rem;
  text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.3em;
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;

function CassisLogin({ onLogin, error, coupleNames, slug }) {
  const { content, project } = useWedding();
  const [password, setPassword] = useState('');
  const uid = useId();
  const mark = content && content.hero && content.hero.name_image;
  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = names.length ? names.join(' ') : (coupleNames || '');
  const submit = (e) => { e.preventDefault(); onLogin(password); };
  return (
    <Page className="si-admin">
      <AdminMobileStyles />
      <Card>
        <Mark>{mark ? <img src={mark} alt={label} /> : <span>{label}</span>}</Mark>
        <Title>Euer Bereich</Title>
        <Rule />
        <Form onSubmit={submit}>
          <Field htmlFor={`${uid}-pw`}>Passwort
            <Input id={`${uid}-pw`} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required
              aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${uid}-err` : undefined} />
          </Field>
          <div aria-live="assertive">{error && <Err role="alert" id={`${uid}-err`}>{error}</Err>}</div>
          <Button as="button" type="submit" $solid $block>Anmelden</Button>
        </Form>
        <Back href={slug ? `/${slug}` : '/'}>Zurück zur Website</Back>
      </Card>
    </Page>
  );
}
export default CassisLogin;
