import { useRef, useEffect, useState } from 'react'
import { ExerciseDefinition, AnimationConfig } from '../types'
import { Play, Pause } from 'lucide-react'

interface ExerciseAnimationProps {
  exercise: ExerciseDefinition
  size?: number
}

export default function ExerciseAnimation({ exercise, size = 280 }: ExerciseAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsPlaying(false)
        } else {
          setIsPlaying(true)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const renderAnimation = () => {
    switch (exercise.animationType) {
      case 'push':
        return <PushAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'pull':
        return <PullAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'squat':
        return <SquatAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'curl':
        return <CurlAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'extend':
        return <ExtendAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'static':
        return <StaticAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'cardio':
        return <CardioAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      case 'stretch':
        return <StretchAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
      default:
        return <PushAnimation config={exercise.animationConfig} size={size} isPlaying={isPlaying} />
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl overflow-hidden"
      style={{ height: size }}
    >
      <div className={`w-full h-full ${isPlaying ? '' : 'animation-paused'}`}>
        {renderAnimation()}
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-gray-600" />
        ) : (
          <Play className="w-4 h-4 text-gray-600 ml-0.5" />
        )}
      </button>

      <div className="absolute top-3 left-3 text-xs font-medium text-gray-400 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
        动画演示
      </div>
    </div>
  )
}

// ============ 颜色常量 ============
const COLORS = {
  skin: '#F5D0C5',
  skinDark: '#E8B8A8',
  shirt: '#4A90D9',
  shirtDark: '#3A7BC8',
  shorts: '#E74C3C',
  shortsDark: '#C0392B',
  hair: '#2C3E50',
  equipment: '#7F8C8D',
  equipmentDark: '#5D6D7E',
  bar: '#95A5A6',
  weight: '#34495E',
  floor: '#BDC3C7',
  bench: '#8E44AD',
}

