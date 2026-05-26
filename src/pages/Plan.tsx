import { useState } from 'react'
import { Plus, Dumbbell, TrendingDown, Target, Edit, Trash2, CheckCircle, X, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { useAppStore } from '../store'
import { PRESET_PLANS } from '../constants'
import { WorkoutPlan, DayExercises } from '../types'
import ExerciseSelector from '../components/ExerciseSelector'

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export default function Plan() {
  const { workoutPlans, addWorkoutPlan, deleteWorkoutPlan, updateWorkoutPlan } = useAppStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [selectedPreset] = useState<number | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDays, setEditDays] = useState<DayExercises[]>([])
  const [activeEditDay, setActiveEditDay] = useState<string>('')
  const [newExerciseName, setNewExerciseName] = useState('')
  const [newExerciseSets, setNewExerciseSets] = useState(3)
  const [newExerciseReps, setNewExerciseReps] = useState(10)
  const [newExerciseWeight, setNewExerciseWeight] = useState(0)
  const [newExerciseRpe, setNewExerciseRpe] = useState(7)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)

  const handleSelectFromLibrary = (name: string) => {
    if (!activeEditDay) return
    setEditDays(prev =>
      prev.map(d =>
        d.day === activeEditDay
          ? { ...d, exercises: [...d.exercises, { name, sets: newExerciseSets, reps: newExerciseReps, weight: newExerciseWeight, rpe: newExerciseRpe }] }
          : d
      )
    )
    setNewExerciseName('')
  }

  const handleAddPreset = (presetIndex: number) => {
    const preset = PRESET_PLANS[presetIndex]
    addWorkoutPlan({ ...preset })
    setShowCreateModal(false)
  }

  const handleCreateCustom = () => {
    const newPlan: Omit<WorkoutPlan, 'id'> = {
      name: '自定义计划',
      description: '我的训练计划',
      trainingDays: [],
    }
    addWorkoutPlan(newPlan)
    setShowCreateModal(false)
    const plans = useAppStore.getState().workoutPlans
    const added = plans[plans.length - 1]
    openEdit(added)
  }

  const openEdit = (plan: WorkoutPlan) => {
    setEditingPlan(plan)
    setEditName(plan.name)
    setEditDescription(plan.description)
    const daysCopy = plan.trainingDays.map(d => ({ day: d.day, exercises: d.exercises.map(e => ({ ...e })) }))
    setEditDays(daysCopy)
    setActiveEditDay(daysCopy.length > 0 ? daysCopy[0].day : '')
  }

  const handleSaveEdit = () => {
    if (!editingPlan || !editName.trim()) return
    updateWorkoutPlan(editingPlan.id, {
      name: editName,
      description: editDescription,
      trainingDays: editDays,
    })
    setEditingPlan(null)
  }

  const toggleDay = (day: string) => {
    setEditDays(prev => {
      const exists = prev.find(d => d.day === day)
      if (exists) {
        const next = prev.filter(d => d.day !== day)
        if (activeEditDay === day && next.length > 0) {
          setActiveEditDay(next[0].day)
        }
        return next
      }
      if (!activeEditDay) setActiveEditDay(day)
      return [...prev, { day, exercises: [] }]
    })
  }

  const handleAddExerciseToDay = () => {
    if (!newExerciseName.trim() || !activeEditDay) return
    setEditDays(prev =>
      prev.map(d =>
        d.day === activeEditDay
          ? { ...d, exercises: [...d.exercises, { name: newExerciseName, sets: newExerciseSets, reps: newExerciseReps, weight: newExerciseWeight, rpe: newExerciseRpe }] }
          : d
      )
    )
    setNewExerciseName('')
    setNewExerciseSets(3)
    setNewExerciseReps(10)
    setNewExerciseWeight(0)
    setNewExerciseRpe(7)
  }

  const handleRemoveEditExercise = (day: string, index: number) => {
    setEditDays(prev =>
      prev.map(d =>
        d.day === day
          ? { ...d, exercises: d.exercises.filter((_, i) => i !== index) }
          : d
      )
    )
  }

  const getPlanIcon = (name: string) => {
    if (name.includes('增肌')) return <Dumbbell className="w-6 h-6 text-blue-500" />
    if (name.includes('减脂')) return <TrendingDown className="w-6 h-6 text-orange-500" />
    return <Target className="w-6 h-6 text-green-500" />
  }

  const getPlanGradient = (name: string) => {
    if (name.includes('增肌')) return 'from-blue-400 to-blue-600'
    if (name.includes('减脂')) return 'from-orange-400 to-red-500'
    return 'from-green-400 to-teal-500'
  }

  const totalExercisesInPlan = (plan: WorkoutPlan) => {
    if (!plan.trainingDays || !Array.isArray(plan.trainingDays)) return 0
    return plan.trainingDays.reduce((sum, d) => sum + (d.exercises?.length || 0), 0)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">训练计划</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {workoutPlans.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">还没有训练计划</h3>
          <p className="text-gray-400 mb-6">选择一个预设计划或创建自己的计划</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium"
          >
            创建计划
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {workoutPlans.map((plan) => {
            const isExpanded = expandedPlan === plan.id
            return (
              <div key={plan.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className={`bg-gradient-to-r ${getPlanGradient(plan.name)} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPlanIcon(plan.name)}
                      <div>
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <p className="text-sm opacity-90">{plan.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(plan)}
                        className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteWorkoutPlan(plan.id)}
                        className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {plan.trainingDays.map((d, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {d.day}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? '收起' : `${totalExercisesInPlan(plan)} 个动作`}
                  </button>
                  {isExpanded && (
                    <div className="mt-3 space-y-4">
                      {plan.trainingDays.map((d, di) => (
                        <div key={di}>
                          <div className="text-sm font-semibold text-gray-700 mb-2">{d.day}</div>
                          <div className="space-y-2">
                            {d.exercises.map((exercise, ei) => (
                              <div key={ei} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                <span className="font-medium text-gray-700">{exercise.name}</span>
                                <span className="text-sm text-gray-500">
                                  {exercise.sets}组 × {exercise.reps}次
                                </span>
                              </div>
                            ))}
                            {d.exercises.length === 0 && (
                              <p className="text-sm text-gray-400 italic">暂无动作</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">创建训练计划</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-medium text-gray-700">选择预设计划</h3>
                {PRESET_PLANS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddPreset(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPreset === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPlanGradient(preset.name)} flex items-center justify-center`}>
                        {getPlanIcon(preset.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{preset.name}</div>
                        <div className="text-sm text-gray-500">{preset.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={handleCreateCustom}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  创建自定义计划
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">编辑计划</h2>
                <button
                  onClick={() => setEditingPlan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">计划名称</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    训练日 <span className="text-gray-400 font-normal">（点击选择/取消）</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const selected = editDays.some(d => d.day === day)
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selected
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {editDays.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                      {editDays.map((d) => (
                        <button
                          key={d.day}
                          onClick={() => setActiveEditDay(d.day)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            activeEditDay === d.day
                              ? 'bg-purple-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {d.day} ({d.exercises.length})
                        </button>
                      ))}
                    </div>

                    {activeEditDay && (() => {
                      const currentDay = editDays.find(d => d.day === activeEditDay)
                      if (!currentDay) return null
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                              {activeEditDay} · 动作列表
                            </label>
                          </div>

                          <div className="space-y-2 mb-3">
                            {currentDay.exercises.map((exercise, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                <div>
                                  <span className="font-medium text-gray-700">{exercise.name}</span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {exercise.sets}组 × {exercise.reps}次
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveEditExercise(activeEditDay, i)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {currentDay.exercises.length === 0 && (
                              <p className="text-sm text-gray-400 italic text-center py-2">
                                暂无动作，请在下方添加
                              </p>
                            )}
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="grid grid-cols-4 gap-2 mb-3">
                              <div className="col-span-4 flex gap-2">
                                <input
                                  type="text"
                                  value={newExerciseName}
                                  onChange={(e) => setNewExerciseName(e.target.value)}
                                  placeholder="动作名称"
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                                <button
                                  onClick={() => setShowExerciseSelector(true)}
                                  className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all"
                                  title="从动作库选择"
                                >
                                  <BookOpen className="w-4 h-4" />
                                </button>
                              </div>
                              <input
                                type="number"
                                value={newExerciseWeight}
                                onChange={(e) => setNewExerciseWeight(Number(e.target.value))}
                                placeholder="重量"
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                              />
                              <input
                                type="number"
                                value={newExerciseSets}
                                onChange={(e) => setNewExerciseSets(Number(e.target.value))}
                                placeholder="组数"
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                              />
                              <input
                                type="number"
                                value={newExerciseReps}
                                onChange={(e) => setNewExerciseReps(Number(e.target.value))}
                                placeholder="次数"
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                              />
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={newExerciseRpe}
                                onChange={(e) => setNewExerciseRpe(Math.min(10, Math.max(1, Number(e.target.value))))}
                                placeholder="RPE"
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                              />
                            </div>
                            <button
                              onClick={handleAddExerciseToDay}
                              disabled={!newExerciseName.trim()}
                              className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              + 添加到 {activeEditDay}
                            </button>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editName.trim() || editDays.length === 0}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5 inline mr-1" />
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleSelectFromLibrary}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}
    </div>
  )
}
