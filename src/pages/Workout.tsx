import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Check, RotateCcw, Play, Pause, Trash2 } from 'lucide-react'
import { useAppStore } from '../store'
import { ExerciseSelector } from '../components/ExerciseSelector'
import { NumberInput } from '../components/NumberInput'
import Toast from '../components/Toast'
import { getTodayString, formatDate, getSuggestedWeight, shouldDeload, getConsecutiveWorkoutDays } from '../utils'
import { useLastTrainingData } from '../hooks/useLastTrainingData'
import type { Exercise, ToastMessage } from '../types'

export default function Workout() {
  const navigate = useNavigate()
  const { 
    workoutPlans, 
    workoutLogs, 
    addWorkoutLog, 
    startTimer, 
    stopTimer, 
    resetTimer, 
    timerRunning, 
    timerSeconds, 
    tickTimer,
    currentWorkout,
    currentExerciseIndex,
    isResting,
    restSeconds,
    setCurrentWorkout,
    setCurrentExerciseIndex,
    setIsResting,
    setRestSeconds,
    updateWorkoutExercise,
    removeWorkoutExercise,
    clearCurrentWorkout
  } = useAppStore()
  const getLastTrainingData = useLastTrainingData()
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const restIntervalRef = useRef<ReturnType<typeof setInterval>>()
  
  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, message }])
  }
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const waveAnimations = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      height: `${20 + Math.random() * 40}px`,
      animationDelay: `${i * 0.1}s`,
      opacity: 0.6 + Math.random() * 0.4,
    }))
  }, [])

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        tickTimer()
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerRunning, tickTimer])

  const currentExercise = currentWorkout[currentExerciseIndex]

  useEffect(() => {
    if (isResting && restSeconds > 0) {
      restIntervalRef.current = setInterval(() => {
        const newSeconds = restSeconds - 1
        if (newSeconds <= 1) {
          setIsResting(false)
          setRestSeconds(0)
          if (currentExercise && currentExercise.sets > 1) {
            updateWorkoutExercise(currentExerciseIndex, 'sets', currentExercise.sets - 1)
          }
        } else {
          setRestSeconds(newSeconds)
        }
      }, 1000)
    }
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current)
    }
  }, [isResting, restSeconds, currentExerciseIndex, currentExercise])

  useEffect(() => {
    if (currentWorkout.length > 0 && !workoutStarted) {
      setWorkoutStarted(true)
    }
  }, [currentWorkout.length, workoutStarted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddExercise = (exerciseName: string) => {
    if (currentWorkout.some(ex => ex.name === exerciseName)) {
      addToast('error', `${exerciseName} 已添加`)
      setShowExerciseSelector(false)
      return
    }
    const last = getLastTrainingData(exerciseName)
    const exercise: Exercise = {
      name: exerciseName,
      weight: last?.lastWeight || 0,
      sets: 3,
      reps: last?.lastReps || 10,
      rpe: 7,
      completedSets: 0,
    }
    setCurrentWorkout([...currentWorkout, exercise])
    setShowExerciseSelector(false)
  }

  const handleAddFromPlan = (planId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId)
    if (plan) {
      const today = new Date().getDay()
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const todayName = dayNames[today]
      const dayPlan = plan.trainingDays.find((d) => d.day === todayName)
      if (dayPlan) {
        const exercisesWithCompletedSets = dayPlan.exercises.map(ex => ({ ...ex, completedSets: 0 }))
        setCurrentWorkout(exercisesWithCompletedSets)
        addToast('success', `已添加 ${plan.name} 的${todayName}训练`)
      } else {
        addToast('error', `${plan.name}中没有${todayName}的训练安排`)
      }
    }
    setShowPlanSelector(false)
  }

  const handleSaveWorkout = () => {
    if (currentWorkout.length === 0) return
    addWorkoutLog({
      date: getTodayString(),
      exercises: currentWorkout,
    })
    resetTimer()
    clearCurrentWorkout()
    addToast('success', '训练记录已保存！')
  }

  const handleCompleteSet = () => {
    if (!currentExercise) return

    if (currentExercise.weight === 0) {
      addToast('error', '请先设置重量')
      return
    }

    const completedSets = (currentExercise.completedSets || 0) + 1

    if (currentExercise.sets <= 1) {
      updateWorkoutExercise(currentExerciseIndex, 'completedSets', completedSets)
      if (currentExerciseIndex < currentWorkout.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setIsResting(false)
        setRestSeconds(0)
        addToast('success', `已完成 ${currentExercise.name}，下一个！`)
      } else {
        setIsResting(false)
        setRestSeconds(0)
        addToast('success', '恭喜！所有动作已完成！')
      }
    } else {
      updateWorkoutExercise(currentExerciseIndex, 'sets', currentExercise.sets - 1)
      updateWorkoutExercise(currentExerciseIndex, 'completedSets', completedSets)
      setIsResting(true)
      setRestSeconds(60)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop"
          alt="Workout Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-dark-bg/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 pt-12 pb-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="glass w-10 h-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </header>

        {currentWorkout.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 rounded-full bg-neon/10 flex items-center justify-center mb-6">
              <Play className="w-10 h-10 text-neon" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">开始训练</h2>
            <p className="text-dark-muted text-center mb-8">添加动作开始记录你的训练</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowExerciseSelector(true)}
                className="flex-1 bg-neon text-dark-bg py-4 rounded-[32px] font-bold text-lg shadow-fab hover:shadow-fab-hover transition-all"
              >
                添加动作
              </button>
              <button
                onClick={() => setShowPlanSelector(true)}
                className="flex-1 bg-dark-card border border-dark-border text-white py-4 rounded-[32px] font-bold text-lg hover:border-zinc-700 transition-colors"
              >
                从计划添加
              </button>
            </div>
          </div>
        ) : (
          /* Active Workout */
          <div className={`flex-1 flex flex-col px-6 ${workoutStarted ? 'animate-workout-start' : ''}`}>
            {/* Tags */}
            <div className="flex gap-3 mb-6">
              <span className="tag-pill glass text-white text-xs">
                {formatDate(getTodayString())}
              </span>
              <span className="tag-pill bg-neon text-dark-bg text-xs">
                第 {currentExerciseIndex + 1}/{currentWorkout.length} 个动作
              </span>
            </div>

            {/* Exercise Name */}
            {currentExercise && (
              <>
                <h1 className="text-4xl font-black text-white mb-2">
                  {currentExercise.name}
                </h1>
                <p className="text-lg text-dark-muted mb-2">
                  {currentExercise.sets} 组 x {currentExercise.reps} 次
                </p>

                {/* Suggestion Tags */}
                {(() => {
                  const suggestion = getSuggestedWeight(currentExercise.name, workoutLogs)
                  const consecutive = getConsecutiveWorkoutDays(workoutLogs)
                  const deload = shouldDeload(0, consecutive)
                  return (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {suggestion.suggestedWeight > 0 && (
                        <span className="text-xs text-cyan-accent bg-cyan-accent/10 px-2.5 py-1 rounded-full">
                          建议 {suggestion.suggestedWeight}kg
                        </span>
                      )}
                      {suggestion.progress === 'plateau' && (
                        <span className="text-xs text-orange-accent bg-orange-accent/10 px-2.5 py-1 rounded-full">
                          平台期
                        </span>
                      )}
                      {suggestion.progress === 'up' && suggestion.lastWeight > 0 && (
                        <span className="text-xs text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">
                          +2.5kg ↑
                        </span>
                      )}
                      {deload.shouldDeload && (
                        <span className="text-xs text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
                          建议减载
                        </span>
                      )}
                    </div>
                  )
                })()}

                {/* Timer */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-[80px] font-black text-white leading-none mb-8">
                    {isResting ? formatTime(restSeconds) : formatTime(timerSeconds)}
                  </div>

                  {/* Wave Animation */}
                  <div className="flex items-end gap-1 h-16 mb-8">
                    {waveAnimations.map((anim, i) => (
                      <div
                        key={i}
                        className="w-1 bg-neon rounded-full animate-wave"
                        style={{
                          height: anim.height,
                          animationDelay: anim.animationDelay,
                          opacity: anim.opacity,
                        }}
                      />
                    ))}
                  </div>

                  {/* Timer Controls */}
                  <div className="flex gap-4">
                    <button
                      onClick={timerRunning ? stopTimer : startTimer}
                      className="glass w-16 h-16 rounded-full flex items-center justify-center"
                    >
                      {timerRunning ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="glass w-16 h-16 rounded-full flex items-center justify-center"
                    >
                      <RotateCcw className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Bottom Data */}
                <div className="bg-dark-card border border-dark-border rounded-[32px] p-6 mb-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-dark-muted mb-1">重量</p>
                      <p className="text-2xl font-black text-white">{currentExercise.weight}</p>
                      <p className="text-xs text-dark-muted">kg</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-dark-muted mb-1">组数</p>
                      <p className="text-2xl font-black text-white">{currentExercise.completedSets || 0}/{currentExercise.sets}</p>
                      <p className="text-xs text-dark-muted">组</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-dark-muted mb-1">次数</p>
                      <p className="text-2xl font-black text-white">{currentExercise.reps}</p>
                      <p className="text-xs text-dark-muted">次</p>
                    </div>
                  </div>

                  {/* Input Controls */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateWorkoutExercise(currentExerciseIndex, 'weight', Math.max(0, currentExercise.weight - 2.5))}
                        className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateWorkoutExercise(currentExerciseIndex, 'weight', currentExercise.weight + 2.5)}
                        className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateWorkoutExercise(currentExerciseIndex, 'sets', currentExercise.sets - 1)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors ${
                          currentExercise.sets <= 1 ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'
                        }`}
                        disabled={currentExercise.sets <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateWorkoutExercise(currentExerciseIndex, 'sets', currentExercise.sets + 1)}
                        className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateWorkoutExercise(currentExerciseIndex, 'reps', currentExercise.reps - 1)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors ${
                          currentExercise.reps <= 1 ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'
                        }`}
                        disabled={currentExercise.reps <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateWorkoutExercise(currentExerciseIndex, 'reps', currentExercise.reps + 1)}
                        className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                      className="flex-1 bg-zinc-800 text-white py-4 rounded-[24px] font-bold hover:bg-zinc-700 transition-colors"
                    >
                      上一个
                    </button>
                    <button
                      onClick={handleCompleteSet}
                      className="flex-1 bg-neon text-dark-bg py-4 rounded-[24px] font-bold shadow-fab hover:shadow-fab-hover transition-all"
                    >
                      完成组
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Exercise List */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {currentWorkout.map((ex, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-1">
                    <button
                      onClick={() => setCurrentExerciseIndex(i)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        i === currentExerciseIndex
                          ? 'bg-neon text-dark-bg'
                          : 'bg-dark-card border border-dark-border text-dark-muted'
                      }`}
                    >
                      {ex.name}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeWorkoutExercise(i)
                      }}
                      className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowExerciseSelector(true)}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-neon/20 border border-neon/30 flex items-center justify-center text-neon hover:bg-neon/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveWorkout}
              className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold text-lg shadow-fab hover:shadow-fab-hover transition-all mb-8"
            >
              保存训练记录
            </button>
          </div>
        )}
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleAddExercise}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}

      {/* Plan Selector Modal */}
      {showPlanSelector && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowPlanSelector(false)} />
          <div className="relative w-full bg-dark-card rounded-t-[32px] p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">选择计划</h2>
            <div className="space-y-3">
              {workoutPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleAddFromPlan(plan.id)}
                  className="w-full bg-dark-bg border border-dark-border rounded-[24px] p-4 text-left hover:border-zinc-700 transition-colors"
                >
                  <h3 className="text-white font-bold">{plan.name}</h3>
                  <p className="text-dark-muted text-sm">{plan.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Toast messages={toasts} onRemove={removeToast} />
    </div>
  )
}
