import { useAppStore } from '../store'

export function useLastTrainingData() {
  const workoutLogs = useAppStore((state) => state.workoutLogs)

  const getLastTrainingData = (exerciseName: string): { lastWeight: number; lastReps: number } | null => {
    if (!exerciseName) return null

    const sortedLogs = [...workoutLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    for (const log of sortedLogs) {
      const found = log.exercises.find((ex) => ex.name === exerciseName)
      if (found) {
        return { lastWeight: found.weight, lastReps: found.reps }
      }
    }

    return null
  }

  return getLastTrainingData
}
