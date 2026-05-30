import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import FloatingTimer from './components/FloatingTimer'
import ErrorBoundary from './components/ErrorBoundary'
import OnboardingGuide from './components/OnboardingGuide'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Plan from './pages/Plan'
import Workout from './pages/Workout'
import Nutrition from './pages/Nutrition'
import History from './pages/History'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'
import ExerciseDetail from './pages/ExerciseDetail'
import Test from './pages/Test'
import { useAppStore } from './store'

function App() {
  const { profile, hasCompletedOnboarding, setCompletedOnboarding } = useAppStore()

  if (!profile) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-dark-bg">
          <Routes>
            <Route path="*" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-dark-bg pb-28">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            <Route path="/test" element={<Test />} />
          </Routes>
          <FloatingTimer />
          <BottomNav />
        </div>
      </ErrorBoundary>
      
      <OnboardingGuide 
        isOpen={!hasCompletedOnboarding} 
        onClose={() => setCompletedOnboarding(true)} 
      />
    </BrowserRouter>
  )
}

export default App
