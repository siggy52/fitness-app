import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Dumbbell } from 'lucide-react'
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

function ExerciseCard({ exercise }: { exercise: ExerciseDefinition }) {
  const navigate = useNavigate()
  const primaryMuscle = exercise.muscleGroups[0]
  const colorClass = MUSCLE_GROUP_COLORS[primaryMuscle] || 'bg-gray-500'

  return (
    <button
      onClick={() => navigate(`/exercises/${exercise.id}`)}
      className="bg-white rounded-2xl p-4 shadow-sm text-left w-full hover:shadow-md transition-all active:scale-95"
    >
      <div className="flex items-start gap-3">
        <div className={`w-1.5 h-12 rounded-full ${colorClass} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{exercise.name}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {exercise.muscleGroups.slice(0, 2).map((mg) => (
              <span
                key={mg}
                className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {MUSCLE_GROUP_LABELS[mg] || mg}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <DifficultyDots level={exercise.difficulty} />
            <span className="text-[10px] text-gray-400">
              {CATEGORY_LABELS[exercise.category]}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default function Exercises() {
  const { getAllExercises } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showCustomModal, setShowCustomModal] = useState(false)

  const allExercises = getAllExercises()

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
          ) ||
          ex.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [allExercises, activeFilter, searchQuery])

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">动作库</h1>
        <button
          onClick={() => setShowCustomModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索动作..."
          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        {FILTER_GROUPS.map((group) => (
          <button
            key={group.key}
            onClick={() => setActiveFilter(group.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === group.key
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">未找到动作</h3>
          <p className="text-gray-400">尝试其他搜索词或添加自定义动作</p>
        </div>
      )}

      {showCustomModal && (
        <CustomExerciseModal onClose={() => setShowCustomModal(false)} />
      )}
    </div>
  )
}

function CustomExerciseModal({ onClose }: { onClose: () => void }) {
  const { addCustomExercise } = useAppStore()
  const [name, setName] = useState('')
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [category, setCategory] = useState<ExerciseDefinition['category']>('free-weight')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [tips, setTips] = useState('')
  const [commonMistakes, setCommonMistakes] = useState('')

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
    addCustomExercise({
      name: name.trim(),
      muscleGroups,
      category,
      difficulty,
      description: description.trim(),
      steps: steps.split('\n').filter((s) => s.trim()),
      tips: tips.split('\n').filter((s) => s.trim()),
      commonMistakes: commonMistakes.split('\n').filter((s) => s.trim()),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">添加自定义动作</h2>
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
                placeholder="例如：我的专属动作"
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
                placeholder="简要描述这个动作..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">执行步骤（每行一步）</label>
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="第一步...&#10;第二步...&#10;第三步..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">动作要点（每行一条）</label>
              <textarea
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                placeholder="要点1...&#10;要点2..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">常见错误（每行一条）</label>
              <textarea
                value={commonMistakes}
                onChange={(e) => setCommonMistakes(e.target.value)}
                placeholder="错误1...&#10;错误2..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || muscleGroups.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加动作
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
