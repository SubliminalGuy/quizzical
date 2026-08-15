export default function ArtistChoice(props) {
  const { options, guess, correctArtist, revealed, active, onSelect } = props

  return (
    <section className={`step-card${active ? " step-active" : ""}`}>
      <header className="step-header">
        <span className="step-badge">1</span>
        <h2>Welche Gruppe?</h2>
        <span className="step-points">+2</span>
      </header>

      <div className="artist-options">
        {options.map(option => {
          const isGuess = guess === option
          const isCorrect = option === correctArtist

          let state = ""
          if (revealed && isCorrect) state = " option-correct"
          else if (revealed && isGuess) state = " option-wrong"
          else if (isGuess) state = " option-selected"

          return (
            <button
              key={option}
              className={`button artist-button${state}`}
              onClick={() => onSelect(option)}
              disabled={revealed}
            >
              {option}
            </button>
          )
        })}
      </div>
    </section>
  )
}
