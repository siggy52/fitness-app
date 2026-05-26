import { ExerciseDefinition } from '../types'

export const PRESET_EXERCISES: ExerciseDefinition[] = [
  // 胸部 (8个)
  {
    id: 'preset-chest-001',
    name: '杠铃卧推',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    category: 'free-weight',
    difficulty: 3,
    description: '仰卧在卧推凳上，双手握住杠铃，将其从架子上推起至手臂伸直，然后缓慢下放至胸部，再推起。',
    steps: [
      '仰卧在卧推凳上，双脚平放地面',
      '双手略宽于肩握住杠铃',
      '将杠铃从架子上推起，手臂伸直',
      '缓慢下放杠铃至胸部中间位置',
      '推起杠铃回到起始位置'
    ],
    tips: [
      '保持肩胛骨后缩下沉，胸部挺起',
      '手腕保持中立位，不要过度翻转',
      '下放时吸气，推起时呼气'
    ],
    commonMistakes: [
      '杠铃下放位置过高或过低',
      '臀部离开凳面',
      '手腕过度后翻导致受伤'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-chest-002',
    name: '哑铃卧推',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    category: 'free-weight',
    difficulty: 3,
    description: '手持哑铃仰卧在凳上，将哑铃推起至手臂伸直，然后缓慢下放至胸部两侧。',
    steps: [
      '手持哑铃坐在凳边，将哑铃置于大腿上',
      '顺势躺下，将哑铃推至胸部上方',
      '手臂伸直，哑铃相对',
      '缓慢下放哑铃至胸部两侧',
      '推起哑铃回到起始位置'
    ],
    tips: [
      '下放时感受胸部拉伸',
      '推起时哑铃不要碰撞',
      '保持核心收紧，腰部不要拱起'
    ],
    commonMistakes: [
      '哑铃下放过低导致肩部过度拉伸',
      '推起时耸肩',
      '腰部过度拱起'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-chest-003',
    name: '上斜哑铃卧推',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    category: 'free-weight',
    difficulty: 3,
    description: '将凳子调整至30-45度上斜角度，进行哑铃卧推，重点刺激上胸部。',
    steps: [
      '将卧推凳调整至上斜30-45度',
      '手持哑铃仰卧在凳上',
      '将哑铃推至胸部上方，手臂伸直',
      '缓慢下放至胸部两侧',
      '推起回到起始位置'
    ],
    tips: [
      '角度不要超过45度，否则肩部受力过大',
      '重点感受上胸部的收缩',
      '保持手腕中立位'
    ],
    commonMistakes: [
      '凳子角度过高，变成肩推',
      '哑铃轨迹过于垂直',
      '没有控制下放速度'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-chest-004',
    name: '哑铃飞鸟',
    muscleGroups: ['chest'],
    category: 'free-weight',
    difficulty: 2,
    description: '手持哑铃仰卧，手臂微屈，像拥抱一样将哑铃从两侧向中间合拢。',
    steps: [
      '手持哑铃仰卧在凳上，手臂伸直',
      '手肘微屈，掌心相对',
      '缓慢向两侧打开手臂',
      '感受胸部拉伸',
      '用胸部力量将哑铃合拢'
    ],
    tips: [
      '手肘保持微屈，不要完全伸直',
      '动作幅度要大，感受拉伸',
      '合拢时挤压胸部'
    ],
    commonMistakes: [
      '手肘完全伸直，给关节压力过大',
      '使用过大重量导致动作变形',
      '耸肩借力'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-chest-005',
    name: '俯卧撑',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    category: 'bodyweight',
    difficulty: 2,
    description: '双手撑地，身体呈直线，屈肘下放身体至接近地面，再推起。',
    steps: [
      '双手撑地，略宽于肩',
      '身体从头到脚呈一条直线',
      '屈肘下放身体至胸部接近地面',
      '推起身体回到起始位置'
    ],
    tips: [
      '核心收紧，不要塌腰或撅臀',
      '手肘与身体呈约45度角',
      '全程控制动作速度'
    ],
    commonMistakes: [
      '塌腰或撅臀',
      '只做半程动作',
      '手肘过度外展'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-chest-006',
    name: '绳索夹胸',
    muscleGroups: ['chest'],
    category: 'machine',
    difficulty: 2,
    description: '站在龙门架中间，双手握住绳索把手，从两侧向中间合拢。',
    steps: [
      '站在龙门架中间，前后脚站立',
      '双手握住绳索把手，手肘微屈',
      '从两侧向前方合拢双手',
      '在胸前交叉或相碰',
      '缓慢回到起始位置'
    ],
    tips: [
      '手肘保持固定角度',
      '合拢时挤压胸部',
      '控制回放速度'
    ],
    commonMistakes: [
      '手肘角度变化过大',
      '身体前后晃动借力',
      '没有充分拉伸胸部'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'cable' }
  },
  {
    id: 'preset-chest-007',
    name: '下斜杠铃卧推',
    muscleGroups: ['chest', 'triceps'],
    category: 'free-weight',
    difficulty: 3,
    description: '将凳子调整至下斜角度，重点刺激下胸部。',
    steps: [
      '将卧推凳调整至下斜角度',
      '仰卧在凳上，双脚固定',
      '双手握住杠铃，推起至手臂伸直',
      '缓慢下放至胸部下方',
      '推起回到起始位置'
    ],
    tips: [
      '确保双脚固定，防止滑动',
      '下放位置在胸部下方',
      '控制动作节奏'
    ],
    commonMistakes: [
      '头部位置不当导致充血',
      '下放位置过高',
      '动作过快失去控制'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-chest-008',
    name: '器械夹胸',
    muscleGroups: ['chest'],
    category: 'machine',
    difficulty: 1,
    description: '坐在器械上，双手握住把手，将双臂从两侧向中间合拢。',
    steps: [
      '坐在器械座位上，调整高度',
      '双手握住把手',
      '将双臂从两侧向中间合拢',
      '挤压胸部',
      '缓慢回到起始位置'
    ],
    tips: [
      '调整座椅使把手与胸部平齐',
      '合拢时充分挤压胸部',
      '不要完全放松重量'
    ],
    commonMistakes: [
      '座椅高度不当',
      '借力耸肩',
      '动作幅度不足'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },

  // 背部 (8个)
  {
    id: 'preset-back-001',
    name: '引体向上',
    muscleGroups: ['back', 'biceps'],
    category: 'bodyweight',
    difficulty: 4,
    description: '双手握住单杠，利用背部力量将身体拉起至下巴过杠。',
    steps: [
      '双手握住单杠，略宽于肩',
      '身体自然悬垂',
      '用背部力量将身体拉起',
      '下巴超过单杠',
      '缓慢下放至手臂伸直'
    ],
    tips: [
      '想象用肘部向下后方拉',
      '核心收紧，身体不要晃动',
      '全程控制，不要借助惯性'
    ],
    commonMistakes: [
      '借助身体摆动借力',
      '只做半程动作',
      '耸肩导致斜方肌代偿'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-back-002',
    name: '杠铃划船',
    muscleGroups: ['back', 'biceps'],
    category: 'free-weight',
    difficulty: 3,
    description: '俯身握住杠铃，将杠铃拉向腹部，感受背部收缩。',
    steps: [
      '双脚与肩同宽，俯身约45度',
      '双手正握杠铃，略宽于肩',
      '背部挺直，核心收紧',
      '将杠铃拉向腹部',
      '缓慢下放至手臂伸直'
    ],
    tips: [
      '保持背部平直，不要弓背',
      '拉向腹部而非胸部',
      '用背部发力，不是手臂'
    ],
    commonMistakes: [
      '弓背导致腰部受伤',
      '借助腿部发力',
      '耸肩借力'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-back-003',
    name: '哑铃单臂划船',
    muscleGroups: ['back', 'biceps'],
    category: 'free-weight',
    difficulty: 2,
    description: '单手持哑铃，另一只手支撑在凳上，将哑铃拉向髋部。',
    steps: [
      '一只手和膝盖支撑在凳上',
      '另一只手持哑铃，手臂伸直',
      '将哑铃拉向髋部',
      '感受背部收缩',
      '缓慢下放至手臂伸直'
    ],
    tips: [
      '保持背部平直',
      '拉向髋部而非胸部',
      '身体不要旋转'
    ],
    commonMistakes: [
      '身体旋转借力',
      '耸肩',
      '动作过快失去控制'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-back-004',
    name: '高位下拉',
    muscleGroups: ['back', 'biceps'],
    category: 'machine',
    difficulty: 2,
    description: '坐在器械上，双手握住横杆，将横杆拉至胸部上方。',
    steps: [
      '坐在器械座位上，固定大腿',
      '双手握住横杆，略宽于肩',
      '将横杆拉至胸部上方',
      '感受背部收缩',
      '缓慢放回至手臂伸直'
    ],
    tips: [
      '想象用肘部向下拉',
      '不要过度后仰',
      '控制回放速度'
    ],
    commonMistakes: [
      '过度后仰借力',
      '用手臂发力而非背部',
      '耸肩'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },
  {
    id: 'preset-back-005',
    name: '硬拉',
    muscleGroups: ['back', 'legs', 'glutes'],
    category: 'free-weight',
    difficulty: 4,
    description: '双脚与杠铃站立，屈髋屈膝俯身握住杠铃，伸髋伸膝将杠铃拉起。',
    steps: [
      '双脚与髋同宽，杠铃贴近小腿',
      '屈髋屈膝俯身，双手握住杠铃',
      '背部挺直，核心收紧',
      '伸髋伸膝将杠铃拉起',
      '站直后缓慢下放'
    ],
    tips: [
      '杠铃始终贴近身体',
      '背部保持中立位',
      '用腿部和臀部发力'
    ],
    commonMistakes: [
      '弓背导致腰部受伤',
      '杠铃远离身体',
      '伸膝过早导致臀部过高'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-back-006',
    name: '直臂下压',
    muscleGroups: ['back'],
    category: 'machine',
    difficulty: 2,
    description: '站在高位滑轮前，双手握住直杆，手臂伸直将杆拉向大腿。',
    steps: [
      '站在高位滑轮前，略微俯身',
      '双手握住直杆，手臂伸直',
      '保持手臂伸直，将杆拉向大腿',
      '感受背部收缩',
      '缓慢回到起始位置'
    ],
    tips: [
      '手臂保持微屈，不要锁死',
      '用背部发力带动手臂',
      '身体保持稳定'
    ],
    commonMistakes: [
      '手肘弯曲借力',
      '身体前后晃动',
      '耸肩'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'cable' }
  },
  {
    id: 'preset-back-007',
    name: '坐姿划船',
    muscleGroups: ['back', 'biceps'],
    category: 'machine',
    difficulty: 2,
    description: '坐在器械上，双手握住把手，将把手拉向腹部。',
    steps: [
      '坐在器械上，脚踩踏板',
      '双手握住把手，手臂伸直',
      '背部挺直，核心收紧',
      '将把手拉向腹部',
      '缓慢放回至手臂伸直'
    ],
    tips: [
      '不要过度后仰',
      '拉向腹部而非胸部',
      '感受背部收缩'
    ],
    commonMistakes: [
      '过度后仰借力',
      '耸肩',
      '用手臂发力'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },
  {
    id: 'preset-back-008',
    name: '超人式',
    muscleGroups: ['lower-back', 'glutes'],
    category: 'bodyweight',
    difficulty: 1,
    description: '俯卧在地上，同时抬起双手和双腿，感受下背部收缩。',
    steps: [
      '俯卧在地上，双手向前伸直',
      '同时抬起双手和双腿',
      '在最高点停留1-2秒',
      '缓慢放回地面'
    ],
    tips: [
      '不要过度抬起导致腰部不适',
      '感受下背部和臀部发力',
      '动作缓慢控制'
    ],
    commonMistakes: [
      '抬起过高导致腰部过度伸展',
      '动作过快',
      '没有控制下放'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'static',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },

  // 腿部 (10个)
  {
    id: 'preset-legs-001',
    name: '深蹲',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    category: 'free-weight',
    difficulty: 3,
    description: '双脚与肩同宽站立，屈髋屈膝下蹲至大腿与地面平行，再站起。',
    steps: [
      '双脚与肩同宽站立',
      '屈髋屈膝下蹲',
      '保持背部挺直，核心收紧',
      '下蹲至大腿与地面平行',
      '伸膝伸髋站起'
    ],
    tips: [
      '膝盖与脚尖方向一致',
      '重心在脚中部',
      '下蹲时吸气，站起时呼气'
    ],
    commonMistakes: [
      '膝盖内扣',
      '脚跟离地',
      '背部弓起'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-legs-002',
    name: '前蹲',
    muscleGroups: ['quadriceps', 'glutes'],
    category: 'free-weight',
    difficulty: 4,
    description: '杠铃置于锁骨前侧，双手交叉或高翻握法支撑，进行深蹲。',
    steps: [
      '将杠铃置于锁骨前侧',
      '双手交叉或高翻握法支撑',
      '肘部抬高，上臂与地面平行',
      '屈髋屈膝下蹲',
      '站起回到起始位置'
    ],
    tips: [
      '保持肘部抬高',
      '躯干保持直立',
      '核心收紧保护脊柱'
    ],
    commonMistakes: [
      '肘部下掉导致杠铃滑落',
      '躯干过度前倾',
      '手腕过度后伸'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-legs-003',
    name: '腿举',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    category: 'machine',
    difficulty: 2,
    description: '坐在腿举机上，双脚踩在踏板上，将重量推起再缓慢下放。',
    steps: [
      '坐在腿举机上，背部贴紧靠垫',
      '双脚与肩同宽踩在踏板上',
      '解开安全锁',
      '屈髋屈膝下放重量',
      '伸膝伸髋推起重量'
    ],
    tips: [
      '不要锁死膝盖',
      '下放时臀部不要离开靠垫',
      '控制动作速度'
    ],
    commonMistakes: [
      '膝盖内扣',
      '推起时锁死膝盖',
      '重量过大导致动作变形'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },
  {
    id: 'preset-legs-004',
    name: '腿弯举',
    muscleGroups: ['hamstrings'],
    category: 'machine',
    difficulty: 1,
    description: '俯卧在器械上，双脚勾住滚轴，弯曲膝盖将滚轴向臀部拉近。',
    steps: [
      '俯卧在器械上',
      '双脚勾住滚轴',
      '双手握住把手',
      '弯曲膝盖将滚轴拉近臀部',
      '缓慢放回至膝盖伸直'
    ],
    tips: [
      '臀部不要抬起',
      '动作幅度要完整',
      '控制回放速度'
    ],
    commonMistakes: [
      '臀部抬起借力',
      '动作过快',
      '没有完全伸直膝盖'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },
  {
    id: 'preset-legs-005',
    name: '腿屈伸',
    muscleGroups: ['quadriceps'],
    category: 'machine',
    difficulty: 1,
    description: '坐在器械上，小腿前侧抵住滚轴，伸直膝盖将重量推起。',
    steps: [
      '坐在器械上，调整靠背',
      '小腿前侧抵住滚轴',
      '双手握住两侧把手',
      '伸直膝盖推起重量',
      '缓慢屈膝放回'
    ],
    tips: [
      '背部贴紧靠垫',
      '在最高点停留片刻',
      '控制回放速度'
    ],
    commonMistakes: [
      '臀部离开座位',
      '推起时锁死膝盖',
      '借助惯性摆动'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'extend',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },
  {
    id: 'preset-legs-006',
    name: '罗马尼亚硬拉',
    muscleGroups: ['hamstrings', 'glutes', 'lower-back'],
    category: 'free-weight',
    difficulty: 3,
    description: '手持杠铃站立，保持膝盖微屈，屈髋俯身将杠铃下放至小腿中部。',
    steps: [
      '手持杠铃站立，膝盖微屈',
      '背部挺直，核心收紧',
      '屈髋俯身，杠铃沿大腿下滑',
      '下放至小腿中部，感受腘绳肌拉伸',
      '伸髋站起回到起始位置'
    ],
    tips: [
      '膝盖保持微屈固定',
      '杠铃贴近身体',
      '感受腘绳肌拉伸'
    ],
    commonMistakes: [
      '膝盖过度弯曲变成深蹲',
      '背部弓起',
      '杠铃远离身体'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-legs-007',
    name: '臀桥',
    muscleGroups: ['glutes', 'hamstrings'],
    category: 'bodyweight',
    difficulty: 1,
    description: '仰卧在地上，双脚踩地，抬起臀部至身体呈直线。',
    steps: [
      '仰卧在地上，双膝弯曲',
      '双脚平放地面，与髋同宽',
      '双手放在身体两侧',
      '抬起臀部至身体呈直线',
      '缓慢下放臀部'
    ],
    tips: [
      '在最高点挤压臀部',
      '不要过度拱腰',
      '用臀部发力而非腰部'
    ],
    commonMistakes: [
      '腰部过度拱起',
      '臀部没有完全抬起',
      '膝盖内扣或外展'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-legs-008',
    name: '保加利亚分腿蹲',
    muscleGroups: ['quadriceps', 'glutes'],
    category: 'bodyweight',
    difficulty: 3,
    description: '后脚放在凳上，前脚站立，进行单腿深蹲动作。',
    steps: [
      '后脚脚背放在凳上',
      '前脚站立，与髋同宽',
      '双手可持哑铃或叉腰',
      '屈髋屈膝下蹲',
      '站起回到起始位置'
    ],
    tips: [
      '前膝与脚尖方向一致',
      '躯干略微前倾',
      '保持平衡'
    ],
    commonMistakes: [
      '前膝过度前移',
      '躯干过度前倾',
      '失去平衡'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-legs-009',
    name: '小腿提踵',
    muscleGroups: ['calves'],
    category: 'machine',
    difficulty: 1,
    description: '站在提踵器械上，抬起脚跟至最高点，再缓慢下放。',
    steps: [
      '站在提踵器械上，前脚掌踩在踏板上',
      '肩膀顶住垫板',
      '抬起脚跟至最高点',
      '在最高点停留',
      '缓慢下放至最低点'
    ],
    tips: [
      '动作幅度要完整',
      '在最高点和最低点都停留',
      '不要借助惯性'
    ],
    commonMistakes: [
      '动作幅度不足',
      '膝盖弯曲',
      '动作过快'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'static',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },
  {
    id: 'preset-legs-010',
    name: '箭步蹲',
    muscleGroups: ['quadriceps', 'glutes'],
    category: 'bodyweight',
    difficulty: 2,
    description: '一脚向前迈出，下蹲至双膝约90度，再站起回到起始位置。',
    steps: [
      '双脚并拢站立',
      '一脚向前迈出一大步',
      '下蹲至双膝约90度',
      '后膝接近地面',
      '站起回到起始位置'
    ],
    tips: [
      '前膝不要超过脚尖太多',
      '躯干保持直立',
      '保持平衡'
    ],
    commonMistakes: [
      '前膝过度前移',
      '躯干过度前倾',
      '步幅过小'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },

  // 肩部 (6个)
  {
    id: 'preset-shoulders-001',
    name: '杠铃肩推',
    muscleGroups: ['shoulders', 'triceps'],
    category: 'free-weight',
    difficulty: 3,
    description: '站立或坐姿，将杠铃从肩部推起至手臂伸直。',
    steps: [
      '站立或坐姿，杠铃置于锁骨处',
      '双手略宽于肩握住杠铃',
      '核心收紧，背部挺直',
      '将杠铃推起至手臂伸直',
      '缓慢下放至起始位置'
    ],
    tips: [
      '不要过度后仰',
      '核心收紧保护腰部',
      '杠铃轨迹略微向前弧形'
    ],
    commonMistakes: [
      '过度后仰借力',
      '耸肩',
      '杠铃轨迹过于垂直导致碰撞'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell', bodyAngle: -90 }
  },
  {
    id: 'preset-shoulders-002',
    name: '哑铃肩推',
    muscleGroups: ['shoulders', 'triceps'],
    category: 'free-weight',
    difficulty: 3,
    description: '手持哑铃坐在凳上，将哑铃从肩部推起至手臂伸直。',
    steps: [
      '手持哑铃坐在有靠背的凳上',
      '哑铃置于肩部两侧',
      '核心收紧，背部贴紧靠垫',
      '将哑铃推起至手臂伸直',
      '缓慢下放至起始位置'
    ],
    tips: [
      '哑铃在最高点不要碰撞',
      '保持手腕中立位',
      '控制动作速度'
    ],
    commonMistakes: [
      '哑铃碰撞',
      '背部离开靠垫',
      '耸肩借力'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell', bodyAngle: -90 }
  },
  {
    id: 'preset-shoulders-003',
    name: '侧平举',
    muscleGroups: ['shoulders'],
    category: 'free-weight',
    difficulty: 2,
    description: '手持哑铃站立，双臂向两侧抬起至与肩平齐。',
    steps: [
      '手持哑铃站立，手臂自然下垂',
      '手肘微屈',
      '双臂向两侧抬起',
      '抬至与肩平齐',
      '缓慢下放'
    ],
    tips: [
      '手肘保持微屈',
      '不要耸肩',
      '控制下放速度'
    ],
    commonMistakes: [
      '使用过大重量导致借力',
      '耸肩',
      '抬得过高'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-shoulders-004',
    name: '前平举',
    muscleGroups: ['shoulders'],
    category: 'free-weight',
    difficulty: 2,
    description: '手持哑铃站立，双臂向前抬起至与肩平齐。',
    steps: [
      '手持哑铃站立',
      '手臂自然下垂，掌心朝向大腿',
      '双臂向前抬起',
      '抬至与肩平齐',
      '缓慢下放'
    ],
    tips: [
      '保持核心收紧',
      '不要借助身体摆动',
      '控制动作速度'
    ],
    commonMistakes: [
      '借助身体摆动',
      '抬得过高',
      '耸肩'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-shoulders-005',
    name: '面拉',
    muscleGroups: ['shoulders', 'back'],
    category: 'machine',
    difficulty: 2,
    description: '站在绳索器械前，将绳索拉向面部两侧。',
    steps: [
      '站在绳索器械前，双手握住绳索两端',
      '手肘抬高至肩部高度',
      '将绳索拉向面部两侧',
      '外旋手臂，感受肩胛骨收缩',
      '缓慢放回至起始位置'
    ],
    tips: [
      '手肘保持抬高',
      '外旋手臂',
      '感受肩胛骨收缩'
    ],
    commonMistakes: [
      '手肘下垂',
      '没有外旋手臂',
      '身体后倾借力'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'cable' }
  },
  {
    id: 'preset-shoulders-006',
    name: '反向飞鸟',
    muscleGroups: ['shoulders', 'back'],
    category: 'machine',
    difficulty: 2,
    description: '坐在器械上或俯身，双臂向两侧打开，刺激后束。',
    steps: [
      '坐在反向飞鸟器械上',
      '胸部贴紧靠垫',
      '双手握住把手',
      '双臂向两侧打开',
      '感受后束收缩'
    ],
    tips: [
      '胸部贴紧靠垫',
      '手肘微屈',
      '控制回放速度'
    ],
    commonMistakes: [
      '借力耸肩',
      '动作过快',
      '幅度不足'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'pull',
    animationConfig: { hasEquipment: true, equipmentType: 'machine' }
  },

  // 手臂 - 二头 (3个)
  {
    id: 'preset-biceps-001',
    name: '杠铃弯举',
    muscleGroups: ['biceps'],
    category: 'free-weight',
    difficulty: 2,
    description: '双手握住杠铃，弯曲手肘将杠铃举向肩部。',
    steps: [
      '双手与肩同宽握住杠铃',
      '手臂自然下垂，掌心朝前',
      '弯曲手肘将杠铃举向肩部',
      '在最高点挤压二头肌',
      '缓慢下放至手臂伸直'
    ],
    tips: [
      '上臂保持固定',
      '不要借助身体摆动',
      '控制下放速度'
    ],
    commonMistakes: [
      '借助身体摆动',
      '上臂前移',
      '没有完全伸直手臂'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-biceps-002',
    name: '哑铃弯举',
    muscleGroups: ['biceps'],
    category: 'free-weight',
    difficulty: 2,
    description: '手持哑铃，弯曲手肘将哑铃举向肩部。',
    steps: [
      '手持哑铃站立',
      '手臂自然下垂，掌心朝前',
      '弯曲手肘将哑铃举向肩部',
      '在最高点旋转手腕（可选）',
      '缓慢下放'
    ],
    tips: [
      '上臂保持固定',
      '可以旋转手腕增加收缩',
      '控制动作速度'
    ],
    commonMistakes: [
      '借助身体摆动',
      '耸肩',
      '动作过快'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },
  {
    id: 'preset-biceps-003',
    name: '锤式弯举',
    muscleGroups: ['biceps', 'forearms'],
    category: 'free-weight',
    difficulty: 2,
    description: '手持哑铃，掌心相对，弯曲手肘将哑铃举向肩部。',
    steps: [
      '手持哑铃站立，掌心相对',
      '手臂自然下垂',
      '弯曲手肘将哑铃举向肩部',
      '保持掌心相对',
      '缓慢下放'
    ],
    tips: [
      '保持掌心相对',
      '上臂固定',
      '控制动作速度'
    ],
    commonMistakes: [
      '手腕翻转',
      '借助身体摆动',
      '耸肩'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: true, equipmentType: 'dumbbell' }
  },

  // 手臂 - 三头 (3个)
  {
    id: 'preset-triceps-001',
    name: '三头下压',
    muscleGroups: ['triceps'],
    category: 'machine',
    difficulty: 2,
    description: '站在高位滑轮前，双手握住直杆或绳索，伸直手臂将重量下压。',
    steps: [
      '站在高位滑轮前',
      '双手握住直杆或绳索',
      '上臂固定在身体两侧',
      '伸直手臂将重量下压',
      '缓慢屈肘放回'
    ],
    tips: [
      '上臂保持固定',
      '在最低点充分收缩三头肌',
      '控制回放速度'
    ],
    commonMistakes: [
      '上臂前移借力',
      '身体前倾',
      '动作过快'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'extend',
    animationConfig: { hasEquipment: true, equipmentType: 'cable' }
  },
  {
    id: 'preset-triceps-002',
    name: '窄握卧推',
    muscleGroups: ['triceps', 'chest'],
    category: 'free-weight',
    difficulty: 3,
    description: '双手窄握杠铃进行卧推，重点刺激三头肌。',
    steps: [
      '仰卧在卧推凳上',
      '双手窄握杠铃，约与肩同宽',
      '将杠铃推起至手臂伸直',
      '缓慢下放至胸部',
      '推起回到起始位置'
    ],
    tips: [
      '握距不要过窄，避免手腕不适',
      '手肘贴近身体',
      '控制动作速度'
    ],
    commonMistakes: [
      '握距过窄导致手腕不适',
      '手肘过度外展',
      '下放位置过高'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: true, equipmentType: 'barbell' }
  },
  {
    id: 'preset-triceps-003',
    name: '臂屈伸',
    muscleGroups: ['triceps', 'chest'],
    category: 'bodyweight',
    difficulty: 2,
    description: '双手撑在凳子或双杠上，屈肘下放身体，再伸直手臂推起。',
    steps: [
      '双手撑在凳子或双杠上',
      '手臂伸直支撑身体',
      '屈肘下放身体',
      '上臂与地面平行',
      '伸直手臂推起'
    ],
    tips: [
      '手肘贴近身体刺激三头',
      '手肘外展刺激胸部',
      '控制下放速度'
    ],
    commonMistakes: [
      '下沉过低导致肩部不适',
      '耸肩',
      '动作过快'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'push',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },

  // 核心 (6个)
  {
    id: 'preset-core-001',
    name: '卷腹',
    muscleGroups: ['abs'],
    category: 'bodyweight',
    difficulty: 1,
    description: '仰卧屈膝，抬起上背部离开地面，收缩腹部。',
    steps: [
      '仰卧在地上，双膝弯曲',
      '双手放在头后或胸前',
      '收缩腹部抬起上背部',
      '在最高点停留',
      '缓慢下放'
    ],
    tips: [
      '不要用手拉头部',
      '下背部保持贴地',
      '用腹部发力而非颈部'
    ],
    commonMistakes: [
      '用手拉头部导致颈部受伤',
      '抬起过高导致腰部离开地面',
      '动作过快借助惯性'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'curl',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-core-002',
    name: '平板支撑',
    muscleGroups: ['core', 'abs'],
    category: 'bodyweight',
    difficulty: 2,
    description: '俯卧，用前臂和脚尖支撑身体，保持身体呈直线。',
    steps: [
      '俯卧在地上',
      '用前臂和脚尖支撑身体',
      '身体从头到脚呈一条直线',
      '核心收紧，保持呼吸',
      '保持指定时间'
    ],
    tips: [
      '不要塌腰或撅臀',
      '核心持续收紧',
      '保持正常呼吸'
    ],
    commonMistakes: [
      '塌腰',
      '撅臀过高',
      '憋气'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'static',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-core-003',
    name: '俄罗斯转体',
    muscleGroups: ['abs', 'core'],
    category: 'bodyweight',
    difficulty: 2,
    description: '坐姿，双脚抬起，双手持重物或空手，左右转体。',
    steps: [
      '坐在地上，双膝弯曲',
      '双脚抬起离地',
      '双手握拳或持重物',
      '左右转体触碰地面',
      '保持核心收紧'
    ],
    tips: [
      '用腹部发力转体',
      '双脚保持稳定',
      '控制动作速度'
    ],
    commonMistakes: [
      '仅用手臂摆动',
      '双脚晃动',
      '背部弓起'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'static',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-core-004',
    name: '悬垂举腿',
    muscleGroups: ['abs', 'core'],
    category: 'bodyweight',
    difficulty: 4,
    description: '悬垂在单杠上，抬起双腿至与地面平行或更高。',
    steps: [
      '双手握住单杠，身体悬垂',
      '双腿伸直或微屈',
      '抬起双腿至与地面平行',
      '在最高点停留',
      '缓慢下放'
    ],
    tips: [
      '不要借助身体摆动',
      '控制下放速度',
      '初学者可以屈膝降低难度'
    ],
    commonMistakes: [
      '借助身体摆动',
      '下放过快',
      '耸肩'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'static',
    animationConfig: { hasEquipment: true, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-core-005',
    name: '死虫式',
    muscleGroups: ['core', 'abs'],
    category: 'bodyweight',
    difficulty: 2,
    description: '仰卧，抬起双腿和双臂，交替伸展对侧手脚。',
    steps: [
      '仰卧，双臂伸直指向天花板',
      '双腿抬起，膝盖弯曲90度',
      '缓慢伸展对侧手脚',
      '手脚接近地面但不接触',
      '回到起始位置换边'
    ],
    tips: [
      '下背部始终贴地',
      '核心持续收紧',
      '动作缓慢控制'
    ],
    commonMistakes: [
      '下背部离开地面',
      '动作过快',
      '手脚接触地面'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'static',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-core-006',
    name: '登山者',
    muscleGroups: ['core', 'abs'],
    category: 'cardio',
    difficulty: 2,
    description: '俯卧撑姿势，交替将膝盖拉向胸部。',
    steps: [
      '俯卧撑姿势，手臂伸直',
      '核心收紧',
      '交替将膝盖拉向胸部',
      '保持快速节奏',
      '臀部不要抬太高'
    ],
    tips: [
      '保持核心收紧',
      '臀部与身体呈直线',
      '保持快速稳定的节奏'
    ],
    commonMistakes: [
      '臀部抬太高',
      '核心松弛',
      '动作过慢'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'cardio',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },

  // 有氧 (6个)
  {
    id: 'preset-cardio-001',
    name: '波比跳',
    muscleGroups: ['full-body'],
    category: 'cardio',
    difficulty: 4,
    description: '从站立到下蹲、俯卧撑、跳起的连续动作。',
    steps: [
      '站立姿势',
      '下蹲双手撑地',
      '双脚后跳呈俯卧撑姿势',
      '做一个俯卧撑',
      '双脚跳回，起身跳跃'
    ],
    tips: [
      '保持动作连贯',
      '落地时缓冲',
      '根据体能调整速度'
    ],
    commonMistakes: [
      '动作不连贯',
      '落地过重',
      '俯卧撑姿势不标准'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'cardio',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-cardio-002',
    name: '跳绳',
    muscleGroups: ['calves', 'full-body'],
    category: 'cardio',
    difficulty: 2,
    description: '手持跳绳，用手腕转动绳子，双脚或单脚跳过。',
    steps: [
      '手持跳绳，绳子置于脚后',
      '用手腕转动绳子',
      '双脚同时跳过绳子',
      '保持节奏',
      '落地时前脚掌着地'
    ],
    tips: [
      '用手腕而非手臂转动',
      '保持肘部贴近身体',
      '落地轻盈'
    ],
    commonMistakes: [
      '用手臂大幅转动',
      '落地过重',
      '跳跃过高'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'cardio',
    animationConfig: { hasEquipment: true, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-cardio-003',
    name: '开合跳',
    muscleGroups: ['full-body'],
    category: 'cardio',
    difficulty: 1,
    description: '站立，跳起时双脚分开双手上举，再跳回起始姿势。',
    steps: [
      '双脚并拢站立，双手自然下垂',
      '跳起双脚分开，双手上举',
      '再跳回双脚并拢',
      '双手放回两侧',
      '保持节奏'
    ],
    tips: [
      '保持节奏稳定',
      '落地缓冲',
      '手臂完全上举'
    ],
    commonMistakes: [
      '节奏不稳',
      '手臂上举不充分',
      '落地过重'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'cardio',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-cardio-004',
    name: '高抬腿',
    muscleGroups: ['quadriceps', 'full-body'],
    category: 'cardio',
    difficulty: 2,
    description: '原地跑步，将膝盖抬至腰部高度。',
    steps: [
      '站立姿势',
      '原地跑步',
      '将膝盖抬至腰部高度',
      '手臂配合摆动',
      '保持快速节奏'
    ],
    tips: [
      '膝盖抬高',
      '保持上身直立',
      '手臂积极摆动'
    ],
    commonMistakes: [
      '膝盖抬得不够高',
      '上身前倾',
      '节奏过慢'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'cardio',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-cardio-005',
    name: '深蹲跳',
    muscleGroups: ['quadriceps', 'glutes'],
    category: 'cardio',
    difficulty: 3,
    description: '下蹲后用力跳起，落地缓冲再次下蹲。',
    steps: [
      '双脚与肩同宽站立',
      '下蹲至大腿与地面平行',
      '用力跳起',
      '落地缓冲',
      '立即进入下一次深蹲'
    ],
    tips: [
      '落地时缓冲',
      '膝盖与脚尖方向一致',
      '保持节奏'
    ],
    commonMistakes: [
      '落地过重',
      '膝盖内扣',
      '下蹲深度不足'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'squat',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-cardio-006',
    name: '战绳',
    muscleGroups: ['full-body'],
    category: 'cardio',
    difficulty: 3,
    description: '双手握住绳子两端，快速上下甩动产生波浪。',
    steps: [
      '双手握住绳子两端',
      '膝盖微屈，核心收紧',
      '快速上下甩动绳子',
      '产生连续波浪',
      '保持节奏和力度'
    ],
    tips: [
      '核心持续收紧',
      '用手臂和肩部发力',
      '保持稳定的节奏'
    ],
    commonMistakes: [
      '手臂发力不充分',
      '核心松弛',
      '节奏不稳定'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'cardio',
    animationConfig: { hasEquipment: true, equipmentType: 'bodyweight' }
  },

  // 拉伸 (10个)
  {
    id: 'preset-stretch-001',
    name: '胸部拉伸',
    muscleGroups: ['chest'],
    category: 'stretching',
    difficulty: 1,
    description: '将手臂靠在墙或门框上，身体前倾拉伸胸部。',
    steps: [
      '将前臂靠在门框上',
      '手肘与肩同高',
      '身体微微前倾',
      '感受胸部拉伸',
      '保持15-30秒'
    ],
    tips: [
      '不要过度拉伸',
      '保持呼吸',
      '感受胸部前侧的拉伸感'
    ],
    commonMistakes: [
      '拉伸过度导致不适',
      '憋气',
      '手肘位置过高或过低'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-002',
    name: '背部拉伸',
    muscleGroups: ['back'],
    category: 'stretching',
    difficulty: 1,
    description: '双手向前伸直，身体前倾，拉伸背部。',
    steps: [
      '跪姿或坐姿',
      '双手向前伸直',
      '身体前倾，额头接近地面',
      '感受背部拉伸',
      '保持15-30秒'
    ],
    tips: [
      '放松背部肌肉',
      '保持呼吸',
      '不要强迫身体'
    ],
    commonMistakes: [
      '强迫身体前倾',
      '憋气',
      '臀部离开脚跟'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-003',
    name: '腿部后侧拉伸',
    muscleGroups: ['hamstrings'],
    category: 'stretching',
    difficulty: 1,
    description: '坐姿一腿伸直，身体前倾拉伸大腿后侧。',
    steps: [
      '坐姿，一腿伸直',
      '另一腿弯曲',
      '身体前倾，双手伸向脚尖',
      '感受大腿后侧拉伸',
      '保持15-30秒换边'
    ],
    tips: [
      '伸直腿的膝盖不要锁死',
      '背部尽量挺直',
      '感受大腿后侧的拉伸'
    ],
    commonMistakes: [
      '背部弓起',
      '膝盖过度伸直',
      '强迫拉伸'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-004',
    name: '股四头肌拉伸',
    muscleGroups: ['quadriceps'],
    category: 'stretching',
    difficulty: 1,
    description: '站立或侧卧，用手拉住脚背向臀部靠近。',
    steps: [
      '站立，手扶墙保持平衡',
      '一只手拉住同侧脚背',
      '将脚向臀部拉近',
      '感受大腿前侧拉伸',
      '保持15-30秒换边'
    ],
    tips: [
      '膝盖指向地面',
      '不要过度拉伸',
      '保持身体直立'
    ],
    commonMistakes: [
      '膝盖外展',
      '身体前倾',
      '拉伸过度'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-005',
    name: '臀部拉伸',
    muscleGroups: ['glutes'],
    category: 'stretching',
    difficulty: 1,
    description: '仰卧，一腿屈膝交叉放在另一腿大腿上，双手拉向胸部。',
    steps: [
      '仰卧在地上',
      '一腿屈膝，脚踝放在另一腿大腿上',
      '双手拉住下方大腿',
      '拉向胸部',
      '感受臀部拉伸，保持15-30秒换边'
    ],
    tips: [
      '放松臀部肌肉',
      '保持呼吸',
      '不要强迫拉伸'
    ],
    commonMistakes: [
      '强迫拉伸',
      '憋气',
      '头部离开地面'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-006',
    name: '肩部拉伸',
    muscleGroups: ['shoulders'],
    category: 'stretching',
    difficulty: 1,
    description: '一臂横过胸前，另一手辅助按压拉伸肩部后侧。',
    steps: [
      '站立或坐姿',
      '一臂横过胸前',
      '另一手辅助按压肘部',
      '感受肩部后侧拉伸',
      '保持15-30秒换边'
    ],
    tips: [
      '不要过度按压',
      '保持呼吸',
      '感受肩部后侧的拉伸'
    ],
    commonMistakes: [
      '按压过度',
      '耸肩',
      '憋气'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-007',
    name: '小腿拉伸',
    muscleGroups: ['calves'],
    category: 'stretching',
    difficulty: 1,
    description: '面对墙站立，一腿后伸脚跟着地，身体前倾拉伸小腿。',
    steps: [
      '面对墙站立',
      '一腿前弓，另一腿后伸',
      '后脚脚跟着地',
      '身体前倾',
      '感受小腿拉伸，保持15-30秒换边'
    ],
    tips: [
      '后脚脚跟着地',
      '膝盖伸直',
      '感受小腿后侧的拉伸'
    ],
    commonMistakes: [
      '脚跟离地',
      '膝盖弯曲',
      '身体前倾不足'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-008',
    name: '髋屈肌拉伸',
    muscleGroups: ['quadriceps', 'core'],
    category: 'stretching',
    difficulty: 1,
    description: '单膝跪地，另一腿前弓，身体前倾拉伸髋部前侧。',
    steps: [
      '单膝跪地',
      '另一腿前弓，脚踩地',
      '双手放在前腿膝盖上',
      '身体微微前倾',
      '感受髋部前侧拉伸，保持15-30秒换边'
    ],
    tips: [
      '骨盆略微后倾',
      '感受髋部前侧拉伸',
      '保持上身直立'
    ],
    commonMistakes: [
      '骨盆前倾',
      '上身过度前倾',
      '前膝过度前移'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-009',
    name: '婴儿式',
    muscleGroups: ['back', 'shoulders'],
    category: 'stretching',
    difficulty: 1,
    description: '跪姿，臀部坐在脚跟上，身体前倾，额头贴地，双臂前伸。',
    steps: [
      '跪姿，双膝分开',
      '臀部坐在脚跟上',
      '身体前倾，额头贴地',
      '双臂向前伸直',
      '保持30-60秒'
    ],
    tips: [
      '放松全身',
      '深呼吸',
      '感受背部和肩部的放松'
    ],
    commonMistakes: [
      '臀部离开脚跟',
      '憋气',
      '手臂过于用力'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  },
  {
    id: 'preset-stretch-010',
    name: '猫牛式',
    muscleGroups: ['back', 'core'],
    category: 'stretching',
    difficulty: 1,
    description: '四肢着地，交替拱背和塌腰，活动脊柱。',
    steps: [
      '四肢着地，手在肩下，膝在髋下',
      '吸气，抬头塌腰（牛式）',
      '呼气，低头拱背（猫式）',
      '缓慢交替',
      '重复10-15次'
    ],
    tips: [
      '动作与呼吸配合',
      '缓慢控制',
      '感受脊柱的活动'
    ],
    commonMistakes: [
      '动作过快',
      '手臂过度弯曲',
      '憋气'
    ],
    isCustom: false,
    createdAt: '2024-01-01',
    animationType: 'stretch',
    animationConfig: { hasEquipment: false, equipmentType: 'bodyweight' }
  }
]

export const getExercisesByMuscleGroup = (group: string): ExerciseDefinition[] => {
  return PRESET_EXERCISES.filter(ex => ex.muscleGroups.includes(group as any))
}

export const getExerciseById = (id: string): ExerciseDefinition | undefined => {
  return PRESET_EXERCISES.find(ex => ex.id === id)
}

export const MUSCLE_GROUP_LABELS: Record<string, string> = {
  chest: '胸部',
  back: '背部',
  shoulders: '肩部',
  biceps: '二头肌',
  triceps: '三头肌',
  legs: '腿部',
  glutes: '臀部',
  hamstrings: '腘绳肌',
  quadriceps: '股四头肌',
  calves: '小腿',
  core: '核心',
  abs: '腹肌',
  'lower-back': '下背',
  'full-body': '全身'
}

export const CATEGORY_LABELS: Record<string, string> = {
  'free-weight': '自由重量',
  machine: '器械',
  bodyweight: '自重',
  cardio: '有氧',
  stretching: '拉伸'
}

export const MUSCLE_GROUP_COLORS: Record<string, string> = {
  chest: 'bg-red-500',
  back: 'bg-blue-500',
  shoulders: 'bg-cyan-500',
  biceps: 'bg-green-500',
  triceps: 'bg-emerald-500',
  legs: 'bg-orange-500',
  glutes: 'bg-pink-500',
  hamstrings: 'bg-amber-500',
  quadriceps: 'bg-yellow-500',
  calves: 'bg-lime-500',
  core: 'bg-purple-500',
  abs: 'bg-violet-500',
  'lower-back': 'bg-indigo-500',
  'full-body': 'bg-rose-500'
}
