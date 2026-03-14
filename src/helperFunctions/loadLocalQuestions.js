import { nanoid } from "nanoid"

function shuffle(array) {
  let currentIndex = array.length, randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

export default function loadLocalQuestions(questions, count = 5) {
  const shuffled = shuffle([...questions])
  return shuffled.slice(0, count).map(q => ({
    id: nanoid(),
    question: q.question,
    answers: shuffle([
      { answer: q.correct_answer, clicked: false, isCorrect: true },
      ...q.incorrect_answers.map(a => ({ answer: a, clicked: false, isCorrect: false }))
    ])
  }))
}
