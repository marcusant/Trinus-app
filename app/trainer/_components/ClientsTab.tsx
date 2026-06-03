// app/trainer/_components/ClientsTab.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Users,
  Clipboard,
  Plus,
  Search,
  CheckCircle,
  UserCheck,
  Clock,
  ChevronRight,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react"
import type { ClientProfile, WorkoutSession, Assessment, WorkoutPlan } from "../_types/trainer.types"

interface ClientsTabProps {
  filteredClients: ClientProfile[]
  clientSearch: string
  setClientSearch: (v: string) => void
  selectedClient: ClientProfile | null
  setSelectedClient: (c: ClientProfile | null) => void
  clientSessions: WorkoutSession[]
  clientAssessments: Assessment[]
  clientPlans: WorkoutPlan[]
  isClientDetailsLoading: boolean
  onPrescriberTreino: () => void
  onAgendarAvaliacao: () => void
  onEditPlan: (plan: WorkoutPlan) => void
  onDeletePlan: (planId: string) => void
}

export function ClientsTab({
  filteredClients,
  clientSearch,
  setClientSearch,
  selectedClient,
  setSelectedClient,
  clientSessions,
  clientAssessments,
  clientPlans,
  isClientDetailsLoading,
  onPrescriberTreino,
  onAgendarAvaliacao,
  onEditPlan,
  onDeletePlan,
}: ClientsTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      {/* Hub de Alunos */}
      <div className="md:col-span-1 space-y-4">

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquise alunos por nome..."
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
          />
        </div>

        {/* Lista de Alunos */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">
              Nenhum aluno atribuído encontrado.
            </div>
          ) : (
            filteredClients.map((clientItem) => (
              <div
                key={clientItem.id}
                onClick={() => setSelectedClient(clientItem)}
                className={`flex items-center justify-between p-4 bg-card/30 border rounded-2xl cursor-pointer transition ${selectedClient?.id === clientItem.id
                    ? "border-primary bg-primary-subtle shadow-glow-whisper"
                    : "border-white/5 hover:border-white/10 hover:bg-white/5"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {(clientItem.full_name || clientItem.email || "A").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold block text-sm text-foreground">{clientItem.full_name || "Sem Nome"}</span>
                    <span className="text-[10px] text-muted-foreground">{clientItem.email}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))
          )}
        </div>

      </div>

      {/* Detalhes do Aluno Selecionado */}
      <div className="md:col-span-2">
        {selectedClient ? (
          <div className="space-y-6">

            {/* Header do Aluno */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-extrabold text-primary text-lg">
                  {(selectedClient.full_name || "A").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-xl text-foreground">{selectedClient.full_name || "Sem Nome"}</h3>
                  <span className="text-xs text-muted-foreground">Registado em: {new Date(selectedClient.created_at).toLocaleDateString('pt-PT')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-white/5 bg-black/40 hover:bg-white/5 text-xs font-semibold cursor-pointer"
                >
                  <Link href={`/trainer/anamnese/${selectedClient.id}`}>
                    <FileText className="h-3.5 w-3.5 mr-1 text-primary" />
                    Anamnese
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/5 bg-black/40 hover:bg-white/5 text-xs font-semibold cursor-pointer"
                  onClick={onPrescriberTreino}
                >
                  <Plus className="h-3.5 w-3.5 mr-1 text-pillar-essence" />
                  Prescrever Treino
                </Button>
                <Button
                  size="sm"
                  className="bg-primary/90 hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
                  onClick={onAgendarAvaliacao}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Agendar Avaliação
                </Button>
              </div>
            </div>

            {isClientDetailsLoading ? (
              <div className="py-12 flex justify-center text-muted-foreground gap-2 text-sm font-semibold">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Carregando prontuário do aluno...</span>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">

                {/* Histórico de Treinos do Aluno */}
                <div className="rounded-3xl border border-white/5 bg-card/40 p-6 shadow-glow-whisper">
                  <div className="flex items-center gap-3 mb-4">
                    <Dumbbell className="h-5 w-5 text-pillar-essence" />
                    <h4 className="font-bold text-foreground">Histórico de Treinos Concluídos</h4>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {clientSessions.length === 0 ? (
                      <div className="text-center py-8 text-xs text-muted-foreground bg-black/20 rounded-2xl border border-white/5">
                        Este aluno ainda não concluiu sessões de treino.
                      </div>
                    ) : (
                      clientSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle className="h-4 w-4 text-[#25D366]" />
                            <div>
                              <span className="font-bold block text-xs text-foreground">Treino Concluído</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(session.started_at).toLocaleDateString('pt-PT')}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-black/40 px-2 py-0.5 rounded-full">
                            <Clock className="h-3 w-3" />
                            <span>{Math.round(session.duration_seconds / 60)} min</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Planos de Treino Prescritos */}
                <div className="rounded-3xl border border-white/5 bg-card/40 p-6 shadow-glow-whisper">
                  <div className="flex items-center gap-3 mb-4">
                    <Clipboard className="h-5 w-5 text-pillar-mind" />
                    <h4 className="font-bold text-foreground">Planos de Treino Prescritos</h4>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {clientPlans.length === 0 ? (
                      <div className="text-center py-8 text-xs text-muted-foreground bg-black/20 rounded-2xl border border-white/5">
                        Não há planos de treino prescritos para este aluno.
                      </div>
                    ) : (
                      clientPlans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => onEditPlan(plan)}
                          className="group flex items-center justify-between p-3 bg-black/30 border border-white/5 hover:border-primary/40 rounded-xl transition cursor-pointer select-none"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <span className="font-bold block text-xs text-foreground truncate group-hover:text-primary transition">{plan.name}</span>
                            <span className="text-[10px] text-muted-foreground block">Início: {new Date(plan.start_date).toLocaleDateString('pt-PT')}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${plan.status === 'active' ? 'text-pillar-mind bg-pillar-mind/10' : 'text-zinc-500 bg-zinc-500/10'
                              }`}>
                              {plan.status === 'active' ? 'Ativo' : 'Rascunho'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeletePlan(plan.id)
                              }}
                              className="p-1 rounded-lg text-zinc-500 hover:text-destructive hover:bg-destructive/10 transition opacity-0 group-hover:opacity-100"
                              title="Excluir Plano"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))

                    )}
                  </div>
                </div>

                {/* Avaliações Corporais do Aluno */}
                <div className="md:col-span-2 rounded-3xl border border-white/5 bg-card/40 p-6 shadow-glow-whisper">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-pillar-mind" />
                    <h4 className="font-bold text-foreground">Avaliações Corporais e Anamneses</h4>
                  </div>

                  <div className="space-y-2">
                    {clientAssessments.length === 0 ? (
                      <div className="text-center py-8 text-xs text-muted-foreground bg-black/20 rounded-2xl border border-white/5">
                        Nenhuma avaliação agendada para este aluno.
                      </div>
                    ) : (
                      clientAssessments.map((as) => (
                        <div key={as.id} className="p-4 bg-black/30 border border-white/5 rounded-2xl">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="font-bold text-xs text-foreground">
                              Avaliação Corporal — {new Date(as.scheduled_at).toLocaleDateString('pt-PT')}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${as.status === 'done' ? 'text-[#25D366] bg-[#25D366]/10' : 'text-amber-500 bg-amber-500/10'
                              }`}>
                              {as.status === 'done' ? 'Concluída' : 'Pendente'}
                            </span>
                          </div>
                          {as.notes ? (
                            <p className="text-xs text-muted-foreground leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5">
                              &quot;{as.notes}&quot;
                            </p>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">Sem observações inseridas.</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-card/20 rounded-3xl border border-white/5">
            <UserCheck className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
            <p className="text-xs font-semibold">Selecione um aluno no Hub lateral para ver seu prontuário completo.</p>
          </div>
        )}
      </div>

    </div>
  )
}
