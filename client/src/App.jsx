import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/AuthForm'
import Home from './components/Home';


function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={<Home/>}  />
      </Routes>
    </div>
  )
}

export default App
