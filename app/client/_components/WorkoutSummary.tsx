// app/client/_components/WorkoutSummary.tsx
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, X, ImagePlus, Loader2, Clock, Dumbbell, ListChecks } from "lucide-react"
import type { WorkoutSummaryData } from "../_types/client.types"

interface WorkoutSummaryProps {
  summary: WorkoutSummaryData | null
  /** Nome do dia de treino, usado como título inicial sugerido. */
  defaultTitle: string
  isPending: boolean
  fmt: (s: number) => string
  onSave: (title: string, notes: string) => void
  onDiscard: () => void
}

function fmtWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

export function WorkoutSummary({ summary, defaultTitle, isPending, fmt, onSave, onDiscard }: WorkoutSummaryProps) {
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")

  // Repõe os campos sempre que um novo resumo abre.
  useEffect(() => {
    if (summary) {
      setTitle(defaultTitle)
      setNotes("")
    }
  }, [summary, defaultTitle])

  if (!summary) return null

  const requestDiscard = () => {
    if (window.confirm("Descartar este treino? As séries registadas serão perdidas.")) {
      onDiscard()
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-background overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-background/90 backdrop-blur-xl border-b border-white/5">
        <button type="button" onClick={requestDiscard} aria-label="Voltar" className="p-1.5 -ml-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-foreground">Guardar treino</span>
        <button
          type="button"
          onClick={() => onSave(title, notes)}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-xl bg-primary hover:brightness-110 disabled:opacity-50 px-4 py-1.5 text-sm font-bold text-primary-foreground transition cursor-pointer"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Salvar
        </button>
      </div>

      <div className="mx-auto w-full max-w-lg px-4 py-5 space-y-6">
        {/* Título do treino */}
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-1">💥</span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nome do treino"
            maxLength={120}
            className="flex-1 min-w-0 bg-transparent text-2xl font-black text-foreground placeholder-zinc-600 focus:outline-none"
          />
          <button type="button" onClick={requestDiscard} aria-label="Descartar" className="shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3">
          <SummaryStat icon={<Clock className="h-3.5 w-3.5" />} label="Duração" value={fmt(summary.durationSeconds)} accent />
          <SummaryStat icon={<Dumbbell className="h-3.5 w-3.5" />} label="Volume" value={`${summary.volumeKg} kg`} />
          <SummaryStat icon={<ListChecks className="h-3.5 w-3.5" />} label="Séries" value={String(summary.setsCount)} />
        </div>

        {/* When */}
        <div className="border-t border-white/5 pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Quando</span>
          <span className="text-sm font-semibold text-primary">{fmtWhen(summary.finishedAt)}</span>
        </div>

        {/* Foto/vídeo (placeholder — upload em breve) */}
        <button
          type="button"
          onClick={() => toast("Upload de foto chega em breve 📸")}
          className="w-full flex items-center gap-4 text-left cursor-pointer group"
        >
          <div className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-white/15 group-hover:border-primary/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition">
            <ImagePlus className="h-7 w-7" />
          </div>
          <span className="text-sm font-semibold text-foreground">Adicionar uma foto/vídeo</span>
        </button>

        {/* Descrição */}
        <div className="border-t border-white/5 pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Descrição</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Como correu o treino? Coloca aqui algumas notas..."
            maxLength={2000}
            rows={4}
            className="w-full resize-none bg-black/30 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition"
          />
        </div>

        {/* Descartar */}
        <button
          type="button"
          onClick={requestDiscard}
          disabled={isPending}
          className="w-full text-center text-sm font-bold text-destructive hover:text-destructive/80 disabled:opacity-50 py-2 transition cursor-pointer"
        >
          Descartar Treino
        </button>
      </div>
    </div>
  )
}

function SummaryStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-3 text-center shadow-glow-whisper">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className={`block text-base font-black tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  )
}
