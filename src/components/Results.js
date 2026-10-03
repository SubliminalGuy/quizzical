import { getRank } from "../data/collections"

export default function Results(props) {
  const { collection, results, score, maxScore, onRestart, onChangeGenre } = props
  const rank = getRank(collection, score, maxScore)

  return (
    <div className="results-screen">
      <p className="results-collection">{collection.label} · {collection.era}</p>
      <div className="results-emoji">{rank.emoji}</div>
      <h2 className="results-title">{rank.title}</h2>
      <p className="results-score">
        <span className="results-score-value">{score}</span>
        <span className="results-score-max"> / {maxScore}</span>
      </p>
      <p className="results-text">{rank.text}</p>

      <ul className="results-list">
        {results.map(result => {
          const points = result.artistPoints + result.yearPoints
          return (
            <li key={result.id} className="results-row">
              <div className="results-row-main">
                <strong>{result.track.artist}</strong>
                <span className="results-row-title">{result.track.title}</span>
              </div>
              <div className="results-row-side">
                <span className="results-row-year">{result.track.year}</span>
                <span className={`results-row-points${points > 0 ? " has-points" : ""}`}>
                  +{points}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="results-actions">
        <button className="button primary-button" onClick={onRestart}>
          Noch ein Set
        </button>
        <button className="button ghost-button" onClick={onChangeGenre}>
          Musikrichtung wechseln
        </button>
      </div>
    </div>
  )
}
