# Hitify — Musik-Ratespiel

Ein Spiel nach Hitster-Vorbild: Track anhören, die **Gruppe** tippen und das
**Erscheinungsjahr** auf dem Zeitstrahl setzen. Die Musikrichtung wird auf der
Startseite gewählt und färbt das ganze Spiel ein.

## Sammlungen

| Richtung | Zeitraum | Tracks | Tonträger |
|---|---|---|---|
| 80er Pop & Rock | 1980 – 1989 | 80 | Fernseher |
| Techno & Elektro | 1990 – 1999 | 50 | Schallplatte |
| Oldschool HipHop | 1979 – 1996 | 64 | Kassette |
| Bass & Booty | 1985 – 2009 | 34 | Bassbox |
| Club & Bass | 2010 – 2026 | 35 | Telefon |

Jede Sammlung bringt ihren eigenen Zeitraum, ihr eigenes Farbthema und ihre
eigenen Ränge mit. Die Punkteregeln gelten für alle gleich.

### Zu Bass & Booty und Club & Bass

Die beiden Bass-Sammlungen teilen sich dieselbe Familie, aber zwei Epochen:

- **Bass & Booty (1985–2009)** hat den Kanon: Miami Bass von MC A.D.E. und
  2 Live Crew über die Chart-Jahre bis Ying Yang Twins, dazu Chicagos Ghetto
  House, Detroits Ghettotech, Baltimore Club, frühes Juke und die Anfänge von
  Jersey Club.
- **Club & Bass (2010–2026)** hat die Gegenwart: Jersey Club von Nadus und
  UNIIQU3 bis Lil Uzi Vert und Cash Cobain, dazu Footwork, DJ Godfathers
  Databass-Reihe und die heutige Miami-Szene um Nick León und INVT.

Beide sind kleiner als die Pop-Sammlungen, und das hat einen Grund: Große Teile
dieser Szene erscheinen ohne belastbares Erscheinungsdatum — früher auf
White-Label-Zwölfzollern, heute auf SoundCloud. Aufgenommen ist nur, was sich
datieren lässt: Label-Veröffentlichungen, Alben und Chart-Singles. DJ-Edits
ohne Datum bleiben draußen, weil ein Ratespiel über Jahreszahlen mit
geschätzten Jahren wertlos wäre.

Einzelne Jahre bleiben deshalb leer — sie stehen auf dem Zeitstrahl, sind aber
nie die richtige Antwort: 1991, 1995, 2002 und 2008 bei Bass & Booty, 2010 bei
Club & Bass.

## Spielablauf

Fünf Tracks pro Runde, maximal 25 Punkte.

1. Ein Track wird gezogen, Titel und Interpret bleiben verdeckt.
2. **Schritt 1 — Gruppe:** vier Antwortmöglichkeiten, Fehlvorschläge kommen
   bevorzugt aus demselben Genre. Treffer: **+2 Punkte**.
3. **Schritt 2 — Jahr:** der Zeitstrahl der Sammlung. Punktlandung: **+3**,
   ein Jahr daneben: **+1**. Zeiträume über zehn Jahre bricht der Zeitstrahl auf
   mehrere Zeilen um — alle Zeilen teilen sich dasselbe Raster, damit die Jahre
   untereinander stehen.
4. Auflösung mit Punkteverteilung, danach der nächste Track.
5. Endstand mit Rang und Trackliste — weiterspielen oder Richtung wechseln.

## Audio

`TrackPlayer` sucht beim Trackwechsel ein 30-Sekunden-Snippet und probiert
dafür mehrere Quellen der Reihe nach durch. Keine davon braucht einen API-Key:

1. **Fest eingetragene `previewUrl`** aus der Trackdatei.
2. **iTunes, Suche nach dem Song.**
3. **iTunes, Suche nach dem Album** und dann dessen erster Titel. Das deckt
   Einträge ab, die eine EP oder ein Album sind — davon haben die beiden
   Bass-Sammlungen viele, und eine Songsuche findet dafür nichts.
4. **Deezer, Suche nach dem Song.** Anderer Katalog, trifft öfter bei
   Clubmusik, die bei Apple fehlt.
5. **Fest eingetragene `soundcloudUrl`** — spielt über das SoundCloud-Widget.

Weder iTunes noch Deezer schicken CORS-Header, beide können aber JSONP, deshalb
lädt `src/helperFunctions/fetchPreview.js` ein `<script>`-Tag statt `fetch()` zu
benutzen. Eine Quelle, die nicht antwortet, beendet die Suche nicht — die
nächste bekommt ihre Chance. Erst wenn jede abfragende Quelle scheitert, meldet
die Oberfläche ein Netzproblem statt „kein Snippet".

Treffer werden gefiltert, bevor sie gespielt werden: Interpret und Titel müssen
beide passen, Karaoke- und Tribute-Fassungen fliegen raus, das Erscheinungsjahr
dient als Stichentscheid gegen späte Remixe. Findet keine Quelle etwas, bleibt
das Spiel voll bedienbar — der Play-Button treibt dann nur die Animation und ein
Hinweis erklärt die Lage. Unter dem Player steht, welche Quelle geliefert hat.

