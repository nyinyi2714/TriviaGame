import { Routes, Route } from 'react-router-dom'
import { StateProvider } from './StateContext'
import { HomePage } from './pages'
import './App.css'

function App() {

  return (
    <div className='app'>
      <StateProvider>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signin' element={null} />
            <Route path='/signup' element={null} />
          </Routes>
      </StateProvider>
    </div>
  )
}

export default App
