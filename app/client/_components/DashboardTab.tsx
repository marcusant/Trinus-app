// app/client/_components/DashboardTab.tsx
"use client"

import { XPBar } from "@/components/ui/xp-bar"
import {
  Dumbbell,
  CheckCircle,
  ChevronRight,
  FileText,
  Flame,
  Weight,
  Play,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { AnamneseProgressivaWidget } from "./AnamneseProgressivaWidget"
import type { WorkoutPlan, WorkoutDay, LevelInfo } from "../_types/client.types"

interface WeekDay {
  label: string
  date: string
  done: boolean
  isToday: boolean
}

interface Habit {
  id: string
  label: string
  done: boolean
  icon: string
}

interface ProgressiveQuestion {
  key: string
  label: string
  question: string
  placeholder?: string
  type: string
  options?: string[]
}

interface DashboardTabProps {
  // XP / Gamification (slim)
  xp: number
  userLevel: LevelInfo & { nextLevelXP: number }
  currentStreak: number

  // Setup slot (onboarding / anamnese / pergunta progressiva)
  hasOnboarding: boolean
  hasAnamnese: boolean
  progressiveProgress: number
  progressiveLogs: Record<string, unknown>[]
  totalQuestions: number
  nextProgressiveQuestion: ProgressiveQuestion | undefined
  questionValue: string
  setQuestionValue: (v: string) => void
  isSubmittingQuestion: boolean
  handleProgressiveSubmit: (e: React.FormEvent) => void
  onGoToOnboarding: () => void

  // Treino de Hoje
  activePlan: WorkoutPlan | null
  planDays: WorkoutDay[]

  // Hábitos
  habits: Habit[]
  completedHabits: number
  habitPct: number
  toggleHabit: (id: string, force?: boolean) => void

  // Esta Semana
  weekDays: WeekDay[]
  weekCompleted: number

  // Navigation / actions
  setActiveTab: (tab: "dashboard" | "treino" | "alimentacao" | "progresso" | "perfil") => void
  setSelectedDayId: (id: string | null) => void
  setShowCheckInModal: (v: boolean) => void
}

export function DashboardTab({
  xp,
  userLevel,
  currentStreak,
  hasOnboarding,
  hasAnamnese,
  progressiveProgress,
  progressiveLogs,
  totalQuestions,
  nextProgressiveQuestion,
  questionValue,
  setQuestionValue,
  isSubmittingQuestion,
  handleProgressiveSubmit,
  onGoToOnboarding,
  activePlan,
  planDays,
  habits,
  completedHabits,
  habitPct,
  toggleHabit,
  weekDays,
  weekCompleted,
  setActiveTab,
  setSelectedDayId,
  setShowCheckInModal,
}: DashboardTabProps) {
  // ── Slot único de setup (prioridade: onboarding → anamnese → pergunta progressiva) ──
  const setupSlot = (() => {
    if (!hasOnboarding) {
      return (
        <AnamneseProgressivaWidget
          hasOnboarding={false}
          progressiveProgress={progressiveProgress}
          progressiveLogs={progressiveLogs}
          totalQuestions={totalQuestions}
          nextProgressiveQuestion={nextProgressiveQuestion}
          questionValue={questionValue}
          setQuestionValue={setQuestionValue}
          isSubmittingQuestion={isSubmittingQuestion}
          handleProgressiveSubmit={handleProgressiveSubmit}
          onGoToOnboarding={onGoToOnboarding}
        />
      )
    }
    if (!hasAnamnese) {
      return (
        <Link
          href="/client/anamnese"
          className="block rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background/40 to-primary/5 p-5 backdrop-blur-md shadow-glow-whisper hover:border-primary/40 transition group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-foreground">Anamnese Completa</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Responde à avaliação detalhada (saúde, medidas, alimentação e treino) para um plano à tua medida.
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-primary shrink-0" />
          </div>
        </Link>
      )
    }
    if (nextProgressiveQuestion) {
      return (
        <AnamneseProgressivaWidget
          hasOnboarding={true}
          progressiveProgress={progressiveProgress}
          progressiveLogs={progressiveLogs}
          totalQuestions={totalQuestions}
          nextProgressiveQuestion={nextProgressiveQuestion}
          questionValue={questionValue}
          setQuestionValue={setQuestionValue}
          isSubmittingQuestion={isSubmittingQuestion}
          handleProgressiveSubmit={handleProgressiveSubmit}
          onGoToOnboarding={onGoToOnboarding}
        />
      )
    }
    return null
  })()

  const todayDay = planDays[0] ?? null
  const startToday = () => {
    setActiveTab("treino")
    if (todayDay) setSelectedDayId(todayDay.id)
  }

  return (
    <div className="space-y-6">

      {/* 1. Header slim — Barra de XP fina (sem tabela de patentes; vive no Perfil) */}
      <XPBar
        currentXP={xp}
        levelName={userLevel.name}
        levelIcon={userLevel.icon}
        levelColor={userLevel.color}
        minXP={userLevel.minXP}
        nextLevelXP={userLevel.nextLevelXP}
        showLevels={false}
      />

      {/* 2. Slot único de setup (condicional, 1 de cada vez) */}
      {setupSlot}

      {/* 3. 🏋️ Treino de Hoje (card herói) */}
      {activePlan && todayDay ? (
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card/50 to-primary/5 p-6 backdrop-blur-md shadow-glow relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <Dumbbell className="h-7 w-7 text-primary" />
              </div>
              <div className="min-w-0 space-y-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Treino de Hoje</span>
                <h2 className="text-lg sm:text-xl font-black text-foreground truncate">
                  {todayDay.name || activePlan.name}
                </h2>
                <span className="text-xs text-muted-foreground block">
                  {todayDay.focus ? `${todayDay.focus} · ` : ""}{activePlan.name} · {planDays.length} {planDays.length === 1 ? "dia" : "dias"}
                </span>
              </div>
            </div>
            <button
              onClick={startToday}
              className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-glow hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              Iniciar Treino
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setActiveTab("treino")}
          className="w-full text-left rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper hover:border-primary/30 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <Dumbbell className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Treino de Hoje</span>
                <h2 className="text-base font-black text-foreground">Sem plano ativo</h2>
                <span className="text-xs text-muted-foreground block mt-0.5">O teu treinador ainda não prescreveu um plano.</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
          </div>
        </button>
      )}

      {/* 4. Hoje — Check-in rápido + Hábitos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Check-in rápido */}
        <button
          onClick={() => setShowCheckInModal(true)}
          className="text-left rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md shadow-glow-whisper hover:border-primary/30 transition group cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Weight className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm text-foreground block">Check-in de Hoje</span>
            <span className="text-xs text-muted-foreground block">Regista peso, humor e energia</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
        </button>

        {/* Hábitos de Hoje */}
        <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md shadow-glow-whisper">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm text-foreground">Hábitos de Hoje</span>
            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">{completedHabits}/{habits.length} · {habitPct}%</span>
          </div>
          <div className="space-y-2">
            {habits.map(h => (
              <div key={h.id} onClick={() => toggleHabit(h.id)} className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${h.done ? "bg-primary/5 border border-primary/20" : "bg-black/30 border border-white/5 hover:bg-white/5"}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{h.icon}</span>
                  <span className={`text-xs font-medium ${h.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{h.label}</span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${h.done ? "bg-primary border-primary" : "border-zinc-600"}`}>
                  {h.done && <CheckCircle className="h-3 w-3 text-background" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. 🔥 Esta Semana — tracker 7 dias + streak inline */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md shadow-glow-whisper">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-foreground">Esta Semana</h3>
            <span className="text-xs text-muted-foreground">{weekCompleted} de 7 dias concluídos</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Flame className="h-4 w-4" />
            {currentStreak} {currentStreak === 1 ? "dia" : "dias"} de sequência
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center transition-all ${d.done
                ? "bg-primary border-primary text-primary-foreground"
                : d.isToday
                  ? "border-primary/50 bg-primary/5 text-primary"
                  : "border-white/10 bg-black/30 text-zinc-600"
                }`}>
                {d.done ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs font-bold">{d.label}</span>}
              </div>
              <span className={`text-[11px] font-semibold ${d.isToday ? "text-primary" : "text-muted-foreground"}`}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. → Ver progresso completo (link discreto) */}
      <button
        onClick={() => setActiveTab("progresso")}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-2 cursor-pointer"
      >
        Ver progresso completo
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
