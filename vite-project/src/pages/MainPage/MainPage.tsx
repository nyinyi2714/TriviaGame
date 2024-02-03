// MainPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Question {
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

const MainPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    // Function to fetch trivia questions
    const fetchTriviaQuestions = async () => {
      try {
        const response = await axios.get(
          'https://opentdb.com/api.php?amount=5&type=multiple'
        )

        // Extracting questions from the API response
        const fetchedQuestions: Question[] = response.data.results

        // Update state with the fetched questions
        setQuestions(fetchedQuestions)
      } catch (error) {
        console.error('Error fetching trivia questions:', error)
      }
    }

    // Call the function when the component mounts
    fetchTriviaQuestions()
  }, [])

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    )
  }

  return (
    <div>
      <h1>Trivia Game</h1>
      {questions.length > 0 && (
        <div>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          {/* You can implement answer choices here */}
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
      {questions.length === 0 && <p>Loading questions...</p>}
    </div>
  )
}

export default MainPage
