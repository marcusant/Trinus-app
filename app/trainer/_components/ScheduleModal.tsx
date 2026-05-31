// app/trainer/_components/ScheduleModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { ClientProfile } from "../_types/trainer.types"

interface ScheduleModalProps {
  selectedClient: ClientProfile
  scheduleDate: string
  setScheduleDate: (v: string) => void
  scheduleNotes: string
  setScheduleNotes: (v: string) => void
  isPending: boolean
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function ScheduleModal({
  selectedClient,
  scheduleDate,
  setScheduleDate,
  scheduleNotes,
  setScheduleNotes,
  isPending,
  onSubmit,
  onClose,
}: ScheduleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[480px] bg-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-card reveal visible">
        <h3 className="text-xl font-bold text-foreground mb-1">Agendar Avaliação Corporal</h3>
        <p className="text-xs text-muted-foreground mb-6">Para o aluno: <strong className="text-primary">{selectedClient.full_name}</strong></p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="schedule-date" className="text-xs font-bold text-foreground block">
              Data e Hora da Avaliação
            </label>
            <input
              id="schedule-date"
              type="datetime-local"
              required
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="schedule-notes" className="text-xs font-bold text-foreground block">
              Instruções ou Notas Iniciais
            </label>
            <textarea
              id="schedule-notes"
              rows={3}
              placeholder="Ex: Vir em jejum, trazer roupa de treino leve..."
              value={scheduleNotes}
              onChange={(e) => setScheduleNotes(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/5 cursor-pointer text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Agendando...
                </>
              ) : (
                "Confirmar Agendamento"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
