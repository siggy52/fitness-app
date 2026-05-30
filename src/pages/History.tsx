import { useState } from 'react'
import { ChevronDown, ChevronUp, Download, FileText, Pencil, Check, X, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '../store'
import { formatDate, exportAllDataToCsv } from '../utils'
import { ConfirmModal } from '../components/ConfirmModal'
import { ExerciseSelector } from '../components/ExerciseSelector'
import { Exercise } from '../types'

export default function History() {
  const { workoutLogs, foodLogs, deleteWorkoutLog, deleteFoodLog, updateWorkoutLog } = useAppStore()
  const [expandedDate, setExpandedDate] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'workout' | 'food'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'workout' | 'food'; id: string } | null>(null)
  const [editingLog, setEditingLog] = useState<{ logId: string; exercises: Exercise[] } | null>(null)
  const [showAddExercise, setShowAddExercise] = useState(false)

  const allDates = Array.from(
    new Set([
      ...workoutLogs.map((log) => log.date),
      ...foodLogs.map((log) => log.date),
    ])
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const filteredDates = allDates.filter((date) => {
    if (filter === 'all') return true
    if (filter === 'workout') return workoutLogs.some((log) => log.date === date)
    if (filter === 'food') return foodLogs.some((log) => log.date === date)
    return true
  })

  const handleExport = () => {
    const csv = exportAllDataToCsv(workoutLogs, foodLogs)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitness-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEditLog = (logId: string, exercises: Exercise[]) => {
    setEditingLog({ logId, exercises: JSON.parse(JSON.stringify(exercises)) })
  }

  const handleSaveEdit = () => {
    if (!editingLog) return
    updateWorkoutLog(editingLog.logId, { exercises: editingLog.exercises })
    setEditingLog(null)
  }

  const handleCancelEdit = () => {
    setEditingLog(null)
  }

  const handleExerciseChange = (index: number, field: keyof Exercise, value: number) => {
    if (!editingLog) return
    const newExercises = [...editingLog.exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setEditingLog({ ...editingLog, exercises: newExercises })
  }

  const handleDeleteExercise = (index: number) => {
    if (!editingLog) return
    const newExercises = editingLog.exercises.filter((_, i) => i !== index)
    setEditingLog({ ...editingLog, exercises: newExercises })
  }

  const handleAddExercise = (exerciseName: string) => {
    if (!editingLog) return
    const newExercise: Exercise = {
      name: exerciseName,
      weight: 0,
      sets: 3,
      reps: 10,
      rpe: 7,
      completedSets: 0,
    }
    setEditingLog({ ...editingLog, exercises: [...editingLog.exercises, newExercise] })
    setShowAddExercise(false)
  }

  const isEditing = (logId: string) => editingLog?.logId === logId

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">历史记录</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="glass w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => alert('PDF导出功能开发中')}
              className="glass w-10 h-10 rounded-full flex items-center justify-center"
            >
              <FileText className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'workout', label: '训练' },
            { key: 'food', label: '饮食' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-neon text-dark-bg'
                  : 'bg-dark-card border border-dark-border text-dark-muted hover:border-zinc-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Records */}
      <div className="px-6 pb-8 space-y-3">
        {filteredDates.map((date) => {
          const dayWorkoutLogs = workoutLogs.filter((log) => log.date === date)
          const dayFoodLogs = foodLogs.filter((log) => log.date === date)
          const isExpanded = expandedDate === date

          const totalExercises = dayWorkoutLogs.reduce((sum, log) => sum + log.exercises.length, 0)
          const totalCalories = dayFoodLogs.reduce((sum, log) => sum + log.totalCalories, 0)

          return (
            <div
              key={date}
              className="bg-dark-card border border-dark-border rounded-[28px] overflow-hidden"
            >
              <button
                onClick={() => setExpandedDate(isExpanded ? null : date)}
                className="w-full p-5 flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="text-white font-bold">{formatDate(date)}</p>
                  <p className="text-sm text-dark-muted">
                    {totalExercises > 0 && `${totalExercises} 个动作`}
                    {totalExercises > 0 && totalCalories > 0 && ' · '}
                    {totalCalories > 0 && `${totalCalories} 千卡`}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-dark-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-muted" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-dark-border">
                  {dayWorkoutLogs.map((workoutLog, logIndex) => (
                    <div key={workoutLog.id} className={logIndex > 0 ? 'mt-6' : 'mt-4'}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-neon">
                          训练记录 {dayWorkoutLogs.length > 1 ? `#${logIndex + 1}` : ''}
                        </h4>
                        <div className="flex gap-3">
                          {isEditing(workoutLog.id) ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="text-xs text-green-500 hover:text-green-400 transition-colors flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" /> 保存
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
                              >
                                <X className="w-4 h-4" /> 取消
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditLog(workoutLog.id, workoutLog.exercises)}
                                className="text-xs text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                              >
                                <Pencil className="w-4 h-4" /> 编辑
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'workout', id: workoutLog.id })}
                                className="text-xs text-red-500 hover:text-red-400 transition-colors"
                              >
                                删除
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(isEditing(workoutLog.id) ? editingLog!.exercises : workoutLog.exercises).map((ex, i) => (
                          <div
                            key={i}
                            className="bg-dark-bg rounded-2xl p-3 flex items-center justify-between"
                          >
                            {isEditing(workoutLog.id) ? (
                              <>
                                <div className="flex-1">
                                  <p className="text-white font-medium mb-2">{ex.name}</p>
                                  <div className="flex gap-2 text-xs">
                                    <div className="flex items-center gap-1">
                                      <span className="text-dark-muted">重量</span>
                                      <input
                                        type="number"
                                        value={editingLog!.exercises[i].weight}
                                        onChange={(e) => handleExerciseChange(i, 'weight', Number(e.target.value))}
                                        className="w-16 bg-dark-card border border-dark-border rounded px-2 py-1 text-white"
                                      />
                                      <span className="text-dark-muted">kg</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-dark-muted">组</span>
                                      <input
                                        type="number"
                                        value={editingLog!.exercises[i].completedSets || editingLog!.exercises[i].sets}
                                        onChange={(e) => handleExerciseChange(i, 'completedSets', Number(e.target.value))}
                                        className="w-12 bg-dark-card border border-dark-border rounded px-2 py-1 text-white"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-dark-muted">次</span>
                                      <input
                                        type="number"
                                        value={editingLog!.exercises[i].reps}
                                        onChange={(e) => handleExerciseChange(i, 'reps', Number(e.target.value))}
                                        className="w-12 bg-dark-card border border-dark-border rounded px-2 py-1 text-white"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteExercise(i)}
                                  className="ml-2 text-red-500 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-white font-medium">{ex.name}</p>
                                  <p className="text-xs text-dark-muted">
                                    {ex.weight}kg × {ex.completedSets || ex.sets}组 × {ex.reps}次
                                  </p>
                                </div>
                                <p className="text-neon font-bold">{ex.weight * (ex.completedSets || ex.sets) * ex.reps}</p>
                              </>
                            )}
                          </div>
                        ))}
                        {isEditing(workoutLog.id) && (
                          <button
                            onClick={() => setShowAddExercise(true)}
                            className="w-full bg-dark-bg rounded-2xl p-3 flex items-center justify-center gap-2 text-neon hover:bg-dark-card transition-colors"
                          >
                            <Plus className="w-4 h-4" /> 添加动作
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-dark-border">
                        <span className="text-dark-muted text-sm">总训练量</span>
                        <span className="text-white font-bold">
                          {isEditing(workoutLog.id)
                            ? editingLog!.exercises.reduce((sum, ex) => sum + ex.weight * (ex.completedSets || ex.sets) * ex.reps, 0)
                            : workoutLog.totalVolume}
                        </span>
                      </div>
                    </div>
                  ))}

                  {dayFoodLogs.map((foodLog, logIndex) => (
                    <div key={foodLog.id} className={(dayWorkoutLogs.length > 0 || logIndex > 0) ? 'mt-6' : 'mt-4'}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-cyan-accent">
                          饮食记录 {dayFoodLogs.length > 1 ? `#${logIndex + 1}` : ''}
                        </h4>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'food', id: foodLog.id })}
                          className="text-xs text-red-500 hover:text-red-400 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                      <div className="space-y-2">
                        {foodLog.foods.map((food, i) => (
                          <div
                            key={i}
                            className="bg-dark-bg rounded-2xl p-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-white font-medium">{food.name}</p>
                              <p className="text-xs text-dark-muted">{food.quantity}g</p>
                            </div>
                            <p className="text-cyan-accent font-bold">{food.calories} 千卡</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-dark-border">
                        <span className="text-dark-muted text-sm">总热量</span>
                        <span className="text-white font-bold">{foodLog.totalCalories} 千卡</span>
                      </div>
                    </div>
                  ))}

                  {dayWorkoutLogs.length === 0 && dayFoodLogs.length === 0 && (
                    <p className="text-dark-muted text-sm mt-4">当天无详细记录</p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filteredDates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-muted">暂无记录</p>
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            if (deleteConfirm.type === 'workout') {
              deleteWorkoutLog(deleteConfirm.id)
            } else {
              deleteFoodLog(deleteConfirm.id)
            }
          }
          setDeleteConfirm(null)
        }}
        title="删除记录"
        message={`确定要删除这条${deleteConfirm?.type === 'workout' ? '训练' : '饮食'}记录吗？此操作无法撤销。`}
        confirmText="确认删除"
        danger
      />

      {showAddExercise && editingLog && (
        <ExerciseSelector
          onSelect={handleAddExercise}
          onClose={() => setShowAddExercise(false)}
        />
      )}
    </div>
  )
}
