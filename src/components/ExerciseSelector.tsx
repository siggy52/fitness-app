import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { useAppStore } from '../store'
import { MUSCLE_GROUPS } from '../constants'

interface ExerciseSelectorProps {
  onSelect: (exerciseName: string) => void
  onClose: () => void
}

export function ExerciseSelector({ onSelect, onClose }: ExerciseSelectorProps) {
  const { getAllExercises } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')

  const allExercises = getAllExercises()

  const filteredExercises = useMemo(() => {
    let filtered = allExercises
    if (searchQuery) {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedMuscle !== 'all') {
      if (selectedMuscle === 'arms') {
        filtered = filtered.filter((ex) =>
          ex.muscleGroups.some(g => ['biceps', 'triceps', 'forearms'].includes(g))
        )
      } else if (selectedMuscle === 'legs') {
        filtered = filtered.filter((ex) =>
          ex.muscleGroups.some(g => ['legs', 'quadriceps', 'glutes', 'hamstrings', 'calves'].includes(g))
        )
      } else {
        filtered = filtered.filter((ex) => ex.muscleGroups.includes(selectedMuscle as any))
      }
    }
    return filtered
  }, [allExercises, searchQuery, selectedMuscle])

  const muscleGroupOptions = [
    { id: 'all', name: '全部' },
    { id: 'chest', name: '胸部' },
    { id: 'back', name: '背部' },
    { id: 'shoulders', name: '肩部' },
    { id: 'legs', name: '腿部' },
    { id: 'arms', name: '手臂' },
  ]

  const getMuscleData = (ids: string[]) => {
    const g = MUSCLE_GROUPS.find((mg) => ids.includes(mg.id))
    return g || { name: '其他', color: '#e8ff47' }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full bg-dark-card rounded-t-[32px] p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">选择动作</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索动作..."
            className="w-full bg-dark-bg border border-dark-border rounded-2xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Tags */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-2">
          {muscleGroupOptions.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedMuscle(g.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedMuscle === g.id
                  ? 'bg-neon text-dark-bg'
                  : 'bg-dark-bg border border-dark-border text-dark-muted hover:border-zinc-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          {filteredExercises.map((exercise) => {
            const md = getMuscleData(exercise.muscleGroups)
            return (
              <button
                key={exercise.id}
                onClick={() => onSelect(exercise.name)}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl p-4 flex items-center gap-3 text-left hover:border-zinc-700 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: md.color + '20' }}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: md.color }}
                  >
                    {exercise.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{exercise.name}</p>
                  <p className="text-xs text-dark-muted">{md.name}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < exercise.difficulty ? 'bg-neon' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
