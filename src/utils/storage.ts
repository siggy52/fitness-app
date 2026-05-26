const STORAGE_KEY_PREFIX = 'fitness-app_'

export const StorageKeys = {
  PROFILE: 'profile',
  WORKOUT_PLANS: 'workoutPlans',
  WORKOUT_LOGS: 'workoutLogs',
  FOOD_LOGS: 'foodLogs',
  FATIGUE_RECORDS: 'fatigueRecords',
  CUSTOM_EXERCISES: 'customExercises',
} as const

type StorageKey = typeof StorageKeys[keyof typeof StorageKeys]

export const storage = {
  get: <T>(key: StorageKey, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  },

  set: (key: StorageKey, value: unknown): void => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  },

  remove: (key: StorageKey): void => {
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  },

  clearAll: (): void => {
    try {
      Object.values(StorageKeys).forEach((key) => {
        localStorage.removeItem(STORAGE_KEY_PREFIX + key)
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}
