import { useState } from 'react'
import { Plus, ArrowRight, ChevronDown, ChevronUp, Trash2, Edit2, BookOpen, X } from 'lucide-react'
import { useAppStore } from '../store'
import { PRESET_PLANS } from '../constants'
import type { WorkoutPlan, DayExercises } from '../types'
import { ExerciseSelector } from '../components/ExerciseSelector'
import { NumberInput } from '../components/NumberInput'

const GRADIENTS = [
  'from-purple-600 to-blue-600',
  'from-yellow-500 to-orange-500',
  'from-zinc-700 to-zinc-900',
  'from-cyan-500 to-blue-500',
]

export default function Plan() {
  const { workoutPlans, addWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } = useAppStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [planName, setPlanName] = useState('')
  const [planDescription, setPlanDescription] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [editDays, setEditDays] = useState<DayExercises[]>([])
  const [activeEditDay, setActiveEditDay] = useState('')
  const [newExerciseName, setNewExerciseName] = useState('')
  const [newExerciseSets, setNewExerciseSets] = useState(3)
  const [newExerciseReps, setNewExerciseReps] = useState(10)
  const [newExerciseWeight, setNewExerciseWeight] = useState(0)
  const [newExerciseRpe, setNewExerciseRpe] = useState(7)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)

  const handleCreatePlan = (presetPlan?: typeof PRESET_PLANS[0]) => {
    if (presetPlan) {
      addWorkoutPlan({
        name: presetPlan.name,
        description: presetPlan.description,
        trainingDays: presetPlan.trainingDays,
      })
      setShowCreateModal(false)
      return
    }

    if (!planName.trim()) return
    addWorkoutPlan({
      name: planName,
      description: planDescription,
      trainingDays: selectedDays.map((day) => ({ day, exercises: [] })),
    })
    setPlanName('')
    setPlanDescription('')
    setSelectedDays([])
    setShowCreateModal(false)
  }

  const handleUpdatePlan = () => {
    if (!editingPlan || !planName.trim()) return
    updateWorkoutPlan(editingPlan.id, {
      name: planName,
      description: planDescription,
      trainingDays: editDays,
    })
    setShowEditModal(false)
    setEditingPlan(null)
  }

  const handleDeletePlan = (id: string) => {
    if (confirm('确定要删除这个训练计划吗？')) {
      deleteWorkoutPlan(id)
    }
  }

  const handleSelectFromLibrary = (name: string) => {
    if (!activeEditDay) return
    setNewExerciseName(name)
    setShowExerciseSelector(false)
  }

  const handleAddExerciseToDay = () => {
    if (!activeEditDay || !newExerciseName.trim()) return
    const newExercise = {
      name: newExerciseName,
      weight: newExerciseWeight,
      sets: newExerciseSets,
      reps: newExerciseReps,
      rpe: newExerciseRpe,
    }
    setEditDays((prev) =>
      prev.map((d) =>
        d.day === activeEditDay
          ? { ...d, exercises: [...d.exercises, newExercise] }
          : d
      )
    )
    setNewExerciseName('')
    setNewExerciseWeight(0)
    setNewExerciseSets(3)
    setNewExerciseReps(10)
    setNewExerciseRpe(7)
  }

  const handleRemoveExerciseFromDay = (day: string, index: number) => {
    setEditDays((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, exercises: d.exercises.filter((_, i) => i !== index) }
          : d
      )
    )
  }

  const openEditModal = (plan: WorkoutPlan) => {
    setEditingPlan(plan)
    setPlanName(plan.name)
    setPlanDescription(plan.description)
    setEditDays(plan.trainingDays.map((d) => ({ day: d.day, exercises: [...d.exercises] })))
    setActiveEditDay(plan.trainingDays[0]?.day || '')
    setShowEditModal(true)
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-dark-muted text-sm">2026年5月</p>
            <h1 className="text-3xl font-bold text-white">训练计划</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-12 h-12 rounded-full bg-neon flex items-center justify-center shadow-fab"
          >
            <Plus className="w-6 h-6 text-dark-bg" />
          </button>
        </div>
      </header>

      {/* Plan Cards */}
      <div className="px-6 pb-8 space-y-4">
        {workoutPlans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative h-[200px] rounded-[32px] overflow-hidden bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="tag-pill bg-white/20 text-white backdrop-blur-sm">
                  {plan.trainingDays.length} 天/周
                </span>
                <button
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-white/80 text-sm mb-3">{plan.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-xs text-white font-medium"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/60 text-sm">+128 人已完成</span>
                </div>
              </div>
            </div>

            {/* Expanded Actions */}
            {expandedPlan === plan.id && (
              <div className="absolute top-4 right-16 flex gap-2">
                <button
                  onClick={() => openEditModal(plan)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full bg-dark-card rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">创建训练计划</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center"
              >
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>

            {/* Preset Plans */}
            <div className="mb-6">
              <h3 className="text-sm text-dark-muted mb-3">快速创建</h3>
              <div className="space-y-3">
                {PRESET_PLANS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleCreatePlan(preset)}
                    className="w-full bg-dark-bg border border-dark-border rounded-[24px] p-4 text-left hover:border-zinc-700 transition-colors"
                  >
                    <h4 className="text-white font-bold">{preset.name}</h4>
                    <p className="text-dark-muted text-sm">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Plan */}
            <div className="space-y-4">
              <h3 className="text-sm text-dark-muted">自定义计划</h3>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="计划名称"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
              <input
                type="text"
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="计划描述"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
              <div>
                <p className="text-sm text-dark-muted mb-2">训练日</p>
                <div className="flex flex-wrap gap-2">
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedDays.includes(day)
                          ? 'bg-neon text-dark-bg'
                          : 'bg-dark-bg border border-dark-border text-dark-muted hover:border-zinc-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleCreatePlan()}
                className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold shadow-fab hover:shadow-fab-hover transition-all"
              >
                创建计划
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full bg-dark-card rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">编辑计划</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center"
              >
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="计划名称"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
              <input
                type="text"
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="计划描述"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />

              {/* Day Tabs */}
              <div>
                <p className="text-sm text-dark-muted mb-3">训练日动作编辑</p>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
                  {editDays.map((d) => (
                    <button
                      key={d.day}
                      onClick={() => setActiveEditDay(d.day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeEditDay === d.day
                          ? 'bg-neon text-dark-bg'
                          : 'bg-dark-bg border border-dark-border text-dark-muted hover:border-zinc-700'
                      }`}
                    >
                      {d.day}
                    </button>
                  ))}
                </div>

                {/* Exercises for Active Day */}
                {activeEditDay && (
                  <div className="bg-dark-bg rounded-2xl p-4 mb-4">
                    {editDays.find((d) => d.day === activeEditDay)?.exercises.length === 0 ? (
                      <p className="text-sm text-dark-muted italic text-center py-2">暂无动作</p>
                    ) : (
                      <div className="space-y-2">
                        {editDays.find((d) => d.day === activeEditDay)?.exercises.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between bg-dark-card rounded-xl p-3">
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">{ex.name}</p>
                              <p className="text-xs text-dark-muted">
                                {ex.weight}kg × {ex.sets}组 × {ex.reps}次 · RPE {ex.rpe}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveExerciseFromDay(activeEditDay, i)}
                              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Add Exercise Form */}
                <div className="bg-dark-bg rounded-2xl p-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      placeholder="动作名称"
                      className="flex-1 bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setShowExerciseSelector(true)}
                      className="px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-neon text-sm font-medium hover:border-zinc-700 transition-all"
                      title="从动作库选择"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div>
                      <label className="block text-[10px] text-dark-muted mb-0.5 text-center">重量(kg)</label>
                      <NumberInput
                        value={newExerciseWeight}
                        onChange={setNewExerciseWeight}
                        min={0}
                        className="w-full bg-dark-card border border-dark-border rounded-xl px-2 py-2 text-white text-sm text-center focus:border-neon focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-dark-muted mb-0.5 text-center">组数</label>
                      <NumberInput
                        value={newExerciseSets}
                        onChange={setNewExerciseSets}
                        min={1}
                        className="w-full bg-dark-card border border-dark-border rounded-xl px-2 py-2 text-white text-sm text-center focus:border-neon focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-dark-muted mb-0.5 text-center">次数</label>
                      <NumberInput
                        value={newExerciseReps}
                        onChange={setNewExerciseReps}
                        min={1}
                        className="w-full bg-dark-card border border-dark-border rounded-xl px-2 py-2 text-white text-sm text-center focus:border-neon focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-dark-muted mb-0.5 text-center">RPE</label>
                      <NumberInput
                        value={newExerciseRpe}
                        min={1}
                        max={10}
                        onChange={(v) => setNewExerciseRpe(Math.min(10, Math.max(1, v)))}
                        className="w-full bg-dark-card border border-dark-border rounded-xl px-2 py-2 text-white text-sm text-center focus:border-neon focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddExerciseToDay}
                    disabled={!newExerciseName.trim()}
                    className="w-full bg-neon/10 text-neon py-2.5 rounded-xl text-sm font-medium hover:bg-neon/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + 添加到 {activeEditDay}
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdatePlan}
                className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold shadow-fab hover:shadow-fab-hover transition-all"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleSelectFromLibrary}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}
    </div>
  )
}
