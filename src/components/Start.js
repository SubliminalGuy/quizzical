
export default function Start(props) {
    return (
        <div className="content-box-start">
            <div className="start-badge">🧠</div>
            <h1>El Cuestionario</h1>
            <h2>¿Cuánto sabes de historia en español?<br/>5 preguntas · ¡Demuestra lo que sabes!</h2>
            <button className="button main-action-button" onClick={props.startQuiz}>¡Jugar ahora!</button>
        </div>
    )
}
