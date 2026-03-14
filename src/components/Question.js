import {nanoid} from "nanoid"

export default function Question(props) {
  const answeredCorrectly = props.revealed && props.knowledge.answers.some(a => a.isCorrect && a.clicked)

  let answers = props.knowledge.answers.map(el => {
    let key = nanoid()
    return (
      <button
        key={key}
        className={`button answer-button${!props.revealed && el.clicked ? " blue" : ""}${props.revealed && el.isCorrect ? " green" : ""}${props.revealed && el.clicked && !el.isCorrect ? " rose" : ""}`}
        onClick={() => !props.revealed && props.clickHandler(props.knowledge.id, el.answer)}
        disabled={props.revealed}
      >
        {el.answer}
      </button>
    )
  })

  return (
    <div className="content-box">
      <div className="question-header">
        <h3>{props.knowledge.question}</h3>
        {props.revealed && (
          <span className={answeredCorrectly ? "result-correct" : "result-wrong"}>
            {answeredCorrectly ? "✓" : "✗"}
          </span>
        )}
      </div>
      <div className="answer-box">
        {answers}
      </div>
    </div>
  )
}
