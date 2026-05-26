import { useState, useMemo } from 'react'
import { Search, Clock, X, Dumbbell } from 'lucide-react'
import { useAppStore } from '../store'
import { ExerciseDefinition, MuscleGroup } from '../types'
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS, CATEGORY_LABELS } from '../data/exercises'

const FILTER_GROUPS: { key: string; label: string; groups: MuscleGroup[] }[] = [
  { key: 'all', label: '全部', groups: [] },
  { key: 'chest', label: '胸部', groups: ['chest'] },
  { key: 'back', label: '背部', groups: ['back', 'lower-back'] },
  { key: 'legs', label: '腿部', groups: ['legs', 'quadriceps', 'hamstrings', 'glutes', 'calves'] },
  { key: 'shoulders', label: '肩部', groups: ['shoulders'] },
  { key: 'arms', label: '手臂', groups: ['biceps', 'triceps'] },
  { key: 'core', label: '核心', groups: ['core', 'abs'] },
  { key: 'cardio', label: '有氧', groups: ['full-body'] },
]

interface ExerciseSelectorProps {
  onSelect: (exerciseName: string) => void
  onClose: () => void
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < level ? 'bg-orange-400' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function ExerciseSelector({ onSelect, onClose }: ExerciseSelectorProps) {
  const { getAllExercises, getRecentlyUsedExercises } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualName, setManualName] = useState('')

  const allExercises = getAllExercises()
  const recentlyUsed = getRecentlyUsedExercises(5)

  const filteredExercises = useMemo(() => {
    let result = allExercises

    if (activeFilter !== 'all') {
      const filterGroup = FILTER_GROUPS.find((g) => g.key === activeFilter)
      if (filterGroup && filterGroup.groups.length > 0) {
        result = result.filter((ex) =>
          ex.muscleGroups.some((mg) => filterGroup.groups.includes(mg))
        )
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.muscleGroups.some((mg) =>
            (MUSCLE_GROUP_LABELS[mg] || mg).toLowerCase().includes(query)
          )
      )
    }

    return result
  }, [allExercises, activeFilter, searchQuery])

  const handleSelect = (exercise: ExerciseDefinition) => {
    onSelect(exercise.name)
    onClose()
  }

  const handleManualSubmit = () => {
    if (manualName.trim()) {
      onSelect(manualName.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">选择动作</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索动作..."
              className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {!searchQuery && recentlyUsed.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">最近使用</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {recentlyUsed.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelect(exercise)}
                    className="flex-shrink-0 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all"
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
            {FILTER_GROUPS.map((group) => (
              <button
                key={group.key}
                onClick={() => setActiveFilter(group.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === group.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[40vh] overflow-y-auto">
            {filteredExercises.map((exercise) => {
              const primaryMuscle = exercise.muscleGroups[0]
              const colorClass = MUSCLE_GROUP_COLORS[primaryMuscle] || 'bg-gray-500'

              return (
                <button
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all text-left"
                >
                  <div className={`w-1 h-10 rounded-full ${colorClass}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm">{exercise.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <DifficultyDots level={exercise.difficulty} />
                      <span className="text-xs text-gray-400">
                        {CATEGORY_LABELS[exercise.category]}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}

            {filteredExercises.length === 0 && (
              <div className="text-center py-6">
                <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">未找到匹配的动作</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            {!showManualInput ? (
              <button
                onClick={() => setShowManualInput(true)}
                className="w-full py-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-all"
              >
                + 手动输入动作名称
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="输入动作名称"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualName.trim()}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  添加
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
