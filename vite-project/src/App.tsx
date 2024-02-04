import { Routes, Route } from 'react-router-dom'
import { HomePage, LoginPage, GamePage } from './pages'
import './App.css'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/game' element={<GamePage />} />
      </Routes>
    </div>
  )
}

export default App
