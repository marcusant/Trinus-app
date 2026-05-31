"use client"

interface MoodOption {
  value: number
  emoji: string
  label: string
  colorClass: string
  bgSelectedClass: string
  borderSelectedClass: string
}

const MOODS: MoodOption[] = [
  {
    value: 1,
    emoji: "😔",
    label: "Difícil",
    colorClass: "text-red-500",
    bgSelectedClass: "bg-red-500/10",
    borderSelectedClass: "border-red-500/30",
  },
  {
    value: 2,
    emoji: "😐",
    label: "Neutro",
    colorClass: "text-amber-500",
    bgSelectedClass: "bg-amber-500/10",
    borderSelectedClass: "border-amber-500/30",
  },
  {
    value: 3,
    emoji: "🙂",
    label: "Bom",
    colorClass: "text-green-500",
    bgSelectedClass: "bg-green-500/10",
    borderSelectedClass: "border-green-500/30",
  },
  {
    value: 4,
    emoji: "😊",
    label: "Ótimo",
    colorClass: "text-blue-500",
    bgSelectedClass: "bg-blue-500/10",
    borderSelectedClass: "border-blue-500/30",
  },
  {
    value: 5,
    emoji: "🤩",
    label: "Incrível",
    colorClass: "text-purple-500",
    bgSelectedClass: "bg-purple-500/10",
    borderSelectedClass: "border-purple-500/30",
  },
]

interface MoodSelectorProps {
  value: number | null
  onChange: (value: number) => void
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="w-full">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
        Como se sente hoje?
      </label>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {MOODS.map((mood) => {
          const isSelected = value === mood.value
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onChange(mood.value)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 outline-none ${
                isSelected
                  ? `${mood.bgSelectedClass} ${mood.borderSelectedClass} border-current ring-1 ring-white/10`
                  : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
              }`}
              style={isSelected ? { color: `var(--level-${getLevelColorVar(mood.value)})` } : undefined}
            >
              <span 
                className={`text-2xl sm:text-3xl mb-1 transition-transform duration-200 ${
                  isSelected ? "scale-110 drop-shadow" : "opacity-75 hover:opacity-100"
                }`}
              >
                {mood.emoji}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate max-w-full">
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function getLevelColorVar(value: number): string {
  if (value === 1) return "bronze"
  if (value === 2) return "silver"
  if (value === 3) return "gold"
  if (value === 4) return "platinum"
  return "diamond"
}
