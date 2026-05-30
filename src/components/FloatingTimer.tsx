import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function FloatingTimer() {
  const navigate = useNavigate()
  const { timerRunning, timerSeconds, startTimer, stopTimer, resetTimer } = useAppStore()
  const [position, setPosition] = useState({ x: 24, y: 24 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newX = dragRef.current.initialX + (e.clientX - dragRef.current.startX)
      const newY = dragRef.current.initialY + (e.clientY - dragRef.current.startY)
      const maxX = window.innerWidth - 180
      const maxY = window.innerHeight - 100
      setPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    }
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      navigate('/workout')
    }
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  if (timerSeconds === 0 && !timerRunning) return null

  return (
    <div
      className={`fixed z-40 ${isDragging ? '' : 'transition-all duration-200'}`}
      style={{ top: position.y, right: position.x }}
    >
      <div
        className="bg-dark-card border border-neon/30 rounded-[24px] px-4 py-3 flex items-center gap-3 shadow-lg cursor-pointer active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onClick={handleContainerClick}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center">
            <span className="text-neon font-mono font-bold text-sm">
              {formatTime(timerSeconds)}
            </span>
          </div>
          {timerRunning && (
            <div className="absolute inset-0 rounded-full border-2 border-neon animate-pulse-ring" />
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => handleButtonClick(e, timerRunning ? stopTimer : startTimer)}
            className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center hover:bg-neon/20 transition-colors"
          >
            {timerRunning ? (
              <Pause className="w-4 h-4 text-neon" />
            ) : (
              <Play className="w-4 h-4 text-neon ml-0.5" />
            )}
          </button>
          <button
            onClick={(e) => handleButtonClick(e, resetTimer)}
            className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center hover:bg-neon/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-neon" />
          </button>
        </div>
      </div>
    </div>
  )
}
