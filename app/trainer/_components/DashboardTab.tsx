// app/trainer/_components/DashboardTab.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Users,
  Clipboard,
  Dumbbell,
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react"
import type { ClientProfile, Assessment } from "../_types/trainer.types"

interface DashboardTabProps {
  clients: ClientProfile[]
  pendingAssessments: Assessment[]
  trainerPlansCount: number
  isPending: boolean
  onViewClient: (client: ClientProfile) => void
  onCompleteAssessment: (id: string, notes: string) => void
  onNavigateToClients: () => void
}

export function DashboardTab({
  clients,
  pendingAssessments,
  trainerPlansCount,
  onViewClient,
  onCompleteAssessment,
  onNavigateToClients,
}: DashboardTabProps) {
  return (
    <div className="space-y-6">

      {/* Bento Grid de KPIs */}
      <section className="grid gap-4 sm:grid-cols-3">

        {/* Alunos Ativos Card */}
        <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm shadow-glow-whisper border-l-pillar-mind border-l-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Alunos Vinculados</span>
            <Users className="h-5 w-5 text-pillar-mind" />
          </div>
          <span className="text-4xl font-black text-foreground">{clients.length}</span>
          <div className="text-[10px] text-muted-foreground mt-2">
            Mapeados via `trainer_clients`
          </div>
        </div>

        {/* Avaliações Pendentes Card */}
        <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm shadow-glow-whisper border-l-pillar-body border-l-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Avaliações Pendentes</span>
            <Clipboard className="h-5 w-5 text-pillar-body" />
          </div>
          <span className="text-4xl font-black text-foreground">{pendingAssessments.length}</span>
          <div className="text-[10px] text-muted-foreground mt-2">
            Bioimpedância e anamnese agendada
          </div>
        </div>

        {/* Planos Prescritos Card */}
        <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm shadow-glow-whisper border-l-pillar-essence border-l-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Planos Ativos Prescritos</span>
            <Dumbbell className="h-5 w-5 text-pillar-essence" />
          </div>
          <span className="text-4xl font-black text-foreground">{trainerPlansCount}</span>
          <div className="text-[10px] text-muted-foreground mt-2">
            Prescritos na tabela `workout_plans`
          </div>
        </div>

      </section>

      {/* Feed e Próximos Eventos */}
      <section className="grid gap-6 md:grid-cols-3">

        {/* Próximas Avaliações Físicas */}
        <div className="md:col-span-2 rounded-3xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-pillar-mind" />
            <h2 className="text-xl font-bold text-foreground">Agenda de Avaliações (Pendentes)</h2>
          </div>

          <div className="space-y-3">
            {pendingAssessments.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground bg-black/20 rounded-2xl border border-white/5">
                Não existem avaliações agendadas no momento.
              </div>
            ) : (
              pendingAssessments.slice(0, 4).map((as) => (
                <div key={as.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/30 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pillar-mind/10 flex items-center justify-center font-bold text-pillar-mind text-xs">
                      {(as.client_name || "A").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold block text-sm text-foreground">{as.client_name}</span>
                      <span className="text-[11px] text-muted-foreground">Agendado em: {new Date(as.scheduled_at).toLocaleString('pt-PT')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-white/5 bg-card hover:bg-white/5 text-[11px] font-semibold cursor-pointer"
                      onClick={() => {
                        const client = clients.find(c => c.id === as.client_id)
                        if (client) onViewClient(client)
                      }}
                    >
                      Ver Aluno
                    </Button>
                    <Button
                      size="xs"
                      className="bg-primary/90 hover:bg-primary/90 text-primary-foreground text-[11px] font-bold cursor-pointer"
                      onClick={() => onCompleteAssessment(as.id, as.notes || "")}
                    >
                      Finalizar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notificações e Dicas de Coaching */}
        <div className="rounded-3xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-pillar-body" />
              <h2 className="text-xl font-bold text-foreground">Alertas Rápidos</h2>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="font-bold text-foreground block mb-1">Dica de Prescrição:</span>
                Tire proveito da nossa biblioteca integrada. Temos mais de **240 exercícios** cadastrados e prontos para serem atribuídos nos treinos de alunos.
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="font-bold text-foreground block mb-1">Métricas Saudáveis:</span>
                A base de dados do Supabase está respondendo perfeitamente, sincronizando treinos de forma assíncrona.
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/5 text-xs text-foreground bg-black/40 hover:bg-white/5 cursor-pointer mt-4"
            onClick={onNavigateToClients}
          >
            Gerir Alunos Ativos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

      </section>

    </div>
  )
}
