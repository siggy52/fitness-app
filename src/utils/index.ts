import { Profile, Exercise, WorkoutLog } from '../types'

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

export const getSuggestedWeight = (exerciseName: string, logs: WorkoutLog[]): { suggestedWeight: number; lastWeight: number; progress: 'up' | 'maintain' | 'plateau' | null } => {
  const exerciseLogs = logs
    .filter((log) => log.exercises.some((ex) => ex.name === exerciseName))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (exerciseLogs.length === 0) {
    return { suggestedWeight: 0, lastWeight: 0, progress: null }
  }

  const latestLog = exerciseLogs[exerciseLogs.length - 1]
  const latestExercise = latestLog.exercises.find((ex) => ex.name === exerciseName)!
  const lastWeight = latestExercise.weight

  if (lastWeight === 0) {
    return { suggestedWeight: 0, lastWeight: 0, progress: null }
  }

  const recentLogs = exerciseLogs.slice(-3)
  const weights = recentLogs.map((log) => {
    const ex = log.exercises.find((e) => e.name === exerciseName)
    return ex ? ex.weight : 0
  }).filter((w) => w > 0)

  let progress: 'up' | 'maintain' | 'plateau' | null = 'up'
  if (weights.length >= 2) {
    const allSame = weights.every((w) => w === weights[0])
    if (allSame) {
      progress = 'plateau'
    }
  }

  return {
    suggestedWeight: lastWeight + 2.5,
    lastWeight,
    progress,
  }
}

export const shouldDeload = (fatigueLevel: number, consecutiveWorkoutDays: number): { shouldDeload: boolean; reason: string } => {
  if (fatigueLevel > 70 && consecutiveWorkoutDays >= 3) {
    return {
      shouldDeload: true,
      reason: `疲劳值 ${fatigueLevel}（偏高），已连续训练 ${consecutiveWorkoutDays} 天，建议减载休息。`,
    }
  }
  return {
    shouldDeload: false,
    reason: '',
  }
}

export const getConsecutiveWorkoutDays = (logs: WorkoutLog[]): number => {
  if (logs.length === 0) return 0

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let count = 1
  for (let i = 1; i < sortedLogs.length; i++) {
    const prevDate = new Date(sortedLogs[i - 1].date)
    const currDate = new Date(sortedLogs[i].date)
    const diffMs = prevDate.getTime() - currDate.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      count++
    } else {
      break
    }
  }

  return count
}

const escapeCsvField = (value: string | number): string => {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export const exportWorkoutLogsToJson = (logs: WorkoutLog[]): string => {
  return JSON.stringify(logs, null, 2)
}

export const exportWorkoutLogsToCsv = (logs: WorkoutLog[]): string => {
  const header = ['日期', '动作名', '重量(kg)', '组数', '次数', 'RPE']
  const rows = [header.map(escapeCsvField).join(',')]

  for (const log of logs) {
    for (const exercise of log.exercises) {
      const row = [
        log.date,
        exercise.name,
        exercise.weight,
        exercise.sets,
        exercise.reps,
        exercise.rpe,
      ]
      rows.push(row.map(escapeCsvField).join(','))
    }
  }

  return rows.join('\n')
}

