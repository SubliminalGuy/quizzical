/**
 * Sucht ein 30-Sekunden-Snippet für einen Track und probiert dafür mehrere
 * Quellen der Reihe nach durch. Keine davon braucht einen API-Key.
 *
 *   1. fest eingetragene `previewUrl` aus der Trackdatei
 *   2. iTunes, Suche nach dem Song
 *   3. iTunes, Suche nach dem Album und dann dessen erster Titel
 *      (für Einträge, die eine EP oder ein Album sind — davon haben die
 *       beiden Bass-Sammlungen viele)
 *   4. Deezer, Suche nach dem Song (anderer Katalog, trifft oft dort,
 *      wo Apple nichts hat)
 *   5. fest eingetragene `soundcloudUrl` — spielt über das SoundCloud-Widget
 *
 * Beide APIs schicken keine CORS-Header, unterstützen aber JSONP, deshalb
 * wird hier ein <script>-Tag geladen statt fetch() benutzt.
 */

const ITUNES_URL = "https://itunes.apple.com"
const DEEZER_URL = "https://api.deezer.com"
const TIMEOUT_MS = 8000

// Coverversionen und Karaoke-Fassungen fliegen raus.
const BAD_WORDS = [
  "karaoke", "tribute", "cover version", "in the style of",
  "made famous by", "made popular by", "originally performed"
]

const cache = new Map()
let callbackCounter = 0

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `__hitifyJsonp${++callbackCounter}`
    const script = document.createElement("script")
    let timer

    function cleanup() {
      clearTimeout(timer)
      delete window[callbackName]
      script.remove()
    }

    window[callbackName] = data => {
      cleanup()
      resolve(data)
    }
    script.onerror = () => {
      cleanup()
      reject(new Error("Quelle nicht erreichbar"))
    }
    timer = setTimeout(() => {
      cleanup()
      reject(new Error("Quelle hat nicht geantwortet"))
    }, TIMEOUT_MS)

    script.src = url.replace("__CALLBACK__", callbackName)
    document.head.appendChild(script)
  })
}

/**
 * Bewertet einen Treffer. Interpret und Titel müssen beide passen, das
 * Erscheinungsjahr dient nur als Stichentscheid — in den Katalogen steht dort
 * oft das Jahr einer späteren Compilation.
 */
function scoreCandidate(candidate, track) {
  if (!candidate.previewUrl) return -1

  const foundArtist = normalize(candidate.artistName)
  const foundTitle = normalize(candidate.trackName)
  const wantArtist = normalize(track.artist)
  const wantTitle = normalize(track.title)

  if (BAD_WORDS.some(word => foundTitle.includes(word) || foundArtist.includes(word))) {
    return -1
  }

  let score = 0
  if (foundArtist === wantArtist) score += 4
  else if (foundArtist.includes(wantArtist) || wantArtist.includes(foundArtist)) score += 2
  else return -1

  if (foundTitle === wantTitle) score += 4
  else if (foundTitle.startsWith(wantTitle)) score += 3
  else if (foundTitle.includes(wantTitle)) score += 2
  else return -1

  const releaseYear = Number(String(candidate.releaseDate || "").slice(0, 4))
  if (releaseYear) {
    score += Math.max(0, 3 - Math.abs(releaseYear - track.year) / 4)
  }

  return score
}

export function pickBest(results, track) {
  let best = null
  let bestScore = 0

  results.forEach(candidate => {
    const score = scoreCandidate(candidate, track)
    if (score > bestScore) {
      best = candidate
      bestScore = score
    }
  })

  return best
}

/** Passt dieses Album zum Eintrag? Gleiche Regel wie bei Songs, ohne Preview-Pflicht. */
export function albumMatches(album, track) {
  const foundArtist = normalize(album.artistName)
  const foundTitle = normalize(album.collectionName)
  const wantArtist = normalize(track.artist)
  const wantTitle = normalize(track.title)

  const artistFits = foundArtist === wantArtist ||
    foundArtist.includes(wantArtist) || wantArtist.includes(foundArtist)
  const titleFits = foundTitle === wantTitle || foundTitle.startsWith(wantTitle)

  return artistFits && titleFits
}

