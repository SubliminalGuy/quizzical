import { pickBest } from "./fetchPreview"

const track = { artist: "Snap!", title: "Rhythm Is a Dancer", year: 1992 }

function candidate(overrides) {
  return {
    artistName: "Snap!",
    trackName: "Rhythm Is a Dancer",
    releaseDate: "1992-03-16T12:00:00Z",
    previewUrl: "https://audio.example/snap.m4a",
    artworkUrl100: "https://art.example/100x100bb.jpg",
    ...overrides
  }
}

test('picks the exact artist and title match', () => {
  const match = pickBest([
    candidate({ artistName: "Culture Beat", trackName: "Mr. Vain" }),
    candidate()
  ], track)

  expect(match.artistName).toBe("Snap!")
})

test('skips karaoke and tribute versions', () => {
  const match = pickBest([
    candidate({ artistName: "Karaoke All Stars" }),
    candidate({ trackName: "Rhythm Is a Dancer (in the style of Snap!)" })
  ], track)

  expect(match).toBeNull()
})

test('skips entries without a preview', () => {
  expect(pickBest([candidate({ previewUrl: null })], track)).toBeNull()
})

test('accepts a suffixed title such as a radio edit', () => {
  const match = pickBest([candidate({ trackName: "Rhythm Is a Dancer (Radio Edit)" })], track)

  expect(match.trackName).toBe("Rhythm Is a Dancer (Radio Edit)")
})

test('prefers the original over a much later re-release', () => {
  const match = pickBest([
    candidate({ trackName: "Rhythm Is a Dancer (2018 Remix)", releaseDate: "2018-01-01T12:00:00Z" }),
    candidate()
  ], track)

  expect(match.releaseDate).toBe("1992-03-16T12:00:00Z")
})

test('rejects a different song by the same artist', () => {
  expect(pickBest([candidate({ trackName: "The Power" })], track)).toBeNull()
})