// ============ 推动画（卧推/俯卧撑/肩推） ============
function PushAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const hasEquipment = config?.hasEquipment ?? false
  const equipmentType = config?.equipmentType ?? 'bodyweight'
  const isBench = equipmentType === 'barbell' || equipmentType === 'dumbbell'
  const isOverhead = config?.bodyAngle === -90

  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.55

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes push-body-${equipmentType} {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(${isBench ? 15 * sp : 25 * sp}px); }
        }
        @keyframes push-arm-${equipmentType} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${isBench ? 45 : 35}deg); }
        }
        @keyframes push-forearm-${equipmentType} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${isBench ? -70 : -60}deg); }
        }
        @keyframes push-bar-${equipmentType} {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(${isBench ? 15 * sp : 25 * sp}px); }
        }
        .push-body { animation: push-body-${equipmentType} 2s ease-in-out infinite; transform-origin: ${cx}px ${cy}px; }
        .push-arm-l { animation: push-arm-${equipmentType} 2s ease-in-out infinite; transform-origin: ${cx - 25 * sp}px ${cy - 30 * sp}px; }
        .push-arm-r { animation: push-arm-${equipmentType} 2s ease-in-out infinite; transform-origin: ${cx + 25 * sp}px ${cy - 30 * sp}px; }
        .push-forearm-l { animation: push-forearm-${equipmentType} 2s ease-in-out infinite; transform-origin: ${cx - 45 * sp}px ${cy - 10 * sp}px; }
        .push-forearm-r { animation: push-forearm-${equipmentType} 2s ease-in-out infinite; transform-origin: ${cx + 45 * sp}px ${cy - 10 * sp}px; }
        .push-bar { animation: push-bar-${equipmentType} 2s ease-in-out infinite; }
      `}</style>

      {/* 地面/凳子 */}
      {isBench && (
        <rect x={cx - 60 * sp} y={cy + 55 * sp} width={120 * sp} height={8 * sp} rx={4} fill={COLORS.bench} />
      )}
      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      {/* 腿部 */}
      <g className="push-body" style={animStyle}>
        {/* 左大腿 */}
        <rect x={cx - 22 * sp} y={cy + 20 * sp} width={16 * sp} height={45 * sp} rx={8} fill={COLORS.shorts} transform={`rotate(10, ${cx - 14 * sp}, ${cy + 42 * sp})`} />
        {/* 右大腿 */}
        <rect x={cx + 6 * sp} y={cy + 20 * sp} width={16 * sp} height={45 * sp} rx={8} fill={COLORS.shortsDark} transform={`rotate(-10, ${cx + 14 * sp}, ${cy + 42 * sp})`} />
        {/* 左小腿 */}
        <rect x={cx - 30 * sp} y={cy + 58 * sp} width={14 * sp} height={40 * sp} rx={7} fill={COLORS.skin} transform={`rotate(5, ${cx - 23 * sp}, ${cy + 78 * sp})`} />
        {/* 右小腿 */}
        <rect x={cx + 16 * sp} y={cy + 58 * sp} width={14 * sp} height={40 * sp} rx={7} fill={COLORS.skinDark} transform={`rotate(-5, ${cx + 23 * sp}, ${cy + 78 * sp})`} />

        {/* 躯干 */}
        <rect x={cx - 28 * sp} y={cy - 35 * sp} width={56 * sp} height={60 * sp} rx={16} fill={COLORS.shirt} />

        {/* 头部 */}
        <circle cx={cx} cy={cy - 52 * sp} r={18 * sp} fill={COLORS.skin} />
        <circle cx={cx} cy={cy - 56 * sp} r={19 * sp} fill={COLORS.hair} clipPath={`circle(${18 * sp} at ${cx} ${cy - 52 * sp})`} />
      </g>

      {/* 手臂和器械 */}
      <g className="push-arm-l" style={animStyle}>
        <rect x={cx - 45 * sp} y={cy - 40 * sp} width={14 * sp} height={35 * sp} rx={7} fill={COLORS.skin} />
        <g className="push-forearm-l" style={animStyle}>
          <rect x={cx - 55 * sp} y={cy - 15 * sp} width={12 * sp} height={30 * sp} rx={6} fill={COLORS.skin} />
        </g>
      </g>
      <g className="push-arm-r" style={animStyle}>
        <rect x={cx + 31 * sp} y={cy - 40 * sp} width={14 * sp} height={35 * sp} rx={7} fill={COLORS.skinDark} />
        <g className="push-forearm-r" style={animStyle}>
          <rect x={cx + 43 * sp} y={cy - 15 * sp} width={12 * sp} height={30 * sp} rx={6} fill={COLORS.skinDark} />
        </g>
      </g>

      {/* 器械 */}
      {hasEquipment && (
        <g className="push-bar" style={animStyle}>
          {equipmentType === 'barbell' && (
            <>
              <rect x={cx - 70 * sp} y={cy - 22 * sp} width={140 * sp} height={6 * sp} rx={3} fill={COLORS.bar} />
              <rect x={cx - 65 * sp} y={cy - 28 * sp} width={12 * sp} height={18 * sp} rx={3} fill={COLORS.weight} />
              <rect x={cx + 53 * sp} y={cy - 28 * sp} width={12 * sp} height={18 * sp} rx={3} fill={COLORS.weight} />
            </>
          )}
          {equipmentType === 'dumbbell' && (
            <>
              <rect x={cx - 55 * sp} y={cy - 20 * sp} width={30 * sp} height={5 * sp} rx={2} fill={COLORS.bar} />
              <rect x={cx - 58 * sp} y={cy - 26 * sp} width={10 * sp} height={16 * sp} rx={3} fill={COLORS.weight} />
              <rect x={cx + 25 * sp} y={cy - 20 * sp} width={30 * sp} height={5 * sp} rx={2} fill={COLORS.bar} />
              <rect x={cx + 48 * sp} y={cy - 26 * sp} width={10 * sp} height={16 * sp} rx={3} fill={COLORS.weight} />
            </>
          )}
        </g>
      )}
    </svg>
  )
}

// ============ 拉动画（引体/划船/下拉） ============
function PullAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const hasEquipment = config?.hasEquipment ?? true
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.5

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes pull-body {
          0%, 100% { transform: translateY(${10 * sp}px); }
          50% { transform: translateY(${-15 * sp}px); }
        }
        @keyframes pull-arm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes pull-forearm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-60deg); }
        }
        .pull-body { animation: pull-body 2s ease-in-out infinite; transform-origin: ${cx}px ${cy + 60 * sp}px; }
        .pull-arm { animation: pull-arm 2s ease-in-out infinite; }
        .pull-forearm { animation: pull-forearm 2s ease-in-out infinite; }
      `}</style>

      {/* 拉杆/绳索 */}
      {hasEquipment && (
        <>
          <rect x={cx - 60 * sp} y={20 * sp} width={120 * sp} height={8 * sp} rx={4} fill={COLORS.bar} />
          <rect x={cx - 40 * sp} y={28 * sp} width={6 * sp} height={40 * sp} fill={COLORS.equipment} />
          <rect x={cx + 34 * sp} y={28 * sp} width={6 * sp} height={40 * sp} fill={COLORS.equipment} />
        </>
      )}

      {/* 身体 */}
      <g className="pull-body" style={animStyle}>
        {/* 腿部 */}
        <rect x={cx - 18 * sp} y={cy + 30 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shorts} transform={`rotate(5, ${cx - 11 * sp}, ${cy + 55 * sp})`} />
        <rect x={cx + 4 * sp} y={cy + 30 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shortsDark} transform={`rotate(-5, ${cx + 11 * sp}, ${cy + 55 * sp})`} />

        {/* 躯干 */}
        <rect x={cx - 24 * sp} y={cy - 30 * sp} width={48 * sp} height={65 * sp} rx={14} fill={COLORS.shirt} />

        {/* 头部 */}
        <circle cx={cx} cy={cy - 48 * sp} r={17 * sp} fill={COLORS.skin} />
        <circle cx={cx} cy={cy - 52 * sp} r={18 * sp} fill={COLORS.hair} clipPath={`circle(${17 * sp} at ${cx} ${cy - 48 * sp})`} />

        {/* 手臂 */}
        <g className="pull-arm" style={{ ...animStyle, transformOrigin: `${cx - 20 * sp}px ${cy - 20 * sp}px` }}>
          <rect x={cx - 32 * sp} y={cy - 30 * sp} width={13 * sp} height={32 * sp} rx={6} fill={COLORS.skin} />
          <g className="pull-forearm" style={{ ...animStyle, transformOrigin: `${cx - 38 * sp}px ${cy - 5 * sp}px` }}>
            <rect x={cx - 42 * sp} y={cy - 8 * sp} width={11 * sp} height={28 * sp} rx={5} fill={COLORS.skin} />
          </g>
        </g>
        <g className="pull-arm" style={{ ...animStyle, transformOrigin: `${cx + 20 * sp}px ${cy - 20 * sp}px` }}>
          <rect x={cx + 19 * sp} y={cy - 30 * sp} width={13 * sp} height={32 * sp} rx={6} fill={COLORS.skinDark} />
          <g className="pull-forearm" style={{ ...animStyle, transformOrigin: `${cx + 38 * sp}px ${cy - 5 * sp}px` }}>
            <rect x={cx + 31 * sp} y={cy - 8 * sp} width={11 * sp} height={28 * sp} rx={5} fill={COLORS.skinDark} />
          </g>
        </g>
      </g>
    </svg>
  )
}

