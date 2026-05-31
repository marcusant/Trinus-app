// app/client/_components/DashboardTab.tsx
"use client"

import { Button } from "@/components/ui/button"
import { XPBar } from "@/components/ui/xp-bar"
import { StreakCard } from "@/components/ui/streak-card"
import {
  Dumbbell,
  Sparkles,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  FileText,
  Flame,
  Target,
  Activity,
  Weight,
  Apple,
} from "lucide-react"
import { AnamneseProgressivaWidget } from "./AnamneseProgressivaWidget"
import type {
  WorkoutPlan,
  WorkoutDay,
  Assessment,
  LevelInfo,
} from "../_types/client.types"

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

interface DashboardTabProps {
  // XP / Gamification
  xp: number
  userLevel: LevelInfo & { nextLevelXP: number }
  currentStreak: number
  bestStreak: number

  // Onboarding / Anamnese Progressiva
  hasOnboarding: boolean
  progressiveProgress: number
  progressiveLogs: Record<string, unknown>[]
  totalQuestions: number
  nextProgressiveQuestion: {
    key: string
    label: string
    question: string
    placeholder?: string
    type: string
    options?: string[]
  } | undefined
  questionValue: string
  setQuestionValue: (v: string) => void
  isSubmittingQuestion: boolean
  handleProgressiveSubmit: (e: React.FormEvent) => void
  onGoToOnboarding: () => void

  // Plan / Sessions
  activePlan: WorkoutPlan | null
  planDays: WorkoutDay[]
  sessions: { id: string; started_at: string; duration_seconds: number }[]
  totalMin: number

  // Habits
  habits: Habit[]
  completedHabits: number
  habitPct: number
  toggleHabit: (id: string, force?: boolean) => void

  // Weekly tracker
  weekDays: WeekDay[]
  weekCompleted: number

  // Assessments
  pendingAssessments: Assessment[]
  doneAssessments: Assessment[]

  // Navigation
  setActiveTab: (tab: "dashboard" | "treino" | "alimentacao" | "progresso" | "perfil") => void
  setSelectedDayId: (id: string | null) => void
  setShowCheckInModal: (v: boolean) => void
}

