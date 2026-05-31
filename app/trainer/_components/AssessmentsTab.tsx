// app/trainer/_components/AssessmentsTab.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Clipboard,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import type { Assessment } from "../_types/trainer.types"

interface AssessmentsTabProps {
  pendingAssessments: Assessment[]
  completedAssessments: Assessment[]
  completingAssessmentId: string | null
  setCompletingAssessmentId: (id: string | null) => void
  completeNotes: string
  setCompleteNotes: (v: string) => void
  isPending: boolean
  handleCompleteSubmit: (e: React.FormEvent) => void
}

export function AssessmentsTab({
  pendingAssessments,
  completedAssessments,
  completingAssessmentId,
  setCompletingAssessmentId,
  completeNotes,
  setCompleteNotes,
  isPending,
  handleCompleteSubmit,
}: AssessmentsTabProps) {
  return (
    <div className="space-y-6">

      {/* Formulário de Finalização Rápida de Avaliações */}
      {completingAssessmentId && (
        <div className="bg-primary-subtle border border-primary/30 p-6 rounded-3xl shadow-glow-whisper reveal visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Finalizar Avaliação Corporal</h3>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCompletingAssessmentId(null)}
              className="border-white/5 bg-black/40 cursor-pointer"
            >
              Cancelar
            </Button>
          </div>

          <form onSubmit={handleCompleteSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="complete-notes" className="text-xs font-bold text-foreground block">
                Resultados Físicos / Observações Clínicas
              </label>
              <textarea
                id="complete-notes"
                rows={3}
                placeholder="Ex: Peso: 82kg, Massa Gorda: 14%, recomendada maior ingestão calórica..."
                value={completeNotes}
                onChange={(e) => setCompleteNotes(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Finalizando...
                </>
              ) : (
                "Salvar & Concluir Avaliação"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Tabela de Avaliações */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Aba Pendentes */}
        <div className="rounded-3xl border border-white/5 bg-card/40 p-6 shadow-glow-whisper">
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-foreground">Avaliações Pendentes ({pendingAssessments.length})</h3>
          </div>

          <div className="space-y-3">
            {pendingAssessments.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground bg-black/20 rounded-2xl border border-white/5">
                Sem avaliações pendentes.
              </div>
            ) : (
              pendingAssessments.map((as) => (
                <div key={as.id} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-bold text-sm text-foreground block">{as.client_name}</span>
                    <span className="text-[10px] text-muted-foreground">Agendado: {new Date(as.scheduled_at).toLocaleString('pt-PT')}</span>
                    {as.notes && <p className="text-xs italic text-muted-foreground mt-2">&quot;Nota: {as.notes}&quot;</p>}
                  </div>

                  <Button
                    size="xs"
                    className="w-full bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs"
                    onClick={() => {
                      setCompletingAssessmentId(as.id)
                      setCompleteNotes(as.notes || "")
                    }}
                  >
                    Lançar Resultados e Concluir
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Aba Concluídas */}
        <div className="rounded-3xl border border-white/5 bg-card/40 p-6 shadow-glow-whisper">
          <div className="flex items-center gap-2.5 mb-4">
            <CheckCircle className="h-5 w-5 text-[#25D366]" />
            <h3 className="font-bold text-foreground">Histórico de Concluídas ({completedAssessments.length})</h3>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {completedAssessments.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground bg-black/20 rounded-2xl border border-white/5">
                Nenhuma avaliação concluída no histórico.
              </div>
            ) : (
              completedAssessments.map((as) => (
                <div key={as.id} className="p-4 bg-black/30 border border-white/5 rounded-2xl">
                  <span className="font-bold text-sm text-foreground block">{as.client_name}</span>
                  <span className="text-[10px] text-muted-foreground">Realizada em: {new Date(as.scheduled_at).toLocaleString('pt-PT')}</span>
                  {as.notes && (
                    <p className="text-xs italic text-muted-foreground mt-2 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                      &quot;{as.notes}&quot;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
