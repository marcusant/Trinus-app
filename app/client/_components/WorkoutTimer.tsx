// app/client/_components/WorkoutTimer.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Timer, Check, Loader2 } from "lucide-react"
import { TimerMenu } from "./TimerMenu"

interface WorkoutTimerProps {
  isTimerRunning: boolean
  timerSeconds: number
  isPending: boolean
  fmt: (s: number) => string
  handleFinishWorkout: () => void
  startRest: (seconds?: number | null) => void
}

/**
 * Barra fixa no topo durante o treino (estilo Hevy): tempo a decorrer à
 * esquerda; botão de relógio (inicia descanso) e botão "Concluir" à direita.
 * Substitui o antigo card flutuante.
 */
export function WorkoutTimer({
  isTimerRunning,
  timerSeconds,
  isPending,
  fmt,
  handleFinishWorkout,
  startRest,
}: WorkoutTimerProps) {
  if (!isTimerRunning) return null

  return (
    <div className="sticky top-0 z-50 border-b border-primary/20 bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5 xl:px-8">
        {/* Tempo a decorrer */}
        <div className="flex min-w-0 items-center gap-2">
          <Timer className="h-4 w-4 shrink-0 animate-pulse text-primary" />
          <span className="text-lg font-black leading-none tabular-nums text-foreground">{fmt(timerSeconds)}</span>
        </div>

        {/* Ações: relógio (temporizador + cronómetro) + Concluir */}
        <div className="flex shrink-0 items-center gap-2">
          <TimerMenu startRest={startRest} />
          <Button
            size="sm"
            onClick={handleFinishWorkout}
            disabled={isPending}
            className="cursor-pointer bg-primary px-4 text-xs font-bold text-primary-foreground hover:brightness-110"
          >
            {isPending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Check className="mr-1 h-3.5 w-3.5" />}
            Concluir
          </Button>
        </div>
      </div>
    </div>
  )
}
