/**
 * Sucht 30-Sekunden-Previews über die iTunes Search API.
 *
 * Die API schickt keine CORS-Header, unterstützt aber JSONP über den
 * `callback`-Parameter — deshalb wird hier ein <script>-Tag geladen statt
 * fetch() benutzt. Kein API-Key, keine Registrierung nötig.
 *
 * Trägt ein Track in technoTracks.json bereits eine `previewUrl`, gewinnt
 * die — so lassen sich einzelne Snippets fest verdrahten (siehe
 * scripts/fetchPreviews.js).
 */

const SEARCH_URL = "https://itunes.apple.com/search"
const TIMEOUT_MS = 8000

// Coverversionen und Karaoke-Fassungen fliegen raus.
const BAD_WORDS = [
  "karaoke", "tribute", "cover version", "in the style of",
  "made famous by", "made popular by", "originally performed"
]

const cache = new Map()
let callbackCounter = 0

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `__ravehisterItunes${++callbackCounter}`
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
      reject(new Error("iTunes-Suche nicht erreichbar"))
    }
    timer = setTimeout(() => {
      cleanup()
      reject(new Error("iTunes-Suche hat nicht geantwortet"))
    }, TIMEOUT_MS)

    script.src = `${url}&callback=${callbackName}`
    document.head.appendChild(script)
  })
}

/**
 * Bewertet einen Treffer. Interpret und Titel müssen beide passen, das
 * Erscheinungsjahr dient nur als Stichentscheid — bei iTunes steht dort oft
 * das Jahr einer späteren Compilation.
 */
function scoreCandidate(candidate, track) {
  if (!candidate.previewUrl) return -1

  const foundArtist = normalize(candidate.artistName || "")
  const foundTitle = normalize(candidate.trackName || "")
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

  const releaseYear = Number((candidate.releaseDate || "").slice(0, 4))
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

function upscaleArtwork(url) {
  return url ? url.replace(/\/\d+x\d+bb\./, "/300x300bb.") : null
}

export default async function fetchPreview(track) {
  if (track.previewUrl) {
    return { previewUrl: track.previewUrl, artworkUrl: track.artworkUrl || null }
  }

  const key = `${track.artist} – ${track.title}`
  if (cache.has(key)) return cache.get(key)

  const term = encodeURIComponent(`${track.artist} ${track.title}`)
  const url = `${SEARCH_URL}?term=${term}&entity=song&limit=25`

  const data = await jsonp(url)
  const match = pickBest(data.results || [], track)
  const result = match
    ? { previewUrl: match.previewUrl, artworkUrl: upscaleArtwork(match.artworkUrl100) }
    : null

  cache.set(key, result)
  return result
}
