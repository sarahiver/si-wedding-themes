# Schriften der Designs

Alle Schriften der Hochzeitsdesigns werden von hier ausgeliefert. Beim Aufruf einer Hochzeitswebsite
geht keine Anfrage an Google Fonts.

- `files/` – Schriftdateien (woff2), je Familie, Stil und Zeichensatz
- `licenses/` – Lizenztext je Familie (alle SIL Open Font License 1.1, lokale Einbindung erlaubt)
- `fontData.js` – erzeugte Tabelle: Datei und Unicode-Bereich je Zeichensatz
- `index.js` – `fontFaces(familie, gewichte, kursiveGewichte)` erzeugt die `@font-face`-Regeln

Cassis bringt seine beiden Schriften weiterhin im eigenen Ordner mit (`src/themes/cassis/fonts`).

## Herkunft

Die Dateien stammen unverändert aus den Fontsource-Paketen (`@fontsource-variable/<familie>`,
für Lato, Great Vibes und Mrs Saint Delafield `@fontsource/<familie>`), Version 5.3.x. Fontsource
verteilt die Dateien von Google Fonts. Wo es die Familie als variable Schrift gibt, liegt je Stil und
Zeichensatz eine Datei vor, die alle Gewichte abdeckt.

## Wo welche Schrift eingebunden ist

- Gemeinsame Schriften aller Designs außer Cassis: `src/lib/sharedFonts.js`
- Schriften eines einzelnen Designs: `GlobalStyles.js` des Designs
- Schriftzug der Startseite: `src/App.js`

## Eine Schrift oder einen Schnitt ergänzen

1. Liegt die Familie schon in `fontData.js`: Gewicht in der Liste des Designs ergänzen – fertig.
2. Neue Familie: Dateien `*-wght-normal.woff2` (und `*-wght-italic.woff2`) aus dem Fontsource-Paket
   nach `files/` legen, Lizenz nach `licenses/`, Eintrag in `fontData.js` nach dem Muster der
   vorhandenen ergänzen (Unicode-Bereiche stehen in der `wght.css` des Pakets).
3. Der Test `src/fonts/__tests__/fonts.test.js` prüft, dass jede eingebundene Schrift vorliegt.
