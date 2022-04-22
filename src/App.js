
import './App.css';
import {useState} from "react"

import {nanoid} from "nanoid"

import augmentItems from "./helperFunctions/augmentItems"
import Start from "./components/Start"
import Question from "./components/Question"


const bla = {"response_code":0,"results":[{"category":"SGlzdG9yeQ==","type":"bXVsdGlwbGU=","difficulty":"ZWFzeQ==","question":"V2hhdCB3YXMgTWFuZnJlZCB2b24gUmljaHRob2ZlbidzIG5pY2tuYW1lPw==","correct_answer":"VGhlIFJlZCBCYXJvbg==","incorrect_answers":["VGhlIEhpZ2ggRmx5aW5nIEFjZQ==","VGhlIEJsdWUgU2VycGVudCA=","VGhlIEdlcm1hbnkgR3VubmVy"]},{"category":"SGlzdG9yeQ==","type":"bXVsdGlwbGU=","difficulty":"aGFyZA==","question":"V2hlbiB3YXMgQWRvbGYgSGl0bGVyIGFwcG9pbnRlZCBhcyBDaGFuY2VsbG9yIG9mIEdlcm1hbnk\/","correct_answer":"SmFudWFyeSAzMCwgMTkzMw==","incorrect_answers":["U2VwdGVtYmVyIDEsIDE5Mzk=","RmVicnVhcnkgMjcsIDE5MzM=","T2N0b2JlciA2LCAxOTM5"]},{"category":"SGlzdG9yeQ==","type":"bXVsdGlwbGU=","difficulty":"bWVkaXVt","question":"VGhlIEtvcmVhbiBXYXIgc3RhcnRlZCBpbiB3aGF0IHllYXI\/","correct_answer":"MTk1MA==","incorrect_answers":["MTk0NQ==","MTk2MA==","MTkxMg=="]},{"category":"SGlzdG9yeQ==","type":"bXVsdGlwbGU=","difficulty":"bWVkaXVt","question":"SW4gMTg0NSwgYSBzZXJpZXMgb2Ygd2FycyBuYW1lZCBhZnRlciB3aGljaCBpbmRpZ2Vub3VzIHBlb3BsZSBiZWdhbiBpbiBOZXcgWmVhbGFuZD8=","correct_answer":"TcSBb3Jp","incorrect_answers":["UGFwdWFucw==","QWJvcmlnaW5lcw==","UG9seW5lc2lhbnM="]},{"category":"SGlzdG9yeQ==","type":"bXVsdGlwbGU=","difficulty":"bWVkaXVt","question":"V2hlbiBkaWQgTywgQ2FuYWRhIG9mZmljaWFsbHkgYmVjb21lIHRoZSBuYXRpb25hbCBhbnRoZW0\/","correct_answer":"MTk4MA==","incorrect_answers":["MTk1MA==","MTkyMA==","MTg4MA=="]}]}


function App() {

  // gives the useState for questions some bulk data to chew on. It seems not to work without ...
  let itemsAugmented = augmentItems(bla)
  
  let [questions, setQuestions] = useState(itemsAugmented)
  let [quizStarted, setQuizStarted] = useState(false)
  let [revealAnswers, setRevealAnswers] = useState(false)
  let [counter, setCounter] = useState(0)
  
// gets 5 questions from the API and re-wrapps them in a way useful for the app purpose
  function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&category=23&type=multiple&encode=base64")
          .then(res => res.json()) 
          .then(data => augmentItems(data))
          .then(result => setQuestions(result))
  }


  
 /*
  useEffect(() => {
    fetchQuestions()
          
  }, [])
  */

  function startQuiz(){
    setQuizStarted(true) 
    setRevealAnswers(false) 
    fetchQuestions()
  }


  function gotClicked(e) {
    let buttonText = e.target.innerText
    
    //check which Answer has been clicked and change the the "clicked"-property accordingly
    setQuestions(prevState => {
      return prevState.map(el => {
      let changedClicks = el.answers.map(item => {
      
          if (item.answer.trim() === buttonText) {
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
      return <button onClick={checkAnswers} className="button check-answers-button">Check answers</button>
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
    return <Question knowledge={el} revealed={revealAnswers} key={key} clickHandler={gotClicked}  />
  })

  return (
    <div className="main-container">
      { !quizStarted ? <Start startQuiz={startQuiz}/> : allQuestions}
      {renderCheckButton()}
    </div>
  );
}

export default App;
