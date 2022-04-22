
export default function Start(props) {
    return (
        <div className="content-box">
            <div className="content-box-start">
                <h1>The Quiz</h1>
                <h2>Lo que hay de saber sobre historia...</h2>
                <button className="button main-action-button" onClick={props.startQuiz} >Start quiz</button>
            </div>
        </div>
    )
    
}