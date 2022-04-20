//import Answers from "./Answers"

export default function Question(props) {

  /*
  let answers = []
  answers.push(props.knowledge.correct_answer)
answers.push(...props.knowledge.incorrect_answers)
  let allAnswers = answers.map(el => <Answers answers={el} />)

*/
    
    return (
        <div className="content-box">
            <h2>{props.knowledge.question}</h2>
<p className={props.knowledge.clicked ? "reddish": ""}>{props.knowledge.correct_answer}</p>
        </div>
    )
    
}