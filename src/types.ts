export type Profile = {
  height: number
  weight: number
  age: number
  gender: 'male' | 'female'
  bmr: number
}

export type Exercise = {
  name: string
  weight: number
  sets: number
  reps: number
  rpe: number
}

export type DayExercises = {
  day: string
  exercises: Exercise[]
}

export type WorkoutPlan = {
  id: string
  name: string
  description: string
  trainingDays: DayExercises[]
}

export type WorkoutLog = {
  id: string
  date: string
  exercises: Exercise[]
  totalVolume: number
}

export type FoodItem = {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type FoodLog = {
  id: string
  date: string
  foods: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export type FatigueRecord = {
  date: string
  fatigueLevel: number
}

export type ExerciseCategory =
  | 'free-weight'
  | 'machine'
  | 'bodyweight'
  | 'cardio'
  | 'stretching'

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'legs'
  | 'glutes'
  | 'hamstrings'
  | 'quadriceps'
  | 'calves'
  | 'core'
  | 'abs'
  | 'lower-back'
  | 'full-body'

export interface ExerciseDefinition {
  id: string
  name: string
  muscleGroups: MuscleGroup[]
  category: ExerciseCategory
  difficulty: DifficultyLevel
  description: string
  steps: string[]
  tips: string[]
  commonMistakes: string[]
  isCustom: boolean
  createdAt: string
}

export interface PersonalRecord {
  maxWeight: number
  maxReps: number
  maxVolume: number
  date: string
}

export interface ExerciseStats {
  exerciseId: string
  personalRecord: PersonalRecord
  totalSets: number
  totalVolume: number
  lastTrained: string | null
}
