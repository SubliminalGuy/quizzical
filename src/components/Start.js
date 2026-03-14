
export default function Start(props) {
    return (
        <div className="content-box">
            <div className="content-box-start">
                <h1>El Cuestionario</h1>
                <h2>¿Cuánto sabes de historia en español?</h2>
                <button className="button main-action-button" onClick={props.startQuiz}>Empezar prueba</button>
            </div>
        </div>
    )
}
