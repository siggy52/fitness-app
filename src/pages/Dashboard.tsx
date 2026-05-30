import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, TrendingUp, Flame, ChevronRight } from 'lucide-react'
import { useAppStore } from '../store'
import { getWeekDates, getTodayString } from '../utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const { workoutLogs, foodLogs, profile } = useAppStore()

  const stats = useMemo(() => {
    const totalWorkouts = workoutLogs.length
    const totalVolume = workoutLogs.reduce((sum, log) => sum + log.totalVolume, 0)
    const totalCalories = foodLogs.reduce((sum, log) => sum + log.totalCalories, 0)
    return { totalWorkouts, totalVolume, totalCalories }
  }, [workoutLogs, foodLogs])

  const weekDates = useMemo(() => getWeekDates(), [])

  const weeklyData = useMemo(() => {
    return weekDates.map((d) => {
      const logs = workoutLogs.filter((l) => l.date === d.date)
      const volume = logs.reduce((sum, l) => sum + l.totalVolume, 0)
      return {
        ...d,
        volume,
      }
    })
  }, [workoutLogs, weekDates])

  const maxVolume = Math.max(...weeklyData.map((d) => d.volume), 1)

  const targetCalories = profile?.targetCalories || 2400
  const todayFoods = foodLogs.filter((log) => log.date === getTodayString())
  const todayCalories = todayFoods.reduce((sum, log) => sum + log.totalCalories, 0)
  const calorieProgress = Math.min((todayCalories / targetCalories) * 100, 100)

  // Ring progress SVG
  const ringRadius = 50
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference - (calorieProgress / 100) * ringCircumference

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <p className="text-dark-muted text-sm">数据概览</p>
        <h1 className="text-3xl font-bold text-white">数据统计</h1>
      </header>

      {/* Stats Grid */}
      <section className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-card border border-dark-border rounded-[28px] p-5">
            <div className="icon-box bg-neon/10 mb-3">
              <Activity className="w-6 h-6 text-neon" />
            </div>
            <p className="text-3xl font-black text-white">{stats.totalWorkouts}</p>
            <p className="text-sm text-dark-muted">训练次数</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-[28px] p-5">
            <div className="icon-box bg-purple-accent/10 mb-3">
              <TrendingUp className="w-6 h-6 text-purple-accent" />
            </div>
            <p className="text-3xl font-black text-white">{(stats.totalVolume / 1000).toFixed(1)}k</p>
            <p className="text-sm text-dark-muted">总训练量</p>
          </div>
        </div>
      </section>

      {/* Calorie Ring */}
      <section className="px-6 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">热量摄入</h3>
            <button
              onClick={() => navigate('/nutrition')}
              className="text-neon text-sm flex items-center gap-1"
            >
              详情 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-[120px] h-[120px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke="#e8ff47"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">{Math.round(calorieProgress)}%</span>
                <span className="text-xs text-dark-muted">已完成</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-dark-muted text-sm">已摄入</span>
                <span className="text-white font-bold">{todayCalories} 千卡</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-dark-muted text-sm">目标</span>
                <span className="text-white font-bold">{targetCalories} 千卡</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted text-sm">剩余</span>
                <span className="text-neon font-bold">{targetCalories - todayCalories} 千卡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Chart */}
      <section className="px-6 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6">
          <h3 className="text-lg font-bold text-white mb-6">本周训练量</h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyData.map((d) => {
              const height = d.volume > 0 ? (d.volume / maxVolume) * 100 : 4
              return (
                <div key={d.date} className="flex flex-col items-center flex-1">
                  <div className="w-full flex justify-center mb-2">
                    <span className="text-xs text-dark-muted">{d.volume > 0 ? d.volume : ''}</span>
                  </div>
                  <div
                    className={`w-full max-w-[32px] rounded-t-full transition-all duration-500 ${
                      d.volume > 0 ? 'bg-neon' : 'bg-zinc-800'
                    }`}
                    style={{ height: `${height}%`, minHeight: d.volume > 0 ? '4px' : '4px' }}
                  />
                  <span className="text-xs text-dark-muted mt-2">{d.day}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Body Data */}
      <section className="px-6 pb-8">
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6">
          <h3 className="text-lg font-bold text-white mb-4">身体数据</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-box bg-cyan-accent/10">
                  <Activity className="w-5 h-5 text-cyan-accent" />
                </div>
                <span className="text-white">体重</span>
              </div>
              <span className="text-white font-bold">{profile?.weight || '--'} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-box bg-orange-accent/10">
                  <Flame className="w-5 h-5 text-orange-accent" />
                </div>
                <span className="text-white">BMI</span>
              </div>
              <span className="text-white font-bold">
                {profile?.weight && profile?.height
                  ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
                  : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-box bg-purple-accent/10">
                  <TrendingUp className="w-5 h-5 text-purple-accent" />
                </div>
                <span className="text-white">基础代谢</span>
              </div>
              <span className="text-white font-bold">{profile?.bmr || '--'} 千卡</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
