<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom'
import { HomePage, LoginPage, GamePage,  } from './pages'
import './App.css'
import Leaderboard from './pages/Leaderboard/leaderboard'
=======
import { Routes, Route } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { Header } from "./components";
import "./App.css";
>>>>>>> 4e79fdc742006472d6a51e591705cb1724a5fcf9

function App() {
  return (
<<<<<<< HEAD
    <div className='app'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/Leaderboard' element={<Leaderboard />} />
          
      </Routes>
=======
    <div className="container-app">
      <div className="game-head">
        <Header header={"FixTitle"} />
      </div>
      <div className="game-shell">
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
>>>>>>> 4e79fdc742006472d6a51e591705cb1724a5fcf9
    </div>
  );
}

export default App;
