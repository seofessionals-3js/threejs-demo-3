# three.js Demo 3

Ein flacher Schnitt 1:100 durch ein Haus auf drei Ebenen plottet sich selbst. Beim Scrollen öffnet sich das Objektiv, während der Schnitt exakt seine Größe behält, sodass die Räume dahinter in eine Schnittperspektive zurückweichen. Ein Scan verwandelt die Tusche in Material und Sonnenlicht, dann besucht die Kamera das Haus Ebene für Ebene, immer mit Blick auf den Schnitt, und endet beim farbigen Schnitt.

[**Live ansehen**](https://seofessionals-3js.github.io/threejs-demo-3/?dir=a) · [**Startprompt**](PROMPT.md) · [**Alle Demos**](https://seofessionals-3js.github.io/threejs-demos/)

Zwei Varianten mit demselben Code: `?dir=a` öffnet das Objektiv und geht Raum für Raum durch das Haus (Standard), `?dir=c` taucht in die Küche ein und geht die Treppe hinunter.

## So funktioniert es

- **Eine Schnittebene.** Das Haus wird von einer senkrechten Ebene durch die Treppe geschnitten, und jeder Körper, den sie trifft, bekommt einen schwarzen Deckel. Frontal durch ein 1,6°-Objektiv aus etwa 1 km Entfernung gesehen, ist das der Schnitt.
- **Der Schnitt behält seine Größe.** Der Kameraabstand ist `Bildhöhe / tan(Objektiv / 2)`, sodass sich das Objektiv von 1,6° auf 64° öffnen kann, ohne dass sich der Ausschnitt am Schnitt ändert. Die Kamera dreht sich nie.
- **Tusche und Farbe in einem Shader.** Jeder Vertex trägt einen Papierton und eine Materialfarbe. `withColour()` in `engine.js` beleuchtet die Materialfarbe mit prozeduralen Texturen und mischt sie hinter der Scan-Linie ein.
- **Die Beschriftungen** (Achsblasen, Höhen, Raumnamen, Stiftlinien) werden auf einem 2D-Canvas über die Szene gezeichnet.
- Ein kleiner 3D-Übersichtsplan in der Ecke zeigt dasselbe Haus von oben und markiert, wohin die Kamera blickt.

## Dateien

`index.html`, `page.js` (Scrollplan, Kamerazustände), `engine.js` (Tusche, Deckel, Farbe, Licht), `house.js` (das Haus als Schnittprofile), `entourage.js` (Figuren und Bäume). Insgesamt etwa 130 KB.

`&skip` überspringt den Loader. `&closing` springt zum Abschlussbereich.

## Lokal starten

Die Seiten nutzen JavaScript-Module und brauchen deshalb einen lokalen Server. Ein Doppelklick auf `index.html` funktioniert nicht.

```bash
python -m http.server 8000
```

Dann http://localhost:8000/ öffnen. Am besten auf einem Laptop mit aktuellem Browser.

## Herkunft und Lizenz

Basiert auf „Open Section“ aus [flat-to-3d](https://github.com/Sam1983Aing/flat-to-3d) von Samnang Aing, veröffentlicht unter der MIT-Lizenz, und ins Deutsche übersetzt. Die Lizenz liegt unverändert in [LICENSE](LICENSE).

Alle Büros, Häuser, Adressen und Kontaktdaten in der Demo sind erfunden. three.js (MIT) wird von einem CDN geladen, die Schriften Chakra Petch und IBM Plex Mono von Google Fonts (SIL Open Font License).
