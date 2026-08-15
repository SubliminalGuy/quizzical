function getRank(score, maxScore) {
  const pct = maxScore > 0 ? score / maxScore : 0
  if (pct === 1)  return { emoji: "🏆", title: "Loveparade-Legende", text: "Alles richtig. Du warst dabei, oder?" }
  if (pct >= 0.8) return { emoji: "🔥", title: "Resident DJ", text: "Fast lupenrein — das Vinyl sitzt." }
  if (pct >= 0.6) return { emoji: "😎", title: "Stammgast im Club", text: "Solide Nacht. Da geht noch was." }
  if (pct >= 0.4) return { emoji: "🤔", title: "Gelegenheitsraver", text: "Die Neunziger rufen nach einem zweiten Set." }
  return { emoji: "💪", title: "Frisch von der Tanzfläche", text: "Kopfhörer auf und nochmal von vorn." }
}

export default function Results(props) {
  const { results, score, maxScore, onRestart } = props
  const rank = getRank(score, maxScore)

  return (
    <div className="results-screen">
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

      <button className="button primary-button" onClick={onRestart}>
        Neues Set starten
      </button>
    </div>
  )
}
