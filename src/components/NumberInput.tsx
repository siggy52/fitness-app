import { Minus, Plus } from 'lucide-react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  step?: number
  min?: number
  max?: number
  unit?: string
}

export function NumberInput({
  value,
  onChange,
  label,
  step = 1,
  min = 0,
  max = 999,
  unit = '',
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-dark-muted">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-center">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            className="w-full bg-transparent text-white font-bold text-center focus:outline-none"
            min={min}
            max={max}
          />
          {unit && <span className="text-xs text-dark-muted">{unit}</span>}
        </div>
        <button
          onClick={handleIncrement}
          className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
