import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAppStore } from '../store'
import { formatTime } from '../utils'

export default function FloatingTimer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { timerRunning, timerSeconds, tickTimer } = useAppStore()

  useEffect(() => {
    if (!timerRunning) return
    const interval = setInterval(tickTimer, 1000)
    return () => clearInterval(interval)
  }, [timerRunning, tickTimer])

  if (!timerRunning) return null

  const isWorkoutPage = location.pathname === '/workout'

  return (
    <button
      onClick={() => {
        if (!isWorkoutPage) navigate('/workout')
      }}
      className={`fixed z-50 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 ${
        isWorkoutPage
          ? 'top-4 right-4 px-3 py-1.5 rounded-xl text-xs opacity-80'
          : 'bottom-20 right-4 px-4 py-3 rounded-full animate-bounce-in'
      }`}
    >
      <div className="relative">
        <Clock className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
      </div>
      <span className="font-mono font-bold">{formatTime(timerSeconds)}</span>
    </button>
  )
}
