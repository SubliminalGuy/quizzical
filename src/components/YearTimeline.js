const MAX_PER_ROW = 10

/** Teilt lange Zeiträume auf gleich volle Zeilen auf, damit alle Jahre sichtbar bleiben. */
function toRows(years) {
  const rowCount = Math.ceil(years.length / MAX_PER_ROW)
  const perRow = Math.ceil(years.length / rowCount)
  const rows = []
  for (let i = 0; i < years.length; i += perRow) {
    rows.push(years.slice(i, i + perRow))
  }
  return rows
}

export default function YearTimeline(props) {
  const { years, guess, correctYear, revealed, active, locked, onSelect } = props
  const rows = toRows(years)

  return (
    <section className={`step-card${active ? " step-active" : ""}${locked ? " step-locked" : ""}`}>
      <header className="step-header">
        <span className="step-badge">2</span>
        <h2>Welches Jahr?</h2>
        <span className="step-points">+3</span>
      </header>

      {locked && <p className="step-lock-hint">Erst die Gruppe tippen.</p>}

      <div className={`timeline${rows.length > 1 ? " timeline-dense" : ""}`}>
        {rows.map((row, rowIndex) => (
          <div className="timeline-row" key={rowIndex}>
            <div className="timeline-line" />
            <div className="timeline-years">
              {row.map(year => {
                const isGuess = guess === year
                const isCorrect = year === correctYear
                const isClose = revealed && Math.abs(year - correctYear) === 1 && isGuess

                let state = ""
                if (revealed && isCorrect) state = " year-correct"
                else if (revealed && isClose) state = " year-close"
                else if (revealed && isGuess) state = " year-wrong"
                else if (isGuess) state = " year-selected"

                return (
                  <button
                    key={year}
                    className={`year-button${state}`}
                    onClick={() => onSelect(year)}
                    disabled={revealed || locked}
                  >
                    <span className="year-dot" />
                    <span className="year-label">'{String(year).slice(2)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
