import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Zap, TrendingUp, ChevronRight, Play, Dumbbell } from 'lucide-react'
import { useAppStore } from '../store'
import { getTodayString, getWeekDates, getGreeting, getConsecutiveWorkoutDays } from '../utils'
import { FATIGUE_LEVELS } from '../constants'

export default function Home() {
  const navigate = useNavigate()
  const { profile, workoutLogs, foodLogs, workoutPlans, fatigueRecords, updateFatigueRecord } = useAppStore()
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const [showFatigueRate, setShowFatigueRate] = useState(false)

  const weekDates = useMemo(() => getWeekDates(), [])

  const todayLogs = workoutLogs.filter((log) => log.date === selectedDate)
  const todayFoodLogs = foodLogs.filter((log) => log.date === selectedDate)

  const consecutiveDays = useMemo(() => getConsecutiveWorkoutDays(workoutLogs), [workoutLogs])

  const todayFatigue = fatigueRecords.find((r) => r.date === getTodayString())
  const subjectiveLevel = todayFatigue?.subjectiveLevel ?? -1
  const combinedLevel = todayFatigue?.fatigueLevel ?? 0
  const calculatedLevel = todayFatigue?.calculatedLevel ?? 0

  const fatigueInfo = FATIGUE_LEVELS.find((l) => combinedLevel <= l.max) || FATIGUE_LEVELS[0]

  const todayCalories = todayFoodLogs.reduce((sum, log) => sum + log.totalCalories, 0)
  const targetCalories = profile?.targetCalories || 2400
  const calorieBalance = targetCalories - todayCalories

  const todayVolume = todayLogs.reduce((sum, log) => sum + log.totalVolume, 0)

  const trainedDates = useMemo(() => {
    const dates = new Set(workoutLogs.map((log) => log.date))
    return weekDates.map((d) => ({
      ...d,
      isTrained: dates.has(d.date),
      isToday: d.date === getTodayString(),
      isFuture: new Date(d.date) > new Date(getTodayString()),
    }))
  }, [workoutLogs, weekDates])

  const handleFatigueRate = (value: number) => {
    updateFatigueRecord(getTodayString(), value)
    setShowFatigueRate(false)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon to-purple-accent flex items-center justify-center text-black font-bold text-lg">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-dark-muted text-sm">{getGreeting()}</p>
              <p className="text-white font-semibold">{profile?.name || '健身达人'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Card */}
      <section className="px-6 mb-6">
        <div
          className="relative h-[280px] rounded-[32px] overflow-hidden cursor-pointer"
          onClick={() => navigate('/workout')}
        >
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
            alt="Workout"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="tag-pill bg-neon text-dark-bg">今日目标</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {workoutPlans[0]?.name || '全身力量训练'}
            </h2>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span>{workoutPlans[0]?.trainingDays.reduce((sum, d) => sum + d.exercises.length, 0) || 0} 个动作</span>
              <span>45 分钟</span>
            </div>
          </div>
          <button className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-neon flex items-center justify-center shadow-fab">
            <Play className="w-6 h-6 text-dark-bg ml-1" fill="currentColor" />
          </button>
        </div>
      </section>

      {/* Data Cards - 3 Column Grid */}
      <section className="px-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">今日数据</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* 热量平衡 */}
          <div className="bg-dark-card border border-dark-border rounded-[20px] p-4 flex flex-col items-center text-center">
            <div className="icon-box bg-neon/10 mb-3">
              <Flame className="w-5 h-5 text-neon" />
            </div>
            <p className={`text-2xl font-black mb-0.5 ${calorieBalance >= 0 ? 'text-neon' : 'text-red-400'}`}>
              {Math.abs(calorieBalance)}
            </p>
            <p className="text-xs text-dark-muted">热量{calorieBalance >= 0 ? '盈余' : '缺口'}</p>
            <p className="text-[10px] text-dark-muted/60 mt-1">目标 {targetCalories}</p>
          </div>
          {/* 疲劳指数 */}
          <div className="bg-dark-card border border-dark-border rounded-[20px] p-4 flex flex-col items-center text-center">
            <div className="icon-box bg-cyan-accent/10 mb-3">
              <Zap className="w-5 h-5 text-cyan-accent" />
            </div>
            <p className="text-2xl font-black text-white mb-0.5">{combinedLevel}</p>
            <p className="text-xs text-dark-muted">综合疲劳</p>
            <p className="text-[10px] text-dark-muted/60 mt-1" style={{ color: fatigueInfo.color }}>
              {fatigueInfo.label}
            </p>
          </div>
          {/* 训练量 */}
          <div className="bg-dark-card border border-dark-border rounded-[20px] p-4 flex flex-col items-center text-center">
            <div className="icon-box bg-purple-accent/10 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-accent" />
            </div>
            <p className="text-2xl font-black text-white mb-0.5">
              {todayVolume > 999 ? (todayVolume / 1000).toFixed(1) + 'k' : todayVolume}
            </p>
            <p className="text-xs text-dark-muted">训练量</p>
            <p className="text-[10px] text-dark-muted/60 mt-1">kg</p>
          </div>
        </div>
      </section>

      {/* Weekly Calendar */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">本周训练</h3>
          <button
            onClick={() => navigate('/history')}
            className="text-neon text-sm flex items-center gap-1"
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between">
          {trainedDates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                selectedDate === d.date ? 'scale-110' : ''
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  d.isTrained
                    ? 'bg-neon text-dark-bg'
                    : d.isFuture
                    ? 'border-2 border-dashed border-zinc-700 text-zinc-600'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {d.dayName.charAt(1)}
              </div>
              <span className="text-xs text-dark-muted">{d.dayName}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Body Status */}
      <section className="px-6 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-orange-accent/10">
                <Zap className="w-6 h-6 text-orange-accent" />
              </div>
              <div>
                <h3 className="text-white font-bold">身体状态</h3>
                <p className="text-sm" style={{ color: fatigueInfo.color }}>
                  {fatigueInfo.label}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFatigueRate(true)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                subjectiveLevel >= 0
                  ? 'bg-neon/20 text-neon border border-neon/30'
                  : 'bg-zinc-800 text-dark-muted border border-dark-border'
              }`}
            >
              {subjectiveLevel >= 0 ? `主观 ${subjectiveLevel}%` : '今天感觉？'}
            </button>
          </div>

          {/* Combined Fatigue Bar */}
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex mb-2">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }} />
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '25%' }} />
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '25%' }} />
            <div className="h-full bg-red-500 rounded-full" style={{ width: '25%' }} />
          </div>
          <div className="relative h-1 bg-zinc-800 rounded-full mb-4">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-dark-bg shadow-lg transition-all duration-300"
              style={{ left: `${combinedLevel}%` }}
            />
          </div>

          {/* Fatigue Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-dark-bg rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dark-muted">主观感受</span>
                <span className="text-xs font-bold text-white">{subjectiveLevel >= 0 ? `${subjectiveLevel}%` : '--'}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, subjectiveLevel)}%` }}
                />
              </div>
            </div>
            <div className="bg-dark-bg rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dark-muted">数据计算</span>
                <span className="text-xs font-bold text-white">{calculatedLevel}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-accent rounded-full transition-all duration-500"
                  style={{ width: `${calculatedLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Factors Details */}
          <div className="text-xs text-dark-muted space-y-1">
            <p>
              <span className="text-white font-medium">{consecutiveDays}</span> 天连续训练
              {consecutiveDays >= 5 && <span className="text-orange-accent"> · 建议休息</span>}
            </p>
            {todayLogs.length > 0 && (
              <p>今日训练 <span className="text-white font-medium">{todayVolume.toLocaleString()}</span> kg · <span className="text-white font-medium">{todayLogs.flatMap(l => l.exercises).length}</span> 个动作</p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 pb-8">
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/history')}
            className="bg-dark-card border border-dark-border rounded-[28px] p-5 flex flex-col items-center gap-3 hover:border-zinc-700 transition-colors"
          >
            <div className="icon-box bg-neon/10">
              <TrendingUp className="w-6 h-6 text-neon" />
            </div>
            <span className="text-white font-medium text-sm">历史</span>
          </button>
          <button
            onClick={() => navigate('/exercises')}
            className="bg-dark-card border border-dark-border rounded-[28px] p-5 flex flex-col items-center gap-3 hover:border-zinc-700 transition-colors"
          >
            <div className="icon-box bg-purple-accent/10">
              <Dumbbell className="w-6 h-6 text-purple-accent" />
            </div>
            <span className="text-white font-medium text-sm">动作库</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-dark-card border border-dark-border rounded-[28px] p-5 flex flex-col items-center gap-3 hover:border-zinc-700 transition-colors"
          >
            <div className="icon-box bg-cyan-accent/10">
              <TrendingUp className="w-6 h-6 text-cyan-accent" />
            </div>
            <span className="text-white font-medium text-sm">统计</span>
          </button>
        </div>
      </section>

      {/* Subjective Fatigue Rate Modal */}
      {showFatigueRate && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowFatigueRate(false)} />
          <div className="relative w-full bg-dark-card rounded-t-[32px] p-6">
            <h2 className="text-xl font-bold text-white mb-2">今天身体感觉如何？</h2>
            <p className="text-dark-muted text-sm mb-6">请根据自身感受评分，这将帮助系统更准确评估你的恢复状态</p>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[
                { value: 10, label: '非常好', color: 'text-green-400' },
                { value: 30, label: '不错', color: 'text-lime-400' },
                { value: 50, label: '一般', color: 'text-yellow-400' },
                { value: 70, label: '有点累', color: 'text-orange-400' },
                { value: 90, label: '很疲惫', color: 'text-red-400' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleFatigueRate(item.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                    subjectiveLevel === item.value
                      ? 'bg-neon/20 border-2 border-neon'
                      : 'bg-dark-bg border-2 border-transparent hover:border-zinc-700'
                  }`}
                >
                  <span className={`text-lg font-bold ${item.color}`}>{item.value}%</span>
                  <span className="text-xs text-dark-muted">{item.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFatigueRate(false)}
              className="w-full bg-zinc-800 text-white py-3 rounded-[24px] font-medium"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
