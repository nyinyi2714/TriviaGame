import { Routes, Route } from 'react-router-dom'
import { HomePage, LoginPage } from './pages'
import './App.css'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signin' element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
