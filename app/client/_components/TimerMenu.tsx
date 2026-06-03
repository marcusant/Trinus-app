// app/client/_components/TimerMenu.tsx
"use client"

import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useStopwatch } from "../_hooks/useStopwatch"
import { Clock, Hourglass, Play, Pause, RotateCcw } from "lucide-react"

interface TimerMenuProps {
  /** Inicia o temporizador de descanso (contagem decrescente). */
  startRest: (seconds?: number | null) => void
}

type Mode = "temporizador" | "cronometro"

/** Presets de descanso em segundos. */
const REST_PRESETS = [30, 60, 90, 120, 180, 300]

function fmtClock(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

function presetLabel(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s === 0 ? `${m}:00` : `${m}:${s.toString().padStart(2, "0")}`
  }
  return `0:${seconds.toString().padStart(2, "0")}`
}

/**
 * Botão de relógio na barra de treino. Ao clicar, abre um menu com:
 * - Temporizador: presets de descanso (contagem decrescente, via startRest).
 * - Cronómetro: contagem crescente com iniciar/pausar/repor.
 */
export function TimerMenu({ startRest }: TimerMenuProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("temporizador")
  const stopwatch = useStopwatch()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Temporizador e cronómetro"
          className={`relative flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2.5 transition ${
            stopwatch.isRunning
              ? "border-primary/40 bg-primary/15 text-primary"
              : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
          }`}
        >
          <Clock className="h-4 w-4" />
          {stopwatch.isRunning && (
            <span className="text-xs font-black tabular-nums leading-none">{fmtClock(stopwatch.seconds)}</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-64">
        {/* Abas */}
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          <TabButton active={mode === "temporizador"} onClick={() => setMode("temporizador")}>
            <Hourglass className="h-3.5 w-3.5" /> Temporizador
          </TabButton>
          <TabButton active={mode === "cronometro"} onClick={() => setMode("cronometro")}>
            <Clock className="h-3.5 w-3.5" /> Cronómetro
          </TabButton>
        </div>

        {mode === "temporizador" ? (
          <div className="space-y-2">
            <p className="px-0.5 text-[11px] font-semibold text-muted-foreground">Descanso (contagem regressiva)</p>
            <div className="grid grid-cols-3 gap-1.5">
              {REST_PRESETS.map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    startRest(sec)
                    setOpen(false)
                  }}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-bold tabular-nums text-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  {presetLabel(sec)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cronómetro</span>
              <span className="block text-3xl font-black leading-none tabular-nums text-foreground">{fmtClock(stopwatch.seconds)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={stopwatch.toggle}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground transition hover:brightness-110"
              >
                {stopwatch.isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {stopwatch.isRunning ? "Pausar" : "Iniciar"}
              </button>
              <button
                type="button"
                onClick={stopwatch.reset}
                aria-label="Repor cronómetro"
                disabled={stopwatch.seconds === 0 && !stopwatch.isRunning}
                className="flex h-9 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-bold transition ${
        active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
