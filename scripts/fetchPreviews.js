#!/usr/bin/env node
/**
 * Trägt Preview-URLs und Cover aus der iTunes Search API fest in
 * src/data/technoTracks.json ein.
 *
 *   node scripts/fetchPreviews.js            # nur fehlende ergänzen
 *   node scripts/fetchPreviews.js --force    # alle neu suchen
 *   node scripts/fetchPreviews.js --dry-run  # nur berichten, nichts schreiben
 *
 * Die App braucht das nicht — TrackPlayer sucht die Snippets zur Laufzeit
 * selbst. Das Skript ist für den Fall, dass die Treffer geprüft, korrigiert
 * und dann eingefroren werden sollen. Läuft ab Node 18 (globales fetch).
 */

const fs = require("fs")
const path = require("path")

const DATA_PATH = path.join(__dirname, "..", "src", "data", "technoTracks.json")
const SEARCH_URL = "https://itunes.apple.com/search"
const PAUSE_MS = 350   // iTunes drosselt bei etwa 20 Anfragen pro Minute

const BAD_WORDS = [
  "karaoke", "tribute", "cover version", "in the style of",
  "made famous by", "made popular by", "originally performed"
]

const force = process.argv.includes("--force")
const dryRun = process.argv.includes("--dry-run")

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

async function lookup(track) {
  const term = encodeURIComponent(`${track.artist} ${track.title}`)
  const response = await fetch(`${SEARCH_URL}?term=${term}&entity=song&limit=25`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()
  let best = null
  let bestScore = 0

  for (const candidate of data.results || []) {
    const score = scoreCandidate(candidate, track)
    if (score > bestScore) {
      best = candidate
      bestScore = score
    }
  }
  return best
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  const tracks = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"))
  let found = 0
  let missing = 0

  for (const track of tracks) {
    if (track.previewUrl && !force) continue

    let match = null
    try {
      match = await lookup(track)
    } catch (error) {
      console.error(`✗ ${track.artist} — ${track.title}: ${error.message}`)
      missing++
      await sleep(PAUSE_MS)
      continue
    }

    if (match) {
      track.previewUrl = match.previewUrl
      track.artworkUrl = (match.artworkUrl100 || "").replace(/\/\d+x\d+bb\./, "/300x300bb.")
      found++
      const foundYear = (match.releaseDate || "").slice(0, 4)
      const yearFlag = foundYear && Number(foundYear) !== track.year ? `  (iTunes: ${foundYear})` : ""
      console.log(`✓ ${track.artist} — ${match.trackName}${yearFlag}`)
    } else {
      missing++
      console.log(`· ${track.artist} — ${track.title}: kein Treffer`)
    }

    await sleep(PAUSE_MS)
  }

  console.log(`\n${found} Snippets gefunden, ${missing} offen.`)

  if (dryRun) {
    console.log("--dry-run: nichts geschrieben.")
    return
  }
  if (found > 0) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(tracks, null, 2) + "\n")
    console.log(`${path.relative(process.cwd(), DATA_PATH)} aktualisiert.`)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
