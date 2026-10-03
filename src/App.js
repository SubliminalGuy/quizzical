import './App.css';
import { useEffect, useState } from "react"

import buildRounds, {
  MAX_POINTS_PER_ROUND,
  scoreArtist,
  scoreYear,
  yearsFor
} from "./helperFunctions/buildRounds"
import collections from "./data/collections"

import Start from "./components/Start"
import TrackPlayer from "./components/TrackPlayer"
import ArtistChoice from "./components/ArtistChoice"
import YearTimeline from "./components/YearTimeline"
import RoundReveal from "./components/RoundReveal"
import Results from "./components/Results"

const ROUND_COUNT = 5

export default function App() {

  const [screen, setScreen] = useState("start")      // start | game | results
  const [collection, setCollection] = useState(null)
  const [rounds, setRounds] = useState([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [guessArtist, setGuessArtist] = useState(null)
  const [guessYear, setGuessYear] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState([])

  // Das Thema der gewählten Sammlung färbt die ganze Seite ein.
  useEffect(() => {
    document.body.dataset.theme = screen === "start" || !collection ? "neutral" : collection.theme
  }, [screen, collection])

  const round = rounds[roundIndex]
  const score = results.reduce((sum, r) => sum + r.artistPoints + r.yearPoints, 0)
  const maxScore = ROUND_COUNT * MAX_POINTS_PER_ROUND
  const isLastRound = roundIndex === rounds.length - 1

  function startGame(chosen) {
    setCollection(chosen)
    setRounds(buildRounds(chosen.tracks, ROUND_COUNT))
    setRoundIndex(0)
    setResults([])
    resetRound()
    setScreen("game")
  }

  function resetRound() {
    setGuessArtist(null)
    setGuessYear(null)
    setRevealed(false)
  }

  function revealRound() {
    const artistPoints = scoreArtist(round.track, guessArtist)
    const yearPoints = scoreYear(round.track, guessYear)
    setResults(prev => [...prev, {
      id: round.id,
      track: round.track,
      guessArtist,
      guessYear,
      artistPoints,
      yearPoints
    }])
    setRevealed(true)
  }

  function nextRound() {
    if (isLastRound) {
      setScreen("results")
      return
    }
    setRoundIndex(prev => prev + 1)
    resetRound()
  }

  if (screen === "start") {
    return (
      <div className="main-container">
        <Start
          collections={collections}
          roundCount={ROUND_COUNT}
          startGame={startGame}
        />
      </div>
    )
  }

  if (screen === "results") {
    return (
      <div className="main-container">
        <Results
          collection={collection}
          results={results}
          score={score}
          maxScore={maxScore}
          onRestart={() => startGame(collection)}
          onChangeGenre={() => setScreen("start")}
        />
      </div>
    )
  }

  const currentResult = revealed ? results[results.length - 1] : null

  return (
    <div className="main-container">
      <header className="game-bar">
        <div className="round-dots">
          {rounds.map((r, i) => (
            <span
              key={r.id}
              className={`round-dot${i === roundIndex ? " dot-active" : ""}${i < roundIndex ? " dot-done" : ""}`}
            />
          ))}
        </div>
        <p className="game-bar-label">
          Track {roundIndex + 1} / {rounds.length}
        </p>
        <p className="game-bar-score">{score} Pkt.</p>
      </header>

      <TrackPlayer track={round.track} revealed={revealed} collection={collection} />

      <ArtistChoice
        options={round.artistOptions}
        guess={guessArtist}
        correctArtist={round.track.artist}
        revealed={revealed}
        active={!revealed && !guessArtist}
        onSelect={setGuessArtist}
      />

      <YearTimeline
        years={yearsFor(collection)}
        guess={guessYear}
        correctYear={round.track.year}
        revealed={revealed}
        active={!revealed && Boolean(guessArtist)}
        locked={!revealed && !guessArtist}
        onSelect={setGuessYear}
      />

      {!revealed && (
        <button
          className="button primary-button"
          onClick={revealRound}
          disabled={!guessArtist || !guessYear}
        >
          {!guessArtist || !guessYear ? "Erst tippen …" : "Auflösen"}
        </button>
      )}

      {revealed && currentResult && (
        <RoundReveal
          track={round.track}
          artistPoints={currentResult.artistPoints}
          yearPoints={currentResult.yearPoints}
          guessYear={currentResult.guessYear}
          isLastRound={isLastRound}
          onNext={nextRound}
        />
      )}
    </div>
  )
}
