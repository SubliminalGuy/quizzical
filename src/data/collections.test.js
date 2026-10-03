import collections, { getRank } from './collections'

test('every track sits inside its collection timeline', () => {
  collections.forEach(collection => {
    collection.tracks.forEach(track => {
      expect(track.year).toBeGreaterThanOrEqual(collection.firstYear)
      expect(track.year).toBeLessThanOrEqual(collection.lastYear)
    })
  })
})

test('every track carries the fields the game needs', () => {
  collections.forEach(collection => {
    collection.tracks.forEach(track => {
      expect(typeof track.title).toBe('string')
      expect(typeof track.artist).toBe('string')
      expect(typeof track.genre).toBe('string')
      expect(track.title.length).toBeGreaterThan(0)
    })
  })
})

test('every collection holds enough artists for four options and five rounds', () => {
  collections.forEach(collection => {
    const artists = new Set(collection.tracks.map(t => t.artist))
    expect(artists.size).toBeGreaterThanOrEqual(4)
    expect(collection.tracks.length).toBeGreaterThanOrEqual(5)
  })
})

test('no collection lists the same track twice', () => {
  collections.forEach(collection => {
    const keys = collection.tracks.map(t => `${t.artist} – ${t.title}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

test('ranks cover every score from zero to full marks', () => {
  collections.forEach(collection => {
    expect(getRank(collection, 25, 25).min).toBe(1)
    expect(getRank(collection, 0, 25)).toBeDefined()
    expect(getRank(collection, 13, 25)).toBeDefined()
  })
})
