import { Profile, Exercise, WorkoutLog, FoodLog } from '../types'

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

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
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

export const calculateFatigueLevel = (workoutLogs: WorkoutLog[]): number => {
  const consecutive = getConsecutiveWorkoutDays(workoutLogs)
  const today = getTodayString()
  const trainedToday = workoutLogs.some((log) => log.date === today)

  let fatigue = consecutive * 12
  if (trainedToday) fatigue += 10
  if (consecutive >= 5) fatigue += 10

  return Math.min(100, Math.max(0, fatigue))
}

/**
 * 使用 Epley 公式估算 1RM（理论最大重量）
 * 1RM = weight * (1 + reps / 30)
 */
export const calculateEstimated1RM = (weight: number, reps: number): number => {
  if (weight <= 0 || reps <= 0) return 0
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

/**
 * 获取某个动作的历史最大理论重量（1RM）
 */
export const getTheoreticalMax = (exerciseName: string, logs: WorkoutLog[]): number => {
  let max1RM = 0
  logs.forEach((log) => {
    log.exercises
      .filter((ex) => ex.name === exerciseName)
      .forEach((ex) => {
        const estimated1RM = calculateEstimated1RM(ex.weight, ex.reps)
        if (estimated1RM > max1RM) max1RM = estimated1RM
      })
  })
  return max1RM
}

/**
 * 获取最近一次训练的"实际/理论"比率
 * 值越低说明当前表现远低于历史最佳，疲劳程度越高
 */
const getPerformanceRatio = (exerciseName: string, logs: WorkoutLog[]): number => {
  const theoreticalMax = getTheoreticalMax(exerciseName, logs)
  if (theoreticalMax <= 0) return 1

  const sortedLogs = [...logs]
    .filter((log) => log.exercises.some((ex) => ex.name === exerciseName))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (sortedLogs.length === 0) return 1

  const latestExercise = sortedLogs[0].exercises.find((ex) => ex.name === exerciseName)
  if (!latestExercise) return 1

  const current1RM = calculateEstimated1RM(latestExercise.weight, latestExercise.reps)
  return Math.min(1, current1RM / theoreticalMax)
}

/**
 * 计算综合疲劳值 = 主观疲劳(40%) + 表现疲劳(30%) + 频率疲劳(20%) + 容量疲劳(10%)
 */
export const calculateCombinedFatigue = (
  workoutLogs: WorkoutLog[],
  subjectiveLevel: number
): { calculatedLevel: number; combinedLevel: number } => {
  // 1. 计算表现疲劳（当前重量 vs 理论最大重量）
  const today = getTodayString()
  const todayLogs = workoutLogs.filter((log) => log.date === today)

  let performanceFatigueSum = 0
  let performanceCount = 0
  if (todayLogs.length > 0) {
    const allExerciseNames = new Set(todayLogs.flatMap((log) => log.exercises.map((ex) => ex.name)))
    allExerciseNames.forEach((name) => {
      const ratio = getPerformanceRatio(name, workoutLogs)
      performanceFatigueSum += (1 - ratio) * 100
      performanceCount++
    })
  }
  const performanceFatigue = performanceCount > 0 ? performanceFatigueSum / performanceCount : 0

  // 2. 训练频率疲劳
  const consecutive = getConsecutiveWorkoutDays(workoutLogs)
  const trainedToday = workoutLogs.some((log) => log.date === today)
  const freqFatigue = Math.min(100, consecutive * 12 + (trainedToday ? 10 : 0) + (consecutive >= 5 ? 10 : 0))

  // 3. 容量疲劳（最近7天训练量）
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentVolume = workoutLogs
    .filter((log) => new Date(log.date) >= sevenDaysAgo)
    .reduce((sum, log) => sum + log.totalVolume, 0)

  // 假设每周容量基数为 50000kg
  const weeklyVolumeBase = 50000
  const volumeFatigue = Math.min(100, (recentVolume / weeklyVolumeBase) * 50)

  // 4. 综合计算
  const calculatedLevel = Math.round(
    performanceFatigue * 0.30 +
    freqFatigue * 0.20 +
    volumeFatigue * 0.10
  )

  const combinedLevel = Math.round(
    subjectiveLevel * 0.40 +
    calculatedLevel * 0.60
  )

  return {
    calculatedLevel: Math.min(100, Math.max(0, calculatedLevel)),
    combinedLevel: Math.min(100, Math.max(0, combinedLevel)),
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

export const exportAllDataToCsv = (workoutLogs: WorkoutLog[], foodLogs: FoodLog[]): string => {
  const sections: string[] = []

  if (workoutLogs.length > 0) {
    sections.push('=== 训练记录 ===')
    sections.push('日期,动作名,重量(kg),组数,次数,RPE')
    for (const log of workoutLogs) {
      for (const ex of log.exercises) {
        sections.push([log.date, ex.name, ex.weight, ex.sets, ex.reps, ex.rpe].map(escapeCsvField).join(','))
      }
    }
    sections.push('')
  }

  if (foodLogs.length > 0) {
    sections.push('=== 饮食记录 ===')
    sections.push('日期,食物名,热量(千卡),蛋白质(g),碳水(g),脂肪(g)')
    for (const log of foodLogs) {
      for (const food of log.foods) {
        sections.push([log.date, food.name, food.calories, food.protein, food.carbs, food.fat].map(escapeCsvField).join(','))
      }
    }
    sections.push('')
  }

  return sections.join('\n')
}

