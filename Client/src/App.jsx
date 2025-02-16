import { BrowserRouter as Router, Routes, Route , Link } from 'react-router-dom'
import UserRegistration from './Pages/UserRegistration' 
import UserLogin from './Pages/UserLogin'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/UserRegistration" element={<UserRegistration />} />
          <Route path="/UserLogin" element={<UserLogin/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
