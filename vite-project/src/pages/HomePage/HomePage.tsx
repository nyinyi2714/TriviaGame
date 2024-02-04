// HomePage.tsx
import { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage-button">
      <div className="new-box">
        <button className="homeBtn">NEW</button>
      </div>
      <div className="resume-box">
        <button className="homeBtn">RESUME</button>
      </div>
      <div className="leader-box">
        <button className="homeBtn">LEADERBOARD</button>
      </div>
      <div className="settings-box">
        <button className="homeBtn">SETTINGS</button>
      </div>
      <div className="logout-box">
        <button className="homeBtn">LOGOUT</button>
      </div>
    </div>
  );
}

export default HomePage;
