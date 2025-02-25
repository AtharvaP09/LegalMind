import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import UserRegistration from './Pages/UserRegistration' 
import UserLogin from './Pages/UserLogin'
import './App.css'
import Dashboard from './Pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />}/>
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path="/UserLogin" element={<UserLogin/>}/>
      </Routes>
    </Router>

    /* Backgorund Video for all pages*/
    // <div className="app-container">
    // <video autoPlay loop muted className="background-video">
    //   <source src={backgroundVideo} type="video/mp4" />
    //   Your browser does not support the video tag.
    // </video>
    // </div>

  )
}

export default App
