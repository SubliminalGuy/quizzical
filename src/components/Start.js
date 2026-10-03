import { MAX_POINTS_PER_ROUND, POINTS_ARTIST, POINTS_YEAR_EXACT, POINTS_YEAR_CLOSE } from "../helperFunctions/buildRounds"
import MediaVisual from "./MediaVisual"

export default function Start(props) {
  const { collections, roundCount, startGame } = props

  return (
    <div className="start-screen">
      <h1 className="start-title">
        <span className="title-glow">HIT</span>
        <span className="title-outline">IFY</span>
      </h1>
      <p className="start-claim">Errate Gruppe und Erscheinungsjahr</p>

      <h2 className="picker-heading">Wähle deine Musikrichtung</h2>

      <div className="genre-cards">
        {collections.map(collection => (
          <button
            key={collection.id}
            className={`genre-card genre-${collection.theme}`}
            onClick={() => startGame(collection)}
          >
            <div className="genre-card-visual">
              <MediaVisual kind={collection.player} label="?" small />
            </div>
            <div className="genre-card-body">
              <p className="genre-card-label">{collection.label}</p>
              <p className="genre-card-era">{collection.era}</p>
              <p className="genre-card-tagline">{collection.tagline}</p>
              <p className="genre-card-examples">{collection.examples}</p>
            </div>
            <span className="genre-card-go">{collection.startLabel} ▸</span>
          </button>
        ))}
      </div>

      <ul className="start-rules">
        <li><span className="rule-num">1</span> Track anhören</li>
        <li><span className="rule-num">2</span> Gruppe raten <em>+{POINTS_ARTIST}</em></li>
        <li><span className="rule-num">3</span> Jahr auf dem Zeitstrahl setzen <em>+{POINTS_YEAR_EXACT}</em></li>
      </ul>

      <p className="start-hint">
        Ein Jahr daneben zählt noch <strong>{POINTS_YEAR_CLOSE} Punkt</strong> — {roundCount} Tracks,
        maximal <strong>{roundCount * MAX_POINTS_PER_ROUND} Punkte</strong>.
      </p>
    </div>
  )
}
