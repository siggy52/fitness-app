import { useState } from 'react'
import { User, Save, Check, Activity, Flame, Target } from 'lucide-react'
import { useAppStore } from '../store'
import { calculateBMR } from '../utils'
import { Profile as ProfileType } from '../types'

export default function Profile() {
  const { profile, setProfile, workoutLogs, foodLogs } = useAppStore()
  const [isEditing, setIsEditing] = useState(!profile)
  const [formData, setFormData] = useState<Omit<ProfileType, 'bmr'>>({
    height: profile?.height || 170,
    weight: profile?.weight || 70,
    age: profile?.age || 25,
    gender: profile?.gender || 'male',
  })

  const bmr = calculateBMR(formData)

  const handleSave = () => {
    setProfile({ ...formData, bmr })
    setIsEditing(false)
  }

  const totalWorkouts = workoutLogs.length
  const totalCaloriesLogged = foodLogs.reduce((sum, log) => sum + log.totalCalories, 0)

  if (isEditing && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">欢迎使用健身助手</h1>
            <p className="text-gray-600">让我们先了解一下你</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身高 (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="170"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">体重 (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">年龄</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormData({ ...formData, gender: 'male' })}
                  className={`py-3 rounded-xl border-2 transition-all ${
                    formData.gender === 'male'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  男
                </button>
                <button
                  onClick={() => setFormData({ ...formData, gender: 'female' })}
                  className={`py-3 rounded-xl border-2 transition-all ${
                    formData.gender === 'female'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  女
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90 mb-1">基础代谢率 (BMR)</div>
              <div className="text-3xl font-bold">{Math.round(bmr)} 千卡</div>
              <div className="text-sm opacity-80 mt-1">这是你每天休息时消耗的热量</div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              开始使用
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">我的资料</h1>
              <p className="text-gray-500">管理你的个人信息</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-all"
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isEditing ? '保存' : '编辑'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              保存更改
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">身高</span>
              <span className="font-medium text-gray-800">{profile?.height} cm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">体重</span>
              <span className="font-medium text-gray-800">{profile?.weight} kg</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">年龄</span>
              <span className="font-medium text-gray-800">{profile?.age} 岁</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">性别</span>
              <span className="font-medium text-gray-800">{profile?.gender === 'male' ? '男' : '女'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">BMR (基础代谢)</span>
              <span className="font-bold text-blue-600">{Math.round(profile?.bmr || 0)} 千卡</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
          <div className="text-sm text-gray-500">训练次数</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{totalCaloriesLogged}</div>
          <div className="text-sm text-gray-500">记录热量</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {profile ? Math.round(profile.bmr * 1.55) : 0}
          </div>
          <div className="text-sm text-gray-500">推荐摄入</div>
        </div>
      </div>
    </div>
  )
}

