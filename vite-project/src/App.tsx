import { Routes, Route } from 'react-router-dom'
import { HomePage, LoginPage, GamePage,  } from './pages'
import './App.css'
import Leaderboard from './pages/Leaderboard/leaderboard'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/Leaderboard' element={<Leaderboard />} />
          
      </Routes>
    </div>
  )
}

export default App
