import { YEARS } from "../helperFunctions/buildRounds"

export default function YearTimeline(props) {
  const { guess, correctYear, revealed, active, locked, onSelect } = props

  return (
    <section className={`step-card${active ? " step-active" : ""}${locked ? " step-locked" : ""}`}>
      <header className="step-header">
        <span className="step-badge">2</span>
        <h2>Welches Jahr?</h2>
        <span className="step-points">+3</span>
      </header>

      {locked && <p className="step-lock-hint">Erst die Gruppe tippen.</p>}

      <div className="timeline">
        <div className="timeline-line" />
        <div className="timeline-years">
          {YEARS.map(year => {
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
    </section>
  )
}
