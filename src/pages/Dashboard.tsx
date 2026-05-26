import { BarChart, TrendingUp, Target, Dumbbell, Calendar } from 'lucide-react'
import { useAppStore } from '../store'
import { getWeekDates } from '../utils'

export default function Dashboard() {
  const { workoutLogs, foodLogs } = useAppStore()
  const weekDates = getWeekDates()

  const totalWorkouts = workoutLogs.length
  const totalVolume = workoutLogs.reduce((sum, log) => sum + log.totalVolume, 0)
  const totalCaloriesIn = foodLogs.reduce((sum, log) => sum + log.totalCalories, 0)

  const weeklyStats = weekDates.map(day => {
    const dayWorkouts = workoutLogs.filter(log => log.date === day.date)
    const dayVolume = dayWorkouts.reduce((sum, log) => sum + log.totalVolume, 0)
    return { ...day, volume: dayVolume, hasWorkout: dayWorkouts.length > 0 }
  })

  const maxVolume = Math.max(...weeklyStats.map(d => d.volume), 1)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">数据统计</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Dumbbell className="w-7 h-7 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
          <div className="text-xs text-gray-500">训练次数</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <TrendingUp className="w-7 h-7 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{Math.round(totalVolume)}</div>
          <div className="text-xs text-gray-500">总训练量</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Target className="w-7 h-7 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{totalCaloriesIn}</div>
          <div className="text-xs text-gray-500">总摄入</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-800">本周训练量</h2>
        </div>
        <div className="space-y-4">
          {weeklyStats.map((day, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 text-sm text-gray-600">{day.dayName}</div>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    day.hasWorkout ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                  }`}
                  style={{ width: `${(day.volume / maxVolume) * 100}%` }}
                />
              </div>
              <div className="w-16 text-sm text-gray-500 text-right">{Math.round(day.volume)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-800">近期记录</h2>
        </div>
        <div className="space-y-3">
          {[...workoutLogs]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-800">
                    {new Date(log.date).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {log.exercises.length} 个动作
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{Math.round(log.totalVolume)}</div>
                  <div className="text-xs text-gray-500">训练量</div>
                </div>
              </div>
            ))}
          {workoutLogs.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              还没有训练记录，开始你的第一次训练吧！
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

