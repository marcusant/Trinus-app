// app/client/_components/PseSheet.tsx
"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

/** Escala PSE/RPE estilo Hevy: 6 .. 10 em passos de 0.5. */
export const RPE_SCALE = [6, 7, 7.5, 8, 8.5, 9, 9.5, 10] as const

const RPE_LABELS: Record<number, { title: string; sub: string }> = {
  6: { title: "Esforço leve", sub: "Podia ter feito mais 4+ repetições" },
  7: { title: "Esforço moderado", sub: "Podia ter feito mais 3 repetições" },
  7.5: { title: "Esforço moderado", sub: "Podia ter feito mais 2-3 repetições" },
  8: { title: "Esforço intenso", sub: "Podia ter feito mais 2 repetições" },
  8.5: { title: "Esforço muito intenso", sub: "Podia talvez ter feito mais 2 repetições" },
  9: { title: "Esforço muito intenso", sub: "Podia ter feito mais 1 repetição" },
  9.5: { title: "Quase máximo", sub: "Talvez mais 1 repetição" },
  10: { title: "Esforço máximo", sub: "Não conseguia fazer mais nenhuma" },
}

interface PseSheetProps {
  open: boolean
  /** Descrição da série a anotar, ex.: "Série 1 · 20 kg × 10 reps". */
  setLabel: string | null
  value: number | null
  onConfirm: (value: number) => void
  onClose: () => void
}

export function PseSheet({ open, setLabel, value, onConfirm, onClose }: PseSheetProps) {
  const [draft, setDraft] = useState<number | null>(value)

  // Sincroniza o rascunho sempre que a folha (re)abre para uma série.
  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  if (!open) return null

  const label = draft != null ? RPE_LABELS[draft] : null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Painel */}
      <div className="relative w-full max-w-lg mx-auto bg-card border-t border-white/10 rounded-t-3xl px-5 pt-3 pb-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />

        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-foreground">Registar PSE da série</h3>
          {setLabel && <p className="text-xs text-muted-foreground">{setLabel}</p>}
        </div>

        {/* Valor grande + descrição */}
        <div className="text-center py-6">
          <span className={`block text-6xl font-black tabular-nums transition-colors ${draft != null ? "text-foreground" : "text-zinc-600"}`}>
            {draft != null ? draft : "—"}
          </span>
          {label ? (
            <div className="mt-2 space-y-0.5">
              <p className="text-sm font-bold text-foreground">{label.title}</p>
              <p className="text-xs text-muted-foreground">{label.sub}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Selecionar RPE</p>
          )}
        </div>

        {/* Escala */}
        <div className="flex items-center gap-1 bg-black/30 border border-white/5 rounded-2xl p-1.5 overflow-x-auto">
          {RPE_SCALE.map(v => {
            const active = draft === v
            return (
              <button
                key={v}
                type="button"
                onClick={() => setDraft(v)}
                className={`flex-1 min-w-[40px] py-2.5 rounded-xl text-sm font-bold tabular-nums transition cursor-pointer ${
                  active ? "bg-primary text-primary-foreground shadow-glow-whisper" : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                {v}
              </button>
            )
          })}
        </div>

        {/* Confirmar */}
        <button
          type="button"
          disabled={draft == null}
          onClick={() => { if (draft != null) { onConfirm(draft); onClose() } }}
          className={`mt-4 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            draft != null ? "bg-success text-success-foreground hover:brightness-110" : "bg-white/10 text-muted-foreground"
          }`}
        >
          Feito <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
