
import './App.css';
import {useState} from "react"

import Start from "./components/Start"
import QuizPage from "./components/QuizPage"



function App() {

  const [questions, setQuestions] = useState({})
  const [quizStarted, setQuizStarted] = useState(false)

  function getQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
          .then(res => res.json())
          .then(data => setQuestions(data.results))
          .then(setQuizStarted(true))
  }

  console.log(questions)


  return (
    <div className="main-container">
      { !quizStarted ? <Start getQuestions={getQuestions}/> : <QuizPage />}
    </div>
  );
}

export default App;
