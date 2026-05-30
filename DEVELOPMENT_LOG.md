# 健身计划应用 - 开发日志

## 📅 日期：2026-05-28

### 🔧 待修复问题

| 优先级 | 问题 | 状态 | 负责人 |
|--------|------|------|--------|
| P1 | Toast组件导入不一致 | 待修复 | - |
| P1 | 悬浮计时器遮挡问题 | 待修复 | - |
| P2 | 训练完成组状态管理 | 待修复 | - |
| P2 | 数据导出导入安全性 | 待修复 | - |
| P2 | 数字输入边界验证 | 待修复 | - |
| P2 | 计时器全局状态共享 | 待修复 | - |
| P3 | 训练计划编辑体验 | 待修复 | - |
| P3 | 空状态处理 | 待修复 | - |

### ✅ 已修复问题

| 问题 | 修复位置 | 修复时间 |
|------|----------|----------|
| 组件导出问题 | `src/components/OnboardingGuide.tsx`, `src/components/ConfirmModal.tsx` | 已修复 |
| 动作ID重复 | `src/data/exercises.ts` | 已修复 |
| 周几日期显示 | `src/pages/Home.tsx` | 已修复 |
| 完成组按钮无反应 | `src/pages/Workout.tsx` | 已修复 |
| 悬浮球可拖拽 | `src/components/FloatingTimer.tsx` | 已修复 |
| 添加多个动作 | `src/pages/Workout.tsx` | 已修复 |
| **训练记录保存问题** | `src/pages/Workout.tsx` | **2026-05-28** |
| **饮食记录删除确认** | `src/pages/Nutrition.tsx` | **2026-05-28** |
| **同天多条记录被覆盖** | `src/pages/Home.tsx`, `src/pages/History.tsx`, `src/pages/Nutrition.tsx`, `src/pages/Dashboard.tsx` | **2026-05-28** |
| **疲劳状态手动拖动不合理** | `src/pages/Home.tsx`, `src/utils/index.ts` | **2026-05-28** |
| **主观疲劳输入 + 理论最大重量算法** | `src/types.ts`, `src/utils/index.ts`, `src/store/index.ts`, `src/pages/Home.tsx` | **2026-05-28** |

---

## 📝 修复记录

### 修复1：训练记录保存问题

**问题描述**: 保存训练后无法在历史记录中看到记录

**根因分析**: `handleSaveWorkout`函数中存在不必要的console.log，其中引用了旧的`workoutLogs`状态，可能导致状态更新时机问题

**修复方案**: 移除console.log中对旧状态的引用，简化保存逻辑，确保addWorkoutLog正确执行

**修改文件**: `src/pages/Workout.tsx`

**代码变更**:
```typescript
// 修复前
const handleSaveWorkout = () => {
  if (exercises.length === 0) return
  console.log('保存训练:', { date: getTodayString(), exercises })
  addWorkoutLog({
    date: getTodayString(),
    exercises,
  })
  resetTimer()
  setExercises([])
  console.log('训练已保存，workoutLogs:', workoutLogs)
  addToast('success', '训练记录已保存！')
}

// 修复后
const handleSaveWorkout = () => {
  if (exercises.length === 0) return
  addWorkoutLog({
    date: getTodayString(),
    exercises,
  })
  resetTimer()
  setExercises([])
  addToast('success', '训练记录已保存！')
}
```

### 修复2：饮食记录删除确认

**问题描述**: 删除食物时没有二次确认，容易误删

**根因分析**: 删除按钮直接调用删除函数，没有确认机制

**修复方案**: 添加确认模态框，删除前要求用户确认

**修改文件**: `src/pages/Nutrition.tsx`

**代码变更**:
```typescript
// 添加状态管理
const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null)

// 删除按钮改为打开确认框
<button onClick={() => setDeleteConfirmIndex(index)}>
  <Trash2 className="w-5 h-5" />
</button>

// 添加确认模态框
<ConfirmModal
  isOpen={deleteConfirmIndex !== null}
  onClose={() => setDeleteConfirmIndex(null)}
  onConfirm={handleDeleteFood}
  title="删除食物"
  message="确定要删除这条食物记录吗？"
  confirmText="确认删除"
  danger
/>
```

### 修复3：同天多条记录被覆盖问题

**问题描述**: 同一天内保存多条训练/饮食记录时，后保存的记录不会显示，只有删除前面的记录才能看到后面的

