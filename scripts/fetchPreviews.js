#!/usr/bin/env node
/**
 * Trägt Preview-URLs und Cover fest in die Trackdateien unter src/data/ ein
 * und meldet, für welche Tracks keine Quelle etwas hat.
 *
 * Probiert dieselben Quellen wie die App: iTunes (Song), iTunes (Album und
 * dann dessen erster Titel) und Deezer.
 *
 *   node scripts/fetchPreviews.js                      # alle Sammlungen, nur fehlende
 *   node scripts/fetchPreviews.js --file hiphopTracks  # nur eine Sammlung
 *   node scripts/fetchPreviews.js --force              # alle neu suchen
 *   node scripts/fetchPreviews.js --dry-run            # nur berichten, nichts schreiben
 *
 * Die App braucht das nicht — TrackPlayer sucht die Snippets zur Laufzeit
 * selbst. Das Skript ist für den Fall, dass die Treffer geprüft, korrigiert
 * und dann eingefroren werden sollen. Läuft ab Node 18 (globales fetch).
 */

const fs = require("fs")
const path = require("path")

const DATA_DIR = path.join(__dirname, "..", "src", "data")
const DEEZER_URL = "https://api.deezer.com"
const SEARCH_URL = "https://itunes.apple.com/search"
const PAUSE_MS = 350   // iTunes drosselt bei etwa 20 Anfragen pro Minute

const BAD_WORDS = [
  "karaoke", "tribute", "cover version", "in the style of",
  "made famous by", "made popular by", "originally performed"
]

const force = process.argv.includes("--force")
const dryRun = process.argv.includes("--dry-run")

/** Welche Trackdateien bearbeitet werden — ohne --file alle. */
function dataFiles() {
  const flagIndex = process.argv.indexOf("--file")
  if (flagIndex !== -1 && process.argv[flagIndex + 1]) {
    const name = process.argv[flagIndex + 1].replace(/\.json$/, "")
    return [path.join(DATA_DIR, `${name}.json`)]
  }
  return fs.readdirSync(DATA_DIR)
    .filter(name => name.endsWith("Tracks.json"))
    .map(name => path.join(DATA_DIR, name))
}

function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function scoreCandidate(candidate, track) {
  if (!candidate.previewUrl) return -1

  const foundArtist = normalize(candidate.artistName || "")
  const foundTitle = normalize(candidate.trackName || "")
  const wantArtist = normalize(track.artist)
  const wantTitle = normalize(track.title)

  if (BAD_WORDS.some(w => foundTitle.includes(w) || foundArtist.includes(w))) return -1

  let score = 0
  if (foundArtist === wantArtist) score += 4
  else if (foundArtist.includes(wantArtist) || wantArtist.includes(foundArtist)) score += 2
  else return -1

  if (foundTitle === wantTitle) score += 4
  else if (foundTitle.startsWith(wantTitle)) score += 3
  else if (foundTitle.includes(wantTitle)) score += 2
  else return -1

  const releaseYear = Number((candidate.releaseDate || "").slice(0, 4))
  if (releaseYear) score += Math.max(0, 3 - Math.abs(releaseYear - track.year) / 4)

  return score
}

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

function pickBest(candidates, track) {
  let best = null
  let bestScore = 0

  for (const candidate of candidates) {
    const score = scoreCandidate(candidate, track)
    if (score > bestScore) {
      best = candidate
      bestScore = score
    }
  }
  return best
}

/** 1. iTunes, Suche nach dem Song. */
async function itunesSong(track) {
  const term = encodeURIComponent(`${track.artist} ${track.title}`)
  const data = await getJson(`${SEARCH_URL}?term=${term}&entity=song&limit=25`)
  const match = pickBest(data.results || [], track)
  return match ? { ...match, source: "iTunes" } : null
}

