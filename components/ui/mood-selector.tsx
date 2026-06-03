"use client"

interface MoodOption {
  value: number
  emoji: string
  label: string
  colorVar: string
}

const MOODS: MoodOption[] = [
  { value: 1, emoji: "😔", label: "Difícil",  colorVar: "--color-mood-1" },
  { value: 2, emoji: "😐", label: "Neutro",   colorVar: "--color-mood-2" },
  { value: 3, emoji: "🙂", label: "Bom",      colorVar: "--color-mood-3" },
  { value: 4, emoji: "😊", label: "Ótimo",    colorVar: "--color-mood-4" },
  { value: 5, emoji: "🤩", label: "Incrível", colorVar: "--color-mood-5" },
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
          const moodColor = `var(${mood.colorVar})`
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onChange(mood.value)}
              className="flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 outline-none"
              style={
                isSelected
                  ? {
                      color: moodColor,
                      backgroundColor: `color-mix(in oklch, ${moodColor} 10%, transparent)`,
                      borderColor: `color-mix(in oklch, ${moodColor} 30%, transparent)`,
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.10)",
                    }
                  : {
                      backgroundColor: "rgba(0,0,0,0.20)",
                      borderColor: "rgba(255,255,255,0.05)",
                    }
              }
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
