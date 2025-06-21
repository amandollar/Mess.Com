import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Game from './Pages/Game'
import Landing from './Pages/Landing'


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/game' element={<Game/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
