import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/AuthForm'

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
