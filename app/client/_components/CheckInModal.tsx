// app/client/_components/CheckInModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { MoodSelector } from "@/components/ui/mood-selector"
import {
  Weight,
  Loader2,
  CheckCircle,
} from "lucide-react"

interface CheckInModalProps {
  showCheckInModal: boolean
  setShowCheckInModal: (v: boolean) => void
  checkInWeight: string
  setCheckInWeight: (v: string) => void
  checkInNotes: string
  setCheckInNotes: (v: string) => void
  checkInMood: number | null
  setCheckInMood: (v: number | null) => void
  checkInEnergy: number
  setCheckInEnergy: (v: number) => void
  isPending: boolean
  handleCheckInSubmit: (e: React.FormEvent) => void
}

export function CheckInModal({
  showCheckInModal,
  setShowCheckInModal,
  checkInWeight,
  setCheckInWeight,
  checkInNotes,
  setCheckInNotes,
  checkInMood,
  setCheckInMood,
  checkInEnergy,
  setCheckInEnergy,
  isPending,
  handleCheckInSubmit,
}: CheckInModalProps) {
  if (!showCheckInModal) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
        <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 mb-2">
          <Weight className="h-5 w-5 text-primary" /> Registar Novo Peso & Bem-Estar
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Insira o seu peso atual, o seu estado de espírito e o seu nível de energia física.</p>

        <form onSubmit={handleCheckInSubmit} className="space-y-4">
          {/* Gamificação: Mood Selector */}
          <div className="pb-1 border-b border-white/5">
            <MoodSelector value={checkInMood} onChange={setCheckInMood} />
          </div>

          {/* Gamificação: Energy Level Slider */}
          <div className="pb-1 border-b border-white/5">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Nível de Energia
              </label>
              <span className="text-xs font-bold text-primary font-mono">{checkInEnergy}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm">😴</span>
              <input
                type="range"
                min="0"
                max="100"
                value={checkInEnergy}
                onChange={e => setCheckInEnergy(parseInt(e.target.value))}
                className="flex-1 accent-primary bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm">⚡</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Peso Corporal (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="ex: 75.5"
              value={checkInWeight}
              onChange={e => setCheckInWeight(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-2xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-200 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Notas / Como se sente?</label>
            <textarea
              placeholder="Disposição, nível de energia, qualidade do sono ou anotações adicionais..."
              rows={3}
              value={checkInNotes}
              onChange={e => setCheckInNotes(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-2xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-200 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 border-white/5 text-xs font-bold py-3 cursor-pointer" onClick={() => setShowCheckInModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary/90 hover:bg-primary/90 text-primary-foreground text-xs font-bold py-3 cursor-pointer" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
              Submeter Check-in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
