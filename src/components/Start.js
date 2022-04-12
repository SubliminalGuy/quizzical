
export default function Start(props) {
    return (
        <div className="content-box">
            <h1>Quizzical</h1>
            <h2>The lunch break quiz for smarty pants ...</h2>
            <button className="main-action-button" onClick={props.getQuestions} >Start quiz</button>
        </div>
    )
    
}