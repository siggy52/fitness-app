import { Flame, TrendingUp, Activity, Dumbbell, Plus, AlertCircle, BarChart2, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { getCurrentFatigueLevel, getFatigueStatus, getTodayDateString, getWeekDates } from '../utils'

export default function Home() {
  const navigate = useNavigate()
  const { profile, workoutLogs, foodLogs, fatigueRecords } = useAppStore()

  const today = getTodayDateString()
  const weekDates = getWeekDates()

  const todayWorkout = workoutLogs.find(log => log.date === today)
  const todayFood = foodLogs.find(log => log.date === today)

  const totalCaloriesIn = todayFood?.totalCalories || 0
  const estimatedCaloriesOut = (profile?.bmr || 0) * 1.55 + (todayWorkout?.totalVolume || 0) * 0.1
  const calorieBalance = totalCaloriesIn - estimatedCaloriesOut

  const currentFatigue = getCurrentFatigueLevel(fatigueRecords)
  const fatigueStatus = getFatigueStatus(currentFatigue)

  const weeklyWorkouts = weekDates.map(day => ({
    ...day,
    hasWorkout: workoutLogs.some(log => log.date === day.date),
  }))

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{getGreeting()}！</h1>
        <p className="text-gray-500">今天也要加油哦 💪</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl p-4 shadow-lg">
          <Flame className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{Math.round(calorieBalance)}</div>
          <div className="text-sm opacity-90">热量平衡 (千卡)</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-2xl p-4 shadow-lg">
          <Activity className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{Math.round(Math.min(currentFatigue, 100))}</div>
          <div className="text-sm opacity-90">疲劳指数</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <AlertCircle className={`w-6 h-6 ${fatigueStatus.color}`} />
          <h2 className="font-semibold text-gray-800">身体状态</h2>
        </div>
        <p className={`text-sm font-medium mb-3 ${fatigueStatus.color}`}>{fatigueStatus.label}</p>
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="h-full w-[25%] rounded-l-full bg-gray-200" />
              <div className="h-full w-[25%] bg-gray-200" />
              <div className="h-full w-[25%] bg-gray-200" />
              <div className="h-full w-[25%] rounded-r-full bg-gray-200" />
            </div>
            <div className="absolute inset-0 flex">
              <div className="h-full w-[25%] rounded-l-full bg-green-400/20" />
              <div className="h-full w-[25%] bg-yellow-400/20" />
              <div className="h-full w-[25%] bg-orange-400/20" />
              <div className="h-full w-[25%] rounded-r-full bg-red-400/20" />
            </div>
            <div
              className={`h-full rounded-full transition-all duration-700 relative z-10 ${fatigueStatus.bgColor}`}
              style={{ width: `${Math.min(currentFatigue, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-0">
            <span>0</span>
            <span>25 良好</span>
            <span>50 中度</span>
            <span>75 高度</span>
            <span>100</span>
          </div>
        </div>
        <p className={`text-sm ${fatigueStatus.color}`}>{fatigueStatus.suggestion}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">本周统计</h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex justify-between">
          {weeklyWorkouts.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                  day.hasWorkout
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {day.dayName[0]}
              </div>
              <span className="text-xs text-gray-500">{day.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">今日数据</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-700">热量摄入</span>
            </div>
            <span className="font-semibold text-gray-800">{totalCaloriesIn} / {Math.round(profile?.bmr || 0) * 1.55} 千卡</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-700">训练状态</span>
            </div>
            <span className={`font-semibold ${todayWorkout ? 'text-green-600' : 'text-gray-500'}`}>
              {todayWorkout ? '已完成' : '未训练'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/workout')}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        <Plus className="w-5 h-5" />
        开始训练
      </button>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => navigate('/history')}
          className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2"
        >
          <Clock className="w-8 h-8 text-blue-500" />
          <span className="font-medium text-gray-800">历史记录</span>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2"
        >
          <BarChart2 className="w-8 h-8 text-purple-500" />
          <span className="font-medium text-gray-800">数据统计</span>
        </button>
      </div>
    </div>
  )
}

