"use client"

import { useState, useRef, useEffect, useCallback } from "react"

/**
 * Cronómetro (contagem crescente) independente. Permite iniciar/pausar e repor.
 * Usado no menu do relógio da barra de treino, ao lado do temporizador
 * (contagem decrescente, ver useRestTimer).
 */
export function useStopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setSeconds(0)
  }, [])
  const toggle = useCallback(() => setIsRunning(prev => !prev), [])

  useEffect(() => {
    if (!isRunning) {
      clear()
      return
    }
    intervalRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000)
    return clear
  }, [isRunning, clear])

  return { seconds, isRunning, start, pause, reset, toggle }
}
