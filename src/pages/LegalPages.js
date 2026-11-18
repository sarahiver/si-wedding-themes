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
  /* lange Wörter und Adressen umbrechen, statt die Seite auf schmalen Handys zu verbreitern */
  overflow-wrap: break-word;
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
  hyphens: auto;
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

        <H2>Angaben gemäß § 5 DDG</H2>
        <P>
          Iver Bohnes<br />
          S&I. wedding<br />
          Große Freiheit 82<br />
          22767 Hamburg
        </P>

        <H2>Kontakt</H2>
        <P>
          E-Mail: wedding@sarahiver.de
        </P>

        <H2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</H2>
        <P>
          Iver Bohnes<br />
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
          Iver Bohnes<br />
          S&I. wedding<br />
          Große Freiheit 82, 22767 Hamburg<br />
          E-Mail: wedding@sarahiver.de
        </P>

        <H2>2. Überblick der Verarbeitung</H2>
        <P>
          Wir betreiben eine Plattform zur Erstellung individueller Hochzeitswebsites. Diese Erklärung gilt für die Hochzeitswebsites, die wir für unsere Kunden (Hochzeitspaare) bereitstellen, für den Verwaltungsbereich der Paare und für unsere Demo-Seiten. Für unsere eigene Website sarahiver.de gilt die dort veröffentlichte Datenschutzerklärung.
        </P>
        <P><strong>Das Wichtigste für Gäste</strong></P>
        <P>
          Die Angaben, die Sie auf dieser Hochzeitswebsite machen, werden ausschließlich zur Organisation und Durchführung der Hochzeit durch das jeweilige Hochzeitspaar verarbeitet. S&I. stellt dafür die technische Plattform bereit und nutzt diese Angaben nicht für eigene Werbe- oder Marketingzwecke.
        </P>
        <Ul>
          <li>Wir verkaufen Ihre Angaben nicht und geben sie nicht an andere Paare oder zu Werbezwecken weiter.</li>
          <li>Wir schreiben Gäste nicht mit eigener Werbung an und bilden keine Profile.</li>
          <li>Ihre Angaben werden nicht an KI-Dienste übermittelt und nicht zum Training von KI-Systemen verwendet.</li>
          <li>Auf den Hochzeitswebsites setzen wir keine Analyse- oder Tracking-Werkzeuge ein.</li>
        </Ul>

        <H2>3. Rechtsgrundlagen</H2>
        <P>Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage von:</P>
        <Ul>
          <li>Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung gegenüber unseren Kunden (Erstellung und Betrieb der Hochzeitswebsite)</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO – Berechtigtes Interesse: Planung der Feier, zu der Sie eingeladen sind (Angaben der Gäste), sowie Betrieb und Sicherheit der Plattform</li>
          <li>Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a DSGVO – Einwilligung, soweit ein Formular sie ausdrücklich abfragt, etwa bei Angaben zu Allergien und Unverträglichkeiten. Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</li>
        </Ul>
        <P>
          Alle Angaben in den Formularen der Hochzeitswebsite sind freiwillig. Ohne Namen und Zu- oder Absage kann das Paar Ihre Antwort allerdings nicht zuordnen.
        </P>

        <H2>4. Welche Daten wir verarbeiten</H2>

        <P><strong>4.1 Kundendaten (Hochzeitspaare)</strong></P>
        <Ul>
          <li>Name, E-Mail-Adresse, Anschrift, Telefonnummer</li>
          <li>Hochzeitsdatum, Veranstaltungsdetails</li>
          <li>Hochgeladene Bilder und Texte</li>
          <li>Zugangsdaten zum Verwaltungsbereich</li>
        </Ul>

        <P><strong>4.2 Gästedaten (über die Hochzeitswebsite)</strong></P>
        <P>Welche Funktionen eine Hochzeitswebsite anbietet, legt das Paar fest. Je nach Website sind das:</P>
        <Ul>
          <li>Antwort auf die Einladung (RSVP): Name, E-Mail-Adresse, Zu- oder Absage, Anzahl der Personen, Namen der Begleitpersonen, gegebenenfalls Alter mitreisender Kinder, Ernährungswünsche, Allergien und Unverträglichkeiten, Nachricht an das Paar, Antworten auf zusätzliche Fragen des Paares, gewählte Sprache und Zeitpunkt der Antwort</li>
          <li>Gästebuch: Name, Nachricht</li>
          <li>Musikwünsche: Name, Künstler, Songtitel</li>
          <li>Geschenke: Name und E-Mail-Adresse der Person, die ein Geschenk reserviert</li>
          <li>Foto-Upload: hochgeladene Bilder und, falls angegeben, Ihr Name</li>
        </Ul>
        <P>
          <strong>Gästeliste des Paares:</strong> Das Paar kann im Verwaltungsbereich eine Gästeliste mit Namen und E-Mail-Adressen anlegen, um Antworten zuzuordnen und Erinnerungen zu versenden. Diese Angaben stammen vom Paar, nicht von Ihnen selbst.
        </P>

        <P><strong>4.3 Technische Daten</strong></P>
        <Ul>
          <li>IP-Adresse (in Server-Logs des Hosting-Providers und kurzzeitig zum Schutz vor Missbrauch der Formulare)</li>
          <li>Browser-Typ, Betriebssystem</li>
          <li>Zeitpunkt des Zugriffs</li>
        </Ul>

        <H2>5. Auftragsverarbeiter und Drittdienste</H2>
        <P>Wir nutzen folgende Drittanbieter zur Erbringung unserer Dienste:</P>

        <P><strong>5.1 Vercel Inc.</strong> (Hosting)</P>
        <P>Unsere Website wird auf Servern von Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Vercel verarbeitet technische Zugriffsdaten (IP-Adressen, Zeitstempel). Über die Server von Vercel laufen auch die Formulare der Website. Datenschutzvereinbarung: vercel.com/legal/privacy-policy</P>

        <P><strong>5.2 Supabase Inc.</strong> (Datenbank)</P>
        <P>Alle Inhalts- und Gästedaten werden in einer Datenbank bei Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992, gespeichert. Die Datenbank befindet sich in der EU (Frankfurt). Datenschutzvereinbarung: supabase.com/privacy</P>

        <P><strong>5.3 Cloudinary Ltd.</strong> (Bildverwaltung)</P>
        <P>Hochgeladene Bilder (Hero-Bilder, Galerien, Gäste-Fotos) werden bei Cloudinary Ltd., 111 W. Evelyn Ave, Suite 206, Sunnyvale, CA 94086, USA gespeichert und ausgeliefert. Beim Anzeigen der Bilder erhält Cloudinary Ihre IP-Adresse. Datenschutzvereinbarung: cloudinary.com/privacy</P>

        <P><strong>5.4 Brevo (Sendinblue)</strong> (E-Mail-Versand)</P>
        <P>E-Mails versenden wir über den Dienst Brevo, Sendinblue GmbH, Köpenicker Str. 126, 10179 Berlin. Das betrifft:</P>
        <Ul>
          <li>Benachrichtigungen an das Paar über neue Antworten, Gästebucheinträge, Musikwünsche, Geschenkreservierungen und Fotos. Sie enthalten den Namen des Gastes und bei Antworten auf die Einladung die Zu- oder Absage, die Personenzahl, Ernährungswünsche und die Nachricht. Angaben zu Allergien werden nicht per E-Mail verschickt.</li>
          <li>E-Mails an Gäste im Namen des Paares, sofern das Paar sie nutzt: Bestätigung der Antwort, Erinnerungen und Hinweise, etwa zu Fotos. Dafür werden Name und E-Mail-Adresse des Gastes an Brevo übermittelt.</li>
        </Ul>
        <P>Datenschutzvereinbarung: brevo.com/legal/privacypolicy</P>

        <P><strong>5.5 Google</strong> (Schriften und Karten, je nach Design)</P>
        <P>Einige Designs laden Schriften von Google Fonts und zeigen eine eingebettete Karte von Google Maps (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Dabei erhält Google Ihre IP-Adresse. Andere Designs kommen ohne beides aus und enthalten nur Links zu Google Maps; Daten fließen dann erst, wenn Sie einen solchen Link anklicken. Im Verwaltungsbereich nutzen wir Google Maps für die Adresssuche. Datenschutzerklärung: policies.google.com/privacy</P>

        <P><strong>5.6 Anthropic</strong> (Übersetzung von Website-Texten)</P>
        <P>Bei mehrsprachigen Hochzeitswebsites können wir die Texte der Website (zum Beispiel Begrüßung, Ablauf, Hinweise zur Anreise) mit einem KI-Dienst von Anthropic PBC, USA, übersetzen lassen. Übermittelt werden nur diese Website-Texte des Paares. Angaben von Gästen werden nicht an Anthropic übermittelt.</P>

        <H2>6. Speicherdauer</H2>
        <Ul>
          <li>Hochzeitswebsite-Daten einschließlich der Angaben der Gäste: Für die Dauer des gebuchten Hosting-Zeitraums, danach innerhalb von 30 Tagen gelöscht</li>
          <li>Einzelne Einträge (Antworten, Gästebucheinträge, Musikwünsche, Reservierungen, Fotos, Einträge der Gästeliste) kann das Paar jederzeit löschen. Auf Ihren Wunsch löschen auch wir sie.</li>
          <li>Gäste-Fotos: Werden nach dem Download durch das Paar automatisch gelöscht, spätestens mit den übrigen Daten der Website</li>
          <li>Vertrags- und Rechnungsdaten unserer Kunden: nach den gesetzlichen Aufbewahrungsfristen (bis zu zehn Jahre)</li>
          <li>Server-Logs: Wir führen keine eigenen dauerhaften Protokolle. Die Protokolle des Hosting-Providers werden nach dessen Vorgaben nach kurzer Zeit gelöscht.</li>
        </Ul>

        <H2>7. Cookies, Speicher im Browser und Tracking</H2>
        <P>
          Auf den Hochzeitswebsites setzen wir <strong>keine Cookies</strong> und verwenden <strong>keine Tracking- oder Analyse-Tools</strong>. Damit die Website funktioniert, legen wir wenige Einträge im Speicher Ihres Browsers ab (Session Storage und Local Storage):
        </P>
        <Ul>
          <li>Passwortgeschützter Zugang: Merkt sich, dass Sie das Passwort der Website eingegeben haben (bis zum Schließen des Browsers)</li>
          <li>Sprachwahl: Merkt sich bei mehrsprachigen Websites die gewählte Sprache</li>
          <li>Anmeldung im Verwaltungsbereich: nur für das Paar</li>
        </Ul>
        <P>
          Diese Einträge sind für die von Ihnen gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können sie jederzeit in Ihrem Browser löschen.
        </P>
        <P>
          <strong>Demo-Seiten:</strong> Nur auf unseren eigenen Demo-Seiten, nicht auf den Websites unserer Kunden, verwenden wir Google Analytics – und nur, wenn Sie dem dort ausdrücklich zustimmen. Ihre Entscheidung speichern wir im Local Storage.
        </P>

        <H2>8. Datenübermittlung in Drittländer</H2>
        <P>
          Einige der genannten Dienstleister haben ihren Sitz außerhalb der EU oder gehören zu Unternehmen aus den USA (Vercel, Supabase, Cloudinary, Google, Anthropic). Die Datenübermittlung erfolgt auf Grundlage von EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) bzw. dem EU-US Data Privacy Framework.
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
          <li>Recht, eine Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)</li>
        </Ul>
        <P>
          Als Gast können Sie sich dafür an das Hochzeitspaar oder direkt an uns wenden: wedding@sarahiver.de. Wir kümmern uns gemeinsam mit dem Paar um Ihr Anliegen.
        </P>

        <H2>10. Beschwerderecht</H2>
        <P>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Aufsichtsbehörde ist der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Str. 22, 20459 Hamburg.
        </P>

        <H2>11. Rollen von Hochzeitspaar und S&I.</H2>
        <P>
          Das Hochzeitspaar entscheidet, welche Angaben es von seinen Gästen erfragt, und nutzt sie für seine private Feier. S&I. wedding verarbeitet diese Angaben im Auftrag des Paares (Art. 28 DSGVO) und nur für diesen Zweck. Für den sicheren Betrieb der Plattform und die Auswahl der in Abschnitt 5 genannten Dienstleister ist S&I. wedding verantwortlich.
        </P>

        <P style={{ marginTop: '2rem', color: '#666', fontSize: '0.8rem' }}>
          Stand: November 2026
        </P>

        <BackLink href="/">← Zurück zur Startseite</BackLink>
      </Container>
    </Page>
  );
}
