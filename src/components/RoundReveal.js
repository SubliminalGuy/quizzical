import { POINTS_ARTIST, POINTS_YEAR_EXACT } from "../helperFunctions/buildRounds"

function yearVerdict(guessYear, points) {
  if (points === POINTS_YEAR_EXACT) return "Punktlandung!"
  if (points > 0) return `Nur ein Jahr daneben (${guessYear})`
  return `Daneben — du lagst bei ${guessYear}`
}

export default function RoundReveal(props) {
  const { track, artistPoints, yearPoints, guessYear, isLastRound, onNext } = props
  const roundPoints = artistPoints + yearPoints

  return (
    <section className="reveal-card">
      <p className="reveal-headline">
        <strong>{track.artist}</strong> — {track.title} <span>({track.year})</span>
      </p>

      <ul className="reveal-list">
        <li className={artistPoints > 0 ? "hit" : "miss"}>
          <span>{artistPoints > 0 ? "✓" : "✗"}</span>
          {artistPoints > 0 ? "Gruppe erkannt" : `Gruppe war ${track.artist}`}
          <em>+{artistPoints}</em>
        </li>
        <li className={yearPoints > 0 ? "hit" : "miss"}>
          <span>{yearPoints === POINTS_YEAR_EXACT ? "✓" : yearPoints > 0 ? "≈" : "✗"}</span>
          {yearVerdict(guessYear, yearPoints)}
          <em>+{yearPoints}</em>
        </li>
      </ul>

      <p className="reveal-score">
        {roundPoints} von {POINTS_ARTIST + POINTS_YEAR_EXACT} Punkten
      </p>

      <button className="button primary-button" onClick={onNext}>
        {isLastRound ? "Endstand ansehen" : "Nächster Track ▸"}
      </button>
    </section>
  )
}
