
export default function Start(props) {
    return (
        <div className="content-box">
            <div className="content-box-start">
                <h1>The Quiz</h1>
                <h2>Choose your quiz settings below</h2>
                <div className="quiz-settings">
                    <select
                        className="quiz-select"
                        value={props.category}
                        onChange={e => props.setCategory(e.target.value)}
                    >
                        <option value="">Any Category</option>
                        {props.categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        className="quiz-select"
                        value={props.difficulty}
                        onChange={e => props.setDifficulty(e.target.value)}
                    >
                        <option value="">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <button className="button main-action-button" onClick={props.startQuiz}>Start quiz</button>
            </div>
        </div>
    )
}
