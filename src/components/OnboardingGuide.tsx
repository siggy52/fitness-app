import { useState } from 'react'
import { X, Check, ArrowRight, Play, Target, BookOpen, Flame } from 'lucide-react'

interface OnboardingGuideProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    icon: Play,
    title: '开始训练',
    description: '点击首页的开始按钮，进入训练页面记录你的每一次训练',
    color: 'text-neon',
    bgColor: 'bg-neon/10',
  },
  {
    icon: Target,
    title: '制定计划',
    description: '在计划页面创建专属训练计划，让训练更有规律',
    color: 'text-cyan-accent',
    bgColor: 'bg-cyan-accent/10',
  },
  {
    icon: BookOpen,
    title: '动作库',
    description: '丰富的动作库包含详细的动作指导，助你正确训练',
    color: 'text-purple-accent',
    bgColor: 'bg-purple-accent/10',
  },
  {
    icon: Flame,
    title: '饮食追踪',
    description: '记录每日饮食，掌握热量摄入，配合训练效果更佳',
    color: 'text-orange-accent',
    bgColor: 'bg-orange-accent/10',
  },
]

export function OnboardingGuide({ isOpen, onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([])

  const handleComplete = () => {
    const newCompleted = [...completedSteps]
    newCompleted[currentStep] = true
    setCompletedSteps(newCompleted)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen) return null

  const current = steps[currentStep]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-md bg-dark-card rounded-[32px] overflow-hidden">
        {/* Header */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark-bg transition-colors z-10"
        >
          <X className="w-5 h-5 text-dark-muted" />
        </button>

        {/* Progress */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i < currentStep || completedSteps[i]
                    ? 'bg-neon'
                    : i === currentStep
                    ? 'bg-neon/50'
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className={`w-20 h-20 rounded-full ${current.bgColor} flex items-center justify-center mx-auto mb-6`}>
            <Icon className={`w-10 h-10 ${current.color}`} />
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-3">
            {current.title}
          </h2>
          <p className="text-dark-muted text-center mb-8">
            {current.description}
          </p>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : handleSkip}
              className="flex-1 py-4 rounded-[24px] bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
            >
              {currentStep > 0 ? '上一步' : '跳过'}
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 py-4 rounded-[24px] bg-neon text-dark-bg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  下一步 <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  开始使用 <Check className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingGuide