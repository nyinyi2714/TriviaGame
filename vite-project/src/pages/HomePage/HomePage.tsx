import { useNavigate } from "react-router-dom"
import { useAuth, useTextToSpeech } from "../../hooks"
import "./HomePage.css"
import { useEffect } from "react"

function HomePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { speak, isSpeaking, stop } = useTextToSpeech()

  const handleDoubleClick = (e: any) => {
    // if TTS is running, return
    if (isSpeaking) return

    // Check if the element has the attribute data-selected set to true
    const isSelected = e.target.getAttribute('data-selected') === 'true'
    if (isSelected) {
      // Handle the case when data-selected is true
      if(e.target.id === 'logout') logout()
      navigate(`/${e.target.id}`)

    } else {
      // Handle the case when data-selected is false
      // speak what the button is
      if(e.target.id === 'game') speak('Play the game')
      else speak(`go to ${e.target.id}`)

      // Reset all the data-selected in all buttons on the page
      const allButtons = document.querySelectorAll('button')
      allButtons.forEach(button => button.setAttribute('data-selected', 'false'))

      // Set data-selected in e.target to true
      e.target.setAttribute('data-selected', 'true')
    }
  }

  useEffect(() => {
    // Clean up func
    return(
      stop()
    )
  }, [])

  return (
    <div className="homepage">
      <h1>Trivia Game</h1>
      <div className="homepage-button">
        <button id="game" onClick={handleDoubleClick}>PLAY</button>
        <button id="leaderboard" onClick={handleDoubleClick}>LEADERBOARD</button>
        <button id="settings" onClick={handleDoubleClick}>SETTINGS</button>
        <button id="logout" onClick={handleDoubleClick}>LOGOUT</button>
      </div>
    </div>
  )
}

export default HomePage