**根因分析**: 代码中多处使用 `数组.find()` 方法获取某天的记录，但 `find()` 只返回第一个匹配项。当同一天有多条记录时（例如上午和下午各训练一次），只有第一条被展示，后面的记录无法在UI中看到，造成"被覆盖"的错觉。

**影响范围**:
- `Home.tsx`: 今日训练量、热量只显示第一条记录的数据
- `History.tsx`: 某天展开后只显示第一条训练和饮食记录
- `Nutrition.tsx`: 今日食物列表只显示第一条饮食记录中的食物
- `Dashboard.tsx`: 每周图表只取第一条记录的数据，今日热量只显示第一条

**修复方案**: 将所有使用 `.find()` 按日期筛选的地方改为 `.filter()`，并聚合所有匹配记录的数据

**修改文件**:
- `src/pages/Home.tsx`
- `src/pages/History.tsx`
- `src/pages/Nutrition.tsx`
- `src/pages/Dashboard.tsx`

**核心变更**:
```typescript
// 修复前（所有页面）
const todayLog = workoutLogs.find((log) => log.date === selectedDate)
const todayVolume = todayLog?.totalVolume || 0

// 修复后（Home.tsx）
const todayLogs = workoutLogs.filter((log) => log.date === selectedDate)
const todayVolume = todayLogs.reduce((sum, log) => sum + log.totalVolume, 0)
```

### 修复4：疲劳状态手动拖动不合理

**问题描述**: 身体状态的疲劳值滑块可以手动拖动/点击设置数值，不符合使用逻辑

**根因分析**: 疲劳状态应根据训练数据自动计算（连续训练天数、今日是否训练等），而不是让用户手动滑动设置

**修复方案**: 
1. 新增 `calculateFatigueLevel` 函数，根据连续训练天数和今日训练状态自动计算疲劳值
2. 移除滑块的手动交互（`onClick`、`cursor-grab`）
3. 显示连续训练天数信息，帮助用户理解疲劳值来源

**修改文件**:
- `src/utils/index.ts`
- `src/pages/Home.tsx`

**核心变更**:
```typescript
// 新增自动疲劳计算函数 (src/utils/index.ts)
export const calculateFatigueLevel = (workoutLogs: WorkoutLog[]): number => {
  const consecutive = getConsecutiveWorkoutDays(workoutLogs)
  const today = getTodayString()
  const trainedToday = workoutLogs.some((log) => log.date === today)
  let fatigue = consecutive * 12
  if (trainedToday) fatigue += 10
  if (consecutive >= 5) fatigue += 10
  return Math.min(100, Math.max(0, fatigue))
}

// Home.tsx - 移除手动交互
// 修复前: 用户可点击拖动设置疲劳值
// 修复后: 疲劳值根据训练数据自动计算，仅作展示
```

### 修复5：主观疲劳输入 + 理论最大重量算法

**问题描述**: 疲劳值仅简单根据连续训练天数计算，未考虑用户主观感受和真实训练表现

**设计方案**:

#### 1. 理论最大重量 (1RM) 
使用 **Epley 公式**：`1RM = weight × (1 + reps / 30)`
- 追踪每个动作的历史 1RM 作为理论极限
- 对比当前训练重量与理论最大值的比率

#### 2. 疲劳算法（四维综合评估）

| 维度 | 权重 | 计算方式 |
|------|------|----------|
| **主观感受** | 40% | 用户每日手动输入 (10%-90%) |
| **表现疲劳** | 30% | 当前重量 / 历史1RM 比率，比率越低越疲劳 |
| **频率疲劳** | 20% | 连续训练天数 × 12，今日训练 +10 |
| **容量疲劳** | 10% | 近7天总训练量 / 基准容量 × 50 |

最终 `综合疲劳 = 主观×40% + 数据计算×60%`

#### 3. 用户体验
- 身体状态卡片显示"今天感觉？"按钮，点击弹出5级评分
- 综合疲劳值显示在主滑块上
- 下方展示**主观感受**和**数据计算**两个子指标对比
- 显示连续训练天数、今日训练量等细节

**修改文件**:
- `src/types.ts` - FatigueRecord 增加 `subjectiveLevel`、`calculatedLevel` 字段
- `src/utils/index.ts` - 新增 `calculateEstimated1RM`、`getTheoreticalMax`、`calculateCombinedFatigue`
- `src/store/index.ts` - 更新 `updateFatigueRecord` 自动计算综合值，添加旧数据迁移
- `src/pages/Home.tsx` - 新增主观疲劳输入弹窗，展示综合疲劳拆解