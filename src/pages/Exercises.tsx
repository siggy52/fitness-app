import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, X } from 'lucide-react'
import { useAppStore } from '../store'
import { MUSCLE_GROUPS } from '../constants'
import type { ExerciseDefinition } from '../types'

export default function Exercises() {
  const navigate = useNavigate()
  const { getAllExercises, addCustomExercise } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroup: 'chest',
    difficulty: 3,
    exerciseType: 'compound' as 'compound' | 'isolation',
    description: '',
    steps: '',
    tips: '',
  })

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

  const getMuscleName = (ids: string[]) => {
    const g = MUSCLE_GROUPS.find((mg) => ids.includes(mg.id))
    return g?.name || '其他'
  }

  const getMuscleColor = (ids: string[]) => {
    const g = MUSCLE_GROUPS.find((mg) => ids.includes(mg.id))
    return g?.color || '#e8ff47'
  }

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) return
    addCustomExercise({
      name: newExercise.name,
      muscleGroups: [newExercise.muscleGroup],
      difficulty: newExercise.difficulty,
      exerciseType: newExercise.exerciseType,
      description: newExercise.description || '暂无描述',
      steps: newExercise.steps ? newExercise.steps.split('\n').filter(s => s.trim()) : [],
      tips: newExercise.tips ? newExercise.tips.split('\n').filter(s => s.trim()) : [],
      commonMistakes: [],
    })
    setNewExercise({ 
      name: '', 
      muscleGroup: 'chest', 
      difficulty: 3, 
      exerciseType: 'compound',
      description: '',
      steps: '',
      tips: '',
    })
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">动作库</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 rounded-full bg-neon flex items-center justify-center shadow-fab"
          >
            <Plus className="w-6 h-6 text-dark-bg" />
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
            className="w-full bg-dark-card border border-dark-border rounded-2xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Tags */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {muscleGroupOptions.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedMuscle(g.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedMuscle === g.id
                  ? 'bg-neon text-dark-bg'
                  : 'bg-dark-card border border-dark-border text-dark-muted hover:border-zinc-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </header>

      {/* Exercise Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {filteredExercises.map((exercise) => {
            const muscleColor = getMuscleColor(exercise.muscleGroups)
            return (
              <button
                key={exercise.id}
                onClick={() => navigate(`/exercises/${exercise.id}`)}
                className="bg-dark-card border border-dark-border rounded-[24px] p-4 text-left hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ background: muscleColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm mb-1 truncate">{exercise.name}</h3>
                    <span className="text-[10px] px-2 py-1 bg-dark-bg text-dark-muted rounded-full">
                      {getMuscleName(exercise.muscleGroups)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
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
                  <span className="text-[10px] text-dark-muted">
                    {exercise.exerciseType === 'compound' ? '复合' : '孤立'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full bg-dark-card rounded-t-[32px] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">添加自定义动作</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center"
              >
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                placeholder="动作名称"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
              <select
                value={newExercise.muscleGroup}
                onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
              >
                {MUSCLE_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewExercise({ ...newExercise, exerciseType: 'compound' })}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                    newExercise.exerciseType === 'compound'
                      ? 'bg-neon text-dark-bg'
                      : 'bg-dark-bg border border-dark-border text-dark-muted'
                  }`}
                >
                  复合动作
                </button>
                <button
                  onClick={() => setNewExercise({ ...newExercise, exerciseType: 'isolation' })}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                    newExercise.exerciseType === 'isolation'
                      ? 'bg-neon text-dark-bg'
                      : 'bg-dark-bg border border-dark-border text-dark-muted'
                  }`}
                >
                  孤立动作
                </button>
              </div>
              <textarea
                value={newExercise.description}
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                placeholder="动作描述（选填）"
                rows={2}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors resize-none"
              />
              <textarea
                value={newExercise.steps}
                onChange={(e) => setNewExercise({ ...newExercise, steps: e.target.value })}
                placeholder="动作步骤（每行一条，选填）"
                rows={3}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors resize-none"
              />
              <textarea
                value={newExercise.tips}
                onChange={(e) => setNewExercise({ ...newExercise, tips: e.target.value })}
                placeholder="训练技巧（每行一条，选填）"
                rows={2}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors resize-none"
              />
              <button
                onClick={handleAddExercise}
                className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold shadow-fab hover:shadow-fab-hover transition-all"
              >
                添加动作
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
