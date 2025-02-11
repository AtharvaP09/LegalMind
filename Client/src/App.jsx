import { useState } from 'react'
import './App.css'
import SummaryInterface from "./SummaryInterface"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SummaryInterface/>
    </>
  )
}

export default App
