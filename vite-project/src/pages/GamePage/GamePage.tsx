import { useState, useEffect } from 'react'
import { useFetchQuestions, useSaveProgress, useTextToSpeech, useTimer } from '../../hooks'
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
  const { timer, cancelTimer } = useTimer()
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
        timer(15).then(() => {
          speak("Time's Up!").then()
          setPopUpMessage("Time's Up!")
        }) 

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
      stop()
    }
  }, [])

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

  const askUserNextStep = (hasUserWon: null | boolean) => {
    // if game is not over
    if (hasUserWon === null) {
      // ask user to go to next question after the first TTS is done running
      speak("click anywhere on the phone's screen to go to the next question")
      // User wins the game
    } else if (hasUserWon) {
      speak('Congrulation! You have reached one milion dollar').then(() => {
        // ask user to go to homepage after the first TTS is done running
        speak("click anywhere on the phone's screen to go to the homepage")
      })
      setPopUpMessage('Congrulation!')
    } else {

      // User lost the game when money reaches 0
      speak('You have lost all your money. Game Over').then(() => {
        // ask user to go to homepage after the first TTS is done running
        speak("click anywhere on the phone's screen to go to the homepage")
      })
      setPopUpMessage('Game Over')
    }
  }

  const handleChooseAns = async (e: any) => {
    if (questionData) {
      const response = await saveProgress(questionData.question_id, e.current.target.id);
  
      const { isUserCorrect, correctAnswer, hasUserWon } = response
      // hasUserWon === null means game is not over yet
      setIsGameOver(hasUserWon === null ? false : true)

      // if user is correct
      if (isUserCorrect) {
        speak("you are correct!").then(() => {
          askUserNextStep(hasUserWon)
        })
        setPopUpMessage('Correct!')
          askUserNextStep(hasUserWon)
      } else {
        // if user is incorrect
        speak(`The correct answer is ${correctAnswer}`).then(() => {
          
        })
        setPopUpMessage(`Incorrect! The correct answer is ${correctAnswer}`)
      }
      
    }
  };

  const displayGameLayout = (questionData: Question) => {
    const answerGroup = ['A', 'B', 'C', 'D']
    return (
      <>
        <p>Your Current Money: {questionData.userMoney}</p>
        <div className="question">
          <button className='gamepage-button'>
            <h2>{questionData.question}</h2>
          </button>
        </div>

        {questionData.choices.map((choice, index) => (
          <div key={index} className={`opt${index + 1}`}>
            <button
              id={choice}
              onDoubleClick={handleChooseAns}
              onClick={() => speak(`${answerGroup[index]}. ${choice}`)}
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
      {popUpMessage.length <= 0 && 
      <div onClick={handleNextStep} className='gamepage-popup-wrapper'>
        <div className='gamepage-popup'>{popUpMessage}</div>
      </div>
      }
      {questionData ? displayGameLayout(questionData) : <p>Error getting a question</p>}
    </div>
  )
}

export default GamePage