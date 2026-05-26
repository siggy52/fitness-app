import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Trash2, Edit2, AlertTriangle, Lightbulb, ListOrdered, Info } from 'lucide-react'
import { useAppStore } from '../store'
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS, CATEGORY_LABELS } from '../data/exercises'
import { useState } from 'react'
import { ExerciseDefinition, MuscleGroup } from '../types'
import ExerciseAnimation from '../components/ExerciseAnimation'

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < level ? 'bg-orange-400' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getExerciseById, getExerciseStats, deleteCustomExercise, updateCustomExercise } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)

  const exercise = id ? getExerciseById(id) : undefined
  const stats = exercise ? getExerciseStats(exercise.name) : null

  if (!exercise) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">动作未找到</h3>
        </div>
      </div>
    )
  }

  const primaryMuscle = exercise.muscleGroups[0]
  const colorClass = MUSCLE_GROUP_COLORS[primaryMuscle] || 'bg-gray-500'

  const handleDelete = () => {
    if (confirm('确定要删除这个自定义动作吗？')) {
      deleteCustomExercise(exercise.id)
      navigate('/exercises')
    }
  }

  if (isEditing) {
    return <EditExerciseModal exercise={exercise} onClose={() => setIsEditing(false)} onSave={(updates) => {
      updateCustomExercise(exercise.id, updates)
      setIsEditing(false)
    }} />
  }

  return (
    <div className="pb-24">
      <div className={`${colorClass} p-4 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/exercises')}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {exercise.isCustom && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">{exercise.name}</h1>
        <div className="flex items-center gap-3 mb-3">
          <DifficultyDots level={exercise.difficulty} />
          <span className="text-sm opacity-90">{CATEGORY_LABELS[exercise.category]}</span>
          {exercise.isCustom && (
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">自定义</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {exercise.muscleGroups.map((mg) => (
            <span
              key={mg}
              className="text-xs bg-white/20 px-2 py-1 rounded-full"
            >
              {MUSCLE_GROUP_LABELS[mg] || mg}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 动画演示 */}
        <ExerciseAnimation exercise={exercise} size={280} />

        {stats && (stats.personalRecord.maxWeight > 0 || stats.totalSets > 0) && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold text-gray-800">我的记录</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{stats.personalRecord.maxWeight}</div>
                <div className="text-xs text-gray-500">最大重量(kg)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{stats.totalSets}</div>
                <div className="text-xs text-gray-500">总组数</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{stats.lastTrained ? new Date(stats.lastTrained).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : '-'}</div>
                <div className="text-xs text-gray-500">最近训练</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-gray-800">动作描述</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{exercise.description}</p>
        </div>

        {exercise.steps.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold text-gray-800">执行步骤</h2>
            </div>
            <div className="space-y-3">
              {exercise.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {exercise.tips.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold text-gray-800">动作要点</h2>
            </div>
            <div className="space-y-2">
              {exercise.tips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {exercise.commonMistakes.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold text-gray-800">常见错误</h2>
            </div>
            <div className="space-y-2">
              {exercise.commonMistakes.map((mistake, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{mistake}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EditExerciseModal({ exercise, onClose, onSave }: {
  exercise: ExerciseDefinition
  onClose: () => void
  onSave: (updates: Partial<ExerciseDefinition>) => void
}) {
  const [name, setName] = useState(exercise.name)
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>(exercise.muscleGroups)
  const [category, setCategory] = useState(exercise.category)
  const [difficulty, setDifficulty] = useState(exercise.difficulty)
  const [description, setDescription] = useState(exercise.description)
  const [steps, setSteps] = useState(exercise.steps.join('\n'))
  const [tips, setTips] = useState(exercise.tips.join('\n'))
  const [commonMistakes, setCommonMistakes] = useState(exercise.commonMistakes.join('\n'))

  const availableMuscleGroups: MuscleGroup[] = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps',
    'legs', 'glutes', 'hamstrings', 'quadriceps', 'calves',
    'core', 'abs', 'lower-back', 'full-body'
  ]

  const toggleMuscleGroup = (mg: MuscleGroup) => {
    setMuscleGroups((prev) =>
      prev.includes(mg) ? prev.filter((g) => g !== mg) : [...prev, mg]
    )
  }

  const handleSubmit = () => {
    if (!name.trim() || muscleGroups.length === 0) return
    onSave({
      name: name.trim(),
      muscleGroups,
      category,
      difficulty,
      description: description.trim(),
      steps: steps.split('\n').filter((s) => s.trim()),
      tips: tips.split('\n').filter((s) => s.trim()),
      commonMistakes: commonMistakes.split('\n').filter((s) => s.trim()),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">编辑动作</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">动作名称 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目标肌群 *</label>
              <div className="flex flex-wrap gap-2">
                {availableMuscleGroups.map((mg) => (
                  <button
                    key={mg}
                    onClick={() => toggleMuscleGroup(mg)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      muscleGroups.includes(mg)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {MUSCLE_GROUP_LABELS[mg] || mg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">动作类型</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExerciseDefinition['category'])}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="free-weight">自由重量</option>
                <option value="machine">器械</option>
                <option value="bodyweight">自重</option>
                <option value="cardio">有氧</option>
                <option value="stretching">拉伸</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">难度等级</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      difficulty === level
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">动作描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">执行步骤（每行一步）</label>
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">动作要点（每行一条）</label>
              <textarea
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">常见错误（每行一条）</label>
              <textarea
                value={commonMistakes}
                onChange={(e) => setCommonMistakes(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || muscleGroups.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
