// components/forms/anamnese/primitives/SliderInput.tsx
'use client'

interface SliderInputProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  labelLeft?: string
  labelRight?: string
}

export function SliderInput({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  labelLeft,
  labelRight,
}: SliderInputProps) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-3">
        {label}: <span className="text-primary font-medium">{value}/{max}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />
      {(labelLeft || labelRight) && (
        <div className="flex justify-between text-xs text-muted-foreground/50 mt-1">
          <span>{labelLeft}</span>
          <span>{labelRight}</span>
        </div>
      )}
    </div>
  )
}