export function DashboardTab({
  xp,
  userLevel,
  currentStreak,
  bestStreak,
  hasOnboarding,
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
  sessions,
  totalMin,
  habits,
  completedHabits,
  habitPct,
  toggleHabit,
  weekDays,
  weekCompleted,
  pendingAssessments,
  doneAssessments,
  setActiveTab,
  setSelectedDayId,
  setShowCheckInModal,
}: DashboardTabProps) {
  const streak = currentStreak

  return (
    <div className="space-y-6">

      {/* Gamificação: Barra de XP */}
      <XPBar
        currentXP={xp}
        levelName={userLevel.name}
        levelIcon={userLevel.icon}
        levelColor={userLevel.color}
        minXP={userLevel.minXP}
        nextLevelXP={userLevel.nextLevelXP}
      />

      {/* Anamnese Progressiva / Onboarding Banner */}
      <AnamneseProgressivaWidget
        hasOnboarding={hasOnboarding}
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

      {/* Premium Quick Actions Widget */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md shadow-glow-whisper">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-3">Ações Rápidas do Aluno</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Iniciar Treino */}
          {activePlan && planDays.length > 0 ? (
            <button
              onClick={() => {
                setActiveTab("treino");
                if (planDays[0]) setSelectedDayId(planDays[0].id);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/50 transition cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-bold text-foreground">Iniciar Treino</span>
              <span className="text-[9px] text-muted-foreground mt-0.5">Treino de Hoje</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("treino")}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-bold text-foreground">Meus Treinos</span>
              <span className="text-[9px] text-muted-foreground mt-0.5">Sem plano ativo</span>
            </button>
          )}

          {/* Action 2: Registar Peso */}
          <button
            onClick={() => setShowCheckInModal(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/50 transition cursor-pointer text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <Weight className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-foreground">Registar Peso</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Check-in diário</span>
          </button>

          {/* Action 3: Ver Dieta */}
          <button
            onClick={() => setActiveTab("alimentacao")}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/50 transition cursor-pointer text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <Apple className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-foreground">Ver Dieta</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Refeições de Hoje</span>
          </button>

          {/* Action 4: Progresso/Medidas */}
          <button
            onClick={() => setActiveTab("progresso")}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/50 transition cursor-pointer text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-foreground">Avaliações</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Evolução Física</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout (Desktop: 3 columns; Mobile: 1 column stack) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Column 1 & 2: Main Activity Widgets (xl:col-span-2) */}
        <div className="xl:col-span-2 space-y-6">

          {/* Weekly Tracker */}
          <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md shadow-glow-whisper">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Esta Semana</h3>
                <span className="text-[11px] text-muted-foreground">{weekCompleted} de 7 dias concluídos</span>
              </div>
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
                    {d.done ? <CheckCircle className="h-4 w-4" /> : <span className="text-[10px] font-bold">{d.label}</span>}
                  </div>
                  <span className={`text-[9px] font-semibold ${d.isToday ? "text-primary" : "text-muted-foreground"}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs - 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm shadow-glow-whisper border-l-primary border-l-[3px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Treinos</span>
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{sessions.length}</span>
              <span className="text-[9px] text-muted-foreground block">{totalMin} min totais</span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm shadow-glow-whisper border-l-primary border-l-[3px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Sequência</span>
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{streak}</span>
              <span className="text-[9px] text-muted-foreground block">{streak > 0 ? "Dias seguidos 🔥" : "Inicie hoje"}</span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm shadow-glow-whisper border-l-primary border-l-[3px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Hábitos</span>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{habitPct}%</span>
              <span className="text-[9px] text-muted-foreground block">{completedHabits}/{habits.length} hoje</span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm shadow-glow-whisper border-l-primary border-l-[3px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Avaliações</span>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{pendingAssessments.length}</span>
              <span className="text-[9px] text-muted-foreground block">pendentes</span>
            </div>
          </div>

          {/* Active plan shortcut */}
          {activePlan && (
            <button onClick={() => setActiveTab("treino")} className="w-full text-left rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm shadow-glow-whisper hover:border-primary/30 transition cursor-pointer block">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground block">{activePlan.name}</span>
                    <span className="text-[10px] text-muted-foreground">{planDays.length} dias de treino · Plano ativo</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          )}

          {/* Motivational quote */}
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs italic text-muted-foreground leading-relaxed">
                &quot;A disciplina é o maior ato de amor-próprio que podes praticar. Transforma o esforço em hábito.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: Habits & Side Cards (lg:col-span-1) */}
        <div className="space-y-6">
          {/* Gamificação: Streak Card */}
          <StreakCard currentStreak={currentStreak} bestStreak={bestStreak} />

          {/* Habits today checklist */}
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm shadow-glow-whisper">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-foreground">Hábitos de Hoje</span>
              <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">{habitPct}%</span>
            </div>
            <div className="space-y-2">
              {habits.map(h => (
                <div key={h.id} onClick={() => toggleHabit(h.id)} className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${h.done ? "bg-primary/5 border border-primary/20" : "bg-black/30 border border-white/5 hover:bg-white/5"}`}>
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

          {/* Physical Assessments Preview Card */}
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm shadow-glow-whisper">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-foreground">Última Avaliação</span>
              <button onClick={() => setActiveTab("progresso")} className="text-[10px] text-primary hover:underline font-bold">Ver Todas</button>
            </div>
            {doneAssessments.length > 0 ? (
              <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[10px] text-foreground">{new Date(doneAssessments[0].scheduled_at).toLocaleDateString('pt-PT')}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase text-[#25D366] bg-[#25D366]/10">Concluída</span>
                </div>
                {doneAssessments[0].notes && <p className="text-[10px] text-muted-foreground italic line-clamp-2">{doneAssessments[0].notes}</p>}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground bg-black/20 rounded-xl border border-white/5">
                Nenhuma avaliação concluída até o momento.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