### SoundCloud als letzte Rettung

Viel Clubmusik liegt nur auf SoundCloud. Dafür nimmt ein Track das Feld
`soundcloudUrl`:

```json
{ "title": "Nxwxrk", "artist": "Nadus", "year": 2014,
  "soundcloudUrl": "https://soundcloud.com/nadus/nxwxrk" }
```

Zwei Dinge dazu:

- **Die URL muss von Hand eingetragen werden.** SoundCloud hat keine Suche
  ohne API-Key, und neue Keys vergibt die Plattform seit Jahren nicht.
- **Das Widget steckt in einem iframe, der unsichtbar im Layout steht.** Er muss
  gelegt sein, damit überhaupt Ton kommt; sichtbar wäre er ein Spoiler, weil
  SoundCloud darin Titel und Interpret anzeigt. Ob das mit den Widget-Bedingungen
  von SoundCloud vereinbar ist, ist nicht abschließend geklärt — deshalb ist es
  die letzte Stufe der Kette und gilt nur für Tracks, bei denen jemand bewusst
  eine URL einträgt.

Das Cover erscheint erst nach der Auflösung auf Plattenlabel, Kassette oder
Bildschirm, vorher wäre es ein Spoiler.

### Snippets fest eintragen

```bash
node scripts/fetchPreviews.js            # nur fehlende ergänzen
node scripts/fetchPreviews.js --dry-run  # nur berichten, nichts schreiben
node scripts/fetchPreviews.js --force    # alle neu suchen
```

Das Skript probiert dieselben Quellen wie die App (iTunes Song, iTunes Album,
Deezer) und schreibt `previewUrl` und `artworkUrl` in die Trackdateien; eine
dort eingetragene URL gewinnt gegen die Laufzeitsuche. Mit `--file` lässt sich
eine einzelne Sammlung bearbeiten.

Am Ende meldet es die Abdeckung und listet jeden Track, für den keine Quelle
etwas hatte — das sind genau die, die eine `soundcloudUrl` von Hand brauchen:

```
28 neu gefunden, 6 ohne Snippet — Abdeckung 82%.

Ohne Snippet — hier hilft nur eine feste URL in der Trackdatei
("previewUrl" für eine Audiodatei, "soundcloudUrl" für SoundCloud):
  DJ Clent — Back Up Off Me
  Brick Bandits — The Brick Bandits EP
```

## Eine Musikrichtung ergänzen

1. Trackdatei unter `src/data/` anlegen — je Eintrag `title`, `artist`, `year`,
   `genre` und `previewUrl: null`.
2. In `src/data/collections.js` einen Eintrag ergänzen: Zeitraum (`firstYear`,
   `lastYear`), `theme`, `player` (`vinyl`, `cassette`, `tv`, `phone` oder
   `speaker`), Texte und Ränge.
3. Für ein eigenes Farbthema einen Block `body[data-theme="…"]` in `App.css`
   anlegen. Die Variablen dort sind semantisch benannt (`--accent`, `--good`,
   `--bad`, `--radius-lg` …), der Rest des Stylesheets braucht keine Änderung.

Der Test `src/data/collections.test.js` prüft neue Sammlungen mit: alle Jahre
müssen im Zeitraum liegen, Pflichtfelder vorhanden und Tracks eindeutig sein.

## Aufbau

```
src/
  App.js                        Zustandsmaschine: start → game → results
  components/
    Start.js                    Startseite mit Richtungswahl
    MediaVisual.js              Platte, Kassette, Fernseher, Telefon, Bassbox
    TrackPlayer.js              Abspieler, Equalizer, Play/Pause
    ArtistChoice.js             Schritt 1: Gruppe raten
    YearTimeline.js             Schritt 2: Jahr auf dem Zeitstrahl
    RoundReveal.js              Auflösung einer Runde
    Results.js                  Endstand mit Rang und Trackliste
  helperFunctions/
    buildRounds.js              Runden bauen, Antwortoptionen, Punktevergabe
    fetchPreview.js             Snippet-Suche über die iTunes Search API
  data/
    collections.js              Sammlungen, Themen, Ränge
    bassBootyTracks.json        Trackbestand Bass & Booty
    clubBassTracks.json         Trackbestand Club & Bass
    popRockTracks.json          Trackbestand 80er Pop & Rock
    technoTracks.json           Trackbestand Techno
    hiphopTracks.json           Trackbestand HipHop
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

Welche Tracks kein Snippet finden, zeigt ein Lauf ohne Schreibzugriff:

```bash
node scripts/fetchPreviews.js --dry-run              # alle Sammlungen
node scripts/fetchPreviews.js --dry-run --file clubBassTracks   # eine davon
```

Er meldet je Sammlung die Abdeckung und listet die Tracks, die eine URL von
Hand brauchen — Einzelheiten unter [Snippets fest eintragen](#snippets-fest-eintragen).

Das Projekt basiert auf [Create React App](https://github.com/facebook/create-react-app).
