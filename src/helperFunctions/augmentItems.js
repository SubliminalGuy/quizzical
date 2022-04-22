
export default function augmentItems(arr) {
    return arr.results.map(el => {
        let wrongAnswers = el.incorrect_answers.map(item => {
            return {
                answer: atob(item),
                clicked: false,
                isCorrect: false
            }
        })
        return {
        question: atob(el.question),
        answers: shuffle([{ answer: atob(el.correct_answer), clicked: false, isCorrect: true}, ...wrongAnswers])
        }
    })
}



// Shuffles the array so that the correct answer not always comes first

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}