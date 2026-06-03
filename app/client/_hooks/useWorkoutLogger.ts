"use client"

import { useState, useCallback } from "react"
import type {
  WorkoutExercise,
  WorkoutLogs,
  SetEntry,
  ExerciseLogPayload,
} from "../_types/client.types"

const DEFAULT_SETS = 3
const MAX_SETS = 20

function emptySet(): SetEntry {
  return { reps_done: "", load_kg: "", rpe: null, completed: false }
}

function plannedSetCount(ex: WorkoutExercise): number {
  const n = ex.sets ?? DEFAULT_SETS
  return Math.min(Math.max(n, 1), MAX_SETS)
}

/**
 * Estado de registo de treino estilo Hevy: o aluno introduz reps/carga reais por
 * série, inicializadas a partir da prescrição do treinador (nº de séries). Os
 * valores prescritos servem de sugestão (placeholder) na UI, não são guardados aqui.
 */
export function useWorkoutLogger() {
  const [logs, setLogs] = useState<WorkoutLogs>({})

  // Inicializa as séries vazias a partir da prescrição do dia.
  const initLogs = useCallback((exercises: WorkoutExercise[]) => {
    const next: WorkoutLogs = {}
    for (const ex of exercises) {
      next[ex.id] = Array.from({ length: plannedSetCount(ex) }, emptySet)
    }
    setLogs(next)
  }, [])

  const resetLogs = useCallback(() => setLogs({}), [])

  const updateSet = useCallback(
    (exId: string, setIdx: number, field: "reps_done" | "load_kg", value: string) => {
      // Mantém apenas dígitos (e ponto decimal na carga) — input numérico seguro.
      const sanitized = field === "load_kg"
        ? value.replace(/[^\d.]/g, "")
        : value.replace(/[^\d]/g, "")
      setLogs(prev => {
        const rows = prev[exId]
        if (!rows || !rows[setIdx]) return prev
        const nextRows = rows.map((r, i) => (i === setIdx ? { ...r, [field]: sanitized } : r))
        return { ...prev, [exId]: nextRows }
      })
    },
    []
  )

  const toggleSet = useCallback((exId: string, setIdx: number) => {
    setLogs(prev => {
      const rows = prev[exId]
      if (!rows || !rows[setIdx]) return prev
      const nextRows = rows.map((r, i) => (i === setIdx ? { ...r, completed: !r.completed } : r))
      return { ...prev, [exId]: nextRows }
    })
  }, [])

  // Regista o PSE/RPE de uma série (valor da escala fixa 6..10, ou null para limpar).
  const setRpe = useCallback((exId: string, setIdx: number, value: number | null) => {
    setLogs(prev => {
      const rows = prev[exId]
      if (!rows || !rows[setIdx]) return prev
      const nextRows = rows.map((r, i) => (i === setIdx ? { ...r, rpe: value } : r))
      return { ...prev, [exId]: nextRows }
    })
  }, [])

  const addSet = useCallback((exId: string) => {
    setLogs(prev => {
      const rows = prev[exId] ?? []
      if (rows.length >= MAX_SETS) return prev
      return { ...prev, [exId]: [...rows, emptySet()] }
    })
  }, [])

  const removeSet = useCallback((exId: string, setIdx: number) => {
    setLogs(prev => {
      const rows = prev[exId]
      if (!rows || rows.length <= 1) return prev
      return { ...prev, [exId]: rows.filter((_, i) => i !== setIdx) }
    })
  }, [])

  // Converte o estado da UI no payload da server action (ordem = order_index).
  const buildPayload = useCallback(
    (exercises: WorkoutExercise[]): ExerciseLogPayload[] => {
      return exercises.map(ex => {
        const rows = logs[ex.id] ?? []
        return {
          workout_exercise_id: ex.id,
          exercise_id: ex.exercise_id,
          order_index: ex.order_index,
          series: rows.map((r, i) => ({
            set_number: i + 1,
            reps_done: r.reps_done.trim() === "" ? null : Number(r.reps_done),
            load_kg: r.load_kg.trim() === "" ? null : Number(r.load_kg),
            rpe: r.rpe,
            completed: r.completed,
          })),
        }
      })
    },
    [logs]
  )

  return { logs, initLogs, resetLogs, updateSet, toggleSet, setRpe, addSet, removeSet, buildPayload }
}
