import { FoodItem, WorkoutPlan } from './types'

export const PRESET_FOODS: FoodItem[] = [
  { name: '鸡胸肉(100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: '鸡蛋(1个)', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: '米饭(100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: '燕麦片(100g)', calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: '牛奶(200ml)', calories: 104, protein: 6, carbs: 10, fat: 4 },
  { name: '西兰花(100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: '牛肉(100g)', calories: 250, protein: 26, carbs: 0, fat: 15 },
  { name: '香蕉(1根)', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: '全麦面包(1片)', calories: 81, protein: 4, carbs: 18, fat: 1 },
  { name: '三文鱼(100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: '豆腐(100g)', calories: 81, protein: 8, carbs: 2, fat: 4 },
  { name: '苹果(1个)', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
]

export const PRESET_PLANS: Omit<WorkoutPlan, 'id'>[] = [
  {
    name: '增肌计划',
    description: '专注于肌肉增长的力量训练',
    trainingDays: [
      {
        day: '周一',
        exercises: [
          { name: '卧推', weight: 0, sets: 4, reps: 8, rpe: 8 },
          { name: '肩推', weight: 0, sets: 3, reps: 10, rpe: 7 },
          { name: '三头肌下压', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '侧平举', weight: 0, sets: 3, reps: 15, rpe: 6 },
        ],
      },
      {
        day: '周三',
        exercises: [
          { name: '引体向上', weight: 0, sets: 4, reps: 8, rpe: 8 },
          { name: '哑铃划船', weight: 0, sets: 4, reps: 10, rpe: 8 },
          { name: '二头弯举', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '面拉', weight: 0, sets: 3, reps: 15, rpe: 6 },
        ],
      },
      {
        day: '周五',
        exercises: [
          { name: '深蹲', weight: 0, sets: 4, reps: 8, rpe: 8 },
          { name: '硬拉', weight: 0, sets: 3, reps: 6, rpe: 9 },
          { name: '腿举', weight: 0, sets: 4, reps: 10, rpe: 7 },
          { name: '小腿提踵', weight: 0, sets: 4, reps: 15, rpe: 6 },
        ],
      },
    ],
  },
  {
    name: '减脂计划',
    description: '高强度间歇训练，高效燃脂',
    trainingDays: [
      {
        day: '周二',
        exercises: [
          { name: '波比跳', weight: 0, sets: 4, reps: 15, rpe: 9 },
          { name: '深蹲跳', weight: 0, sets: 4, reps: 12, rpe: 8 },
          { name: '俯卧撑', weight: 0, sets: 4, reps: 15, rpe: 7 },
          { name: '登山者', weight: 0, sets: 4, reps: 20, rpe: 8 },
        ],
      },
      {
        day: '周四',
        exercises: [
          { name: '开合跳', weight: 0, sets: 4, reps: 20, rpe: 7 },
          { name: '箭步蹲', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '平板支撑', weight: 0, sets: 3, reps: 60, rpe: 7 },
          { name: '高抬腿', weight: 0, sets: 4, reps: 20, rpe: 8 },
        ],
      },
      {
        day: '周六',
        exercises: [
          { name: '跳绳', weight: 0, sets: 5, reps: 60, rpe: 8 },
          { name: '战绳', weight: 0, sets: 4, reps: 30, rpe: 9 },
          { name: 'Burpee', weight: 0, sets: 4, reps: 12, rpe: 9 },
          { name: '俄罗斯转体', weight: 0, sets: 4, reps: 20, rpe: 6 },
        ],
      },
    ],
  },
  {
    name: '塑形计划',
    description: '均衡发展，提升体态和力量',
    trainingDays: [
      {
        day: '周一',
        exercises: [
          { name: '哑铃弯举', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '三头肌下压', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '侧平举', weight: 0, sets: 4, reps: 15, rpe: 6 },
          { name: '卷腹', weight: 0, sets: 4, reps: 20, rpe: 6 },
        ],
      },
      {
        day: '周二',
        exercises: [
          { name: '箭步蹲', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '臀桥', weight: 0, sets: 4, reps: 12, rpe: 7 },
          { name: '深蹲', weight: 0, sets: 3, reps: 15, rpe: 7 },
          { name: '平板支撑', weight: 0, sets: 3, reps: 45, rpe: 6 },
        ],
      },
      {
        day: '周四',
        exercises: [
          { name: '俯卧撑', weight: 0, sets: 4, reps: 12, rpe: 7 },
          { name: '哑铃划船', weight: 0, sets: 3, reps: 12, rpe: 7 },
          { name: '面拉', weight: 0, sets: 3, reps: 15, rpe: 6 },
          { name: '反向飞鸟', weight: 0, sets: 3, reps: 15, rpe: 6 },
        ],
      },
      {
        day: '周五',
        exercises: [
          { name: '硬拉', weight: 0, sets: 3, reps: 10, rpe: 8 },
          { name: '保加利亚分腿蹲', weight: 0, sets: 3, reps: 10, rpe: 7 },
          { name: '提踵', weight: 0, sets: 4, reps: 15, rpe: 6 },
          { name: '俄罗斯转体', weight: 0, sets: 4, reps: 15, rpe: 6 },
        ],
      },
    ],
  },
]
