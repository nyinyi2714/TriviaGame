import { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import "./HomePage.css";

function HomePage() {
  const { logout } = useAuth();

  return (
    <div className="homepage">
      <h1>Trivia Game</h1>

      <div className="homepage-button">
        <button>NEW</button>
        <button>RESUME</button>
        <button>LEADERBOARD</button>
        <button>SETTINGS</button>
        <button onClick={logout}>LOGOUT</button>
      </div>
    </div>
  );
}

export default HomePage;
