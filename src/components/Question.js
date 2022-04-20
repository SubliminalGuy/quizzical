

export default function Question(props) {

  
  let answers = props.knowledge.answers.map(el =>  <p className={`answer-button ${el.clicked ? "blue" : ""}`} onClick={(e) => props.clickHandler(e)}>{el.answer}</p>)

  
    return (
        <div className="content-box">
            <h3>{props.knowledge.question}</h3>
            <div className="answer-box">
              {answers}
            </div>
        </div>
    )
    
}