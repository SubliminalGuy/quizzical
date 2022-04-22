import {nanoid} from "nanoid"

export default function Question(props) {

  
  let answers = props.knowledge.answers.map(el => { 
    let key = nanoid()
    return <p key={key} className={`button answer-button ${!props.revealed && el.clicked ? "blue" : ""} ${props.revealed && el.isCorrect ? "green" : ""} ${props.revealed && el.clicked ? "rose" : ""}`} onClick={(e) => props.clickHandler(e)}>{el.answer}</p>
  })
  

  
    return (
        <div className="content-box">
            <h3>{props.knowledge.question}</h3>
            <div className="answer-box">
              {answers}
            </div>
        </div>
    )
    
}