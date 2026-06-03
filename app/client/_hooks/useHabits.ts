"use client"

import { useState, useEffect, useCallback } from "react"

interface Habit {
  id: string
  label: string
  done: boolean
  icon: string
}

const DEFAULT_HABITS: Habit[] = [
  { id: "agua",     label: "Beber 3L de água",              done: false, icon: "💧" },
  { id: "treino",   label: "Completar o treino do dia",     done: false, icon: "🏋️" },
  { id: "leitura",  label: "10 minutos de leitura",         done: false, icon: "📖" },
  { id: "sono",     label: "Dormir 7+ horas",               done: false, icon: "😴" },
  { id: "nutricao", label: "Seguir o plano alimentar",      done: false, icon: "🥗" },
]

export function useHabits(clientId: string | null) {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS)

  // Restaura hábitos do localStorage quando clientId fica disponível
  useEffect(() => {
    if (!clientId) return
    const dateKey = new Date().toISOString().split("T")[0]
    const saved = localStorage.getItem(`habits_${clientId}_${dateKey}`)
    if (saved) {
      try { setHabits(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [clientId])

  const toggleHabit = useCallback((id: string, force?: boolean) => {
    setHabits(prev => {
      const updated = prev.map(h =>
        h.id === id ? { ...h, done: force !== undefined ? force : !h.done } : h
      )
      if (clientId) {
        const dateKey = new Date().toISOString().split("T")[0]
        localStorage.setItem(`habits_${clientId}_${dateKey}`, JSON.stringify(updated))
      }
      return updated
    })
  }, [clientId])

  const completedHabits = habits.filter(h => h.done).length
  const habitPct = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0

  return { habits, toggleHabit, completedHabits, habitPct }
}
