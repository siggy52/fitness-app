import { create } from 'zustand'
import { Profile, WorkoutPlan, WorkoutLog, FoodLog, FatigueRecord, Exercise, FoodItem, DayExercises, ExerciseDefinition, ExerciseStats, PersonalRecord } from '../types'
import { storage, StorageKeys } from '../utils/storage'
import { PRESET_EXERCISES } from '../data/exercises'
import { calculateCombinedFatigue } from '../utils'

const migrateWorkoutPlans = (plans: unknown[]): WorkoutPlan[] => {
  return plans.map((plan: any) => {
    if (!plan || typeof plan !== 'object') return plan
    if (plan.trainingDays && plan.trainingDays.length > 0 && typeof plan.trainingDays[0] === 'string') {
      const oldExercises: Exercise[] = plan.exercises || []
      const oldDays: string[] = plan.trainingDays
      const exercisesPerDay = oldExercises.length > 0
        ? Math.max(1, Math.floor(oldExercises.length / oldDays.length))
        : 0
      const newDays: DayExercises[] = oldDays.map((day, i) => ({
        day,
        exercises: oldExercises.slice(i * exercisesPerDay, (i + 1) * exercisesPerDay),
      }))
      return { ...plan, trainingDays: newDays }
    }
    return plan
  })
}

const migrateFatigueRecord = (record: any): FatigueRecord => {
  if (record.subjectiveLevel === undefined) {
    return {
      date: record.date,
      fatigueLevel: record.fatigueLevel,
      subjectiveLevel: record.fatigueLevel,
      calculatedLevel: record.fatigueLevel,
    }
  }
  return record as FatigueRecord
}

const migrateFatigueRecords = (records: unknown[]): FatigueRecord[] => {
  return records.map(migrateFatigueRecord)
}