// ============ 蹲动画（深蹲/腿举） ============
function SquatAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const hasEquipment = config?.hasEquipment ?? false
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.45

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes squat-body {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(${35 * sp}px); }
        }
        @keyframes squat-thigh {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${hasEquipment ? -50 : -55}deg); }
        }
        @keyframes squat-shin {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${hasEquipment ? 50 : 55}deg); }
        }
        @keyframes squat-torso {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${hasEquipment ? 15 : 10}deg); }
        }
        @keyframes squat-arm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${hasEquipment ? -20 : 0}deg); }
        }
        .squat-body { animation: squat-body 2.5s ease-in-out infinite; transform-origin: ${cx}px ${cy + 80 * sp}px; }
        .squat-thigh-l { animation: squat-thigh 2.5s ease-in-out infinite; transform-origin: ${cx - 12 * sp}px ${cy + 25 * sp}px; }
        .squat-thigh-r { animation: squat-thigh 2.5s ease-in-out infinite; transform-origin: ${cx + 12 * sp}px ${cy + 25 * sp}px; }
        .squat-shin-l { animation: squat-shin 2.5s ease-in-out infinite; transform-origin: ${cx - 20 * sp}px ${cy + 65 * sp}px; }
        .squat-shin-r { animation: squat-shin 2.5s ease-in-out infinite; transform-origin: ${cx + 20 * sp}px ${cy + 65 * sp}px; }
        .squat-torso { animation: squat-torso 2.5s ease-in-out infinite; transform-origin: ${cx}px ${cy + 25 * sp}px; }
        .squat-arm { animation: squat-arm 2.5s ease-in-out infinite; }
      `}</style>

      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      {/* 杠铃 */}
      {hasEquipment && (
        <g className="squat-torso" style={{ ...animStyle, transformOrigin: `${cx}px ${cy - 10 * sp}px` }}>
          <rect x={cx - 75 * sp} y={cy - 35 * sp} width={150 * sp} height={7 * sp} rx={3} fill={COLORS.bar} />
          <rect x={cx - 70 * sp} y={cy - 42 * sp} width={14 * sp} height={20 * sp} rx={3} fill={COLORS.weight} />
          <rect x={cx + 56 * sp} y={cy - 42 * sp} width={14 * sp} height={20 * sp} rx={3} fill={COLORS.weight} />
        </g>
      )}

      {/* 身体 */}
      <g className="squat-body" style={animStyle}>
        {/* 小腿 */}
        <g className="squat-shin-l" style={{ ...animStyle, transformOrigin: `${cx - 20 * sp}px ${cy + 65 * sp}px` }}>
          <rect x={cx - 26 * sp} y={cy + 58 * sp} width={13 * sp} height={45 * sp} rx={6} fill={COLORS.skin} />
        </g>
        <g className="squat-shin-r" style={{ ...animStyle, transformOrigin: `${cx + 20 * sp}px ${cy + 65 * sp}px` }}>
          <rect x={cx + 13 * sp} y={cy + 58 * sp} width={13 * sp} height={45 * sp} rx={6} fill={COLORS.skinDark} />
        </g>

        {/* 大腿 */}
        <g className="squat-thigh-l" style={{ ...animStyle, transformOrigin: `${cx - 12 * sp}px ${cy + 25 * sp}px` }}>
          <rect x={cx - 22 * sp} y={cy + 20 * sp} width={16 * sp} height={48 * sp} rx={8} fill={COLORS.shorts} />
        </g>
        <g className="squat-thigh-r" style={{ ...animStyle, transformOrigin: `${cx + 12 * sp}px ${cy + 25 * sp}px` }}>
          <rect x={cx + 6 * sp} y={cy + 20 * sp} width={16 * sp} height={48 * sp} rx={8} fill={COLORS.shortsDark} />
        </g>

        {/* 躯干 */}
        <g className="squat-torso" style={{ ...animStyle, transformOrigin: `${cx}px ${cy + 25 * sp}px` }}>
          <rect x={cx - 26 * sp} y={cy - 35 * sp} width={52 * sp} height={65 * sp} rx={14} fill={COLORS.shirt} />

          {/* 头部 */}
          <circle cx={cx} cy={cy - 52 * sp} r={17 * sp} fill={COLORS.skin} />
          <circle cx={cx} cy={cy - 56 * sp} r={18 * sp} fill={COLORS.hair} clipPath={`circle(${17 * sp} at ${cx} ${cy - 52 * sp})`} />

          {/* 手臂 */}
          <g className="squat-arm" style={{ ...animStyle, transformOrigin: `${cx - 25 * sp}px ${cy - 25 * sp}px` }}>
            <rect x={cx - 38 * sp} y={cy - 32 * sp} width={12 * sp} height={30 * sp} rx={6} fill={COLORS.skin} />
          </g>
          <g className="squat-arm" style={{ ...animStyle, transformOrigin: `${cx + 25 * sp}px ${cy - 25 * sp}px` }}>
            <rect x={cx + 26 * sp} y={cy - 32 * sp} width={12 * sp} height={30 * sp} rx={6} fill={COLORS.skinDark} />
          </g>
        </g>
      </g>
    </svg>
  )
}

// ============ 弯举动画（二头弯举） ============
function CurlAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const hasEquipment = config?.hasEquipment ?? true
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.45

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes curl-forearm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-75deg); }
        }
        @keyframes curl-dumbbell {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-75deg); }
        }
        .curl-forearm-l { animation: curl-forearm 1.8s ease-in-out infinite; transform-origin: ${cx - 30 * sp}px ${cy - 5 * sp}px; }
        .curl-forearm-r { animation: curl-forearm 1.8s ease-in-out infinite; transform-origin: ${cx + 30 * sp}px ${cy - 5 * sp}px; }
        .curl-dumbbell-l { animation: curl-dumbbell 1.8s ease-in-out infinite; transform-origin: ${cx - 30 * sp}px ${cy - 5 * sp}px; }
        .curl-dumbbell-r { animation: curl-dumbbell 1.8s ease-in-out infinite; transform-origin: ${cx + 30 * sp}px ${cy - 5 * sp}px; }
      `}</style>

      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      {/* 腿部 */}
      <rect x={cx - 18 * sp} y={cy + 30 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shorts} transform={`rotate(3, ${cx - 11 * sp}, ${cy + 55 * sp})`} />
      <rect x={cx + 4 * sp} y={cy + 30 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shortsDark} transform={`rotate(-3, ${cx + 11 * sp}, ${cy + 55 * sp})`} />

      {/* 躯干 */}
      <rect x={cx - 24 * sp} y={cy - 30 * sp} width={48 * sp} height={65 * sp} rx={14} fill={COLORS.shirt} />

      {/* 头部 */}
      <circle cx={cx} cy={cy - 48 * sp} r={17 * sp} fill={COLORS.skin} />
      <circle cx={cx} cy={cy - 52 * sp} r={18 * sp} fill={COLORS.hair} clipPath={`circle(${17 * sp} at ${cx} ${cy - 48 * sp})`} />

      {/* 上臂 */}
      <rect x={cx - 38 * sp} y={cy - 28 * sp} width={13 * sp} height={30 * sp} rx={6} fill={COLORS.skin} transform={`rotate(10, ${cx - 31 * sp}, ${cy - 13 * sp})`} />
      <rect x={cx + 25 * sp} y={cy - 28 * sp} width={13 * sp} height={30 * sp} rx={6} fill={COLORS.skinDark} transform={`rotate(-10, ${cx + 31 * sp}, ${cy - 13 * sp})`} />

      {/* 前臂 */}
      <g className="curl-forearm-l" style={animStyle}>
        <rect x={cx - 48 * sp} y={cy - 8 * sp} width={11 * sp} height={28 * sp} rx={5} fill={COLORS.skin} />
      </g>
      <g className="curl-forearm-r" style={animStyle}>
        <rect x={cx + 37 * sp} y={cy - 8 * sp} width={11 * sp} height={28 * sp} rx={5} fill={COLORS.skinDark} />
      </g>

      {/* 哑铃 */}
      {hasEquipment && (
        <>
          <g className="curl-dumbbell-l" style={animStyle}>
            <rect x={cx - 55 * sp} y={cy - 12 * sp} width={22 * sp} height={5 * sp} rx={2} fill={COLORS.bar} />
            <rect x={cx - 58 * sp} y={cy - 18 * sp} width={8 * sp} height={16 * sp} rx={2} fill={COLORS.weight} />
          </g>
          <g className="curl-dumbbell-r" style={animStyle}>
            <rect x={cx + 33 * sp} y={cy - 12 * sp} width={22 * sp} height={5 * sp} rx={2} fill={COLORS.bar} />
            <rect x={cx + 50 * sp} y={cy - 18 * sp} width={8 * sp} height={16 * sp} rx={2} fill={COLORS.weight} />
          </g>
        </>
      )}
    </svg>
  )
}

