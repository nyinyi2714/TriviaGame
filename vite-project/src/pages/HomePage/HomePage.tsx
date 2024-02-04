// HomePage.tsx
import { useState, useEffect } from 'react'
import './HomePage.css'


function HomePage() {

  return (
    <div className='homepage'>
      <h1>Trivia Game</h1>
      <h2>WHO WANTS TO BE A MILLIONAIRE</h2>

      <div className='homepage-button'>
        <button>NEW</button>
        <button>RESUME</button>
        <button>LEADERBOARD</button>
        <button>SETTINGS</button>
        <button>LOGOUT</button>
      </div>
    </div>
    
  )
}

export default HomePage