type AppState = {
  profile: Profile | null
  workoutPlans: WorkoutPlan[]
  workoutLogs: WorkoutLog[]
  foodLogs: FoodLog[]
  fatigueRecords: FatigueRecord[]
  hasCompletedOnboarding: boolean

  timerRunning: boolean
  timerSeconds: number
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  tickTimer: () => void

  // 当前运动状态
  currentWorkout: Exercise[]
  currentExerciseIndex: number
  isResting: boolean
  restSeconds: number
  setCurrentWorkout: (exercises: Exercise[]) => void
  setCurrentExerciseIndex: (index: number) => void
  setIsResting: (resting: boolean) => void
  setRestSeconds: (seconds: number) => void
  updateWorkoutExercise: (index: number, field: keyof Exercise, value: number) => void
  removeWorkoutExercise: (index: number) => void
  clearCurrentWorkout: () => void

  setProfile: (profile: Profile) => void
  updateProfile: (updates: Partial<Profile>) => void

  addWorkoutPlan: (plan: Omit<WorkoutPlan, 'id'>) => void
  updateWorkoutPlan: (id: string, updates: Partial<WorkoutPlan>) => void
  deleteWorkoutPlan: (id: string) => void

  addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'totalVolume'>) => void
  updateWorkoutLog: (id: string, updates: Partial<WorkoutLog>) => void
  deleteWorkoutLog: (id: string) => void

  addFoodLog: (log: Omit<FoodLog, 'id' | 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat'>) => void
  updateFoodLog: (id: string, updates: Partial<FoodLog>) => void
  deleteFoodLog: (id: string) => void

  addFatigueRecord: (record: FatigueRecord) => void
  updateFatigueRecord: (date: string, subjectiveLevel: number) => void

  setCompletedOnboarding: (completed: boolean) => void

  calculateTotalVolume: (exercises: Exercise[]) => number
  calculateFoodTotals: (foods: FoodItem[]) => { calories: number; protein: number; carbs: number; fat: number }

  exercises: ExerciseDefinition[]
  customExercises: ExerciseDefinition[]
  addCustomExercise: (exercise: Omit<ExerciseDefinition, 'id' | 'isCustom' | 'createdAt'>) => void
  updateCustomExercise: (id: string, updates: Partial<ExerciseDefinition>) => void
  deleteCustomExercise: (id: string) => void
  getAllExercises: () => ExerciseDefinition[]
  getExerciseById: (id: string) => ExerciseDefinition | undefined
  getExerciseStats: (exerciseName: string) => ExerciseStats
  getRecentlyUsedExercises: (limit?: number) => ExerciseDefinition[]
  clearAllData: () => void
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const calculateTotalVolume = (exercises: Exercise[]): number => {
  return exercises.reduce((total, ex) => total + ex.weight * ex.sets * ex.reps, 0)
}

const calculateFoodTotals = (foods: FoodItem[]) => {
  return foods.reduce(
    (totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

export const useAppStore = create<AppState>((set, get) => {
  const rawPlans = storage.get<unknown[]>(StorageKeys.WORKOUT_PLANS, [])
  const migratedPlans = migrateWorkoutPlans(rawPlans)
  if (JSON.stringify(rawPlans) !== JSON.stringify(migratedPlans)) {
    storage.set(StorageKeys.WORKOUT_PLANS, migratedPlans)
  }

  const customExercises = storage.get<ExerciseDefinition[]>(StorageKeys.CUSTOM_EXERCISES, [])

  const migragedFatigueRecords = migrateFatigueRecords(storage.get<unknown[]>(StorageKeys.FATIGUE_RECORDS, []))

  const initialState = {
    profile: storage.get<Profile | null>(StorageKeys.PROFILE, null),
    workoutPlans: migratedPlans,
    workoutLogs: storage.get<WorkoutLog[]>(StorageKeys.WORKOUT_LOGS, []),
    foodLogs: storage.get<FoodLog[]>(StorageKeys.FOOD_LOGS, []),
    fatigueRecords: migragedFatigueRecords,
    hasCompletedOnboarding: storage.get<boolean>('fitness-app_onboarding', false),
    timerRunning: false,
    timerSeconds: 0,
    currentWorkout: [],
    currentExerciseIndex: 0,
    isResting: false,
    restSeconds: 0,
    exercises: PRESET_EXERCISES,
    customExercises,
  }

  return {
    ...initialState,
    calculateTotalVolume,
    calculateFoodTotals,

    startTimer: () => set({ timerRunning: true }),

    stopTimer: () => set({ timerRunning: false }),

    resetTimer: () => set({ timerRunning: false, timerSeconds: 0 }),

    tickTimer: () => set((state) => {
      if (!state.timerRunning) return state
      return { timerSeconds: state.timerSeconds + 1 }
    }),

    // 当前运动状态管理
    setCurrentWorkout: (exercises) => set({ currentWorkout: exercises }),
    
    setCurrentExerciseIndex: (index) => set({ currentExerciseIndex: index }),
    
    setIsResting: (resting) => set({ isResting: resting }),
    
    setRestSeconds: (seconds) => set({ restSeconds: seconds }),
    
    updateWorkoutExercise: (index, field, value) =>
      set((state) => {
        const updated = [...state.currentWorkout]
        let clampedValue = value
        if (field === 'weight') {
          clampedValue = Math.max(0, Math.min(500, value))
        } else if (field === 'sets') {
          clampedValue = Math.max(1, Math.min(20, value))
        } else if (field === 'reps') {
          clampedValue = Math.max(1, Math.min(50, value))
        } else if (field === 'rpe') {
          clampedValue = Math.max(1, Math.min(10, value))
        } else if (field === 'completedSets') {
          clampedValue = Math.max(0, Math.min(50, value))
        }
        updated[index] = { ...updated[index], [field]: clampedValue }
        return { ...state, currentWorkout: updated }
      }),
    
    removeWorkoutExercise: (index) =>
      set((state) => {
        const updated = state.currentWorkout.filter((_, i) => i !== index)
        let newIndex = state.currentExerciseIndex
        if (newIndex >= updated.length && newIndex > 0) {
          newIndex = updated.length - 1
        }
        return { ...state, currentWorkout: updated, currentExerciseIndex: newIndex }
      }),
    
    clearCurrentWorkout: () => set({ currentWorkout: [], currentExerciseIndex: 0, isResting: false, restSeconds: 0 }),

    setProfile: (profile) =>
      set((state) => {
        storage.set(StorageKeys.PROFILE, profile)
        storage.set('fitness-app_onboarding', true)
        return { ...state, profile, hasCompletedOnboarding: true }
      }),

    updateProfile: (updates) =>
      set((state) => {
        if (!state.profile) return state
        const newProfile = { ...state.profile, ...updates }
        storage.set(StorageKeys.PROFILE, newProfile)
        return { ...state, profile: newProfile }
      }),

    addWorkoutPlan: (plan) =>
      set((state) => {
        const newPlan: WorkoutPlan = { ...plan, id: generateId() }
        const newPlans = [...state.workoutPlans, newPlan]
        storage.set(StorageKeys.WORKOUT_PLANS, newPlans)
        return { ...state, workoutPlans: newPlans }
      }),

    updateWorkoutPlan: (id, updates) =>
      set((state) => {
        const newPlans = state.workoutPlans.map((plan) =>
          plan.id === id ? { ...plan, ...updates } : plan
        )
        storage.set(StorageKeys.WORKOUT_PLANS, newPlans)
        return { ...state, workoutPlans: newPlans }
      }),

    deleteWorkoutPlan: (id) =>
      set((state) => {
        const newPlans = state.workoutPlans.filter((plan) => plan.id !== id)
        storage.set(StorageKeys.WORKOUT_PLANS, newPlans)
        return { ...state, workoutPlans: newPlans }
      }),

    addWorkoutLog: (log) =>
      set((state) => {
        const totalVolume = calculateTotalVolume(log.exercises)
        const newLog: WorkoutLog = { ...log, id: generateId(), totalVolume }
        const newLogs = [...state.workoutLogs, newLog]
        storage.set(StorageKeys.WORKOUT_LOGS, newLogs)
        return { ...state, workoutLogs: newLogs }
      }),

    updateWorkoutLog: (id, updates) =>
      set((state) => {
        const newLogs = state.workoutLogs.map((log) => {
          if (log.id !== id) return log
          const updatedLog = { ...log, ...updates }
          return {
            ...updatedLog,
            totalVolume: calculateTotalVolume(updatedLog.exercises),
          }
        })
        storage.set(StorageKeys.WORKOUT_LOGS, newLogs)
        return { ...state, workoutLogs: newLogs }
      }),

    deleteWorkoutLog: (id) =>
      set((state) => {
        const newLogs = state.workoutLogs.filter((log) => log.id !== id)
        storage.set(StorageKeys.WORKOUT_LOGS, newLogs)
        return { ...state, workoutLogs: newLogs }
      }),

    addFoodLog: (log) =>
      set((state) => {
        const totals = calculateFoodTotals(log.foods)
        const newLog: FoodLog = { ...log, id: generateId(), totalCalories: totals.calories, totalProtein: totals.protein, totalCarbs: totals.carbs, totalFat: totals.fat }
        const newLogs = [...state.foodLogs, newLog]
        storage.set(StorageKeys.FOOD_LOGS, newLogs)
        return { ...state, foodLogs: newLogs }
      }),

    updateFoodLog: (id, updates) =>
      set((state) => {
        const newLogs = state.foodLogs.map((log) => {
          if (log.id !== id) return log
          const updatedLog = { ...log, ...updates }
          const totals = calculateFoodTotals(updatedLog.foods)
          return { ...updatedLog, totalCalories: totals.calories, totalProtein: totals.protein, totalCarbs: totals.carbs, totalFat: totals.fat }
        })
        storage.set(StorageKeys.FOOD_LOGS, newLogs)
        return { ...state, foodLogs: newLogs }
      }),

    deleteFoodLog: (id) =>
      set((state) => {
        const newLogs = state.foodLogs.filter((log) => log.id !== id)
        storage.set(StorageKeys.FOOD_LOGS, newLogs)
        return { ...state, foodLogs: newLogs }
      }),

    addFatigueRecord: (record) =>
    set((state) => {
      const todayLogs = state.workoutLogs.filter((log) => log.date === record.date)
      const { calculatedLevel, combinedLevel } = calculateCombinedFatigue(todayLogs, record.subjectiveLevel)
      const newRecord: FatigueRecord = {
        ...record,
        fatigueLevel: combinedLevel,
        calculatedLevel,
      }
      const existingIndex = state.fatigueRecords.findIndex((r) => r.date === record.date)
      let newRecords
      if (existingIndex !== -1) {
        newRecords = [...state.fatigueRecords]
        newRecords[existingIndex] = newRecord
      } else {
        newRecords = [...state.fatigueRecords, newRecord]
      }
      storage.set(StorageKeys.FATIGUE_RECORDS, newRecords)
      return { ...state, fatigueRecords: newRecords }
    }),

  updateFatigueRecord: (date, subjectiveLevel) =>
    set((state) => {
      const todayLogs = state.workoutLogs.filter((log) => log.date === date)
      const { calculatedLevel, combinedLevel } = calculateCombinedFatigue(todayLogs, subjectiveLevel)
      const existingIndex = state.fatigueRecords.findIndex((r) => r.date === date)
      let newRecords
      if (existingIndex !== -1) {
        newRecords = [...state.fatigueRecords]
        newRecords[existingIndex] = { ...newRecords[existingIndex], subjectiveLevel, fatigueLevel: combinedLevel, calculatedLevel }
      } else {
        newRecords = [...state.fatigueRecords, { date, subjectiveLevel, fatigueLevel: combinedLevel, calculatedLevel }]
      }
      storage.set(StorageKeys.FATIGUE_RECORDS, newRecords)
      return { ...state, fatigueRecords: newRecords }
    }),

    setCompletedOnboarding: (completed) =>
      set((state) => {
        storage.set('fitness-app_onboarding', completed)
        return { ...state, hasCompletedOnboarding: completed }
      }),

    addCustomExercise: (exercise) =>
      set((state) => {
        const newExercise: ExerciseDefinition = {
          ...exercise,
          id: 'custom-' + generateId(),
          isCustom: true,
          createdAt: new Date().toISOString(),
        }
        const newCustomExercises = [...state.customExercises, newExercise]
        storage.set(StorageKeys.CUSTOM_EXERCISES, newCustomExercises)
        return { ...state, customExercises: newCustomExercises }
      }),

    updateCustomExercise: (id, updates) =>
      set((state) => {
        const newCustomExercises = state.customExercises.map((ex) =>
          ex.id === id ? { ...ex, ...updates } : ex
        )
        storage.set(StorageKeys.CUSTOM_EXERCISES, newCustomExercises)
        return { ...state, customExercises: newCustomExercises }
      }),

    deleteCustomExercise: (id) =>
      set((state) => {
        const newCustomExercises = state.customExercises.filter((ex) => ex.id !== id)
        storage.set(StorageKeys.CUSTOM_EXERCISES, newCustomExercises)
        return { ...state, customExercises: newCustomExercises }
      }),

    getAllExercises: () => {
      const state = get()
      return [...state.exercises, ...state.customExercises]
    },

    getExerciseById: (id) => {
      const state = get()
      return state.exercises.find((ex) => ex.id === id) || state.customExercises.find((ex) => ex.id === id)
    },

    getExerciseStats: (exerciseName) => {
      const state = get()
      const logs = state.workoutLogs.filter((log) =>
        log.exercises.some((ex) => ex.name === exerciseName)
      )

      let maxWeight = 0
      let maxReps = 0
      let maxVolume = 0
      let maxVolumeDate = ''
      let totalSets = 0
      let totalVolume = 0
      let lastTrained: string | null = null

      const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      if (sortedLogs.length > 0) {
        lastTrained = sortedLogs[0].date
      }

      logs.forEach((log) => {
        const exerciseEntries = log.exercises.filter((ex) => ex.name === exerciseName)
        let logVolume = 0
        exerciseEntries.forEach((ex) => {
          totalSets += ex.sets
          const volume = ex.weight * ex.sets * ex.reps
          totalVolume += volume
          logVolume += volume
          if (ex.weight > maxWeight) {
            maxWeight = ex.weight
            maxReps = ex.reps
          }
        })
        if (logVolume > maxVolume) {
          maxVolume = logVolume
          maxVolumeDate = log.date
        }
      })

      const pr: PersonalRecord = {
        maxWeight,
        maxReps,
        maxVolume,
        date: maxVolumeDate || new Date().toISOString(),
      }

      return {
        exerciseId: exerciseName,
        personalRecord: pr,
        totalSets,
        totalVolume,
        lastTrained,
      }
    },

    getRecentlyUsedExercises: (limit = 5) => {
      const state = get()
      const allExercises = [...state.exercises, ...state.customExercises]
      const exerciseUsage = new Map<string, { date: string; exercise: ExerciseDefinition }>()

      state.workoutLogs.forEach((log) => {
        log.exercises.forEach((ex) => {
          const existing = exerciseUsage.get(ex.name)
          if (!existing || new Date(log.date) > new Date(existing.date)) {
            const found = allExercises.find((e) => e.name === ex.name)
            if (found) {
              exerciseUsage.set(ex.name, { date: log.date, exercise: found })
            }
          }
        })
      })

      return Array.from(exerciseUsage.values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
        .map((item) => item.exercise)
    },

    clearAllData: () => {
      storage.remove(StorageKeys.PROFILE)
      storage.remove(StorageKeys.WORKOUT_PLANS)
      storage.remove(StorageKeys.WORKOUT_LOGS)
      storage.remove(StorageKeys.FOOD_LOGS)
      storage.remove(StorageKeys.CUSTOM_EXERCISES)
      window.location.reload()
    },
  }
})
