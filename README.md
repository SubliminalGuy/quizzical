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

## Audio

Die Snippets kommen aus der **iTunes Search API**: 30 Sekunden pro Track, kein
API-Key, keine Registrierung. `TrackPlayer` sucht sie beim Trackwechsel zur
Laufzeit. Die API schickt keine CORS-Header, unterstützt aber JSONP — deshalb
lädt `src/helperFunctions/fetchPreview.js` ein `<script>`-Tag statt `fetch()`.

Treffer werden gefiltert, bevor sie gespielt werden: Interpret und Titel müssen
beide passen, Karaoke- und Tribute-Fassungen fliegen raus, das Erscheinungsjahr
dient als Stichentscheid gegen späte Remixe. Findet sich nichts oder ist die API
nicht erreichbar, bleibt das Spiel voll bedienbar — der Play-Button treibt dann
nur die Animation und ein Hinweis erklärt die Lage.

Das Cover erscheint erst nach der Auflösung auf dem Plattenlabel, vorher wäre es
ein Spoiler.

### Snippets fest eintragen

Optional lassen sich die URLs einfrieren, statt sie jedes Mal zu suchen:

```bash
node scripts/fetchPreviews.js            # nur fehlende ergänzen
node scripts/fetchPreviews.js --dry-run  # nur berichten, nichts schreiben
node scripts/fetchPreviews.js --force    # alle neu suchen
```

Das Skript schreibt `previewUrl` und `artworkUrl` in
`src/data/technoTracks.json`. Ist dort eine `previewUrl` gesetzt, gewinnt sie
gegen die Laufzeitsuche.

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
    fetchPreview.js             Snippet-Suche über die iTunes Search API
  data/
    technoTracks.json           Trackbestand
scripts/
  fetchPreviews.js              Snippets optional fest in die JSON schreiben
```

## Entwicklung

```bash
npm install
npm start    # Entwicklungsserver auf http://localhost:3000
npm test     # Tests
npm run build
```

Das Projekt basiert auf [Create React App](https://github.com/facebook/create-react-app).
