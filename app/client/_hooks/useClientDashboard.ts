// app/client/_hooks/useClientDashboard.ts
// Orquestrador: compõe os hooks focados e expõe a interface pública.
// Alterações de lógica devem ir nos hooks específicos, não aqui.
"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import { useClientData } from "./useClientData"
import { useHabits } from "./useHabits"
import { useWorkoutLogger } from "./useWorkoutLogger"
import { useWorkoutTimer } from "./useWorkoutTimer"
import { useRestTimer } from "./useRestTimer"
import { useCheckIn } from "./useCheckIn"
import { useGamification } from "./useGamification"
import { useProgressiveAnamnese } from "./useProgressiveAnamnese"

import type { TabKey } from "../_types/client.types"

// Re-exports para compatibilidade com app/client/page.tsx
export { LEVELS } from "./useGamification"
export { PROGRESSIVE_QUESTIONS } from "./useProgressiveAnamnese"

export function useClientDashboard() {
  const supabase = createClient()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")
  const [logoutLoading, setLogoutLoading] = useState(false)

  const data      = useClientData()
  const habits    = useHabits(data.clientId)
  const logger    = useWorkoutLogger()
  const timer     = useWorkoutTimer({ clientId: data.clientId, setSessions: data.setSessions, toggleHabit: habits.toggleHabit, dayExercises: data.dayExercises, logger })
  const rest      = useRestTimer()
  const checkIn   = useCheckIn({ clientId: data.clientId, setCheckIns: data.setCheckIns })
  const gami      = useGamification({ sessions: data.sessions, checkIns: data.checkIns, progressiveLogs: data.progressiveLogs, profile: data.profile })
  const anamnese  = useProgressiveAnamnese({ progressiveLogs: data.progressiveLogs, setProgressiveLogs: data.setProgressiveLogs })

  // Ao concluir o treino, encerra o descanso e abre o ecrã de resumo.
  const handleFinishWorkout = useCallback(() => {
    rest.skipRest()
    timer.handleFinishWorkout()
  }, [rest, timer])

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success("Sessão terminada.")
      setTimeout(() => { router.push("/login"); router.refresh() }, 800)
    } catch {
      toast.error("Erro ao sair.")
      setLogoutLoading(false)
    }
  }, [supabase, router])

  const pendingAssessments  = data.assessments.filter(a => a.status === "pending")
  const doneAssessments     = data.assessments.filter(a => a.status === "done")
  const totalMin            = data.sessions.reduce((acc, s) => acc + Math.round(s.duration_seconds / 60), 0)
  const hasOnboarding       = !!data.profile?.metadata && !!data.profile.metadata.objetivo

  return {
    // Identidade
    userName: data.userName,
    clientId: data.clientId,
    profile: data.profile,
    isLoading: data.isLoading,
    hasAnamnese: data.hasAnamnese,
    logoutLoading,
    isPending: timer.isPending || checkIn.isPending,
    activeTab,
    setActiveTab,

    // Dados
    trainerName: data.trainerName,
    activePlan: data.activePlan,
    planWeeks: data.planWeeks,
    planDays: data.planDays,
    dayExercises: data.dayExercises,
    previousSets: data.previousSets,
    selectedDayId: data.selectedDayId,
    setSelectedDayId: data.setSelectedDayId,
    sessions: data.sessions,
    assessments: data.assessments,
    checkIns: data.checkIns,
    progressiveLogs: data.progressiveLogs,
    questionValue: anamnese.questionValue,
    setQuestionValue: anamnese.setQuestionValue,
    isSubmittingQuestion: anamnese.isSubmittingQuestion,

    // Alimentação
    activeMealPlan: data.activeMealPlan,
    mealDays: data.mealDays,
    selectedMealDayId: data.selectedMealDayId,
    setSelectedMealDayId: data.setSelectedMealDayId,
    dayMeals: data.dayMeals,
    isMealsLoading: data.isMealsLoading,

    // Timer
    isTimerRunning: timer.isTimerRunning,
    timerSeconds: timer.timerSeconds,
    activeWorkoutDayId: timer.activeWorkoutDayId,

    // Resumo do treino (Hevy)
    workoutSummary: timer.summary,
    handleSaveWorkout: timer.handleSaveWorkout,
    handleDiscardWorkout: timer.handleDiscardWorkout,

    // Registo de séries (Hevy)
    workoutLogs: logger.logs,
    updateSet: logger.updateSet,
    toggleSet: logger.toggleSet,
    setRpe: logger.setRpe,
    addSet: logger.addSet,
    removeSet: logger.removeSet,

    // Cronómetro de descanso (Hevy)
    restIsResting: rest.isResting,
    restRemaining: rest.restRemaining,
    restTotal: rest.restTotal,
    startRest: rest.startRest,
    addRestTime: rest.addRestTime,
    skipRest: rest.skipRest,

    // Check-in
    showCheckInModal: checkIn.showCheckInModal,
    setShowCheckInModal: checkIn.setShowCheckInModal,
    checkInWeight: checkIn.checkInWeight,
    setCheckInWeight: checkIn.setCheckInWeight,
    checkInNotes: checkIn.checkInNotes,
    setCheckInNotes: checkIn.setCheckInNotes,
    checkInMood: checkIn.checkInMood,
    setCheckInMood: checkIn.setCheckInMood,
    checkInEnergy: checkIn.checkInEnergy,
    setCheckInEnergy: checkIn.setCheckInEnergy,

    // Exercícios
    isExercisesLoading: data.isExercisesLoading,

    // Hábitos
    habits: habits.habits,
    toggleHabit: habits.toggleHabit,

    // Derivados
    completedHabits: habits.completedHabits,
    habitPct: habits.habitPct,
    pendingAssessments,
    doneAssessments,
    totalMin,
    hasOnboarding,
    weekDays: gami.weekDays,
    weekCompleted: gami.weekCompleted,
    currentStreak: gami.currentStreak,
    bestStreak: gami.bestStreak,
    xp: gami.xp,
    userLevel: gami.userLevel,
    nextProgressiveQuestion: anamnese.nextProgressiveQuestion,
    progressiveProgress: anamnese.progressiveProgress,

    // Handlers
    fmt: timer.fmt,
    handleStartWorkout: timer.handleStartWorkout,
    handleFinishWorkout,
    handleCheckInSubmit: checkIn.handleCheckInSubmit,
    handleProgressiveSubmit: anamnese.handleProgressiveSubmit,
    handleLogout,
  }
}
