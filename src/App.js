
import './App.css';
import {useState} from "react"

import {nanoid} from "nanoid"

import shuffleHelper from "./helperFunctions/shuffleHelper"
import Start from "./components/Start"
import Question from "./components/Question"


const bla = {"response_code":0,"results":[{"category":"Geography","type":"multiple","difficulty":"medium","question":"What European country is not a part of the EU?","correct_answer":"Norway","incorrect_answers":["Lithuania","Ireland","Czechia"]},{"category":"Geography","type":"multiple","difficulty":"medium","question":"Which state of the United States is the smallest?","correct_answer":"Rhode Island ","incorrect_answers":["Maine","Vermont","Massachusetts"]},{"category":"Geography","type":"multiple","difficulty":"medium","question":"What is the only country in the world with a flag that doesn't have four right angles?","correct_answer":"Nepal","incorrect_answers":["Panama","Angola","Egypt"]},{"category":"Geography","type":"multiple","difficulty":"medium","question":"The Principality of Sealand is an unrecognized micronation off the coast of what country?","correct_answer":"The United Kingdom","incorrect_answers":["Japan","Austrailia","Argentina"]},{"category":"Geography","type":"multiple","difficulty":"medium","question":"Which Canadian province has Charlottetown as its capital?","correct_answer":"Prince Edward Island","incorrect_answers":["Saskachewan","Northwest Terrirories","Ontario"]}]}


function App() {

  let itemsAugmented = bla.results.map(el => {
      let wrongAnswers = el.incorrect_answers.map(item => {
        return {
          answer: item,
          clicked: false,
          isCorrect: false
        }
      })
      
    return {
      question: el.question,
      answers: shuffleHelper([{ answer: el.correct_answer, clicked: false, isCorrect: true}, ...wrongAnswers])
    }

  })
  

  
  let [questions, setQuestions] = useState(itemsAugmented)
  let [quizStarted, setQuizStarted] = useState(false)
/*
useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
          .then(res => res.json())
          .then(data => setQuestions(data.results))
          
  }, [])*/
  
  function startQuiz(){
    setQuizStarted(true)  
  }

  function gotClicked(e) {
    let buttonText = e.target.innerText
    
    let alteredQuestions = questions.map(el => {
        let changedClicks = el.answers.map(item => {
        
          if (item.answer === buttonText) {
            return {
              ...item,
              clicked: !item.clicked
            }
          }
          else {
            return item
          }
        })
      return {
        ...el,
        answers: changedClicks
      }
      
    })
    
    setQuestions(alteredQuestions)
  }


let allQuestions = questions.map(el => {
  let key = nanoid()
  return <Question knowledge={el} key={key} clickHandler={gotClicked}  />
}
)

  return (
    <div className="main-container">
      { !quizStarted ? <Start startQuiz={startQuiz}/> : allQuestions}
      
    </div>
  );
}

export default App;
