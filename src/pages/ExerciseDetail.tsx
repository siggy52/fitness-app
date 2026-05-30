import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Play, Star, Clock, Dumbbell, AlertTriangle, CheckCircle, Pencil, Trash2 } from 'lucide-react'
import { useAppStore } from '../store'
import { MUSCLE_GROUPS, DIFFICULTY_LEVELS } from '../constants'
import { ConfirmModal } from '../components/ConfirmModal'

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getExerciseById, getExerciseStats, updateCustomExercise, deleteCustomExercise } = useAppStore()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    steps: '',
    tips: '',
  })

  const exercise = getExerciseById(id || '')
  const stats = exercise ? getExerciseStats(exercise.name) : null

  if (!exercise) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-muted mb-4">动作未找到</p>
          <button
            onClick={() => navigate('/exercises')}
            className="bg-neon text-dark-bg px-6 py-3 rounded-[32px] font-bold"
          >
            返回动作库
          </button>
        </div>
      </div>
    )
  }

  const muscleGroup = MUSCLE_GROUPS.find((g) => exercise.muscleGroups.includes(g.id))
  const difficulty = DIFFICULTY_LEVELS[exercise.difficulty - 1]

  const muscleGroupName = muscleGroup?.name || exercise.muscleGroups[0] || '其他'

  const handleStartEdit = () => {
    setEditData({
      name: exercise.name,
      description: exercise.description,
      steps: exercise.steps.join('\n'),
      tips: exercise.tips.join('\n'),
    })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!editData.name.trim()) return
    updateCustomExercise(exercise.id, {
      name: editData.name,
      description: editData.description || '暂无描述',
      steps: editData.steps ? editData.steps.split('\n').filter(s => s.trim()) : [],
      tips: editData.tips ? editData.tips.split('\n').filter(s => s.trim()) : [],
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteCustomExercise(exercise.id)
    navigate('/exercises')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Image Section - 55% height */}
      <div className="relative h-[55vh]">
        <img
          src={exercise.image || `https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop`}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />

        {/* Top Buttons */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-20">
          <button
            onClick={() => navigate('/exercises')}
            className="glass w-10 h-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            {exercise.isCustom && (
              <>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="glass w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
                <button
                  onClick={isEditing ? handleSaveEdit : handleStartEdit}
                  className="glass w-10 h-10 rounded-full flex items-center justify-center"
                >
                  {isEditing ? (
                    <CheckCircle className="w-5 h-5 text-neon" />
                  ) : (
                    <Pencil className="w-5 h-5 text-white" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 rounded-full bg-neon flex items-center justify-center shadow-fab hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-dark-bg ml-1" fill="currentColor" />
          </button>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-12 right-20">
          <div className="bg-dark-card/90 backdrop-blur-sm border border-dark-border rounded-2xl p-3">
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < exercise.difficulty ? 'text-neon fill-neon' : 'text-zinc-600'}`}
                />
              ))}
            </div>
            <p className="text-xs text-dark-muted">难度等级</p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="tag-pill text-white text-xs"
              style={{ background: muscleGroup?.color + '40', border: `1px solid ${muscleGroup?.color}` }}
            >
              {muscleGroupName}
            </span>
            <span className="tag-pill bg-dark-card/80 text-white text-xs border border-dark-border">
              {exercise.exerciseType === 'compound' ? '复合动作' : '孤立动作'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">{exercise.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 pb-8">
        {/* Data Tags */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-dark-card border border-dark-border rounded-[24px] p-4 text-center">
            <Dumbbell className="w-5 h-5 text-neon mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{stats?.personalRecord.maxWeight || 0}</p>
            <p className="text-xs text-dark-muted">最大重量</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-[24px] p-4 text-center">
            <Clock className="w-5 h-5 text-cyan-accent mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{stats?.totalSets || 0}</p>
            <p className="text-xs text-dark-muted">总组数</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-[24px] p-4 text-center">
            <CheckCircle className="w-5 h-5 text-purple-accent mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{stats?.totalVolume || 0}</p>
            <p className="text-xs text-dark-muted">总容量</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-3">动作描述</h3>
          <p className="text-dark-muted leading-relaxed">{exercise.description}</p>
        </div>

        {/* Steps */}
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">执行步骤</h3>
          <div className="space-y-4">
            {exercise.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center flex-shrink-0">
                  <span className="text-dark-bg font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-dark-muted pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-3">动作要点</h3>
          <div className="space-y-2">
            {exercise.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-neon flex-shrink-0 mt-0.5" />
                <p className="text-dark-muted">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-3">常见错误</h3>
          <div className="space-y-2">
            {exercise.commonMistakes.map((mistake, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-accent flex-shrink-0 mt-0.5" />
                <p className="text-dark-muted">{mistake}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => navigate('/workout')}
          className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold text-lg shadow-fab hover:shadow-fab-hover transition-all"
        >
          添加到训练
        </button>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-dark-card border border-dark-border rounded-[28px] p-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-4">编辑动作</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="动作名称"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="动作描述"
                rows={2}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors resize-none"
              />
              <textarea
                value={editData.steps}
                onChange={(e) => setEditData({ ...editData, steps: e.target.value })}
                placeholder="动作步骤（每行一条）"
                rows={3}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors resize-none"
              />
              <textarea
                value={editData.tips}
                onChange={(e) => setEditData({ ...editData, tips: e.target.value })}
                placeholder="训练技巧（每行一条）"
                rows={2}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-2xl bg-dark-bg text-white font-medium hover:bg-zinc-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 rounded-2xl bg-neon text-dark-bg font-bold hover:opacity-90 transition-opacity"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="删除动作"
        message={`确定要删除"${exercise.name}"吗？此操作无法撤销。`}
        confirmText="确认删除"
        danger
      />
    </div>
  )
}
