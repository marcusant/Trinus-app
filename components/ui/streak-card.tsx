"use client"

import { Flame } from "lucide-react"

interface StreakCardProps {
  currentStreak: number
  bestStreak: number
}

function getFlameColorVar(streak: number): string {
  if (streak >= 14) return "var(--color-flame-max)"
  if (streak >= 7)  return "var(--color-flame-hot)"
  if (streak >= 3)  return "var(--color-flame-warm)"
  if (streak > 0)   return "var(--color-flame-low)"
  return "var(--color-flame-cold)"
}

export function StreakCard({ currentStreak, bestStreak }: StreakCardProps) {
  const shouldAnimate = currentStreak >= 7

  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm shadow-glow-whisper">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame
            className={`h-5 w-5 ${shouldAnimate ? "animate-flame" : ""}`}
            style={{ color: getFlameColorVar(currentStreak) }}
          />
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Sequência
          </span>
        </div>
        {bestStreak > 0 && (
          <span className="text-[9px] text-muted-foreground bg-black/40 px-2 py-0.5 rounded-full">
            Melhor: {bestStreak} dias
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-foreground tabular-nums">
          {currentStreak}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {currentStreak === 1 ? "dia" : "dias"}
        </span>
      </div>

      <p className="text-[9px] text-muted-foreground mt-1">
        {currentStreak === 0
          ? "Inicie hoje a sua sequência"
          : currentStreak >= 14
            ? "Foco imparável! 🔥"
            : currentStreak >= 7
              ? "Uma semana de consistência!"
              : "Continue assim 💪"}
      </p>
    </div>
  )
}