/** 2. iTunes, Suche nach dem Album und dann dessen erster Titel. */
async function itunesAlbum(track) {
  const term = encodeURIComponent(`${track.artist} ${track.title}`)
  const found = await getJson(`${SEARCH_URL}?term=${term}&entity=album&limit=10`)

  const wantArtist = normalize(track.artist)
  const wantTitle = normalize(track.title)
  const album = (found.results || []).find(item => {
    const foundArtist = normalize(item.artistName)
    const foundTitle = normalize(item.collectionName)
    const artistFits = foundArtist === wantArtist ||
      foundArtist.includes(wantArtist) || wantArtist.includes(foundArtist)
    return artistFits && (foundTitle === wantTitle || foundTitle.startsWith(wantTitle))
  })
  if (!album) return null

  await sleep(PAUSE_MS)
  const tracks = await getJson(`${SEARCH_URL.replace("/search", "/lookup")}?id=${album.collectionId}&entity=song&limit=40`)
  const first = (tracks.results || []).find(item => item.wrapperType === "track" && item.previewUrl)
  if (!first) return null

  return { ...first, source: "iTunes (Album)" }
}

/** 3. Deezer — anderer Katalog, trifft oft dort, wo Apple nichts hat. */
async function deezerSong(track) {
  const query = encodeURIComponent(`artist:"${track.artist}" track:"${track.title}"`)
  const data = await getJson(`${DEEZER_URL}/search?q=${query}&limit=25`)
  const candidates = (data.data || []).map(item => ({
    artistName: item.artist ? item.artist.name : "",
    trackName: item.title_short || item.title,
    previewUrl: item.preview || null,
    artworkUrl100: (item.album && (item.album.cover_medium || item.album.cover)) || null,
    releaseDate: item.release_date || ""
  }))
  const match = pickBest(candidates, track)
  return match ? { ...match, source: "Deezer" } : null
}

const SOURCES = [itunesSong, itunesAlbum, deezerSong]

async function lookup(track) {
  for (const source of SOURCES) {
    const match = await source(track)
    await sleep(PAUSE_MS)
    if (match) return match
  }
  return null
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function processFile(dataPath) {
  const tracks = JSON.parse(fs.readFileSync(dataPath, "utf8"))
  let found = 0
  let missing = 0
  const open = []

  console.log(`\n── ${path.basename(dataPath)} (${tracks.length} Tracks) ──`)

  for (const track of tracks) {
    if ((track.previewUrl || track.soundcloudUrl) && !force) continue

    let match = null
    try {
      match = await lookup(track)
    } catch (error) {
      console.error(`✗ ${track.artist} — ${track.title}: ${error.message}`)
      missing++
      open.push(`${track.artist} — ${track.title}`)
      continue
    }

    if (match) {
      track.previewUrl = match.previewUrl
      track.artworkUrl = (match.artworkUrl100 || "").replace(/\/\d+x\d+bb\./, "/300x300bb.")
      found++
      const foundYear = (match.releaseDate || "").slice(0, 4)
      const yearFlag = foundYear && Number(foundYear) !== track.year ? `  (Katalog: ${foundYear})` : ""
      console.log(`✓ [${match.source}] ${track.artist} — ${match.trackName}${yearFlag}`)
    } else {
      missing++
      open.push(`${track.artist} — ${track.title}`)
      console.log(`· ${track.artist} — ${track.title}: kein Treffer`)
    }
  }

  const quota = tracks.length ? Math.round((tracks.length - missing) / tracks.length * 100) : 0
  console.log(`${found} neu gefunden, ${missing} ohne Snippet — Abdeckung ${quota}%.`)

  if (open.length) {
    console.log(`\nOhne Snippet — hier hilft nur eine feste URL in der Trackdatei`)
    console.log(`("previewUrl" für eine Audiodatei, "soundcloudUrl" für SoundCloud):`)
    open.forEach(name => console.log(`  ${name}`))
  }

  if (dryRun) {
    console.log("--dry-run: nichts geschrieben.")
    return
  }
  if (found > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(tracks, null, 2) + "\n")
    console.log(`${path.relative(process.cwd(), dataPath)} aktualisiert.`)
  }
}

async function main() {
  const files = dataFiles()
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`✗ ${file} gibt es nicht.`)
      process.exitCode = 1
      continue
    }
    await processFile(file)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
