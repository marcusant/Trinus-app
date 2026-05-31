// app/client/_hooks/useClientDashboard.ts
"use client"

import { useState, useEffect, useTransition, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  logWorkoutSession,
  submitCheckIn,
  getClientProfile,
  submitProgressiveAnamnese,
  getProgressiveAnamnese
} from "@/lib/actions/client"
import { toast } from "sonner"
import type {
  WorkoutPlan,
  WorkoutWeek,
  WorkoutDay,
  WorkoutExercise,
  WorkoutSession,
  Assessment,
  CheckIn,
  MealPlan,
  MealDay,
  Meal,
  UserProfile,
  TabKey,
  LevelInfo
} from "../_types/client.types"

export const LEVELS: LevelInfo[] = [
  { name: "Bronze", icon: "🥉", color: "var(--level-bronze)", minXP: 0, maxXP: 499 },
  { name: "Prata", icon: "🥈", color: "var(--level-silver)", minXP: 500, maxXP: 1499 },
  { name: "Ouro", icon: "🥇", color: "var(--level-gold)", minXP: 1500, maxXP: 2999 },
  { name: "Platina", icon: "🏆", color: "var(--level-platinum)", minXP: 3000, maxXP: 5999 },
  { name: "Diamante", icon: "💎", color: "var(--level-diamond)", minXP: 6000, maxXP: 999999 },
]

export const PROGRESSIVE_QUESTIONS = [
  { key: "horario_dormir", label: "💤 Rotina de Sono", question: "A que horas costumas deitar-te regularmente?", placeholder: "Ex: 22:30, 23:00...", type: "text" },
  { key: "horario_acordar", label: "🌅 Despertar", question: "A que horas costumas acordar regularmente?", placeholder: "Ex: 06:30, 07:00...", type: "text" },
  { key: "acompanhamento_psicologico", label: "🧠 Saúde Mental", question: "Tens ou já tiveste acompanhamento psicológico?", type: "select", options: ["Sim", "Não", "Já tive"] },
  { key: "lidar_com_stress", label: "⚡ Gestão de Stress", question: "De que forma lidas com picos de stress no teu dia a dia?", placeholder: "Ex: Meditação, respiração, desporto...", type: "textarea" },
  { key: "horas_ecra", label: "📱 Tempo de Ecrã", question: "Quantas horas diárias passas, em média, em frente a ecrãs?", placeholder: "Ex: 4h, 6h, 8h...", type: "text" },
  { key: "rotina_matinal", label: "☀️ Rotina Matinal", question: "Tens alguma rotina matinal estabelecida?", type: "select", options: ["Sim", "Não", "Às vezes"] },
  { key: "dreno_energia", label: "🔋 Energia", question: "Qual consideras ser o maior dreno de energia no teu dia?", placeholder: "Ex: Falta de sono, stress de trabalho, má nutrição...", type: "textarea" },
  { key: "porque_profundo", label: "✨ Propósito", question: "Qual é o teu porquê mais profundo para cuidar de ti hoje?", placeholder: "Escreve a tua reflexão mais sincera...", type: "textarea" },
  { key: "caminho_inspirador", label: "🕊️ Inspiração", question: "Existe alguma tradição filosófica ou espiritual que te inspire?", placeholder: "Ex: Estoicismo, Budismo, Yoga, nenhuma...", type: "text" },
  { key: "rede_apoio", label: "👥 Rede de Apoio", question: "Tens uma rede de apoio forte que te apoie neste processo?", type: "select", options: ["Forte", "Média", "Fraca", "Nenhuma"] },
]

