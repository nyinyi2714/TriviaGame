// HomePage.tsx
import "./HomePage.css";
import React, {useState} from "react";


function HomePage() {

  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const speakText = (text: string | undefined) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleClick = (optiontext: string) => {
    const optionText = optiontext;

    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      console.log('Double Click - Select Option');
      // Handle double click (select option)
    } else {
      const newTimeout = setTimeout(() => {
        console.log('Single Click - Read Option');
        // Handle single click (read option)
        speakText(optionText);
        setClickTimeout(null);
      }, 300); // 300 ms timeout for the second click
      setClickTimeout(newTimeout);
    }
  }

  return (

    <div>
    <div className="title">HomePage </div>
    
   <div className="homepage-button">

      <div className="new-box">
      <button onClick={() => handleClick('New')} className="homeBtn">NEW</button>
      </div>
      <div className="resume-box">
        <button onClick={() => handleClick('RESUME')} className="homeBtn">RESUME</button>
      </div>
      <div className="leader-box">
        <button onClick={() => handleClick('LEADERBOARD')} className="homeBtn">LEADERBOARD</button>
      </div>
      <div className="settings-box">
        <button onClick={() => handleClick('SETTINGS')} className="homeBtn">SETTINGS</button>
      </div>
      <div className="logout-box">
        <button onClick={() => handleClick('LOGOUT')} className="homeBtn">LOGOUT</button>
      </div>
      </div>
    </div>


  );

}

export default HomePage;
