import { pickBest, albumMatches, fromDeezer, runSources } from "./fetchPreview"

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

// ── Deezer-Treffer ──

test('maps a Deezer hit onto the common shape', () => {
  const mapped = fromDeezer({
    title: "Rhythm Is a Dancer",
    artist: { name: "Snap!" },
    preview: "https://cdns-preview.dzcdn.net/stream/snap.mp3",
    album: { cover_medium: "https://e-cdns-images.dzcdn.net/250x250.jpg" },
    release_date: "1992-03-16"
  })

  expect(mapped.artistName).toBe("Snap!")
  expect(mapped.previewUrl).toContain("dzcdn.net")
  expect(pickBest([mapped], track)).toBe(mapped)
})

test('rejects a Deezer hit without a preview', () => {
  const mapped = fromDeezer({ title: "Rhythm Is a Dancer", artist: { name: "Snap!" }, preview: null })

  expect(pickBest([mapped], track)).toBeNull()
})

// ── Album-Treffer ──

test('matches an album entry by artist and album title', () => {
  const albumTrack = { artist: "Jlin", title: "Dark Energy", year: 2015 }

  expect(albumMatches({ artistName: "Jlin", collectionName: "Dark Energy" }, albumTrack)).toBe(true)
  expect(albumMatches({ artistName: "Jlin", collectionName: "Dark Energy (Deluxe)" }, albumTrack)).toBe(true)
  expect(albumMatches({ artistName: "Jlin", collectionName: "Black Origami" }, albumTrack)).toBe(false)
  expect(albumMatches({ artistName: "Other", collectionName: "Dark Energy" }, albumTrack)).toBe(false)
})

// ── Reihenfolge der Quellen ──

const hit = kind => async () => ({ kind, previewUrl: "x", source: kind })
const miss = async () => null
const boom = async () => { throw new Error("nicht erreichbar") }

test('takes the first source that delivers', async () => {
  const result = await runSources(track, [miss, hit("first"), hit("second")])

  expect(result.source).toBe("first")
})

test('keeps going when a source fails', async () => {
  const result = await runSources(track, [boom, boom, hit("later")])

  expect(result.source).toBe("later")
})

test('reports no snippet when every source comes up empty', async () => {
  await expect(runSources(track, [miss, miss])).resolves.toBeNull()
})

test('only reports a network problem when every source failed', async () => {
  await expect(runSources(track, [boom, boom])).rejects.toThrow(/nicht erreichbar/)
})

test('a failing network source does not look like a clean miss', async () => {
  const pinned = async () => null
  pinned.network = false

  // Nur die abfragende Quelle ist gescheitert — das ist ein Netzproblem.
  await expect(runSources(track, [pinned, boom, pinned])).rejects.toThrow(/nicht erreichbar/)
})

test('a clean miss stays a clean miss when another source answered', async () => {
  await expect(runSources(track, [boom, miss])).resolves.toBeNull()
})
