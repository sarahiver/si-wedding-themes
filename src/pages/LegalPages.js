// src/pages/LegalPages.js
// Impressum & Datenschutzerklärung für siwedding.de
import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #e0e0e0;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 4rem 2rem;
`;

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const Logo = styled.a`
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  margin-bottom: 3rem;
  text-decoration: none;
  &:hover { opacity: 0.8; }
`;

const H1 = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
`;

const H2 = styled.h2`
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  margin: 2rem 0 0.75rem;
`;

const P = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: #aaa;
  margin-bottom: 0.75rem;
`;

const Ul = styled.ul`
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
  li {
    font-size: 0.9rem;
    line-height: 1.7;
    color: #aaa;
    margin-bottom: 0.25rem;
  }
`;

const BackLink = styled.a`
  display: inline-block;
  margin-top: 3rem;
  font-size: 0.8rem;
  color: #666;
  text-decoration: none;
  &:hover { color: #fff; }
`;

// ============================================
// IMPRESSUM
// ============================================

export function Impressum() {
  return (
    <Page>
      <Container>
        <Logo href="/">S&I.</Logo>
        <H1>Impressum</H1>

        <H2>Angaben gemäß § 5 TMG</H2>
        <P>
          Iver Gentz<br />
          S&I. wedding<br />
          Große Freiheit 82<br />
          22767 Hamburg
        </P>

        <H2>Kontakt</H2>
        <P>
          E-Mail: wedding@sarahiver.de
        </P>

        <H2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</H2>
        <P>
          Iver Gentz<br />
          Große Freiheit 82<br />
          22767 Hamburg
        </P>

        <H2>Haftung für Inhalte</H2>
        <P>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </P>
        <P>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </P>

        <H2>Haftung für Links</H2>
        <P>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </P>

        <H2>Urheberrecht</H2>
        <P>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </P>

        <BackLink href="/">← Zurück zur Startseite</BackLink>
      </Container>
    </Page>
  );
}

// ============================================
// DATENSCHUTZERKLÄRUNG
// ============================================

export function Datenschutz() {
  return (
    <Page>
      <Container>
        <Logo href="/">S&I.</Logo>
        <H1>Datenschutzerklärung</H1>

        <H2>1. Verantwortlicher</H2>
        <P>
          Iver Gentz<br />
          S&I. wedding<br />
          Große Freiheit 82, 22767 Hamburg<br />
          E-Mail: wedding@sarahiver.de
        </P>

        <H2>2. Überblick der Verarbeitung</H2>
        <P>
          Wir betreiben eine Plattform zur Erstellung individueller Hochzeitswebsites. Im Rahmen dieses Dienstes verarbeiten wir personenbezogene Daten unserer Kunden (Brautpaare) und deren Hochzeitsgäste.
        </P>

        <H2>3. Rechtsgrundlagen</H2>
        <P>Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage von:</P>
        <Ul>
          <li>Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung (Erstellung der Hochzeitswebsite)</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO – Berechtigtes Interesse (Betrieb und Sicherheit der Plattform)</li>
          <li>Art. 6 Abs. 1 lit. a DSGVO – Einwilligung (bei optionalen Funktionen wie Foto-Upload durch Gäste)</li>
        </Ul>

        <H2>4. Welche Daten wir verarbeiten</H2>

        <P><strong>4.1 Kundendaten (Brautpaare)</strong></P>
        <Ul>
          <li>Name, E-Mail-Adresse, Anschrift</li>
          <li>Hochzeitsdatum, Veranstaltungsdetails</li>
          <li>Hochgeladene Bilder und Texte</li>
        </Ul>

        <P><strong>4.2 Gästedaten (über die Hochzeitswebsite)</strong></P>
        <Ul>
          <li>RSVP: Name, E-Mail, Anzahl Personen, Ernährungswünsche, Allergien</li>
          <li>Gästebuch: Name, Nachricht</li>
          <li>Musikwünsche: Name, Künstler, Songtitel</li>
          <li>Geschenke: Name, E-Mail des Reservierenden</li>
          <li>Foto-Upload: Hochgeladene Bilder</li>
        </Ul>

        <P><strong>4.3 Technische Daten</strong></P>
        <Ul>
          <li>IP-Adresse (in Server-Logs des Hosting-Providers)</li>
          <li>Browser-Typ, Betriebssystem</li>
          <li>Zeitpunkt des Zugriffs</li>
        </Ul>

        <H2>5. Auftragsverarbeiter und Drittdienste</H2>
        <P>Wir nutzen folgende Drittanbieter zur Erbringung unserer Dienste:</P>

        <P><strong>5.1 Vercel Inc.</strong> (Hosting)</P>
        <P>Unsere Website wird auf Servern von Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Vercel verarbeitet technische Zugriffsdaten (IP-Adressen, Zeitstempel). Datenschutzvereinbarung: vercel.com/legal/privacy-policy</P>

        <P><strong>5.2 Supabase Inc.</strong> (Datenbank)</P>
        <P>Alle Inhalts- und Gästedaten werden in einer Datenbank bei Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992, gespeichert. Die Datenbank befindet sich in der EU (Frankfurt). Datenschutzvereinbarung: supabase.com/privacy</P>

        <P><strong>5.3 Cloudinary Ltd.</strong> (Bildverwaltung)</P>
        <P>Hochgeladene Bilder (Hero-Bilder, Galerien, Gäste-Fotos) werden bei Cloudinary Ltd., 111 W. Evelyn Ave, Suite 206, Sunnyvale, CA 94086, USA gespeichert und ausgeliefert. Datenschutzvereinbarung: cloudinary.com/privacy</P>

        <P><strong>5.4 Brevo (Sendinblue)</strong> (E-Mail-Benachrichtigungen)</P>
        <P>Für Benachrichtigungen an das Brautpaar (neue RSVP-Antworten, Gästebucheinträge etc.) nutzen wir den E-Mail-Dienst Brevo, Sendinblue GmbH, Köpenicker Str. 126, 10179 Berlin. Dabei werden nur die E-Mail-Adresse des Brautpaars und der Inhalt der Benachrichtigung übermittelt. Datenschutzvereinbarung: brevo.com/legal/privacypolicy</P>

        <H2>6. Speicherdauer</H2>
        <Ul>
          <li>Hochzeitswebsite-Daten: Für die Dauer des gebuchten Hosting-Zeitraums, danach innerhalb von 30 Tagen gelöscht</li>
          <li>Gäste-Fotos: Werden nach Download durch das Brautpaar automatisch gelöscht</li>
          <li>Vertragsdaten: 10 Jahre (gesetzliche Aufbewahrungspflicht)</li>
          <li>Server-Logs: Maximal 30 Tage</li>
        </Ul>

        <H2>7. Cookies und Tracking</H2>
        <P>
          Wir setzen <strong>keine Cookies</strong> und verwenden <strong>keine Tracking- oder Analyse-Tools</strong>. Für die Funktionalität der Website verwenden wir ausschließlich Session Storage (wird beim Schließen des Browsers automatisch gelöscht) für:
        </P>
        <Ul>
          <li>Admin-Authentifizierung</li>
          <li>Passwortgeschützten Zugang</li>
        </Ul>

        <H2>8. Datenübermittlung in Drittländer</H2>
        <P>
          Einige unserer Auftragsverarbeiter haben ihren Sitz in den USA (Vercel, Cloudinary). Die Datenübermittlung erfolgt auf Grundlage von EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) bzw. dem EU-US Data Privacy Framework.
        </P>

        <H2>9. Ihre Rechte</H2>
        <P>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</P>
        <Ul>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
        </Ul>
        <P>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: wedding@sarahiver.de
        </P>

        <H2>10. Beschwerderecht</H2>
        <P>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Aufsichtsbehörde ist der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Str. 22, 20459 Hamburg.
        </P>

        <H2>11. Verantwortlichkeit für Hochzeitswebsite-Inhalte</H2>
        <P>
          Für die über die Hochzeitswebsite erhobenen Gästedaten (RSVP, Gästebuch, Fotos etc.) ist das jeweilige Brautpaar als Auftraggeber datenschutzrechtlich verantwortlich. S&I. wedding agiert als Auftragsverarbeiter im Sinne von Art. 28 DSGVO.
        </P>

        <P style={{ marginTop: '2rem', color: '#666', fontSize: '0.8rem' }}>
          Stand: Februar 2026
        </P>

        <BackLink href="/">← Zurück zur Startseite</BackLink>
      </Container>
    </Page>
  );
}
