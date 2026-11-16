# Prüfumgebung (isoliert)

Prüft beide Apps gegen den **echten API-Code**, aber mit einer nachgebauten Datenbank im
Arbeitsspeicher. Es gibt keine Verbindung zu Supabase, Brevo oder Cloudinary: Aufrufe nach
außen werden abgefangen, E-Mails landen in einem Testpostfach. Alle Daten sind Kunstdaten.

## Start

```
# beide Repositories nebeneinander: si-wedding-themes/ und si-superadmin/
cd si-wedding-themes && npm ci && CI=false npm run build
cd ../si-superadmin && npm ci && CI=false npm run build
cd ../si-wedding-themes/qa && npm install && npx playwright install chromium
node server.js .. 4310 &                    # Gästeseite und Kundendashboard
node server.js ../../si-superadmin 4320 &   # SuperAdmin
sh run-all.sh lauf1
```

Nach Änderungen am Code: App neu bauen und den jeweiligen Server neu starten.

## Prüfungen

| Datei | Inhalt |
|---|---|
| `shots.js` + `diff.py` | Bildvergleich aller neun bestehenden Themes (Handy und Desktop) gegen die Ausgangsbasis |
| `rsvp.js` | Zusage über das Formular in allen neun Themes |
| `flows.js` | Entwurf, Passwortseite, Dashboard-Anmeldung und Speichern je Theme |
| `api-tests.js` | Mandantentrennung und Zugriffsschutz der Schnittstelle |
| `sa.js` | SuperAdmin: Anmeldung, Liste, Projektdetail, Speichern |
| `cassis.js` | Cassis-Theme: Darstellung 320–1440 px, vier Sprachen, Countdown, Kalenderdatei, RSVP mit Kindern, Passwortseite, Dashboard |
| `api-rules.js` | RSVP-Regeln auf dem Server: Grenzen, Kinderalter, Doppelantworten, gleichzeitige Anfragen, Mailfehler |
| `modules.js` | Gästebuch, Musikwünsche, Foto-Upload, Geschenke |
| `sa-features.js` | SuperAdmin: Zusatzfunktionen je Projekt und RSVP-Übersicht |

Die Tests im Ordner `src/**/__tests__` laufen mit `CI=true npx react-scripts test --watchAll=false`.

Die Kundengrafiken (Schriftzug, Fotos) liegen nicht im Repository. Liegen sie unter
`../../assets/`, nutzt `cassis-view.js` sie; sonst erscheint ein Platzhalterbild.

Ergebnisse des letzten Laufs: `results/`.
