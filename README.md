# Ravehister — 90er Techno & Elektro Ratespiel

Ein Musik-Ratespiel nach Hitster-Vorbild: Track anhören, die **Gruppe** tippen und
das **Erscheinungsjahr** auf dem Zeitstrahl von 1990 bis 1999 setzen.

## Spielablauf

1. Ein Track aus dem Bestand wird gezogen (Titel und Interpret bleiben verdeckt).
2. **Schritt 1 — Gruppe:** vier Antwortmöglichkeiten, Fehlvorschläge kommen
   bevorzugt aus demselben Genre. Treffer: **+2 Punkte**.
3. **Schritt 2 — Jahr:** ein Zeitstrahl mit den Jahren '90 bis '99.
   Punktlandung: **+3 Punkte**, ein Jahr daneben: **+1 Punkt**.
4. Auflösung mit Punkteverteilung, danach der nächste Track.
5. Nach 5 Tracks folgt der Endstand mit DJ-Rang und Trackliste (max. 25 Punkte).

## Stand der Umsetzung

Die Oberfläche und die komplette Spielmechanik stehen. Die Audio-Wiedergabe ist
vorbereitet, aber noch nicht mit Inhalten belegt:

- `src/data/technoTracks.json` enthält 50 Tracks mit Titel, Interpret, Jahr und Genre.
  Das Feld `previewUrl` ist überall `null`.
- Sobald dort eine Audio-URL eingetragen wird, spielt `TrackPlayer` sie über ein
  `<audio>`-Element ab; ohne URL steuert der Play-Button nur die Animation.

## Aufbau

```
src/
  App.js                        Zustandsmaschine: start → game → results
  components/
    Start.js                    Startbildschirm mit Regeln
    TrackPlayer.js              Plattenteller, Equalizer, Play/Pause
    ArtistChoice.js             Schritt 1: Gruppe raten
    YearTimeline.js             Schritt 2: Jahr auf dem Zeitstrahl
    RoundReveal.js              Auflösung einer Runde
    Results.js                  Endstand mit Rang und Trackliste
  helperFunctions/
    buildRounds.js              Runden bauen, Antwortoptionen, Punktevergabe
  data/
    technoTracks.json           Trackbestand
```

## Entwicklung

```bash
npm install
npm start    # Entwicklungsserver auf http://localhost:3000
npm test     # Tests
npm run build
```

Das Projekt basiert auf [Create React App](https://github.com/facebook/create-react-app).
