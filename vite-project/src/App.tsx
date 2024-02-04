import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage, LoginPage, GamePage } from './pages';
import Leaderboard from './pages/Leaderboard/leaderboard';
import { Header } from "./components";
import "./App.css";
import Settings from './pages/Settings/Settings';


function App() {

  return (
    <div className='app'>
      {/* Conditionally render Header if not on the login page */}
      
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/gameplay' element={<GamePage />} />
        <Route path='/Leaderboard' element={<Leaderboard />} />
        <Route path='/Settings' element={<Settings />} />

        
      </Routes>
    </div>
  );
}

export default App;
