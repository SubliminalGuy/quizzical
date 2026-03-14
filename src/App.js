
import './App.css';
import {useState, useEffect} from "react"

import {nanoid} from "nanoid"

import augmentItems from "./helperFunctions/augmentItems"
import Start from "./components/Start"
import Question from "./components/Question"


function App() {

  let [questions, setQuestions] = useState([])
  let [quizStarted, setQuizStarted] = useState(false)
  let [revealAnswers, setRevealAnswers] = useState(false)
  let [counter, setCounter] = useState(0)
  let [categories, setCategories] = useState([])
  let [category, setCategory] = useState("")
  let [difficulty, setDifficulty] = useState("")

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then(res => res.json())
      .then(data => setCategories(data.trivia_categories))
  }, [])

  function fetchQuestions() {
    let url = `https://opentdb.com/api.php?amount=5&type=multiple&encode=base64`
    if (category) url += `&category=${category}`
    if (difficulty) url += `&difficulty=${difficulty}`
    fetch(url)
          .then(res => res.json())
          .then(data => augmentItems(data))
          .then(result => setQuestions(result))
  }

  function startQuiz(){
    setQuizStarted(true)
    setRevealAnswers(false)
    fetchQuestions()
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
    let correctCounter = 0;
    questions.forEach((item) => {
      item.answers.forEach(el => {
        if (el.clicked && el.isCorrect) {
          correctCounter++;
        }
      })
    })
    setCounter(correctCounter)
  }

  function renderCheckButton() {
    if(quizStarted && !revealAnswers) {
      const allAnswered = questions.length > 0 && questions.every(q => q.answers.some(a => a.clicked))
      return (
        <button
          onClick={checkAnswers}
          className="button check-answers-button"
          disabled={!allAnswered}
        >
          Check answers
        </button>
      )
    }
    else if (quizStarted && revealAnswers) {
      return (
        <div className="score-container">
          <h3>You scored {counter}/5 correct answers</h3>
          <button onClick={startQuiz} className="button play-again-button">Play again</button>
        </div>
      )
    }
  }


  let allQuestions = questions.map(el => {
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
      { !quizStarted
        ? <Start
            startQuiz={startQuiz}
            categories={categories}
            category={category}
            difficulty={difficulty}
            setCategory={setCategory}
            setDifficulty={setDifficulty}
          />
        : allQuestions
      }
      {renderCheckButton()}
    </div>
  );
}

export default App;
