import { useState } from 'react'
import { Settings, Bell, Download, Upload, ChevronRight, LogOut, User, Ruler, Weight, Calendar, Target, Trash2 } from 'lucide-react'
import { useAppStore } from '../store'
import type { Profile } from '../types'
import { ConfirmModal } from '../components/ConfirmModal'

export default function ProfilePage() {
  const { profile, setProfile, updateProfile, workoutLogs, foodLogs, clearAllData, addWorkoutLog, addFoodLog } = useAppStore()
  const [isEditing, setIsEditing] = useState(!profile)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: profile?.name || '',
    height: profile?.height || 170,
    weight: profile?.weight || 70,
    age: profile?.age || 25,
    gender: profile?.gender || 'male',
    targetCalories: profile?.targetCalories || 2400,
    ...profile,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) return

    const bmr = formData.gender === 'male'
      ? 10 * (formData.weight || 70) + 6.25 * (formData.height || 170) - 5 * (formData.age || 25) + 5
      : 10 * (formData.weight || 70) + 6.25 * (formData.height || 170) - 5 * (formData.age || 25) - 161

    const newProfile: Profile = {
      name: formData.name || '健身达人',
      height: formData.height || 170,
      weight: formData.weight || 70,
      age: formData.age || 25,
      gender: formData.gender || 'male',
      targetCalories: formData.targetCalories || 2400,
      bmr: Math.round(bmr),
    }

    if (profile) {
      updateProfile(newProfile)
    } else {
      setProfile(newProfile)
    }
    setIsEditing(false)
  }

  const handleExport = () => {
    const data = {
      profile,
      workoutLogs,
      foodLogs,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          if (data.profile) {
            updateProfile(data.profile)
          }
          if (data.workoutLogs && Array.isArray(data.workoutLogs)) {
            data.workoutLogs.forEach((log: any) => {
              if (log.date && log.exercises && Array.isArray(log.exercises)) {
                addWorkoutLog(log)
              }
            })
          }
          if (data.foodLogs && Array.isArray(data.foodLogs)) {
            data.foodLogs.forEach((log: any) => {
              if (log.date && log.foods && Array.isArray(log.foods)) {
                addFoodLog(log)
              }
            })
          }
          alert('数据导入成功！')
        } catch (error) {
          alert('导入失败，请确保文件格式正确')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon to-purple-accent flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-dark-bg" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">欢迎使用</h1>
            <p className="text-dark-muted">填写你的基本信息，开始健身之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-[32px] p-6 space-y-4">
            <div>
              <label className="text-sm text-dark-muted mb-2 block">昵称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入你的昵称"
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-muted mb-2 block">身高 (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-dark-muted mb-2 block">体重 (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-muted mb-2 block">年龄</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-dark-muted mb-2 block">性别</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-dark-muted mb-2 block">目标热量 (千卡)</label>
              <input
                type="number"
                value={formData.targetCalories}
                onChange={(e) => setFormData({ ...formData, targetCalories: Number(e.target.value) })}
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold text-lg shadow-fab hover:shadow-fab-hover transition-all"
            >
              开始使用
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header Background */}
      <div className="h-48 bg-gradient-to-b from-zinc-900 to-dark-bg" />

      {/* Content */}
      <div className="px-6 -mt-20 pb-8">
        {/* User Card */}
        <div className="bg-dark-card border border-dark-border rounded-[32px] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon to-purple-accent p-1">
                <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{profile?.name?.charAt(0) || 'U'}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{profile?.name || '健身达人'}</h2>
                <p className="text-dark-muted text-sm">{profile?.age}岁 · {profile?.gender === 'male' ? '男' : '女'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="glass w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{workoutLogs.length}</p>
              <p className="text-xs text-dark-muted">训练次数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{foodLogs.reduce((sum, log) => sum + log.totalCalories, 0)}</p>
              <p className="text-xs text-dark-muted">记录热量</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{profile?.targetCalories || 2400}</p>
              <p className="text-xs text-dark-muted">推荐摄入</p>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-dark-card border border-dark-border rounded-[32px] p-2">
          <MenuItem
            icon={<Bell className="w-5 h-5 text-neon" />}
            title="提醒设置"
            subtitle="训练提醒、休息提醒"
            onClick={() => alert('提醒设置功能开发中')}
          />
          <MenuItem
            icon={<Download className="w-5 h-5 text-cyan-accent" />}
            title="导出数据"
            subtitle="导出所有训练记录"
            onClick={handleExport}
          />
          <MenuItem
            icon={<Upload className="w-5 h-5 text-green-accent" />}
            title="导入数据"
            subtitle="从文件恢复训练记录"
            onClick={handleImport}
          />
          <MenuItem
            icon={<Target className="w-5 h-5 text-purple-accent" />}
            title="目标设置"
            subtitle="修改热量目标"
            onClick={() => setIsEditing(true)}
          />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl text-red-400 hover:bg-red-500/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">退出登录</p>
              <p className="text-xs text-red-400/60">清除所有数据</p>
            </div>
          </button>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={clearAllData}
        title="退出登录"
        message="确定要退出登录吗？此操作将清除所有本地数据，包括训练记录、饮食记录等。建议先导出数据备份。"
        confirmText="确认退出"
        danger
      />
    </div>
  )
}

function MenuItem({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-dark-bg rounded-[24px] transition-colors"
    >
      <div className="icon-box bg-dark-bg">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-white font-medium">{title}</p>
        <p className="text-sm text-dark-muted">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-dark-muted" />
    </button>
  )
}
