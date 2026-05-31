// components/forms/anamnese/primitives/BooleanToggle.tsx
'use client'

interface BooleanToggleProps {
  value: boolean | null | undefined
  onChange: (v: boolean) => void
  labelTrue: string
  labelFalse: string
}

export function BooleanToggle({
  value,
  onChange,
  labelTrue,
  labelFalse,
}: BooleanToggleProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border border-transparent ${
          value === true
            ? 'bg-primary text-white shadow-sm'
            : 'bg-input text-muted-foreground border-border hover:bg-muted'
        }`}
      >
        {labelTrue}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border border-transparent ${
          value === false
            ? 'bg-primary text-white shadow-sm'
            : 'bg-input text-muted-foreground border-border hover:bg-muted'
        }`}
      >
        {labelFalse}
      </button>
    </div>
  )
}
