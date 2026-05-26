import { InputHTMLAttributes } from 'react'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number
  onChange: (value: number) => void
  className?: string
  min?: number
  max?: number
}

export default function NumberInput({ value, onChange, className = '', min, max, ...props }: NumberInputProps) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value || ''}
      onChange={(e) => {
        if (e.target.value === '') {
          onChange(min ?? 0)
          return
        }
        const raw = Number(e.target.value)
        if (min !== undefined && raw < min) onChange(min)
        else if (max !== undefined && raw > max) onChange(max)
        else onChange(raw)
      }}
      min={min}
      max={max}
      className={className}
      {...props}
    />
  )
}
