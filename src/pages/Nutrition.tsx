import { useState } from 'react'
import { Plus, X, Trash2, ChevronRight } from 'lucide-react'
import { useAppStore } from '../store'
import { getTodayString } from '../utils'
import { FOOD_DATABASE } from '../constants'
import { ConfirmModal } from '../components/ConfirmModal'
import type { FoodItem } from '../types'

export default function Nutrition() {
  const { profile, foodLogs, addFoodLog, deleteFoodLog, updateFoodLog } = useAppStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedFood, setSelectedFood] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [foodSearch, setFoodSearch] = useState('')
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null)

  const todayLogs = foodLogs.filter((log) => log.date === getTodayString())
  const targetCalories = profile?.targetCalories || 2400
  const todayCalories = todayLogs.reduce((sum, log) => sum + log.totalCalories, 0)
  const todayProtein = todayLogs.reduce((sum, log) => sum + log.totalProtein, 0)
  const todayCarbs = todayLogs.reduce((sum, log) => sum + log.totalCarbs, 0)
  const todayFat = todayLogs.reduce((sum, log) => sum + log.totalFat, 0)
  const calorieProgress = Math.min((todayCalories / targetCalories) * 100, 100)

  const handleAddFood = () => {
    const food = FOOD_DATABASE.find((f) => f.name === selectedFood)
    if (!food) return

    const ratio = quantity / 100
    const foodItem: FoodItem = {
      name: food.name,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      quantity,
    }

    const currentTodayLog = foodLogs.find((log) => log.date === getTodayString())
    if (currentTodayLog) {
      const updatedFoods = [...currentTodayLog.foods, foodItem]
      updateFoodLog(currentTodayLog.id, { foods: updatedFoods })
    } else {
      addFoodLog({
        date: getTodayString(),
        foods: [foodItem],
      })
    }

    setSelectedFood('')
    setQuantity(100)
    setFoodSearch('')
    setShowAddModal(false)
  }

  const handleDeleteFood = () => {
    if (deleteConfirmIndex === null) return
    const todayLogs = foodLogs.filter((log) => log.date === getTodayString())
    let remaining = deleteConfirmIndex
    for (const log of todayLogs) {
      if (remaining < log.foods.length) {
        const updatedFoods = log.foods.filter((_, i) => i !== remaining)
        updateFoodLog(log.id, { foods: updatedFoods })
        break
      }
      remaining -= log.foods.length
    }
    setDeleteConfirmIndex(null)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-3xl font-bold text-white">营养追踪</h1>
      </header>

      {/* Calorie Card */}
      <section className="px-6 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-[28px] p-6 text-center">
          <p className="text-5xl font-black text-white mb-2">{todayCalories}</p>
          <p className="text-dark-muted text-sm">/ {targetCalories} 千卡</p>
          <p className="text-neon text-sm mt-2 font-medium">还剩 {targetCalories - todayCalories} 千卡</p>

          <div className="mt-5 mb-2">
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon rounded-full transition-all duration-1000"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-accent">{todayProtein}g</p>
              <p className="text-xs text-dark-muted">蛋白质</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-neon">{todayCarbs}g</p>
              <p className="text-xs text-dark-muted">碳水</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-accent">{todayFat}g</p>
              <p className="text-xs text-dark-muted">脂肪</p>
            </div>
          </div>
        </div>
      </section>

      {/* Food List */}
      <section className="px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">今日食物</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-neon text-dark-bg px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-fab"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>

        <div className="space-y-3">
          {todayLogs.length > 0 ? (
            todayLogs.map((log, logIndex) => (
              log.foods.map((food, foodIndex) => (
                <div
                  key={`${log.id}-${foodIndex}`}
                  className="bg-dark-card border border-dark-border rounded-[24px] p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="icon-box bg-neon/10">
                      <span className="text-neon font-bold text-sm">{food.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{food.name}</p>
                      <p className="text-xs text-dark-muted">
                        {food.calories} 千卡 · P:{food.protein}g · C:{food.carbs}g · F:{food.fat}g
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const currentTodayLog = foodLogs.find((l) => l.date === getTodayString())
                      if (currentTodayLog) {
                        const globalIndex = todayLogs
                          .slice(0, logIndex)
                          .reduce((sum, l) => sum + l.foods.length, 0) + foodIndex
                        setDeleteConfirmIndex(globalIndex)
                      }
                    }}
                    className="text-dark-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-dark-muted">今天还没有记录食物</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full bg-dark-card rounded-t-[32px] p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">添加食物</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center"
              >
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-muted mb-2 block">选择食物</label>
                <input
                  type="text"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="搜索食物..."
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:border-neon focus:outline-none transition-colors mb-3"
                />
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {FOOD_DATABASE.filter((food) => 
                    food.name.toLowerCase().includes(foodSearch.toLowerCase())
                  ).map((food) => (
                    <button
                      key={food.name}
                      onClick={() => setSelectedFood(food.name)}
                      className={`p-3 rounded-2xl text-left transition-all ${
                        selectedFood === food.name
                          ? 'bg-neon text-dark-bg'
                          : 'bg-dark-bg border border-dark-border text-white hover:border-zinc-700'
                      }`}
                    >
                      <p className="font-medium text-sm">{food.name}</p>
                      <p className="text-xs opacity-80">{food.calories} 千卡/100g</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-dark-muted mb-2 block">分量 (g)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={handleAddFood}
                disabled={!selectedFood}
                className="w-full bg-neon text-dark-bg py-4 rounded-[32px] font-bold shadow-fab hover:shadow-fab-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirmIndex !== null}
        onClose={() => setDeleteConfirmIndex(null)}
        onConfirm={handleDeleteFood}
        title="删除食物"
        message={`确定要删除这条食物记录吗？`}
        confirmText="确认删除"
        danger
      />
    </div>
  )
}
