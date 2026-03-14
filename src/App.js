
import './App.css';
import { useState } from "react"
import { nanoid } from "nanoid"

import loadLocalQuestions from "./helperFunctions/loadLocalQuestions"
import allQuestions from "./data/spanishHistoryQuestions.json"
import Start from "./components/Start"
import Question from "./components/Question"


function App() {

  let [questions, setQuestions] = useState([])
  let [quizStarted, setQuizStarted] = useState(false)
  let [revealAnswers, setRevealAnswers] = useState(false)
  let [counter, setCounter] = useState(0)

  function startQuiz() {
    setQuizStarted(true)
    setRevealAnswers(false)
    setQuestions(loadLocalQuestions(allQuestions))
  }

  function gotClicked(questionId, answerText) {
    setQuestions(prevState => {
      return prevState.map(el => {
        if (el.id !== questionId) return el
        let changedClicks = el.answers.map(item => {
          if (item.answer.trim() === answerText) {
            return { ...item, clicked: true }
          }
          return { ...item, clicked: false }
        })
        return { ...el, answers: changedClicks }
      })
    })
  }

  function checkAnswers() {
    setRevealAnswers(true)
    let correctCounter = 0
    questions.forEach((item) => {
      item.answers.forEach(el => {
        if (el.clicked && el.isCorrect) {
          correctCounter++
        }
      })
    })
    setCounter(correctCounter)
  }

  const answeredCount = questions.filter(q => q.answers.some(a => a.clicked)).length
  const totalCount = questions.length

  function getScoreEmoji(score, total) {
    const pct = score / total
    if (pct === 1)   return "🏆"
    if (pct >= 0.8)  return "🔥"
    if (pct >= 0.6)  return "😎"
    if (pct >= 0.4)  return "🤔"
    return "💪"
  }

  function getScoreMessage(score, total) {
    const pct = score / total
    if (pct === 1)   return "¡Perfecto! Eres un crack."
    if (pct >= 0.8)  return "¡Muy bien! Casi lo bordas."
    if (pct >= 0.6)  return "¡Bien hecho! Sigue así."
    if (pct >= 0.4)  return "No está mal. ¡Puedes mejorar!"
    return "¡Inténtalo de nuevo!"
  }

  function renderCheckButton() {
    if (quizStarted && !revealAnswers) {
      const allAnswered = totalCount > 0 && answeredCount === totalCount
      return (
        <button
          onClick={checkAnswers}
          className="button check-answers-button"
          disabled={!allAnswered}
        >
          Comprobar respuestas
        </button>
      )
    }
    else if (quizStarted && revealAnswers) {
      return (
        <div className="score-container">
          <div className="score-emoji">{getScoreEmoji(counter, totalCount)}</div>
          <p className="score-result-text">
            {getScoreMessage(counter, totalCount)}<br/>
            <span style={{color: "#C084FC"}}>{counter}</span>
            <span style={{color: "rgba(255,255,255,0.5)"}}> / {totalCount}</span>
          </p>
          <div className="score-actions">
            <button onClick={startQuiz} className="button play-again-button">Jugar de nuevo</button>
          </div>
        </div>
      )
    }
  }

  let questionElements = questions.map(el => {
    let key = nanoid()
    return (
      <Question
        knowledge={el}
        revealed={revealAnswers}
        key={key}
        clickHandler={gotClicked}
      />
    )
  })

  return (
    <div className="main-container">
      {!quizStarted
        ? <Start startQuiz={startQuiz} />
        : (
          <>
            {!revealAnswers && (
              <div className="progress-bar-container">
                <div className="progress-label">{answeredCount} / {totalCount} respondidas</div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: totalCount > 0 ? `${(answeredCount / totalCount) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            )}
            {questionElements}
          </>
        )
      }
      {renderCheckButton()}
    </div>
  )
}

export default App;