/** Bringt einen Deezer-Treffer auf dieselbe Form wie einen von iTunes. */
export function fromDeezer(item) {
  return {
    artistName: item.artist ? item.artist.name : "",
    trackName: item.title_short || item.title,
    previewUrl: item.preview || null,
    artworkUrl100: (item.album && (item.album.cover_medium || item.album.cover)) || null,
    releaseDate: item.release_date || ""
  }
}

function upscaleArtwork(url) {
  return url ? url.replace(/\/\d+x\d+bb\./, "/300x300bb.") : null
}

function asResult(candidate, source) {
  return {
    kind: "audio",
    previewUrl: candidate.previewUrl,
    artworkUrl: upscaleArtwork(candidate.artworkUrl100),
    source
  }
}

// ── Die Quellen ──────────────────────────────────────────────────────────

// Die beiden "fest eingetragen"-Quellen fragen nichts ab. Sie zählen deshalb
// nicht mit, wenn entschieden wird, ob die Suche am Netz gescheitert ist.
pinnedPreview.network = false
async function pinnedPreview(track) {
  if (!track.previewUrl) return null
  return {
    kind: "audio",
    previewUrl: track.previewUrl,
    artworkUrl: track.artworkUrl || null,
    source: "fest eingetragen"
  }
}

async function itunesSong(track) {
  const term = encodeURIComponent(`${track.artist} ${track.title}`)
  const data = await jsonp(`${ITUNES_URL}/search?term=${term}&entity=song&limit=25&callback=__CALLBACK__`)
  const match = pickBest(data.results || [], track)
  return match ? asResult(match, "iTunes") : null
}

/** Für EP- und Album-Einträge: erst das Album finden, dann dessen ersten Titel nehmen. */
async function itunesAlbum(track) {
  const term = encodeURIComponent(`${track.artist} ${track.title}`)
  const found = await jsonp(`${ITUNES_URL}/search?term=${term}&entity=album&limit=10&callback=__CALLBACK__`)
  const album = (found.results || []).find(item => albumMatches(item, track))
  if (!album) return null

  const tracks = await jsonp(`${ITUNES_URL}/lookup?id=${album.collectionId}&entity=song&limit=40&callback=__CALLBACK__`)
  const first = (tracks.results || []).find(item => item.wrapperType === "track" && item.previewUrl)
  if (!first) return null

  return {
    kind: "audio",
    previewUrl: first.previewUrl,
    artworkUrl: upscaleArtwork(first.artworkUrl100 || album.artworkUrl100),
    source: "iTunes (Album)"
  }
}

async function deezerSong(track) {
  const query = encodeURIComponent(`artist:"${track.artist}" track:"${track.title}"`)
  const data = await jsonp(`${DEEZER_URL}/search?q=${query}&limit=25&output=jsonp&callback=__CALLBACK__`)
  const match = pickBest((data.data || []).map(fromDeezer), track)
  if (!match) return null

  return {
    kind: "audio",
    previewUrl: match.previewUrl,
    artworkUrl: match.artworkUrl100,
    source: "Deezer"
  }
}

pinnedSoundcloud.network = false
async function pinnedSoundcloud(track) {
  if (!track.soundcloudUrl) return null
  return {
    kind: "soundcloud",
    soundcloudUrl: track.soundcloudUrl,
    artworkUrl: track.artworkUrl || null,
    source: "SoundCloud"
  }
}

export const SOURCES = [pinnedPreview, itunesSong, itunesAlbum, deezerSong, pinnedSoundcloud]

/**
 * Geht die Quellen der Reihe nach durch und nimmt den ersten Treffer. Eine
 * Quelle, die nicht antwortet, beendet die Suche nicht — die nächste bekommt
 * ihre Chance. Erst wenn jede abfragende Quelle gescheitert ist, war es ein
 * Netzproblem, und nur dann fliegt der Fehler weiter: Sonst stünde bei
 * fehlender Verbindung "kein Snippet" statt "nicht erreichbar".
 */
export async function runSources(track, sources = SOURCES) {
  const asking = sources.filter(source => source.network !== false)
  let failures = 0
  let lastError = null

  for (const source of sources) {
    try {
      const result = await source(track)
      if (result) return result
    } catch (error) {
      failures++
      lastError = error
    }
  }

  if (failures > 0 && failures === asking.length) throw lastError

  return null
}

export default async function fetchPreview(track) {
  const key = `${track.artist} – ${track.title}`
  if (cache.has(key)) return cache.get(key)

  const result = await runSources(track)
  cache.set(key, result)
  return result
}
