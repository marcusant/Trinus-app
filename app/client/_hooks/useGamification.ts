"use client"

import { useMemo } from "react"
import type { WorkoutSession, CheckIn, UserProfile, LevelInfo } from "../_types/client.types"

export const LEVELS: LevelInfo[] = [
  { name: "Bronze",   icon: "🥉", color: "var(--level-bronze)",    minXP: 0,    maxXP: 999    },
  { name: "Prata",    icon: "🥈", color: "var(--level-silver)",    minXP: 1000, maxXP: 2499   },
  { name: "Ouro",     icon: "🥇", color: "var(--level-gold)",      minXP: 2500, maxXP: 4499   },
  { name: "Platina",  icon: "🏆", color: "var(--level-platinum)",  minXP: 4500, maxXP: 6999   },
  { name: "Diamante", icon: "💎", color: "var(--level-diamond)",   minXP: 7000, maxXP: 999999 },
]

function getLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function computeStreaks(sessionsList: WorkoutSession[]): { currentStreak: number; bestStreak: number } {
  if (sessionsList.length === 0) return { currentStreak: 0, bestStreak: 0 }

  const uniqueDates = Array.from(
    new Set(sessionsList.map(s => getLocalDateStr(new Date(s.started_at))))
  ).sort((a, b) => a.localeCompare(b))

  const todayStr = getLocalDateStr(new Date())
  const lastStr = uniqueDates[uniqueDates.length - 1]
  const diffFromToday = Math.ceil(
    Math.abs(new Date(todayStr).getTime() - new Date(lastStr).getTime()) / (1000 * 60 * 60 * 24)
  )
  const isAlive = diffFromToday <= 3

  let best = 0
  let temp = 0
  let prev: Date | null = null

  for (const dateStr of uniqueDates) {
    const cur = new Date(dateStr)
    if (!prev) {
      temp = 1
    } else {
      const diff = Math.ceil(Math.abs(cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
      if (diff <= 3) { temp++ } else { best = Math.max(best, temp); temp = 1 }
    }
    prev = cur
  }
  best = Math.max(best, temp)

  return { currentStreak: isAlive ? temp : 0, bestStreak: best }
}

function computeWeeksGoalMet(sessionsList: WorkoutSession[], targetDays: number): number {
  if (sessionsList.length === 0) return 0
  const byWeek: Record<string, Set<string>> = {}
  sessionsList.forEach(s => {
    const d = new Date(s.started_at)
    const dayOfWeek = d.getDay()
    const monday = new Date(d)
    monday.setDate(d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
    const weekKey = monday.toISOString().split("T")[0]
    const dayKey = getLocalDateStr(new Date(s.started_at))
    if (!byWeek[weekKey]) byWeek[weekKey] = new Set()
    byWeek[weekKey].add(dayKey)
  })
  return Object.values(byWeek).filter(days => days.size >= targetDays).length
}

interface UseGamificationParams {
  sessions: WorkoutSession[]
  checkIns: CheckIn[]
  progressiveLogs: Record<string, unknown>[]
  profile: UserProfile | null
}

export function useGamification({ sessions, checkIns, progressiveLogs, profile }: UseGamificationParams) {
  const { currentStreak, bestStreak } = useMemo(() => computeStreaks(sessions), [sessions])

  const weekDays = useMemo(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const labels = ["D", "S", "T", "Q", "Q", "S", "S"]
    const todayStr = getLocalDateStr(today)

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const dateStr = getLocalDateStr(d)
      return {
        label: labels[i] || "",
        date: dateStr,
        done: sessions.some(s => getLocalDateStr(new Date(s.started_at)) === dateStr),
        isToday: dateStr === todayStr,
      }
    })
  }, [sessions])

  const weekCompleted = useMemo(() => weekDays.filter(d => d.done).length, [weekDays])

  const xp = useMemo(() => {
    const targetDays = Number(profile?.metadata?.dias_disponiveis ?? 3)
    const weeksGoalMet = computeWeeksGoalMet(sessions, targetDays)
    const checkInsWithWeight = checkIns.filter(c => c.weight_kg !== null && c.weight_kg > 0).length
    return (sessions.length * 50) +
      (checkInsWithWeight * 30) +
      (checkIns.length * 10) +
      (weeksGoalMet * 50) +
      (bestStreak * 15) +
      (progressiveLogs.length * 10)
  }, [sessions, checkIns, progressiveLogs, profile, bestStreak])

  const userLevel = useMemo((): LevelInfo & { nextLevelXP: number } => {
    const level = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[0]
    const next = LEVELS[LEVELS.indexOf(level) + 1] || level
    return { ...level, nextLevelXP: next.maxXP === 999999 ? level.maxXP : next.minXP }
  }, [xp])

  return { currentStreak, bestStreak, weekDays, weekCompleted, xp, userLevel }
}