// ============ 伸展动画（三头下压/腿屈伸） ============
function ExtendAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const isLeg = config?.equipmentType === 'machine'
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.45

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes extend-limb {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${isLeg ? 45 : 50}deg); }
        }
        .extend-limb-l { animation: extend-limb 1.8s ease-in-out infinite; }
        .extend-limb-r { animation: extend-limb 1.8s ease-in-out infinite; }
      `}</style>

      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      {isLeg ? (
        // 腿屈伸动画
        <>
          {/* 坐姿躯干 */}
          <rect x={cx - 24 * sp} y={cy - 20 * sp} width={48 * sp} height={55 * sp} rx={14} fill={COLORS.shirt} transform={`rotate(-15, ${cx}, ${cy + 30 * sp})`} />
          <circle cx={cx - 8 * sp} cy={cy - 35 * sp} r={16 * sp} fill={COLORS.skin} />
          <circle cx={cx - 10 * sp} cy={cy - 39 * sp} r={17 * sp} fill={COLORS.hair} clipPath={`circle(${16 * sp} at ${cx - 8 * sp} ${cy - 35 * sp})`} />

          {/* 大腿 */}
          <rect x={cx - 15 * sp} y={cy + 15 * sp} width={14 * sp} height={40 * sp} rx={7} fill={COLORS.shorts} transform={`rotate(-15, ${cx - 8 * sp}, ${cy + 35 * sp})`} />
          <rect x={cx + 1 * sp} y={cy + 15 * sp} width={14 * sp} height={40 * sp} rx={7} fill={COLORS.shortsDark} transform={`rotate(-15, ${cx + 8 * sp}, ${cy + 35 * sp})`} />

          {/* 小腿伸展 */}
          <g className="extend-limb-l" style={{ ...animStyle, transformOrigin: `${cx - 12 * sp}px ${cy + 52 * sp}px` }}>
            <rect x={cx - 18 * sp} y={cy + 48 * sp} width={12 * sp} height={38 * sp} rx={6} fill={COLORS.skin} />
          </g>
          <g className="extend-limb-r" style={{ ...animStyle, transformOrigin: `${cx + 12 * sp}px ${cy + 52 * sp}px` }}>
            <rect x={cx + 6 * sp} y={cy + 48 * sp} width={12 * sp} height={38 * sp} rx={6} fill={COLORS.skinDark} />
          </g>
        </>
      ) : (
        // 手臂伸展动画（三头）
        <>
          {/* 腿部 */}
          <rect x={cx - 18 * sp} y={cy + 30 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shorts} transform={`rotate(3, ${cx - 11 * sp}, ${cy + 55 * sp})`} />
          <rect x={cx + 4 * sp} y={cy + 30 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shortsDark} transform={`rotate(-3, ${cx + 11 * sp}, ${cy + 55 * sp})`} />

          {/* 躯干 */}
          <rect x={cx - 24 * sp} y={cy - 30 * sp} width={48 * sp} height={65 * sp} rx={14} fill={COLORS.shirt} />

          {/* 头部 */}
          <circle cx={cx} cy={cy - 48 * sp} r={17 * sp} fill={COLORS.skin} />
          <circle cx={cx} cy={cy - 52 * sp} r={18 * sp} fill={COLORS.hair} clipPath={`circle(${17 * sp} at ${cx} ${cy - 48 * sp})`} />

          {/* 上臂 */}
          <rect x={cx - 35 * sp} y={cy - 25 * sp} width={12 * sp} height={28 * sp} rx={6} fill={COLORS.skin} transform={`rotate(-5, ${cx - 29 * sp}, ${cy - 11 * sp})`} />
          <rect x={cx + 23 * sp} y={cy - 25 * sp} width={12 * sp} height={28 * sp} rx={6} fill={COLORS.skinDark} transform={`rotate(5, ${cx + 29 * sp}, ${cy - 11 * sp})`} />

          {/* 前臂伸展 */}
          <g className="extend-limb-l" style={{ ...animStyle, transformOrigin: `${cx - 32 * sp}px ${cy + 2 * sp}px` }}>
            <rect x={cx - 40 * sp} y={cy - 2 * sp} width={10 * sp} height={26 * sp} rx={5} fill={COLORS.skin} />
          </g>
          <g className="extend-limb-r" style={{ ...animStyle, transformOrigin: `${cx + 32 * sp}px ${cy + 2 * sp}px` }}>
            <rect x={cx + 30 * sp} y={cy - 2 * sp} width={10 * sp} height={26 * sp} rx={5} fill={COLORS.skinDark} />
          </g>
        </>
      )}
    </svg>
  )
}

// ============ 静态动画（平板支撑） ============
function StaticAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.55

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes static-breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }
        @keyframes static-shake {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(${1 * sp}px); }
          75% { transform: translateX(${-1 * sp}px); }
        }
        .static-body { animation: static-breathe 3s ease-in-out infinite; transform-origin: ${cx}px ${cy}px; }
        .static-shake { animation: static-shake 0.5s ease-in-out infinite; }
      `}</style>

      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      {/* 身体平板支撑 */}
      <g className="static-body" style={animStyle}>
        {/* 腿部 */}
        <rect x={cx - 40 * sp} y={cy - 6 * sp} width={14 * sp} height={45 * sp} rx={7} fill={COLORS.shorts} transform={`rotate(-85, ${cx - 33 * sp}, ${cy + 16 * sp})`} />
        <rect x={cx - 25 * sp} y={cy - 6 * sp} width={14 * sp} height={45 * sp} rx={7} fill={COLORS.shortsDark} transform={`rotate(-85, ${cx - 18 * sp}, ${cy + 16 * sp})`} />

        {/* 小腿 */}
        <rect x={cx + 5 * sp} y={cy - 8 * sp} width={12 * sp} height={40 * sp} rx={6} fill={COLORS.skin} transform={`rotate(-85, ${cx + 11 * sp}, ${cy + 12 * sp})`} />
        <rect x={cx + 18 * sp} y={cy - 8 * sp} width={12 * sp} height={40 * sp} rx={6} fill={COLORS.skinDark} transform={`rotate(-85, ${cx + 24 * sp}, ${cy + 12 * sp})`} />

        {/* 躯干 */}
        <rect x={cx - 55 * sp} y={cy - 12 * sp} width={70 * sp} height={28 * sp} rx={10} fill={COLORS.shirt} transform={`rotate(-5, ${cx}, ${cy - 2 * sp})`} />

        {/* 头部 */}
        <circle cx={cx - 58 * sp} cy={cy - 8 * sp} r={14 * sp} fill={COLORS.skin} />
        <circle cx={cx - 60 * sp} cy={cy - 11 * sp} r={15 * sp} fill={COLORS.hair} clipPath={`circle(${14 * sp} at ${cx - 58 * sp} ${cy - 8 * sp})`} />

        {/* 手臂支撑 */}
        <rect x={cx - 50 * sp} y={cy + 8 * sp} width={12 * sp} height={30 * sp} rx={6} fill={COLORS.skin} transform={`rotate(-80, ${cx - 44 * sp}, ${cy + 23 * sp})`} />
        <rect x={cx - 38 * sp} y={cy + 8 * sp} width={12 * sp} height={30 * sp} rx={6} fill={COLORS.skinDark} transform={`rotate(-80, ${cx - 32 * sp}, ${cy + 23 * sp})`} />
      </g>
    </svg>
  )
}

