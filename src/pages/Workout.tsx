import { useState } from 'react'
import { Dumbbell, Play, Pause, RotateCcw, Plus, Save, Trash2, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Exercise, WorkoutPlan } from '../types'
import NumberInput from '../components/NumberInput'
import { formatTime, getTodayDateString, calculateFatigueFromWorkout, getCurrentFatigueLevel, getSuggestedWeight, shouldDeload, getConsecutiveWorkoutDays } from '../utils'
import ExerciseSelector from '../components/ExerciseSelector'
import { useLastTrainingData } from '../hooks/useLastTrainingData'

export default function Workout() {
  const navigate = useNavigate()
  const { addWorkoutLog, addFatigueRecord, fatigueRecords, workoutLogs, workoutPlans, timerRunning, timerSeconds, startTimer, stopTimer, resetTimer } = useAppStore()
  const getLastTrainingData = useLastTrainingData()

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'name'>>(
    { weight: 0, sets: 3, reps: 10, rpe: 7 }
  )
  const [exerciseName, setExerciseName] = useState('')
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [selectedPlanForDays, setSelectedPlanForDays] = useState<WorkoutPlan | null>(null)

  const handleAddExercise = () => {
    if (!exerciseName.trim()) return
    setExercises([...exercises, { name: exerciseName, ...newExercise }])
    setExerciseName('')
    setNewExercise({ weight: 0, sets: 3, reps: 10, rpe: 7 })
    setShowAddExercise(false)
  }

  const handleSelectFromLibrary = (name: string) => {
    const lastData = getLastTrainingData(name)
    setExercises([...exercises, {
      name,
      weight: lastData?.lastWeight ?? 0,
      sets: 3,
      reps: lastData?.lastReps ?? 10,
      rpe: 7,
    }])
    setNewExercise({ weight: 0, sets: 3, reps: 10, rpe: 7 })
  }

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleSelectPlan = (plan: WorkoutPlan) => {
    setSelectedPlanForDays(plan)
  }

  const handleAddDayExercises = (dayExercises: Exercise[]) => {
    const enriched = dayExercises.map((ex) => {
      const lastData = getLastTrainingData(ex.name)
      return lastData ? { ...ex, weight: lastData.lastWeight, reps: lastData.lastReps } : ex
    })
    setExercises([...exercises, ...enriched])
    setSelectedPlanForDays(null)
    setShowPlanSelector(false)
  }

  const handleSaveWorkout = () => {
    if (exercises.length === 0) return

    addWorkoutLog({
      date: getTodayDateString(),
      exercises,
    })

    const currentFatigue = getCurrentFatigueLevel(fatigueRecords)
    const newFatigue = Math.min(100, currentFatigue + calculateFatigueFromWorkout(exercises))
    addFatigueRecord({
      date: getTodayDateString(),
      fatigueLevel: newFatigue,
    })

    resetTimer()
    navigate('/home')
  }

  const updateExercise = (index: number, updates: Partial<Exercise>) => {
    const updated = [...exercises]
    updated[index] = { ...updated[index], ...updates }
    setExercises(updated)
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">开始训练</h1>

      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            <span className="text-lg">训练时长</span>
          </div>
        </div>
        <div className="text-5xl font-bold text-center mb-6 font-mono">
          {formatTime(timerSeconds)}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => timerRunning ? stopTimer() : startTimer()}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
          >
            {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {timerRunning ? '暂停' : '开始'}
          </button>
          <button
            onClick={resetTimer}
            className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>
      </div>

      {exercises.length === 0 && (() => {
        const currentFatigue = getCurrentFatigueLevel(fatigueRecords)
        const consecutiveDays = getConsecutiveWorkoutDays(workoutLogs)
        const deload = shouldDeload(currentFatigue, consecutiveDays)
        return (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-700">
              {deload.shouldDeload
                ? deload.reason
                : currentFatigue > 50
                  ? `当前疲劳值 ${Math.round(currentFatigue)}，建议适当降低训练强度。`
                  : '体能状态良好，开始今天的训练吧！'}
            </p>
          </div>
        )
      })()}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowExerciseSelector(true)}
          className="flex-1 bg-white border-2 border-dashed border-gray-300 text-gray-600 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          添加动作
        </button>
        {workoutPlans.length > 0 && (
          <button
            onClick={() => setShowPlanSelector(true)}
            className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-500 transition-all"
          >
            从计划添加
          </button>
        )}
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => {
          const suggestion = getSuggestedWeight(exercise.name, workoutLogs)
          return (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{exercise.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {suggestion.suggestedWeight > 0 && (
                      <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                        建议 {suggestion.suggestedWeight}kg
                      </span>
                    )}
                    {suggestion.progress === 'plateau' && (
                      <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                        平台期
                      </span>
                    )}
                    {suggestion.progress === 'up' && suggestion.lastWeight > 0 && (
                      <span className="text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                        +2.5kg ↑
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveExercise(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">重量 (kg)</label>
                <NumberInput
                  value={exercise.weight}
                  onChange={(v) => updateExercise(index, { weight: v })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">组数</label>
                <NumberInput
                  value={exercise.sets}
                  onChange={(v) => updateExercise(index, { sets: v })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">次数</label>
                <NumberInput
                  value={exercise.reps}
                  onChange={(v) => updateExercise(index, { reps: v })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">RPE</label>
                <NumberInput
                  value={exercise.rpe}
                  min={1}
                  max={10}
                  onChange={(v) => updateExercise(index, { rpe: Math.min(10, Math.max(1, v)) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center"
                />
              </div>
            </div>
          </div>
        )
      })}

        {exercises.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">还没有添加动作</h3>
            <p className="text-gray-400">点击上方按钮添加训练动作</p>
          </div>
        )}
      </div>

      {exercises.length > 0 && (
        <button
          onClick={handleSaveWorkout}
          className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Save className="w-5 h-5" />
          保存训练记录
        </button>
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleSelectFromLibrary}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}

      {showAddExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">手动添加动作</h2>
                <button
                  onClick={() => setShowAddExercise(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">动作名称</label>
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="例如：卧推、深蹲"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">重量 (kg)</label>
                    <NumberInput
                      value={newExercise.weight}
                      onChange={(v) => setNewExercise({ ...newExercise, weight: v })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">组数</label>
                    <NumberInput
                      value={newExercise.sets}
                      onChange={(v) => setNewExercise({ ...newExercise, sets: v })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">次数</label>
                    <NumberInput
                      value={newExercise.reps}
                      onChange={(v) => setNewExercise({ ...newExercise, reps: v })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RPE (1-10)</label>
                    <NumberInput
                      value={newExercise.rpe}
                      min={1}
                      max={10}
                      onChange={(v) => setNewExercise({ ...newExercise, rpe: Math.min(10, Math.max(1, v)) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddExercise}
                  disabled={!exerciseName.trim()}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  添加动作
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlanSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedPlanForDays ? `选择训练日 - ${selectedPlanForDays.name}` : '从计划选择'}
                </h2>
                <button
                  onClick={() => {
                    if (selectedPlanForDays) {
                      setSelectedPlanForDays(null)
                    } else {
                      setShowPlanSelector(false)
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {!selectedPlanForDays ? (
                <div className="space-y-3">
                  {workoutPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all"
                    >
                      <div className="font-semibold text-gray-800">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.trainingDays.length} 个训练日</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPlanForDays.trainingDays.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddDayExercises(day.exercises)}
                      className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all"
                    >
                      <div className="font-semibold text-gray-800">{day.day}</div>
                      <div className="text-sm text-gray-500">
                        {day.exercises.length} 个动作
                        {day.exercises.length > 0 && (
                          <span className="text-gray-400 ml-1">
                            · {day.exercises.map(e => e.name).join('、')}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