export function useClientDashboard() {
  const supabase = createClient()
  const router = useRouter()

  const [userName, setUserName] = useState("Aluno")
  const [clientId, setClientId] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Nav
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")

  // Data
  const [trainerName, setTrainerName] = useState<string | null>(null)
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null)
  const [planWeeks, setPlanWeeks] = useState<WorkoutWeek[]>([])
  const [planDays, setPlanDays] = useState<WorkoutDay[]>([])
  const [dayExercises, setDayExercises] = useState<WorkoutExercise[]>([])
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [progressiveLogs, setProgressiveLogs] = useState<Record<string, unknown>[]>([])
  const [questionValue, setQuestionValue] = useState("")
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)

  // Alimentação
  const [activeMealPlan, setActiveMealPlan] = useState<MealPlan | null>(null)
  const [mealDays, setMealDays] = useState<MealDay[]>([])
  const [selectedMealDayId, setSelectedMealDayId] = useState<string | null>(null)
  const [dayMeals, setDayMeals] = useState<Meal[]>([])
  const [isMealsLoading, setIsMealsLoading] = useState(false)

  // Timer
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [activeWorkoutDayId, setActiveWorkoutDayId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check-in form
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [checkInWeight, setCheckInWeight] = useState("")
  const [checkInNotes, setCheckInNotes] = useState("")
  const [checkInMood, setCheckInMood] = useState<number | null>(null)
  const [checkInEnergy, setCheckInEnergy] = useState<number>(80)

  // Exercises loading
  const [isExercisesLoading, setIsExercisesLoading] = useState(false)

  // Hábitos
  const [habits, setHabits] = useState([
    { id: "agua", label: "Beber 3L de água", done: false, icon: "💧" },
    { id: "treino", label: "Completar o treino do dia", done: false, icon: "🏋️" },
    { id: "leitura", label: "10 minutos de leitura", done: false, icon: "📖" },
    { id: "sono", label: "Dormir 7+ horas", done: false, icon: "😴" },
    { id: "nutricao", label: "Seguir o plano alimentar", done: false, icon: "🥗" },
  ])

  // Helper functions internally
  const getLevel = useCallback((xp: number) => {
    const currentLevel = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[0]
    const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1] || currentLevel
    return {
      ...currentLevel,
      nextLevelXP: nextLevel.maxXP === 999999 ? currentLevel.maxXP : nextLevel.minXP,
    }
  }, [])

  const calculateXP = useCallback((sessionsCount: number, checkInsCount: number, currentHabitsDone: number, bestStreak: number, progressiveCount: number = 0) => {
    return (sessionsCount * 100) + (checkInsCount * 20) + (currentHabitsDone * 10) + (bestStreak * 15) + (progressiveCount * 50)
  }, [])

  const getStreaks = useCallback((sessionsList: WorkoutSession[]) => {
    if (sessionsList.length === 0) return { currentStreak: 0, bestStreak: 0 }

    const uniqueDates = Array.from(new Set(
      sessionsList.map(s => {
        const dateObj = new Date(s.started_at)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, "0")
        const day = String(dateObj.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      })
    )).sort((a, b) => b.localeCompare(a))

    if (uniqueDates.length === 0) return { currentStreak: 0, bestStreak: 0 }

    const getLocalDateString = (d: Date) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }

    const todayStr = getLocalDateString(new Date())
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = getLocalDateString(yesterday)

    let currentStreak = 0
    let expectedDateStr = todayStr

    if (!uniqueDates.includes(todayStr)) {
      if (uniqueDates.includes(yesterdayStr)) {
        expectedDateStr = yesterdayStr
      } else {
        expectedDateStr = ""
      }
    }

    if (expectedDateStr !== "") {
      const checkDate = new Date(expectedDateStr)
      while (true) {
        const checkStr = getLocalDateString(checkDate)
        if (uniqueDates.includes(checkStr)) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    const ascDates = [...uniqueDates].sort((a, b) => a.localeCompare(b))
    let bestStreak = 0
    let tempStreak = 0
    let prevDate: Date | null = null

    for (const dateStr of ascDates) {
      const curDate = new Date(dateStr)
      if (!prevDate) {
        tempStreak = 1
      } else {
        const diffTime = Math.abs(curDate.getTime() - prevDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          tempStreak++
        } else if (diffDays > 1) {
          bestStreak = Math.max(bestStreak, tempStreak)
          tempStreak = 1
        }
      }
      prevDate = curDate
    }
    bestStreak = Math.max(bestStreak, tempStreak)

    return { currentStreak, bestStreak }
  }, [])

  const toggleHabit = useCallback((id: string, force?: boolean) => {
    setHabits(prev => {
      const up = prev.map(h => h.id === id ? { ...h, done: force !== undefined ? force : !h.done } : h)
      if (clientId) localStorage.setItem(`habits_${clientId}_${new Date().toISOString().split("T")[0]}`, JSON.stringify(up))
      return up
    })
  }, [clientId])

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    async function loadClientData() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setClientId(user.id)

        // Profile (Fetched and decrypted on server securely)
        const profileRes = await getClientProfile()
        if (profileRes.success && profileRes.profile) {
          const perfil = profileRes.profile as UserProfile
          setProfile(perfil)
          if (perfil.full_name) setUserName(perfil.full_name)
        }

        // Progressive Anamnese Logs
        const progRes = await getProgressiveAnamnese()
        if (progRes.success && progRes.logs) {
          setProgressiveLogs(progRes.logs)
        }

        // Trainer
        const { data: trainerLink } = await supabase
          .from("trainer_clients")
          .select("trainer_id")
          .eq("client_id", user.id)
          .limit(1)
          .single()
        if (trainerLink) {
          const { data: tp } = await supabase.from("profiles").select("full_name").eq("id", trainerLink.trainer_id).single()
          if (tp?.full_name) setTrainerName(tp.full_name)
        }

        // Active workout plan
        const { data: plans } = await supabase
          .from("workout_plans")
          .select("id, name, status, start_date, created_at, trainer_id")
          .eq("client_id", user.id).eq("status", "active")
          .order("created_at", { ascending: false }).limit(1)
        if (plans && plans.length > 0) {
          setActivePlan(plans[0] as WorkoutPlan)
          const { data: weeks } = await supabase.from("workout_weeks").select("id, plan_id, week_number, name").eq("plan_id", plans[0].id).order("week_number", { ascending: true })
          setPlanWeeks(weeks || [])
          if (weeks && weeks.length > 0) {
            const { data: days } = await supabase.from("workout_days").select("id, week_id, day_number, name, focus").in("week_id", weeks.map(w => w.id)).order("day_number", { ascending: true })
            setPlanDays(days || [])
          }
        }

        // Sessions
        const { data: sl } = await supabase.from("workout_sessions").select("id, started_at, finished_at, duration_seconds, workout_day_id").eq("client_id", user.id).order("started_at", { ascending: false })
        setSessions(sl || [])

        // Assessments
        const { data: al } = await supabase.from("assessments").select("id, trainer_id, scheduled_at, notes, status, created_at").eq("client_id", user.id).order("scheduled_at", { ascending: false })
        setAssessments(al as Assessment[] || [])

        // Check-ins
        const { data: cl } = await supabase.from("check_ins").select("id, date, weight_kg, notes, created_at, mood, energy_level").eq("client_id", user.id).order("date", { ascending: false })
        setCheckIns(cl as CheckIn[] || [])

        // Meal plan
        const { data: mp } = await supabase.from("meal_plans").select("id, name, status, created_at").eq("client_id", user.id).eq("status", "active").order("created_at", { ascending: false }).limit(1)
        if (mp && mp.length > 0) {
          setActiveMealPlan(mp[0] as MealPlan)
          const { data: md } = await supabase.from("meal_days").select("id, plan_id, day_number, name").eq("plan_id", mp[0].id).order("day_number", { ascending: true })
          setMealDays(md || [])
        }

        // Habits
        const saved = localStorage.getItem(`habits_${user.id}_${new Date().toISOString().split("T")[0]}`)
        if (saved) { try { setHabits(JSON.parse(saved)) } catch { /* ignore */ } }

      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        toast.error("Erro ao sincronizar dados.")
      } finally { setIsLoading(false) }
    }
    loadClientData()
  }, [supabase])

  /* ---------- LOAD EXERCISES ---------- */
  useEffect(() => {
    if (!selectedDayId) return
    async function load() {
      setIsExercisesLoading(true)
      try {
        const { data: el } = await supabase.from("workout_exercises").select("id, day_id, exercise_id, order_index, sets, reps, rest_seconds, load_kg, notes").eq("day_id", selectedDayId).order("order_index", { ascending: true })
        if (el && el.length > 0) {
          const ids = el.map(e => e.exercise_id).filter((id): id is string => id !== null)
          let names: Record<string, string> = {}
          if (ids.length > 0) {
            const { data: exs } = await supabase.from("exercises").select("id, name").in("id", ids)
            if (exs) names = Object.fromEntries(exs.map(e => [e.id, e.name]))
          }
          setDayExercises(el.map(e => ({ ...e, exercise_name: e.exercise_id ? names[e.exercise_id] || "Exercício" : "Exercício" })))
        } else { setDayExercises([]) }
      } catch { setDayExercises([]) }
      finally { setIsExercisesLoading(false) }
    }
    load()
  }, [selectedDayId, supabase])

  /* ---------- LOAD MEALS ---------- */
  useEffect(() => {
    if (!selectedMealDayId) return
    async function load() {
      setIsMealsLoading(true)
      try {
        const { data: meals } = await supabase.from("meals").select("id, day_id, meal_type, name, time_scheduled").eq("day_id", selectedMealDayId).order("time_scheduled", { ascending: true })
        if (meals && meals.length > 0) {
          const mealIds = meals.map(m => m.id)
          const { data: items } = await supabase.from("meal_items").select("id, meal_id, name, quantity, unit, calories").in("meal_id", mealIds)
          setDayMeals(meals.map(m => ({ ...m, items: (items || []).filter(i => i.meal_id === m.id) })))
        } else { setDayMeals([]) }
      } catch { setDayMeals([]) }
      finally { setIsMealsLoading(false) }
    }
    load()
  }, [selectedMealDayId, supabase])

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (isTimerRunning) { timerRef.current = setInterval(() => setTimerSeconds(p => p + 1), 1000) }
    else { if (timerRef.current) clearInterval(timerRef.current) }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isTimerRunning])

  const fmt = useCallback((s: number) => {
    return `${Math.floor(s / 3600).toString().padStart(2, "0")}:${Math.floor((s % 3600) / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`
  }, [])

  const handleStartWorkout = useCallback((dayId: string) => {
    setActiveWorkoutDayId(dayId)
    setTimerSeconds(0)
    setIsTimerRunning(true)
    toast.success("Cronómetro iniciado! 💪")
  }, [])

  const handleStopWorkout = useCallback(() => {
    setIsTimerRunning(false)
    if (!activeWorkoutDayId || timerSeconds < 5) {
      toast.error("O treino precisa de ter pelo menos 5 segundos.")
      return
    }
    startTransition(async () => {
      try {
        const result = await logWorkoutSession(activeWorkoutDayId, timerSeconds)
        if (result.success) {
          toast.success(`Treino registado! Duração: ${fmt(timerSeconds)}`)
          if (clientId) {
            const { data: ns } = await supabase.from("workout_sessions").select("id, started_at, finished_at, duration_seconds, workout_day_id").eq("client_id", clientId).order("started_at", { ascending: false })
            setSessions(ns || [])
          }
          toggleHabit("treino", true)
        } else {
          toast.error(result.error || "Erro ao registar.")
        }
      } catch {
        toast.error("Erro de rede.")
      } finally {
        setActiveWorkoutDayId(null)
        setTimerSeconds(0)
      }
    })
  }, [activeWorkoutDayId, timerSeconds, clientId, toggleHabit, fmt, supabase])

  const handleCheckInSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const w = checkInWeight ? parseFloat(checkInWeight) : null
        const r = await submitCheckIn(new Date().toISOString().split("T")[0], w, checkInNotes, checkInMood, checkInEnergy)
        if (r.success) {
          toast.success("Check-in registado!")
          setShowCheckInModal(false)
          setCheckInWeight("")
          setCheckInNotes("")
          setCheckInMood(null)
          setCheckInEnergy(80)
          if (clientId) {
            const { data: nc } = await supabase
              .from("check_ins")
              .select("id, date, weight_kg, notes, created_at, mood, energy_level")
              .eq("client_id", clientId)
              .order("date", { ascending: false })
            setCheckIns(nc as CheckIn[] || [])
          }
        } else {
          toast.error(r.error || "Erro.")
        }
      } catch {
        toast.error("Erro de rede.")
      }
    })
  }, [checkInWeight, checkInNotes, checkInMood, checkInEnergy, clientId, supabase])

  const nextProgressiveQuestion = PROGRESSIVE_QUESTIONS.find(
    q => !progressiveLogs.some(l => l.key === q.key)
  )
  const progressiveProgress = Math.round((progressiveLogs.length / PROGRESSIVE_QUESTIONS.length) * 100)

  const handleProgressiveSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nextProgressiveQuestion || !questionValue.trim()) return
    setIsSubmittingQuestion(true)
    try {
      const res = await submitProgressiveAnamnese(nextProgressiveQuestion.key, questionValue)
      if (res.success) {
        toast.success("Resposta guardada! +50 XP adicionados!")
        setQuestionValue("")
        const progRes = await getProgressiveAnamnese()
        if (progRes.success && progRes.logs) {
          setProgressiveLogs(progRes.logs)
        }
      } else {
        toast.error(res.error || "Erro ao guardar resposta.")
      }
    } catch {
      toast.error("Erro de rede ao submeter.")
    } finally {
      setIsSubmittingQuestion(false)
    }
  }, [nextProgressiveQuestion, questionValue])

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success("Sessão terminada.")
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 800)
    } catch {
      toast.error("Erro ao sair.")
      setLogoutLoading(false)
    }
  }, [supabase, router])

  /* ---------- COMPUTED ---------- */
  const completedHabits = habits.filter(h => h.done).length
  const habitPct = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0
  const pendingAssessments = assessments.filter(a => a.status === "pending")
  const doneAssessments = assessments.filter(a => a.status === "done")
  const totalMin = sessions.reduce((a, s) => a + Math.round(s.duration_seconds / 60), 0)
  const hasOnboarding = !!profile?.metadata && !!profile.metadata.objetivo

  const getWeekDays = useCallback(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)

    const getDayLabel = (idx: number): string => ["D", "S", "T", "Q", "Q", "S", "S"][idx] || ""

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const dateStr = d.toISOString().split("T")[0]
      const hasTrained = sessions.some(s => new Date(s.started_at).toISOString().split("T")[0] === dateStr)
      const isToday = dateStr === today.toISOString().split("T")[0]
      return { label: getDayLabel(i), date: dateStr, done: hasTrained, isToday }
    })
  }, [sessions])

  const weekDays = getWeekDays()
  const weekCompleted = weekDays.filter(d => d.done).length

  const { currentStreak, bestStreak } = getStreaks(sessions)
  const xp = calculateXP(sessions.length, checkIns.length, weekCompleted * 10, bestStreak, progressiveLogs.length)
  const userLevel = getLevel(xp)

  return {
    userName,
    clientId,
    profile,
    isLoading,
    logoutLoading,
    isPending,
    activeTab,
    setActiveTab,

    // Data
    trainerName,
    activePlan,
    planWeeks,
    planDays,
    dayExercises,
    selectedDayId,
    setSelectedDayId,
    sessions,
    assessments,
    checkIns,
    progressiveLogs,
    questionValue,
    setQuestionValue,
    isSubmittingQuestion,

    // Alimentação
    activeMealPlan,
    mealDays,
    selectedMealDayId,
    setSelectedMealDayId,
    dayMeals,
    isMealsLoading,

    // Timer
    isTimerRunning,
    timerSeconds,
    activeWorkoutDayId,

    // Check-in
    showCheckInModal,
    setShowCheckInModal,
    checkInWeight,
    setCheckInWeight,
    checkInNotes,
    setCheckInNotes,
    checkInMood,
    setCheckInMood,
    checkInEnergy,
    setCheckInEnergy,

    // Exercises loading
    isExercisesLoading,

    // Habits
    habits,
    toggleHabit,

    // Derived states
    completedHabits,
    habitPct,
    pendingAssessments,
    doneAssessments,
    totalMin,
    hasOnboarding,
    weekDays,
    weekCompleted,
    currentStreak,
    bestStreak,
    xp,
    userLevel,
    nextProgressiveQuestion,
    progressiveProgress,

    // Handlers
    fmt,
    handleStartWorkout,
    handleStopWorkout,
    handleCheckInSubmit,
    handleProgressiveSubmit,
    handleLogout
  }
}
