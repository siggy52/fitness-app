import { InputHTMLAttributes } from 'react'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number
  onChange: (value: number) => void
  className?: string
}

export default function NumberInput({ value, onChange, className = '', ...props }: NumberInputProps) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value || ''}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      className={className}
      {...props}
    />
  )
}
