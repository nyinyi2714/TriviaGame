import { useEffect } from "react"
import { useTextToSpeech } from "../../hooks"
import { useNavigate } from "react-router-dom"
import "./Header.css";

function Header(props: { header: string }) {
  const { header } = props;
  const navigate = useNavigate()
  const { speak, isSpeaking, stop } = useTextToSpeech()

  const goToMenu = () => {
    navigate('/')
  }

  const handleDoubleClick = (e: any) => {
    // if TTS is running, return
    if (isSpeaking) return

    // Check if the element has the attribute data-selected set to true
    const isSelected = e.target.getAttribute('data-selected') === 'true';
    if (isSelected) {
      goToMenu()

    } else {
      // Handle the case when data-selected is false
      // speak what the button is
      speak('Go back to Menu')

      // Reset all the data-selected in all buttons on the page
      const allButtons = document.querySelectorAll('img');
      allButtons.forEach(button => button.setAttribute('data-selected', 'false'));

      // Set data-selected in e.target to true
      e.target.setAttribute('data-selected', 'true');
    }
  }

  useEffect(() => {
    // Clean up func
    return(
      stop()
    )
  }, [])

  return (
    <div className="container-header">
      <div className="title">{header}</div>
      <div className="back-btn-box">
        <button className="back-btn">
          <img src="https://img.icons8.com/ios/50/000000/back--v1.png" alt="back" onClick={handleDoubleClick} />
        </button>
      </div>
    </div>
  );
}

export default Header;