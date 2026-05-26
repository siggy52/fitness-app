import { useState } from 'react'
import { Calendar, Dumbbell, Apple, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppStore } from '../store'
import { formatDate } from '../utils'

type HistoryTab = 'all' | 'workouts' | 'nutrition'

export default function History() {
  const { workoutLogs, foodLogs } = useAppStore()
  const [activeTab, setActiveTab] = useState<HistoryTab>('all')
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  const allDates = Array.from(
    new Set([
      ...workoutLogs.map(log => log.date),
      ...foodLogs.map(log => log.date),
    ])
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDates(newExpanded)
  }

  const getFilteredDates = () => {
    if (activeTab === 'all') return allDates
    if (activeTab === 'workouts') {
      return Array.from(new Set(workoutLogs.map(log => log.date))).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      )
    }
    return Array.from(new Set(foodLogs.map(log => log.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  }

  const filteredDates = getFilteredDates()

  const totalWorkouts = workoutLogs.length
  const totalCalories = foodLogs.reduce((sum, log) => sum + log.totalCalories, 0)
  const totalVolume = workoutLogs.reduce((sum, log) => sum + log.totalVolume, 0)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">历史记录</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Dumbbell className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
          <div className="text-sm text-gray-500">训练次数</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Apple className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{totalCalories}</div>
          <div className="text-sm text-gray-500">总摄入热量</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{Math.round(totalVolume)}</div>
          <div className="text-sm text-gray-500">总训练量</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all' as const, label: '全部' },
          { key: 'workouts' as const, label: '训练' },
          { key: 'nutrition' as const, label: '饮食' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredDates.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">还没有记录</h3>
            <p className="text-gray-400">开始记录你的训练和饮食吧！</p>
          </div>
        ) : (
          filteredDates.map(date => {
            const workoutLog = workoutLogs.find(log => log.date === date)
            const foodLog = foodLogs.find(log => log.date === date)
            const isExpanded = expandedDates.has(date)

            const showWorkout = activeTab !== 'nutrition' && workoutLog
            const showFood = activeTab !== 'workouts' && foodLog

            if (!showWorkout && !showFood) return null

            return (
              <div key={date} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleDate(date)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">{formatDate(date)}</div>
                      <div className="text-sm text-gray-500">
                        {[
                          workoutLog ? `${workoutLog.exercises.length} 个训练` : null,
                          foodLog ? `${foodLog.foods.length} 种食物` : null,
                        ].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4">
                    {showWorkout && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Dumbbell className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800">训练记录</span>
                          <span className="text-sm text-gray-500 ml-auto">
                            总训练量: {Math.round(workoutLog.totalVolume)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {workoutLog.exercises.map((exercise, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                              <span className="text-gray-800">{exercise.name}</span>
                              <span className="text-sm text-gray-500">
                                {exercise.weight}kg × {exercise.sets}组 × {exercise.reps}次 · RPE {exercise.rpe}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {showFood && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Apple className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-gray-800">饮食记录</span>
                          <span className="text-sm text-gray-500 ml-auto">
                            {foodLog.totalCalories} 千卡
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="bg-white p-2 rounded-lg text-center">
                            <div className="font-medium text-blue-600">{foodLog.totalProtein}g</div>
                            <div className="text-xs text-gray-500">蛋白质</div>
                          </div>
                          <div className="bg-white p-2 rounded-lg text-center">
                            <div className="font-medium text-green-600">{foodLog.totalCarbs}g</div>
                            <div className="text-xs text-gray-500">碳水</div>
                          </div>
                          <div className="bg-white p-2 rounded-lg text-center">
                            <div className="font-medium text-orange-600">{foodLog.totalFat}g</div>
                            <div className="text-xs text-gray-500">脂肪</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {foodLog.foods.map((food, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                              <span className="text-gray-800">{food.name}</span>
                              <span className="text-sm text-gray-500">{food.calories} 千卡</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
