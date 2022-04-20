
export default function Start(props) {
    return (
        <div className="content-box">
            <h1>The Quiz</h1>
            <h2>Lo que hay de saber sobre geografía...</h2>
            <button className="main-action-button" onClick={props.startQuiz} >Start quiz</button>
        </div>
    )
    
}