// app/client/_components/WorkoutTimer.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Timer, Square, Loader2 } from "lucide-react"

interface WorkoutTimerProps {
  isTimerRunning: boolean
  timerSeconds: number
  isPending: boolean
  fmt: (s: number) => string
  handleFinishWorkout: () => void
}

export function WorkoutTimer({
  isTimerRunning,
  timerSeconds,
  isPending,
  fmt,
  handleFinishWorkout,
}: WorkoutTimerProps) {
  if (!isTimerRunning) return null

  return (
    <div className="fixed bottom-24 xl:bottom-6 right-4 xl:right-6 z-50 bg-card/95 border border-primary/30 rounded-2xl p-4 backdrop-blur-xl shadow-glow-whisper">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Treino em Curso</span>
      </div>
      <span className="text-2xl font-black text-foreground tabular-nums block mb-2">{fmt(timerSeconds)}</span>
      <Button size="sm" className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold cursor-pointer" onClick={handleFinishWorkout} disabled={isPending}>
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Square className="h-3 w-3 mr-1" />}
        Concluir treino
      </Button>
    </div>
  )
}
