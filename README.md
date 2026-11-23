# three.js Demo 5

In der Übersicht und in der durchlaufenden Schau ist das die Nummer 5; das Repository heißt weiter `threejs-demo-3`, damit alle Adressen gültig bleiben.

Ein flacher Schnitt 1:100 durch ein Haus auf zwei Ebenen zeichnet sich selbst, als Aquarell mit Bleistift auf Bütten. Beim Scrollen öffnet sich das Objektiv, während der Schnitt exakt seine Größe behält, sodass die Räume dahinter in eine Schnittperspektive zurückweichen. Ein Scan verwandelt die Zeichnung in Material und Licht, dann besucht die Kamera das Haus Raum für Raum, immer mit Blick auf den Schnitt, und endet beim Schnitt in Material und Licht.

[**Live ansehen**](https://seofessionals-3js.github.io/threejs-demo-3/?dir=a) · [**Startprompt**](PROMPT.md) · [**Alle Demos**](https://seofessionals-3js.github.io/threejs-demos/)

Zwei Varianten mit demselben Code: `?dir=a` öffnet das Objektiv und geht Raum für Raum durch das Haus (Standard), `?dir=c` beginnt im Obergeschoss und geht die Treppe hinunter.

## Das Haus

Casa Dos: 14 × 10 m, zwei Ebenen unter einem flachen Dach. Unten Küche mit Terrazzo-Insel, Esstisch und ein Wohnraum, der durch beide Geschosse reicht. Eine gerade Treppe unter einem Oberlicht führt hinauf zu Schlafzimmer und Arbeitsplatz an der Brüstung. Vor dem Glas liegen Terrasse, Pool und Garten.

## So funktioniert es

- **Eine Schnittebene.** Das Haus wird von einer senkrechten Ebene durch die Treppe geschnitten, und jeder Körper, den sie trifft, bekommt einen Deckel in rosa Poché. Frontal durch ein 1,6°-Objektiv aus etwa 1 km Entfernung gesehen, ist das der Schnitt.
- **Der Schnitt behält seine Größe.** Der Kameraabstand ist `Bildhöhe / tan(Objektiv / 2)`, sodass sich das Objektiv von 1,6° auf 64° öffnen kann, ohne dass sich der Ausschnitt am Schnitt ändert. Die Kamera dreht sich nie.
- **Zeichnung und Material in einem Shader.** Jeder Vertex trägt einen Blattton und eine Materialfarbe, die Zeichnung in Papier, Sepia und Rosa, das Haus in den Farben Mallorcas. `withColour()` in `engine.js` beleuchtet die Materialfarbe mit prozeduralen Texturen und mischt sie hinter der Scan-Linie ein.
- **Die Beschriftungen** (Achsblasen, Höhen, Raumnamen, Stiftlinien in Meerestürkis) werden auf einem 2D-Canvas über die Szene gezeichnet.
- Ein kleiner 3D-Übersichtsplan in der Ecke zeigt dasselbe Haus von oben und markiert, wohin die Kamera blickt.

## Farben

Das Medium ist ein Schnitt im Stil der Beaux-Arts: Aquarell und Bleistift auf warmem Bütten, die Schnittflächen als rosa Poché angelegt. Genau ein Akzent, das Meerestürkis, zeichnet die Stiftlinie des Scans, die Höhenmarken und die Links. Kein Rot.

| | Farbe | Verwendung |
|---|---|---|
| Papier | `#f3ebdb` (hell `#f9f3e7`, tief `#e9dfca`) | Blatt, Seitenhintergrund |
| Sepia | `#3b2f27`, gedämpft `#84776a` | Bleistiftlinien, Schrift |
| Poché | `#cf7d68`, tief `#b5604c` | Schnittflächen als Lasur |
| Sienna | `#a8734f` | Erdschraffur |
| Meerestürkis | `#1b7a8c`, hell `#3aa3b0`, Text `#17667a` | Scan, Stiftlinie, Links |

Nach dem Scan trägt das Haus nur, was in Deià gebaut wird: Marès-Stein `#dcc7a0`, Kalkputz `#f5f0e6`, Terrakotta `#c0694a`, Kiefer `#b88a57`, geräucherte Eiche `#6b4f3a` (Bibliothekswand), Terrazzo `#d8d0c2`, Leinen `#e6dccb`, Olivgrün `#7d8a5c`, Pinienkrone `#5f7550`, Pool `#58a6ae`, Himmel als helle Lasur `#cfe2e6`. Die Buchrücken nehmen nur Terrakotta, Olivgrün, `#d9b46a`, `#3e5c76` und Leinen. Das Licht ist weiches Tageslicht mit warmem Boden- und kühlem Himmelsanteil.

## Dateien

`index.html`, `page.js` (Scrollplan, Kamerazustände), `engine.js` (Tusche, Deckel, Farbe, Licht), `house.js` (das Haus als Schnittprofile), `entourage.js` (Figuren und Bäume), `quality.js` (Geräteklasse und Auflösung). Insgesamt etwa 140 KB.

`&skip` überspringt den Loader. `&closing` springt zum Abschlussbereich. `&p=0.4` friert die Seite bei 40 % des Wegs ein.

## Läuft auch auf dem Handy

- **Die Auflösung folgt dem Gerät.** `quality.js` teilt Geräte in drei Klassen ein und gibt jeder ein Pixelbudget statt einer festen Obergrenze. Ein Regler misst die Bildzeit und nimmt die Auflösung in kleinen Schritten zurück, wenn Bilder länger als etwa 23 ms brauchen, und vorsichtig wieder hoch, wenn Luft ist. `&q=low`, `&q=mid` oder `&q=high` erzwingt eine Klasse, `&dpr=1.5` legt die Auflösung fest und schaltet den Regler ab.
- **Ruhe kostet nichts.** Gezeichnet wird nur, wenn sich etwas ändert. Steht der Scroll, steht auch die Grafikkarte, und solange der Abschlussbereich das Bild verdeckt oder die Seite im Hintergrund liegt, wird gar nicht gezeichnet.
- **Die Seite schreibt nur, was sich ändert.** HUD, Bildunterschriften und Karten werden nicht mehr in jedem Bild neu gesetzt. Kamerazustände, Deckel und Layoutmaße werden einmal berechnet und erst bei einer neuen Fenstergröße wieder.
- **Die Beschriftung hat ihre eigene Ebene, aber nur wenn sie etwas zeigt.** Im Rundgang ist die 2D-Ebene geleert und ausgeblendet. Die Stiftlinie des Scans ist ein Element, das per Transform wandert.
- **Der Schatten wird einmal gezeichnet.** Die Schattenkamera sitzt eng um Haus und Terrasse, auf dem Handy ist die Schattenkarte 2048 statt 4096 Pixel groß und wird mit vier statt sechzehn Zugriffen gelesen.
- **Das Bild ist so hoch wie das große Sichtfenster** (`100lvh`). Wenn die Adressleiste des Handys beim Scrollen verschwindet, wird nichts neu angelegt und nichts verzerrt.
- **Die Tiefe reicht nur von der Schnittebene bis zum Himmel dahinter.** Durch das 1,6°-Objektiv aus 600 m Entfernung bleiben so auch auf dem Handy Deckel und Flächen ruhig.

## Lokal starten

Die Seiten nutzen JavaScript-Module und brauchen deshalb einen lokalen Server. Ein Doppelklick auf `index.html` funktioniert nicht.

```bash
python -m http.server 8000
```

Dann http://localhost:8000/ öffnen. Am besten auf einem Laptop mit aktuellem Browser.

## Herkunft und Lizenz

Basiert auf „Open Section“ aus [flat-to-3d](https://github.com/Sam1983Aing/flat-to-3d) von Samnang Aing, veröffentlicht unter der MIT-Lizenz, und ins Deutsche übersetzt. Das Haus ist neu entworfen, Aufbau, Animationen und Effekte folgen der Vorlage. Die Lizenz liegt unverändert in [LICENSE](LICENSE).

Alle Büros, Häuser, Adressen und Kontaktdaten in der Demo sind erfunden. three.js (MIT) wird von einem CDN geladen, die Schriften Chakra Petch und IBM Plex Mono von Google Fonts (SIL Open Font License).
