import { useState, useEffect } from 'react'
import { useDelayCallback, useFetchQuestions, useSaveProgress, useTextToSpeech, useTimer } from '../../hooks'
import './GamePage.css'
import { useNavigate } from 'react-router-dom';

type Question = {
  userMoney: number;
  question_id: string;
  question: string;
  choices: string[];
}

function GamePage() {
  const { saveProgress } = useSaveProgress()
  const { speak, stop, isSpeaking } = useTextToSpeech()
  const { startTimer, cancelTimer, timeLeft } = useTimer()
  const { delayedCallback } = useDelayCallback()
  const navigate = useNavigate()

  const { fetchQuestions } = useFetchQuestions()
  const [questionData, setQuestionData] = useState<Question | null>(null)
  const [popUpMessage, setPopUpMessage] = useState("")
  const [isGameOver, setIsGameOver] = useState(false)

  const fetchAndSaveQuestionData = async () => {
    // reset game parameters
    setPopUpMessage('')
    cancelTimer()

    try {
      const responseData: Question = await fetchQuestions();

      if (responseData) {
        setQuestionData(responseData)

        // 15 sec to answer the question
        startTimer(15)

      } else {
        console.error("fetched question data is empty")
      }
    } catch (error) {
      console.error('Error fetching question data:', error);
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
  }, [])

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

  // contain scripts for Text-To-Speech Hook
  const askUserNextStep = (hasUserWon: null | boolean) => {
    // if game is not over
    if (hasUserWon === null) {
      // ask user to go to next question after the first TTS is done running
      delayedCallback(() => speak("click anywhere on the phone's screen to go to the next question"))
      return

      // User wins the game
    } else if (hasUserWon) {
      setPopUpMessage('Congratulation!')
      speak('Congratulation! You have reached one milion dollar')
      // ask user to go to homepage after the first TTS is done running

    } else {
      // User lost the game when money reaches 0
      setPopUpMessage('Game Over')
      speak('Game Over. You have lost all your money.')
    }

    // ask user to go to homepage after the first TTS is done running
    delayedCallback(() => speak("click anywhere on the phone's screen to go to the homepage"), 3000)
  }

  // check user's answer if it's correct by sending to backend
  const checkAnswer = async (questionData: Question, userChoice: string) => {
    const response = await saveProgress(questionData.question_id, userChoice);

    const { isUserCorrect, correctAnswer, hasUserWon } = response
    // hasUserWon === null means game is not over yet
    setIsGameOver(hasUserWon === null ? false : true)

    // if user is correct
    if (isUserCorrect) {
      setPopUpMessage('Correct!')
      speak("you are correct!")
      delayedCallback(() => askUserNextStep(hasUserWon), 1500)

    } else {
      // if user is incorrect
      setPopUpMessage(`The correct answer is ${correctAnswer}`)
      speak(`Incorrect! The correct answer is ${correctAnswer}.`)
      delayedCallback(() => askUserNextStep(hasUserWon), 3000)
    }

  }

  // when user choose an answer
  const handleChooseAns = async (e: any) => {
     // stop the timer
     cancelTimer()

    if (questionData) {
      checkAnswer(questionData, e.currentTarget.id)
    }
  };

  const speakQuestion = () => questionData && speak(questionData.question)

  // keep track of timeLeft
  useEffect(() => {
    if (timeLeft <= 0) {
      speak("Time's Up!")
      setPopUpMessage("Time's Up!")
      // if time's up before you choose, your answer will be saved as empty string
      if(questionData) {
        delayedCallback(() => checkAnswer(questionData, ""), 1500)
      }

      // 6 sec to accomodate the TTS API call lag
    } else if (timeLeft === 6) {
      // TODO
      speak("5 seconds left")
    }
  }, [timeLeft])

  // generate jsx to display the question and 4 answers
  const displayGameLayout = (questionData: Question) => {
    const answerGroup = ['A', 'B', 'C', 'D']
    return (
      <>
        <p>Timer : {timeLeft}</p>
        <p>Your Current Money: {questionData.userMoney}</p>
        <div className="question">
          <button className='gamepage-button'>
            <h2 onClick={speakQuestion}>{questionData.question}</h2>
          </button>
        </div>

        {questionData.choices.map((choice, index) => (
          <div key={index} className={`opt${index + 1}`}>
            <button
              id={choice}
              onClick={handleChooseAns}
              // onClick={() => speak(`${answerGroup[index]}. ${choice}`)}
              className={`gamepage-button gamepage-${answerGroup[index]}`}
            >
              {answerGroup[index]} {choice}
            </button>
          </div>
        ))}
      </>
    )
  }

  return (
    <div className='gamepage'>
      {
        popUpMessage.length > 0 &&
        <div onClick={handleNextStep} className='gamepage-popup-wrapper fullscreen'>
          <div className='gamepage-popup'>{popUpMessage}</div>
        </div>
      }
      {questionData ? displayGameLayout(questionData) : <p>Error getting a question</p>}
    </div>
  )
}

export default GamePage