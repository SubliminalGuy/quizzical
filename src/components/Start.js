
export default function Start(props) {
    return (
        <div className="content-box">
            <div className="content-box-start">
                <h1>El Cuestionario</h1>
                <h2>Elige los ajustes de tu prueba</h2>
                <div className="quiz-settings">
                    <select
                        className="quiz-select"
                        value={props.category}
                        onChange={e => props.setCategory(e.target.value)}
                    >
                        <option value="">Cualquier categoría</option>
                        {props.categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        className="quiz-select"
                        value={props.difficulty}
                        onChange={e => props.setDifficulty(e.target.value)}
                    >
                        <option value="">Cualquier dificultad</option>
                        <option value="easy">Fácil</option>
                        <option value="medium">Intermedio</option>
                        <option value="hard">Difícil</option>
                    </select>
                </div>
                <button className="button main-action-button" onClick={props.startQuiz}>Empezar prueba</button>
            </div>
        </div>
    )
}