// ============ 有氧动画（波比跳/开合跳） ============
function CardioAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const isBurpee = config?.equipmentType === 'bodyweight'
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.5

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes cardio-jump {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(${-30 * sp}px); }
        }
        @keyframes cardio-arm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${isBurpee ? 0 : -140}deg); }
        }
        @keyframes cardio-leg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${isBurpee ? 0 : -25}deg); }
        }
        .cardio-body { animation: cardio-jump 0.8s ease-in-out infinite; }
        .cardio-arm { animation: cardio-arm 0.8s ease-in-out infinite; }
        .cardio-leg { animation: cardio-leg 0.8s ease-in-out infinite; }
      `}</style>

      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      {isBurpee ? (
        // 波比跳 - 简化为跳跃
        <g className="cardio-body" style={{ ...animStyle, transformOrigin: `${cx}px ${cy + 60 * sp}px` }}>
          {/* 腿部 */}
          <rect x={cx - 18 * sp} y={cy + 25 * sp} width={14 * sp} height={45 * sp} rx={7} fill={COLORS.shorts} />
          <rect x={cx + 4 * sp} y={cy + 25 * sp} width={14 * sp} height={45 * sp} rx={7} fill={COLORS.shortsDark} />

          {/* 躯干 */}
          <rect x={cx - 22 * sp} y={cy - 25 * sp} width={44 * sp} height={55 * sp} rx={12} fill={COLORS.shirt} />

          {/* 头部 */}
          <circle cx={cx} cy={cy - 42 * sp} r={15 * sp} fill={COLORS.skin} />
          <circle cx={cx} cy={cy - 46 * sp} r={16 * sp} fill={COLORS.hair} clipPath={`circle(${15 * sp} at ${cx} ${cy - 42 * sp})`} />

          {/* 手臂 */}
          <rect x={cx - 38 * sp} y={cy - 22 * sp} width={11 * sp} height={28 * sp} rx={5} fill={COLORS.skin} transform={`rotate(20, ${cx - 32 * sp}, ${cy - 8 * sp})`} />
          <rect x={cx + 27 * sp} y={cy - 22 * sp} width={11 * sp} height={28 * sp} rx={5} fill={COLORS.skinDark} transform={`rotate(-20, ${cx + 32 * sp}, ${cy - 8 * sp})`} />
        </g>
      ) : (
        // 开合跳
        <g className="cardio-body" style={{ ...animStyle, transformOrigin: `${cx}px ${cy + 60 * sp}px` }}>
          {/* 腿部 */}
          <g className="cardio-leg" style={{ ...animStyle, transformOrigin: `${cx - 8 * sp}px ${cy + 30 * sp}px` }}>
            <rect x={cx - 15 * sp} y={cy + 25 * sp} width={13 * sp} height={45 * sp} rx={6} fill={COLORS.shorts} />
          </g>
          <g className="cardio-leg" style={{ ...animStyle, transformOrigin: `${cx + 8 * sp}px ${cy + 30 * sp}px` }}>
            <rect x={cx + 2 * sp} y={cy + 25 * sp} width={13 * sp} height={45 * sp} rx={6} fill={COLORS.shortsDark} />
          </g>

          {/* 躯干 */}
          <rect x={cx - 20 * sp} y={cy - 25 * sp} width={40 * sp} height={55 * sp} rx={12} fill={COLORS.shirt} />

          {/* 头部 */}
          <circle cx={cx} cy={cy - 42 * sp} r={15 * sp} fill={COLORS.skin} />
          <circle cx={cx} cy={cy - 46 * sp} r={16 * sp} fill={COLORS.hair} clipPath={`circle(${15 * sp} at ${cx} ${cy - 42 * sp})`} />

          {/* 手臂开合 */}
          <g className="cardio-arm" style={{ ...animStyle, transformOrigin: `${cx - 22 * sp}px ${cy - 20 * sp}px` }}>
            <rect x={cx - 35 * sp} y={cy - 25 * sp} width={10 * sp} height={26 * sp} rx={5} fill={COLORS.skin} />
          </g>
          <g className="cardio-arm" style={{ ...animStyle, transformOrigin: `${cx + 22 * sp}px ${cy - 20 * sp}px` }}>
            <rect x={cx + 25 * sp} y={cy - 25 * sp} width={10 * sp} height={26 * sp} rx={5} fill={COLORS.skinDark} />
          </g>
        </g>
      )}
    </svg>
  )
}

// ============ 拉伸动画 ============
function StretchAnimation({ config, size, isPlaying }: { config?: AnimationConfig; size: number; isPlaying: boolean }) {
  const sp = size / 300
  const cx = size / 2
  const cy = size * 0.5

  const animStyle = isPlaying ? {} : { animationPlayState: 'paused' as const }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes stretch-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes stretch-arm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        .stretch-body { animation: stretch-pulse 4s ease-in-out infinite; transform-origin: ${cx}px ${cy}px; }
        .stretch-arm { animation: stretch-arm 4s ease-in-out infinite; }
      `}</style>

      <rect x={0} y={size - 10} width={size} height={10} fill={COLORS.floor} />

      <g className="stretch-body" style={animStyle}>
        {/* 腿部 - 站姿或坐姿 */}
        <rect x={cx - 18 * sp} y={cy + 25 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shorts} transform={`rotate(5, ${cx - 11 * sp}, ${cy + 50 * sp})`} />
        <rect x={cx + 4 * sp} y={cy + 25 * sp} width={14 * sp} height={50 * sp} rx={7} fill={COLORS.shortsDark} transform={`rotate(-5, ${cx + 11 * sp}, ${cy + 50 * sp})`} />

        {/* 躯干 */}
        <rect x={cx - 22 * sp} y={cy - 25 * sp} width={44 * sp} height={55 * sp} rx={12} fill={COLORS.shirt} />

        {/* 头部 */}
        <circle cx={cx} cy={cy - 42 * sp} r={15 * sp} fill={COLORS.skin} />
        <circle cx={cx} cy={cy - 46 * sp} r={16 * sp} fill={COLORS.hair} clipPath={`circle(${15 * sp} at ${cx} ${cy - 42 * sp})`} />

        {/* 手臂 - 拉伸姿势 */}
        <g className="stretch-arm" style={{ ...animStyle, transformOrigin: `${cx - 20 * sp}px ${cy - 18 * sp}px` }}>
          <rect x={cx - 50 * sp} y={cy - 22 * sp} width={10 * sp} height={30 * sp} rx={5} fill={COLORS.skin} transform={`rotate(-30, ${cx - 45 * sp}, ${cy - 7 * sp})`} />
        </g>
        <g className="stretch-arm" style={{ ...animStyle, transformOrigin: `${cx + 20 * sp}px ${cy - 18 * sp}px` }}>
          <rect x={cx + 15 * sp} y={cy - 50 * sp} width={10 * sp} height={30 * sp} rx={5} fill={COLORS.skinDark} transform={`rotate(30, ${cx + 20 * sp}, ${cy - 35 * sp})`} />
        </g>
      </g>
    </svg>
  )
}
