"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { toast } from "sonner"

const MIN_REST = 5
const MAX_REST = 3600
const DEFAULT_REST = 60

/**
 * Cronómetro de descanso (contagem decrescente) estilo Hevy. Auto-inicia ao
 * concluir uma série e permite ajustar (-15s / +15s) ou saltar. Independente do
 * cronómetro de duração do treino (useWorkoutTimer).
 */
export function useRestTimer() {
  const [isResting, setIsResting] = useState(false)
  const [restRemaining, setRestRemaining] = useState(0)
  const [restTotal, setRestTotal] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startRest = useCallback((seconds?: number | null) => {
    const total = Math.min(Math.max(seconds ?? DEFAULT_REST, MIN_REST), MAX_REST)
    setRestTotal(total)
    setRestRemaining(total)
    setIsResting(true)
  }, [])

  const addRestTime = useCallback((delta: number) => {
    setRestRemaining(prev => {
      const next = Math.min(Math.max(prev + delta, 0), MAX_REST)
      setRestTotal(t => Math.max(t, next))
      return next
    })
  }, [])

  const skipRest = useCallback(() => {
    clear()
    setIsResting(false)
    setRestRemaining(0)
  }, [clear])

  // Tick: decrementa a cada segundo enquanto descansa; ao chegar a 0, encerra.
  useEffect(() => {
    if (!isResting) {
      clear()
      return
    }
    intervalRef.current = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          clear()
          setIsResting(false)
          toast.success("Descanso terminado! Bora para a próxima série 💪")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return clear
  }, [isResting, clear])

  return { isResting, restRemaining, restTotal, startRest, addRestTime, skipRest }
}
