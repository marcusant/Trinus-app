"use client"

import { useState, useRef, useEffect, useCallback, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { logWorkoutSessionWithSets } from "@/lib/actions/client"
import { toast } from "sonner"
import type { WorkoutSession, WorkoutExercise, WorkoutSummaryData } from "../_types/client.types"
import type { useWorkoutLogger } from "./useWorkoutLogger"

interface UseWorkoutTimerParams {
  clientId: string | null
  setSessions: React.Dispatch<React.SetStateAction<WorkoutSession[]>>
  toggleHabit: (id: string, force?: boolean) => void
  dayExercises: WorkoutExercise[]
  logger: ReturnType<typeof useWorkoutLogger>
}

const MIN_DURATION_SECONDS = 5

export function useWorkoutTimer({ clientId, setSessions, toggleHabit, dayExercises, logger }: UseWorkoutTimerParams) {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [activeWorkoutDayId, setActiveWorkoutDayId] = useState<string | null>(null)
  // Instantâneo do treino concluído, à espera de "Salvar"/"Descartar" no resumo.
  const [summary, setSummary] = useState<WorkoutSummaryData | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Refs com os últimos valores, para os handlers evitarem closures obsoletas.
  const dayExercisesRef = useRef(dayExercises)
  dayExercisesRef.current = dayExercises
  const loggerRef = useRef(logger)
  loggerRef.current = logger

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds(p => p + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isTimerRunning])

  const fmt = useCallback((s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0")
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${h}:${m}:${sec}`
  }, [])

  const handleStartWorkout = useCallback((dayId: string) => {
    loggerRef.current.initLogs(dayExercisesRef.current)
    setActiveWorkoutDayId(dayId)
    setTimerSeconds(0)
    setSummary(null)
    setIsTimerRunning(true)
    toast.success("Treino iniciado! Regista as tuas séries 💪")
  }, [])

  // Para o cronómetro e abre o ecrã de resumo (sem persistir ainda).
  const handleFinishWorkout = useCallback(() => {
    if (!activeWorkoutDayId || timerSeconds < MIN_DURATION_SECONDS) {
      toast.error("O treino precisa de ter pelo menos 5 segundos.")
      return
    }
    setIsTimerRunning(false)

    // Estatísticas a partir das séries concluídas (Volume = Σ kg × reps).
    const payload = loggerRef.current.buildPayload(dayExercisesRef.current)
    let volumeKg = 0
    let setsCount = 0
    for (const ex of payload) {
      for (const s of ex.series) {
        if (!s.completed) continue
        setsCount += 1
        if (s.load_kg != null && s.reps_done != null) volumeKg += s.load_kg * s.reps_done
      }
    }

    setSummary({
      dayId: activeWorkoutDayId,
      durationSeconds: timerSeconds,
      volumeKg: Math.round(volumeKg),
      setsCount,
      finishedAt: new Date().toISOString(),
    })
  }, [activeWorkoutDayId, timerSeconds])

  const resetWorkoutState = useCallback(() => {
    loggerRef.current.resetLogs()
    setSummary(null)
    setActiveWorkoutDayId(null)
    setTimerSeconds(0)
  }, [])

  // Confirma o resumo: persiste a sessão com título/notas e atualiza o estado.
  const handleSaveWorkout = useCallback((title: string, notes: string) => {
    if (!summary) return
    const { dayId, durationSeconds } = summary
    const payload = loggerRef.current.buildPayload(dayExercisesRef.current)
    startTransition(async () => {
      try {
        const result = await logWorkoutSessionWithSets(dayId, durationSeconds, payload, { title, notes })
        if (result.success) {
          toast.success(`Treino guardado! Duração: ${fmt(durationSeconds)}`)
          if (clientId) {
            const { data: ns } = await supabase
              .from("workout_sessions")
              .select("id, started_at, finished_at, duration_seconds, workout_day_id, title, notes")
              .eq("client_id", clientId)
              .order("started_at", { ascending: false })
            setSessions(ns || [])
          }
          toggleHabit("treino", true)
          resetWorkoutState()
        } else {
          toast.error(result.error || "Erro ao registar.")
        }
      } catch {
        toast.error("Erro de rede.")
      }
    })
  }, [summary, clientId, setSessions, toggleHabit, fmt, supabase, resetWorkoutState])

  // Descarta o treino sem guardar nada.
  const handleDiscardWorkout = useCallback(() => {
    resetWorkoutState()
    toast("Treino descartado.")
  }, [resetWorkoutState])

  return {
    isPending,
    isTimerRunning,
    timerSeconds,
    activeWorkoutDayId,
    summary,
    fmt,
    handleStartWorkout,
    handleFinishWorkout,
    handleSaveWorkout,
    handleDiscardWorkout,
  }
}
