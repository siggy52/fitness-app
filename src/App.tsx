import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import FloatingTimer from './components/FloatingTimer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Plan from './pages/Plan'
import Workout from './pages/Workout'
import Nutrition from './pages/Nutrition'
import History from './pages/History'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'
import ExerciseDetail from './pages/ExerciseDetail'
import { useAppStore } from './store'

function App() {
  const { profile } = useAppStore()

  if (!profile) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
        <div className="min-h-screen bg-gray-50 pb-20">
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
        </Routes>
        <FloatingTimer />
        <BottomNav />
      </div>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
