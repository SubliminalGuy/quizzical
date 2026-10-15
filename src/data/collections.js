import technoTracks from "./technoTracks.json"
import hiphopTracks from "./hiphopTracks.json"
import popRockTracks from "./popRockTracks.json"
import clubBassTracks from "./clubBassTracks.json"
import bassBootyTracks from "./bassBootyTracks.json"
import whiteGirlTracks from "./whiteGirlTracks.json"

/**
 * Jede Sammlung bringt ihren eigenen Zeitraum, ihr eigenes Thema und ihre
 * eigenen Ränge mit. Die Punkteregeln sind für alle gleich — sie stehen in
 * helperFunctions/buildRounds.js.
 */
const collections = [
  {
    id: "popRock80s",
    theme: "eighties",
    label: "80er Pop & Rock",
    era: "1980 – 1989",
    tagline: "Das MTV-Jahrzehnt zwischen New Wave und Stadionrock",
    examples: "a-ha, Queen, Madonna, Bon Jovi",
    player: "tv",
    startLabel: "Fernseher an",
    firstYear: 1980,
    lastYear: 1989,
    tracks: popRockTracks,
    ranks: [
      { min: 1,   emoji: "📺", title: "MTV-Legende",           text: "Alles richtig. Du kennst die Videos auswendig." },
      { min: 0.8, emoji: "🎸", title: "Stadion-Headliner",     text: "Fast lupenrein — da sitzt jede Hook." },
      { min: 0.6, emoji: "🕶️", title: "Walkman-Veteran",       text: "Solide Seite A. Da geht noch was." },
      { min: 0.4, emoji: "📻", title: "Radiohörer",            text: "Zeit für eine Runde Klassiker." },
      { min: 0,   emoji: "🎵", title: "Frischling im Jahrzehnt", text: "Kopfhörer auf und nochmal von vorn." }
    ]
  },
  {
    id: "techno90s",
    theme: "techno",
    label: "Techno & Elektro",
    era: "1990 – 1999",
    tagline: "Rave, Trance und Eurodance aus den Neunzigern",
    examples: "Snap!, The Prodigy, Daft Punk, Scooter",
    player: "vinyl",
    startLabel: "Auflegen",
    firstYear: 1990,
    lastYear: 1999,
    tracks: technoTracks,
    ranks: [
      { min: 1,    emoji: "🏆", title: "Loveparade-Legende",       text: "Alles richtig. Du warst dabei, oder?" },
      { min: 0.8,  emoji: "🔥", title: "Resident DJ",              text: "Fast lupenrein — das Vinyl sitzt." },
      { min: 0.6,  emoji: "😎", title: "Stammgast im Club",        text: "Solide Nacht. Da geht noch was." },
      { min: 0.4,  emoji: "🤔", title: "Gelegenheitsraver",        text: "Die Neunziger rufen nach einem zweiten Set." },
      { min: 0,    emoji: "💪", title: "Frisch von der Tanzfläche", text: "Kopfhörer auf und nochmal von vorn." }
    ]
  },
  {
    id: "hiphopOldschool",
    theme: "hiphop",
    label: "Oldschool HipHop",
    era: "1979 – 1996",
    tagline: "Von der Sugarhill Gang bis zur Golden Era",
    examples: "Run-DMC, Public Enemy, Nas, Wu-Tang Clan",
    player: "cassette",
    startLabel: "Tape einlegen",
    firstYear: 1979,
    lastYear: 1996,
    tracks: hiphopTracks,
    ranks: [
      { min: 1,    emoji: "👑", title: "Golden-Age-Legende",     text: "Lupenrein. Du hast die Tapes noch selbst gedreht." },
      { min: 0.8,  emoji: "🎤", title: "Headliner",              text: "Dickes Ding — da sitzt jeder Beat." },
      { min: 0.6,  emoji: "📼", title: "Crate Digger",           text: "Solide Kiste. Ein paar Platten fehlen noch." },
      { min: 0.4,  emoji: "🧢", title: "Gelegenheitshörer",      text: "Zeit für eine Runde Klassiker." },
      { min: 0,    emoji: "🎧", title: "Frischling am Regal",    text: "Kopfhörer auf und nochmal von vorn." }
    ]
  },
  {
    id: "bassBooty",
    theme: "booty",
    label: "Bass & Booty",
    era: "1985 – 2009",
    tagline: "Miami Bass, Ghetto House, Ghettotech und Baltimore Club",
    examples: "2 Live Crew, DJ Assault, DJ Deeon, Rod Lee",
    player: "speaker",
    startLabel: "Bass aufdrehen",
    firstYear: 1985,
    lastYear: 2009,
    tracks: bassBootyTracks,
    ranks: [
      { min: 1,    emoji: "🔊", title: "Subwoofer-Legende",  text: "Alles richtig. Der Kofferraum wackelt." },
      { min: 0.8,  emoji: "📢", title: "Soundsystem-Chef",   text: "Fast lupenrein. Da sitzt jeder Drop." },
      { min: 0.6,  emoji: "💿", title: "Maxi-Sammler",       text: "Solide Runde. Ein paar 12-Inches fehlen." },
      { min: 0.4,  emoji: "🚗", title: "Autoradio-Hörer",    text: "Du kennst die Hits, nicht die B-Seiten." },
      { min: 0,    emoji: "🪩", title: "Noch an der Bar",    text: "Kopfhörer auf und nochmal von vorn." }
    ]
  },
  {
    id: "clubBass2010s",
    theme: "club",
    label: "Club & Bass",
    era: "2010 – 2026",
    tagline: "Jersey Club, Ghettotech und Miami Bass der Gegenwart",
    examples: "DJ Sliink, Jlin, DJ Godfather, INVT",
    player: "phone",
    startLabel: "Antippen",
    firstYear: 2010,
    lastYear: 2026,
    tracks: clubBassTracks,
    ranks: [
      { min: 1,    emoji: "📱", title: "Algorithmus-Flüsterer", text: "Alles richtig. Du warst vor dem Hype da." },
      { min: 0.8,  emoji: "🔊", title: "Club-Resident",         text: "Fast lupenrein — der Bass sitzt." },
      { min: 0.6,  emoji: "🎛️", title: "Szenekenner",           text: "Solide Runde. Ein paar Edits fehlen noch." },
      { min: 0.4,  emoji: "📲", title: "Charts-Hörer",          text: "Du kennst die Hits, nicht die Deepcuts." },
      { min: 0,    emoji: "🚪", title: "Noch im Vorraum",       text: "Kopfhörer auf und nochmal von vorn." }
    ]
  },
  {
    id: "whiteGirlMusic",
    theme: "wgm",
    label: "White Girl Music",
    era: "2000 – 2026",
    tagline: "Von Mitgröl-Pop bis Sad Girl — die Playlist, die alle mitsingen",
    examples: "Taylor Swift, Katy Perry, Lana Del Rey, Olivia Rodrigo",
    player: "headphones",
    startLabel: "Mitsingen",
    firstYear: 2000,
    lastYear: 2026,
    tracks: whiteGirlTracks,
    ranks: [
      { min: 1,    emoji: "👑", title: "Playlist-Königin",     text: "Alles richtig. Jede Zeile sitzt." },
      { min: 0.8,  emoji: "🎀", title: "Erste Reihe",          text: "Fast lupenrein. Du kennst auch die Bridge." },
      { min: 0.6,  emoji: "✨", title: "Mitsing-Garantie",     text: "Solide Runde. Beim Refrain warst du da." },
      { min: 0.4,  emoji: "🌸", title: "Radio-Bekanntschaft",  text: "Die Hits ja, die Deepcuts nicht." },
      { min: 0,    emoji: "🫧", title: "Noch beim Einsingen",  text: "Kopfhörer auf und nochmal von vorn." }
    ]
  }
]

export function getRank(collection, score, maxScore) {
  const pct = maxScore > 0 ? score / maxScore : 0
  return collection.ranks.find(rank => pct >= rank.min) || collection.ranks[collection.ranks.length - 1]
}

export default collections
