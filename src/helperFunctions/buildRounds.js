import { nanoid } from "nanoid"

export const FIRST_YEAR = 1990
export const LAST_YEAR = 1999

export const POINTS_ARTIST = 2
export const POINTS_YEAR_EXACT = 3
export const POINTS_YEAR_CLOSE = 1
export const MAX_POINTS_PER_ROUND = POINTS_ARTIST + POINTS_YEAR_EXACT

function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Picks three decoy artists that are not the artist of the given track.
 * Decoys from the same genre come first so the guess stays challenging.
 */
function pickArtistOptions(track, allTracks, optionCount = 4) {
  const otherArtists = [...new Set(
    allTracks.filter(t => t.artist !== track.artist).map(t => t.artist)
  )]
  const sameGenre = shuffle(otherArtists.filter(
    artist => allTracks.some(t => t.artist === artist && t.genre === track.genre)
  ))
  const rest = shuffle(otherArtists.filter(artist => !sameGenre.includes(artist)))

  const decoys = [...sameGenre, ...rest].slice(0, optionCount - 1)
  return shuffle([track.artist, ...decoys])
}

export const YEARS = Array.from(
  { length: LAST_YEAR - FIRST_YEAR + 1 },
  (_, i) => FIRST_YEAR + i
)

export function scoreArtist(track, guessedArtist) {
  return guessedArtist === track.artist ? POINTS_ARTIST : 0
}

export function scoreYear(track, guessedYear) {
  const distance = Math.abs(track.year - guessedYear)
  if (distance === 0) return POINTS_YEAR_EXACT
  if (distance === 1) return POINTS_YEAR_CLOSE
  return 0
}

export default function buildRounds(tracks, roundCount = 5) {
  return shuffle(tracks).slice(0, roundCount).map(track => ({
    id: nanoid(),
    track,
    artistOptions: pickArtistOptions(track, tracks)
  }))
}
