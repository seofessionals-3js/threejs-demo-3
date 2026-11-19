# Startprompt · three.js Demo 3

Der Prompt, mit dem ich anfangen würde, um diese Demo nachzubauen. Er liefert nicht genau diese Seite, sondern eine erste Version der Idee. Danach beginnt die eigentliche Arbeit.

Ersetzen Sie die Teile in `[eckigen Klammern]` durch Ihr eigenes Thema.

```text
Ich möchte eine scrollgesteuerte Landingpage bauen für [ein Architekturbüro, ein Haus am Hang,
Ihr Thema].

Die Idee: Die Seite öffnet mit einem flachen Schnitt 1:100. Wände und Decken massiv schwarz
geschnitten, schraffiertes Erdreich, Achsblasen, Höhenkoten, Raumnamen, kleine Figuren und
Bäume. Nichts wirkt dreidimensional. Beim Laden fahren Stiftlinien in Bernstein von links nach
rechts, und der Schnitt plottet sich selbst.

Der Scrollablauf, der Reihe nach:
1. Das Objektiv öffnet sich. Die Räume hinter dem Schnitt weichen in die Tiefe zurück, während
   der Schnitt auf dem Bildschirm exakt seine Größe behält. Aus dem flachen Schnitt wird eine
   Schnittperspektive.
2. Eine Scan-Linie in Bernstein fährt durch das Haus und verwandelt die Tusche in Material,
   Sonnenlicht und Schatten.
3. Die Kamera besucht das Haus Ebene für Ebene auf Augenhöhe, immer mit Blick auf den Schnitt:
   [die Treppe, die Küche, das Schlafzimmer, den Wohnraum, den Pool], mit einer Karte für jede
   Station.
4. Sie fährt zurück zum flachen Schnitt, jetzt in Farbe.
5. Ein Abschlussbereich auf Papier: das Büro, die Fakten zum Haus, [drei weitere Häuser] als
   kleine Schnitte und [Projekt starten].

Worauf es mir ankommt:
- Der Schnitt ist kein Bild. Er ist das echte 3D-Modell, geschnitten von einer einzigen
  Schnittebene, mit einem schwarzen Deckel auf jedem Körper, den die Ebene trifft, frontal
  gesehen durch ein 1,6-Grad-Objektiv aus etwa 1 km Entfernung.
- Beim Öffnen des Objektivs fährt die Kamera so heran, dass der Ausschnitt am Schnitt seine
  Größe nie ändert: Abstand = Bildhöhe / tan(Objektiv / 2). Die Kamera kreist nie.
- Gib der Tiefe etwas zu zeigen: [drei Ebenen am Hang, eine Treppe, ein Innenhof hinter dem
  Schnitt], echte Möbel.
- Der Look: ein CAD-Bildschirm. Papier #f2efe7, Tusche #1d1c19, ein Bernstein-Akzent #e85d04,
  Chakra Petch für Überschriften, IBM Plex Mono für Beschriftungen. Passermarken in den Ecken,
  ein Schriftfeld, eine Maßstabsleiste, eine Live-Anzeige des Objektivwinkels und ein kleiner
  3D-Übersichtsplan, der zeigt, wo die Kamera ist.
- three.js 0.160 von einem CDN, einfache Dateien, kein Build-Schritt. Keine Bilddateien, jede
  Textur wird im Code gezeichnet.

Bevor du Code schreibst, schlage das Haus im Schnitt mit Maßen vor, die ich mir vorstellen
kann, und die Kamerastationen der Reihe nach, und warte auf meine Antwort. Dann baue in
Etappen. Nur die erste Etappe: der Loader, das Plotten des Schnitts, das Öffnen des Objektivs
und der Farb-Scan. Nimm es auf und zeig es mir, bevor du weitermachst.
```

Der letzte Absatz ist genauso wichtig wie die Idee. Ohne ihn bekommen Sie eine fertige Seite, die Sie nicht selbst ausgewählt haben.
