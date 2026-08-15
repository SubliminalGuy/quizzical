import { MAX_POINTS_PER_ROUND } from "../helperFunctions/buildRounds"

export default function Start(props) {
  return (
    <div className="start-screen">
      <div className="start-vinyl">
        <div className="vinyl vinyl-spinning">
          <div className="vinyl-label">90s</div>
        </div>
      </div>

      <h1 className="start-title">
        <span className="title-glow">RAVE</span>
        <span className="title-outline">HISTER</span>
      </h1>
      <p className="start-claim">Das Ratespiel für 90er Techno &amp; Elektro</p>

      <ul className="start-rules">
        <li><span className="rule-num">1</span> Track anhören</li>
        <li><span className="rule-num">2</span> Gruppe raten <em>+2</em></li>
        <li><span className="rule-num">3</span> Jahr auf dem Zeitstrahl setzen <em>+3</em></li>
      </ul>

      <p className="start-hint">
        Ein Jahr daneben zählt noch {" "}
        <strong>1 Punkt</strong> — {props.roundCount} Tracks, maximal{" "}
        <strong>{props.roundCount * MAX_POINTS_PER_ROUND} Punkte</strong>.
      </p>

      <button className="button primary-button" onClick={props.startGame}>
        Auflegen ▸
      </button>
    </div>
  )
}
