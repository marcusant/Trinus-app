// app/client/_components/RestTimerBar.tsx
"use client"

interface RestTimerBarProps {
  isResting: boolean
  restRemaining: number
  restTotal: number
  addRestTime: (delta: number) => void
  skipRest: () => void
}

function fmtRest(s: number): string {
  const m = Math.floor(s / 60)
  const sec = (s % 60).toString().padStart(2, "0")
  return `${m.toString().padStart(2, "0")}:${sec}`
}

/**
 * Barra de descanso (contagem decrescente) ancorada ao fundo, estilo Hevy.
 * Aparece ao concluir uma série; permite -15s / +15s / saltar.
 */
export function RestTimerBar({ isResting, restRemaining, restTotal, addRestTime, skipRest }: RestTimerBarProps) {
  if (!isResting) return null

  const pct = restTotal > 0 ? Math.max(0, Math.min(100, (restRemaining / restTotal) * 100)) : 0

  return (
    <div className="fixed inset-x-0 bottom-16 xl:bottom-0 z-[55] px-4 pb-2 xl:pb-4 pointer-events-none">
      <div className="relative w-full max-w-lg mx-auto bg-card/95 border border-primary/30 rounded-2xl backdrop-blur-xl shadow-glow-whisper overflow-hidden pointer-events-auto animate-in slide-in-from-bottom duration-300">
        {/* Barra de progresso */}
        <div className="absolute top-0 left-0 h-1 bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />

        <div className="flex items-center gap-2 px-3 py-3 pt-4">
          <button
            type="button"
            onClick={() => addRestTime(-15)}
            className="shrink-0 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-foreground transition cursor-pointer"
          >
            -15
          </button>

          <div className="flex-1 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-primary">Descanso</span>
            <span className="block text-2xl font-black text-foreground tabular-nums leading-none">{fmtRest(restRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => addRestTime(15)}
            className="shrink-0 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-foreground transition cursor-pointer"
          >
            +15
          </button>

          <button
            type="button"
            onClick={skipRest}
            className="shrink-0 px-4 py-2 rounded-xl bg-primary hover:brightness-110 text-xs font-bold text-primary-foreground transition cursor-pointer"
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  )
}
