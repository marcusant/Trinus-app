// components/forms/anamnese/primitives/ChipSelector.tsx
'use client'

interface ChipSelectorProps {
  options: string[]
  selected: string[]
  onToggle: (item: string) => void
  colorSelected?: 'primary' | 'green' | 'red' | 'orange' | 'blue'
}

export function ChipSelector({
  options,
  selected,
  onToggle,
  colorSelected = 'primary',
}: ChipSelectorProps) {
  const colors = {
    primary: 'bg-primary text-white font-medium shadow-sm',
    green: 'bg-emerald-600 text-white font-medium',
    red: 'bg-red-600 text-white font-medium',
    orange: 'bg-amber-600 text-white font-medium',
    blue: 'bg-sky-600 text-white font-medium',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer ${
            selected.includes(option)
              ? colors[colorSelected]
              : 'bg-input text-foreground hover:bg-muted border border-border'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
