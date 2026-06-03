// app/client/_components/ProgressoTab.tsx
"use client"

import { Button } from "@/components/ui/button"
import { TimelineAchievements } from "@/components/ui/timeline-achievements"
import {
  Calendar,
  NotebookPen,
  CheckCircle,
  Plus,
  Weight,
  Dumbbell,
  Flame,
  Award,
  FileText,
  Clock,
} from "lucide-react"
import type { WorkoutSession, Assessment, CheckIn } from "../_types/client.types"

interface ProgressoTabProps {
  sessions: WorkoutSession[]
  checkIns: CheckIn[]
  assessments: Assessment[]
  memberSince: string
  xp: number
  totalMin: number
  currentStreak: number
  isPending: boolean
  setShowCheckInModal: (v: boolean) => void
}

export function ProgressoTab({
  sessions,
  checkIns,
  assessments,
  memberSince,
  xp,
  totalMin,
  currentStreak,
  isPending,
  setShowCheckInModal,
}: ProgressoTabProps) {
  void isPending
  const pendingCount = assessments.filter(a => a.status !== "done").length

  const kpis = [
    { icon: <Dumbbell className="h-4 w-4 text-primary" />, label: "Treinos", value: sessions.length, sub: `${totalMin} min totais` },
    { icon: <Flame className="h-4 w-4 text-primary" />, label: "Sequência", value: currentStreak, sub: currentStreak > 0 ? "Dias seguidos 🔥" : "Inicie hoje" },
    { icon: <Award className="h-4 w-4 text-primary" />, label: "XP Total", value: xp, sub: "Pontos acumulados" },
    { icon: <FileText className="h-4 w-4 text-primary" />, label: "Avaliações", value: pendingCount, sub: "Pendentes" },
  ]

  return (
    <div className="space-y-4">
      {/* KPIs — métricas de evolução (relocadas do dashboard) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm shadow-glow-whisper border-l-primary border-l-[3px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{kpi.label}</span>
              {kpi.icon}
            </div>
            <span className="text-2xl font-black text-foreground tabular-nums">{kpi.value}</span>
            <span className="text-[11px] text-muted-foreground block">{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* Gamificação: Timeline de Conquistas */}
      <TimelineAchievements
        sessions={sessions}
        checkIns={checkIns}
        memberSince={memberSince}
        currentXP={xp}
      />

      {/* Histórico de Treinos (relocado da página de Treino) */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-md shadow-glow-whisper">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
          <Dumbbell className="h-4 w-4 text-primary" /> Histórico de Treinos
        </h3>
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground bg-black/20 rounded-xl border border-white/5">Sem sessões registadas.</div>
          ) : sessions.map(s => (
            <div key={s.id} className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-success" />
                <span className="text-xs text-foreground font-medium">{new Date(s.started_at).toLocaleDateString('pt-PT')}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-black/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="h-3 w-3" />{Math.round(s.duration_seconds / 60)}min
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Check-ins */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-md shadow-glow-whisper">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Weight className="h-4 w-4 text-primary" /> Peso & Check-Ins
          </h3>
          <Button size="xs" className="bg-primary/90 hover:bg-primary/90 text-primary-foreground text-[10px] font-bold cursor-pointer" onClick={() => setShowCheckInModal(true)}>
            <Plus className="h-3 w-3 mr-1" /> Novo Check-In
          </Button>
        </div>

        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {checkIns.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground bg-black/20 rounded-xl border border-white/5">Sem check-ins registados.</div>
          ) : checkIns.map(ci => (
            <div key={ci.id} className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-3.5 w-3.5 text-primary" />
                <div>
                  <span className="font-bold text-[11px] text-foreground">{new Date(ci.date).toLocaleDateString('pt-PT')}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {ci.mood && (
                      <span className="text-xs" title="Humor">
                        {ci.mood === 1 ? "😔" : ci.mood === 2 ? "😐" : ci.mood === 3 ? "🙂" : ci.mood === 4 ? "😊" : "🤩"}
                      </span>
                    )}
                    {ci.energy_level !== undefined && ci.energy_level !== null && (
                      <span className="text-[9px] text-muted-foreground bg-white/5 border border-white/5 px-1.5 py-0.2 rounded-full font-mono">
                        ⚡ {ci.energy_level}%
                      </span>
                    )}
                    {ci.notes && <span className="text-[9px] text-muted-foreground truncate max-w-[150px]">— {ci.notes}</span>}
                  </div>
                </div>
              </div>
              {ci.weight_kg && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{ci.weight_kg}kg</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Avaliações */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-md shadow-glow-whisper">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-amber-500" /> Avaliações Físicas
        </h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {assessments.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground bg-black/20 rounded-xl border border-white/5">Sem avaliações registadas.</div>
          ) : assessments.map(a => (
            <div key={a.id} className="p-3 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] text-foreground">{new Date(a.scheduled_at).toLocaleDateString('pt-PT')}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${a.status === "done" ? "text-[#25D366] bg-[#25D366]/10" : "text-amber-500 bg-amber-500/10"}`}>
                  {a.status === "done" ? "Concluída" : "Pendente"}
                </span>
              </div>
              {a.notes && <p className="text-[10px] text-muted-foreground italic">{a.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
