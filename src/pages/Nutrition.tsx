import { useState } from 'react'
import { Apple, Plus, Utensils, Trash2, Search } from 'lucide-react'
import { useAppStore } from '../store'
import { PRESET_FOODS } from '../constants'
import { FoodItem } from '../types'
import { getTodayDateString } from '../utils'

export default function Nutrition() {
  const { profile, foodLogs, addFoodLog, updateFoodLog } = useAppStore()
  const [showAddFood, setShowAddFood] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customFood, setCustomFood] = useState<FoodItem>(
    { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
  const [showCustomFood, setShowCustomFood] = useState(false)

  const today = getTodayDateString()
  const todayLog = foodLogs.find(log => log.date === today)

  const targetCalories = profile ? Math.round(profile.bmr * 1.55) : 2000
  const remainingCalories = targetCalories - (todayLog?.totalCalories || 0)

  const filteredPresets = PRESET_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddPresetFood = (food: FoodItem) => {
    if (todayLog) {
      updateFoodLog(todayLog.id, {
        foods: [...todayLog.foods, food],
      })
    } else {
      addFoodLog({
        date: today,
        foods: [food],
      })
    }
    setShowAddFood(false)
    setSearchQuery('')
  }

  const handleAddCustomFood = () => {
    if (!customFood.name.trim() || customFood.calories <= 0) return
    handleAddPresetFood(customFood)
    setCustomFood({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
    setShowCustomFood(false)
  }

  const handleRemoveFood = (index: number) => {
    if (!todayLog) return
    const updatedFoods = todayLog.foods.filter((_, i) => i !== index)
    updateFoodLog(todayLog.id, { foods: updatedFoods })
  }

  const calorieProgress = Math.min((todayLog?.totalCalories || 0) / targetCalories * 100, 100)
  const isOverCalories = remainingCalories < 0

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">营养追踪</h1>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="text-center mb-6">
          <div className={`text-5xl font-bold mb-2 ${isOverCalories ? 'text-red-500' : 'text-blue-600'}`}>
            {todayLog?.totalCalories || 0}
          </div>
          <div className="text-gray-500">/ {targetCalories} 千卡</div>
          <div className={`text-sm mt-2 ${isOverCalories ? 'text-red-500' : 'text-green-600'}`}>
            {isOverCalories ? `超出 ${Math.abs(remainingCalories)} 千卡` : `还剩 ${remainingCalories} 千卡`}
          </div>
        </div>

        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverCalories ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${calorieProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-500">{todayLog?.totalProtein || 0}g</div>
            <div className="text-sm text-gray-500">蛋白质</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-500">{todayLog?.totalCarbs || 0}g</div>
            <div className="text-sm text-gray-500">碳水</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-500">{todayLog?.totalFat || 0}g</div>
            <div className="text-sm text-gray-500">脂肪</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">今日食物</h2>
        <button
          onClick={() => setShowAddFood(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          添加食物
        </button>
      </div>

      <div className="space-y-3">
        {todayLog?.foods.map((food, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Apple className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{food.name}</div>
                <div className="text-sm text-gray-500">
                  {food.calories} 千卡 · P:{food.protein}g · C:{food.carbs}g · F:{food.fat}g
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveFood(index)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {(!todayLog || todayLog.foods.length === 0) && (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">还没有记录食物</h3>
            <p className="text-gray-400">点击上方按钮添加今天的食物</p>
          </div>
        )}
      </div>

      {showAddFood && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">添加食物</h2>
                <button
                  onClick={() => {
                    setShowAddFood(false)
                    setShowCustomFood(false)
                    setSearchQuery('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索食物..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!showCustomFood ? (
                <div className="space-y-3">
                  {filteredPresets.map((food, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddPresetFood(food)}
                      className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-800">{food.name}</div>
                        <div className="text-sm text-gray-500">
                          {food.calories} 千卡
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">食物名称</label>
                    <input
                      type="text"
                      value={customFood.name}
                      onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      placeholder="例如：鸡胸肉"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">热量 (千卡)</label>
                      <input
                        type="number"
                        value={customFood.calories}
                        onChange={(e) => setCustomFood({ ...customFood, calories: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">蛋白质 (g)</label>
                      <input
                        type="number"
                        value={customFood.protein}
                        onChange={(e) => setCustomFood({ ...customFood, protein: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">碳水 (g)</label>
                      <input
                        type="number"
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood({ ...customFood, carbs: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">脂肪 (g)</label>
                      <input
                        type="number"
                        value={customFood.fat}
                        onChange={(e) => setCustomFood({ ...customFood, fat: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddCustomFood}
                    disabled={!customFood.name.trim() || customFood.calories <= 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    添加食物
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setShowCustomFood(!showCustomFood)}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                {showCustomFood ? '选择预设食物' : '添加自定义食物'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
