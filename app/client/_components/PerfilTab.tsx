// app/client/_components/PerfilTab.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XP_LEVELS } from "@/components/ui/xp-bar"
import { Award } from "lucide-react"
import {
  Dumbbell,
  Sparkles,
  Flame,
  Target,
  Activity,
  Mail,
  CalendarDays,
  Shield,
  User,
  FileText,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
import type { UserProfile, LevelInfo } from "../_types/client.types"

interface PerfilTabProps {
  userName: string
  profile: UserProfile | null
  userLevel: LevelInfo & { nextLevelXP: number }
  xp: number
  currentStreak: number
  sessions: { id: string }[]
  trainerName: string | null
  hasOnboarding: boolean
  hasAnamnese: boolean
  onGoToOnboarding: () => void
}

export function PerfilTab({
  userName,
  profile,
  userLevel,
  xp,
  currentStreak,
  sessions,
  trainerName,
  hasOnboarding,
  hasAnamnese,
  onGoToOnboarding,
}: PerfilTabProps) {
  const streak = currentStreak

  const infoItems = [
    { icon: <Mail className="h-4 w-4 text-primary" />, label: "E-mail", value: profile?.email || "—" },
    { icon: <Shield className="h-4 w-4 text-primary" />, label: "Papel", value: "Aluno (Client)" },
    { icon: <CalendarDays className="h-4 w-4 text-primary" />, label: "Membro desde", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-PT') : "—" },
    ...(profile?.metadata ? [
      { icon: <Target className="h-4 w-4 text-primary" />, label: "Objetivo Principal", value: (profile.metadata as Record<string, string>).objetivo || "—" },
      { icon: <Activity className="h-4 w-4 text-primary" />, label: "Nível de Experiência", value: (profile.metadata as Record<string, string>).nivel || "—" },
      { icon: <Dumbbell className="h-4 w-4 text-primary" />, label: "Local de Treino", value: (profile.metadata as Record<string, string>).local_treino || "—" },
    ] : []),
  ]

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-2xl mx-auto mb-4 border-2 border-primary/20 shadow-glow">
          {(userName || "A").substring(0, 2).toUpperCase()}
        </div>
        <h2 className="text-xl font-black text-foreground">{userName}</h2>
        <div className="mt-1 flex items-center justify-center gap-1.5 font-bold text-xs select-none">
          <span>{userLevel.icon}</span>
          <span style={{ color: userLevel.color }}>{userLevel.name}</span>
          <span className="text-muted-foreground font-normal">({xp} XP)</span>
        </div>
        <span className="text-xs text-muted-foreground mt-0.5 block">{profile?.email || ""}</span>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[9px] px-3 py-1 rounded-full font-bold uppercase bg-primary/10 text-primary border border-primary/20">Aluno</span>
          {trainerName && <span className="text-[9px] px-3 py-1 rounded-full bg-pillar-mind/10 text-pillar-mind font-semibold border border-pillar-mind/20">Treinador: {trainerName}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/5 bg-card/30 p-4 text-center">
          <Dumbbell className="h-5 w-5 mx-auto text-primary mb-1" />
          <span className="text-lg font-black text-foreground block">{sessions.length}</span>
          <span className="text-[9px] text-muted-foreground">Treinos</span>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card/30 p-4 text-center">
          <Flame className="h-5 w-5 mx-auto text-primary mb-1" />
          <span className="text-lg font-black text-foreground block">{streak}</span>
          <span className="text-[9px] text-muted-foreground">Sequência</span>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card/30 p-4 text-center">
          <Award className="h-5 w-5 mx-auto text-primary mb-1" />
          <span className="text-lg font-black text-foreground block">{xp}</span>
          <span className="text-[9px] text-muted-foreground">XP Total</span>
        </div>
      </div>

      {/* Progressão & Patentes (relocada da barra de XP do dashboard) */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md shadow-glow-whisper">
        <div className="flex items-center gap-1.5 mb-3">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">Tabela de Patentes & Progressão</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {XP_LEVELS.map((lvl) => {
            const isCurrent = userLevel.name === lvl.name
            return (
              <div
                key={lvl.name}
                className={`p-3 rounded-xl border flex flex-row sm:flex-col items-center justify-between sm:justify-center text-center gap-2 transition duration-300 ${
                  isCurrent
                    ? "bg-primary/10 border-primary/30 text-white shadow-glow-whisper"
                    : "bg-black/30 border-white/5 text-zinc-400"
                }`}
              >
                <div className="flex items-center sm:flex-col gap-1.5">
                  <span className="text-lg">{lvl.icon}</span>
                  <span className={`text-xs font-bold ${isCurrent ? "text-primary" : "text-white"}`}>{lvl.name}</span>
                </div>
                <span className="text-[11px] font-bold opacity-80 tabular-nums">{lvl.xp}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info list */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-1 backdrop-blur-md shadow-glow-whisper">
        {infoItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
            {item.icon}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-muted-foreground block">{item.label}</span>
              <span className="text-xs text-foreground font-medium truncate block">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Anamnese Completa — entrada de menu com estado */}
      <Link
        href="/client/anamnese"
        className="flex items-center justify-between rounded-2xl border border-white/5 bg-card/40 px-4 py-3.5 backdrop-blur-md shadow-glow-whisper hover:border-primary/30 transition group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block">Anamnese Completa</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              {hasAnamnese ? (
                <><CheckCircle className="h-3 w-3 text-primary" /> Preenchida · toca para editar</>
              ) : (
                "Avaliação detalhada pendente"
              )}
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </Link>

      {/* If no onboarding completed, show Complete Profile CTA */}
      {!hasOnboarding && (
        <Button
          onClick={onGoToOnboarding}
          className="w-full bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs py-3.5 rounded-xl shadow-glow transition-all"
        >
          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
          Completar Perfil / Onboarding
        </Button>
      )}
    </div>
  )
}
