import { useState, useEffect } from 'react'
import { useDelayCallback, useFetchQuestions, useSaveProgress, useTextToSpeech, useTimer } from '../../hooks'
import { Header } from "../../components"
import './GamePage.css'
import { useNavigate } from 'react-router-dom'

type Question = {
  userMoney: number
  question_id: string
  question: string
  choices: string[]
}

function GamePage() {
  const { saveProgress } = useSaveProgress()
  const { speak, stop, isSpeaking } = useTextToSpeech()
  const { startTimer, cancelTimer, timeLeft } = useTimer()
  const { delayedCallback } = useDelayCallback()
  const navigate = useNavigate()


  const { fetchQuestions } = useFetchQuestions()
  const sampleQuestion = {
    question: 'Welcome!',
    choices: ['A', 'B', 'C', 'D'],
    userMoney: 6000,
    question_id: "",
  }
  const [questionData, setQuestionData] = useState<Question>(sampleQuestion)
  const [popUpMessage, setPopUpMessage] = useState("")
  const [isGameOver, setIsGameOver] = useState(false)
  const [startGame, setStartGame] = useState(false)

  const answerGroup = ['A', 'B', 'C', 'D']

  const fetchAndSaveQuestionData = async () => {
    // if game is not started, return
    if (!startGame) return

    // reset game parameters
    setPopUpMessage('')
    cancelTimer()

    try {
      const responseData: Question = await fetchQuestions()

      if (responseData) {
        setQuestionData(responseData)
        speakQuestionsAndChoice(responseData)
        // 30 sec to answer the question
        startTimer(30)

      } else {
        console.error("fetched question data is empty")
      }
    } catch (error) {
      console.error('Error fetching question data:', error)
    }
  }

  // Get question data from backend to display
  useEffect(() => {
    fetchAndSaveQuestionData()

    // Clean up Func for timers and TTS
    return () => {
      cancelTimer()
      stop() // stop the TTS from playing the audio
    }
  }, [startGame])

  // go to homepage or next question based on game status 
  const handleNextStep = (e: any) => {
    // Stop the event propagation
    e.stopPropagation()

    // diabled when TTS is running
    if (isSpeaking) return

    // if game over, redirect to homepage
    if (isGameOver) navigate('/')
    // else fetch next question
    else fetchAndSaveQuestionData()
  }

  // check user's answer if it's correct by sending to backend
  const checkAnswer = async (questionData: Question, userChoice: string) => {
    const response = await saveProgress(questionData.question_id, userChoice)

    const { isUserCorrect, correctAnswer, hasUserWon } = response
    // hasUserWon === null means game is not over yet
    setIsGameOver(hasUserWon === null ? false : true)

    let textToSpeech = ''

    // if user is correct
    if (isUserCorrect) {
      setPopUpMessage('Correct!')
      textToSpeech += 'correct!'

    } else {
      // if user is incorrect
      setPopUpMessage(`The correct answer is ${correctAnswer}`)
      textToSpeech += `Incorrect! The correct answer is ${correctAnswer}.`
    }

    // if game is not over
    if (hasUserWon === null) {
      // ask user to go to next question after the first TTS is done running
      textToSpeech += "click anywhere on the phone's screen to go to the next question"
      speak(textToSpeech)
      return

      // User wins the game
    } else if (hasUserWon) {
      textToSpeech += 'Congratulation! You have reached one milion dollar'

    } else {
      // User lost the game when money reaches 0
      textToSpeech += 'Game Over. You have lost all your money.'
    }

    textToSpeech += "click anywhere on the phone's screen to go to the homepage"
    speak(textToSpeech)
  }

  // when user choose an answer
  const handleChooseAns = async (buttonId: string) => {
    // stop the timer
    cancelTimer()

    if (questionData) {
      checkAnswer(questionData, buttonId)
    }
  }

  const speakQuestion = () => questionData && speak(questionData.question)

  const speakQuestionsAndChoice = (questionData: Question) => {
    let textToSpeech = questionData.question
    questionData.choices.forEach((choice, index) => {
      textToSpeech += answerGroup[index] + choice + ". "
    })
    textToSpeech += 'you have ' + questionData.userMoney + 'dollar'
    speak(textToSpeech)
  }

  const handleDoubleClick = (e: any) => {
    // if TTS is running, return
    if (isSpeaking) return

    // Check if the element has the attribute data-selected set to true
    const isSelected = e.target.getAttribute('data-selected') === 'true'
    if (isSelected) {
      // Handle the case when data-selected is true
      handleChooseAns(e.target.id)

    } else {
      // Handle the case when data-selected is false
      // speak what the button is
      speak(e.target.value)

      // Reset all the data-selected in all buttons on the page
      const allButtons = document.querySelectorAll('.gamepage-button')
      allButtons.forEach(button => button.setAttribute('data-selected', 'false'))

      // Set data-selected in e.target to true
      e.target.setAttribute('data-selected', 'true')
    }
  }

  // keep track of timeLeft
  useEffect(() => {
    if (timeLeft <= 0) {
      speak("Time's Up!")
      setPopUpMessage("Time's Up!")
      // if time's up before you choose, your answer will be saved as empty string
      if (questionData) {
        delayedCallback(() => checkAnswer(questionData, ""), 1500)
      }
    }
  }, [timeLeft])

  // generate jsx to display the question and 4 answers
  const displayGameLayout = (questionData: Question) => {
    return (
      <>
        <div className="gamepage-score">
          <p>Timer : {timeLeft}</p>
          <p>Your Current Money: {questionData.userMoney}</p>
        </div>
        <div className="question">
          <button className='gamepage-button'>
            <h2 onClick={speakQuestion}>{questionData.question}</h2>
          </button>
        </div>

        {questionData.choices.map((choice, index) => (
          <div key={index} className={`opt${index + 1}`}>
            <button
              id={choice}
              onClick={handleDoubleClick}
              value={`${answerGroup[index]}. ${choice}`}
              className={`gamepage-button gamepage-${answerGroup[index]}`}
            >
              {answerGroup[index]} {choice}
            </button>
          </div>
        ))}
      </>
    )
  }

  const handleStartGame = () => {
    setStartGame(true)
  }

  return (
    <>
      <Header header='Game Page' />
      <div className='gamepage'>
      {
        !startGame && <div onClick={handleStartGame} className='gamepage-startgame'>
          <p className='gamepage-ready-text'>Click Anywhere on Screen</p>
        </div>
      }
      {
        popUpMessage.length > 0 &&
        <div onClick={handleNextStep} className='gamepage-popup-wrapper fullscreen'>
          <div className='gamepage-popup'>{popUpMessage}</div>
        </div>
      }
      {questionData && displayGameLayout(questionData)}
    </div>
    </>
  )
}

export default GamePage