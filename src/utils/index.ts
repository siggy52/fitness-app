import { Profile, Exercise } from '../types'

export const calculateBMR = (profile: Omit<Profile, 'bmr'>): number => {
  if (profile.gender === 'male') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
  } else {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
  }
}

export const calculateFatigueFromWorkout = (exercises: Exercise[]): number => {
  return exercises.reduce((fatigue, ex) => {
    const rpeRatio = ex.rpe / 10

    const rpeBase = ex.sets * rpeRatio * 3

    let weightBonus = 0
    if (ex.weight > 0) {
      weightBonus = (ex.weight * ex.sets * ex.reps / 100) * rpeRatio * 0.3
    }

    return fatigue + rpeBase + weightBonus
  }, 0)
}

export const calculateFatigueDecay = (lastFatigue: number, hoursPassed: number): number => {
  const decayRate = 0.02
  const decayed = lastFatigue * Math.pow(1 - decayRate, hoursPassed)
  return Math.max(0, Math.min(decayed, 100))
}

export const getCurrentFatigueLevel = (fatigueRecords: { date: string; fatigueLevel: number }[]): number => {
  if (fatigueRecords.length === 0) return 0

  const sortedRecords = [...fatigueRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latestRecord = sortedRecords[0]
  const hoursPassed = (Date.now() - new Date(latestRecord.date).getTime()) / (1000 * 60 * 60)

  return Math.max(0, calculateFatigueDecay(latestRecord.fatigueLevel, hoursPassed))
}

export const getFatigueStatus = (fatigueLevel: number): { status: 'low' | 'medium' | 'high' | 'critical'; color: string; bgColor: string; label: string; suggestion: string } => {
  if (fatigueLevel < 25) {
    return {
      status: 'low',
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      label: '状态良好',
      suggestion: '体能充沛，适合进行高强度训练！',
    }
  } else if (fatigueLevel < 50) {
    return {
      status: 'medium',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500',
      label: '中度疲劳',
      suggestion: '建议进行中等强度训练，注意身体反馈。',
    }
  } else if (fatigueLevel < 75) {
    return {
      status: 'high',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      label: '高度疲劳',
      suggestion: '疲劳累积较多，建议降低训练强度或休息一天。',
    }
  } else {
    return {
      status: 'critical',
      color: 'text-red-600',
      bgColor: 'bg-red-500',
      label: '极度疲劳',
      suggestion: '身体需要充分休息恢复，建议休息1-2天！',
    }
  }
}

export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const getWeekDates = (): { date: string; dayName: string }[] => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dates = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push({
      date: date.toISOString().split('T')[0],
      dayName: days[i],
    })
  }

  return dates
}

