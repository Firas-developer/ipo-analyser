import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import AnalysisPage from './pages/AnalysisPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const handleNavigateToAnalysis = () => {
    setCurrentPage('analysis')
  }

  const handleNavigateToLanding = () => {
    setCurrentPage('landing')
  }

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onNavigateToAnalysis={handleNavigateToAnalysis} />
      ) : (
        <AnalysisPage onNavigateToLanding={handleNavigateToLanding} />
      )}
    </>
  )
}

export default App
