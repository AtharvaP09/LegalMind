import { BrowserRouter as Router, Routes, Route , Link } from 'react-router-dom'
import Dashboard from './Pages/DashBoard.jsx';
import backgroundVideo from "./Assets/BackgroundVideo.mov"; 
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Router>

    {/* Keeping the website simple no longer using a background video */}
      {/* <div className="app-container">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      </div>  */}

    </>
  )
}

export default App
