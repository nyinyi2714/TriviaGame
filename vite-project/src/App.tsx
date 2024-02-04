import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, LoginPage, GamePage, LeaderboardPage } from './pages';
import { useAuth } from './hooks';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const { getUser } = useAuth();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setIsUserAuthenticated(userData);
    };

    fetchUser();
  }, [getUser]);

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={isUserAuthenticated ? <HomePage /> : <LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
