"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getClientProfile, getProgressiveAnamnese } from "@/lib/actions/client"
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
  PreviousSets,
} from "../_types/client.types"

export function useClientData() {
  const supabase = createClient()

  const [userName, setUserName] = useState("Aluno")
  const [clientId, setClientId] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAnamnese, setHasAnamnese] = useState(false)

  const [trainerName, setTrainerName] = useState<string | null>(null)
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null)
  const [planWeeks, setPlanWeeks] = useState<WorkoutWeek[]>([])
  const [planDays, setPlanDays] = useState<WorkoutDay[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [progressiveLogs, setProgressiveLogs] = useState<Record<string, unknown>[]>([])

  const [activeMealPlan, setActiveMealPlan] = useState<MealPlan | null>(null)
  const [mealDays, setMealDays] = useState<MealDay[]>([])

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [dayExercises, setDayExercises] = useState<WorkoutExercise[]>([])
  const [isExercisesLoading, setIsExercisesLoading] = useState(false)
  const [previousSets, setPreviousSets] = useState<PreviousSets>({})

  const [selectedMealDayId, setSelectedMealDayId] = useState<string | null>(null)
  const [dayMeals, setDayMeals] = useState<Meal[]>([])
  const [isMealsLoading, setIsMealsLoading] = useState(false)

  /* ---- carga inicial ---- */
  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setClientId(user.id)

        const profileRes = await getClientProfile()
        if (profileRes.success && profileRes.profile) {
          const perfil = profileRes.profile as UserProfile
          setProfile(perfil)
          if (perfil.full_name) setUserName(perfil.full_name)
        }

        const progRes = await getProgressiveAnamnese()
        if (progRes.success && progRes.logs) setProgressiveLogs(progRes.logs)

        const { data: anamneseRow } = await supabase
          .from("anamnese").select("client_id")
          .eq("client_id", user.id).maybeSingle()
        setHasAnamnese(!!anamneseRow)

        const { data: trainerLink } = await supabase
          .from("trainer_clients").select("trainer_id")
          .eq("client_id", user.id).limit(1).single()
        if (trainerLink) {
          const { data: tp } = await supabase
            .from("profiles").select("full_name").eq("id", trainerLink.trainer_id).single()
          if (tp?.full_name) setTrainerName(tp.full_name)
        }

        const { data: plans } = await supabase
          .from("workout_plans")
          .select("id, name, status, start_date, created_at, trainer_id")
          .eq("client_id", user.id).eq("status", "active")
          .order("created_at", { ascending: false }).limit(1)
        if (plans && plans.length > 0) {
          setActivePlan(plans[0] as WorkoutPlan)
          const { data: weeks } = await supabase
            .from("workout_weeks").select("id, plan_id, week_number, name")
            .eq("plan_id", plans[0].id).order("week_number", { ascending: true })
          setPlanWeeks(weeks || [])
          if (weeks && weeks.length > 0) {
            const { data: days } = await supabase
              .from("workout_days").select("id, week_id, day_number, name, focus")
              .in("week_id", weeks.map(w => w.id)).order("day_number", { ascending: true })
            setPlanDays(days || [])
          }
        }

        const { data: sl } = await supabase
          .from("workout_sessions")
          .select("id, started_at, finished_at, duration_seconds, workout_day_id, title, notes")
          .eq("client_id", user.id).order("started_at", { ascending: false })
        setSessions(sl || [])

        const { data: al } = await supabase
          .from("assessments")
          .select("id, trainer_id, scheduled_at, notes, status, created_at")
          .eq("client_id", user.id).order("scheduled_at", { ascending: false })
        setAssessments((al as Assessment[]) || [])

        const { data: cl } = await supabase
          .from("check_ins")
          .select("id, date, weight_kg, notes, created_at, mood, energy_level")
          .eq("client_id", user.id).order("date", { ascending: false })
        setCheckIns((cl as CheckIn[]) || [])

        const { data: mp } = await supabase
          .from("meal_plans").select("id, name, status, created_at")
          .eq("client_id", user.id).eq("status", "active")
          .order("created_at", { ascending: false }).limit(1)
        if (mp && mp.length > 0) {
          setActiveMealPlan(mp[0] as MealPlan)
          const { data: md } = await supabase
            .from("meal_days").select("id, plan_id, day_number, name")
            .eq("plan_id", mp[0].id).order("day_number", { ascending: true })
          setMealDays(md || [])
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        toast.error("Erro ao sincronizar dados.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [supabase])

  /* ---- lazy load exercícios ---- */
  useEffect(() => {
    if (!selectedDayId) return
    const dayId = selectedDayId
    async function load() {
      setIsExercisesLoading(true)
      setPreviousSets({})
      try {
        const { data: el } = await supabase
          .from("workout_exercises")
          .select("id, day_id, exercise_id, order_index, sets, reps, rest_seconds, load_kg, notes")
          .eq("day_id", dayId).order("order_index", { ascending: true })
        if (el && el.length > 0) {
          const ids = el.map(e => e.exercise_id).filter((id): id is string => id !== null)
          let names: Record<string, string> = {}
          if (ids.length > 0) {
            const { data: exs } = await supabase.from("exercises").select("id, name").in("id", ids)
            if (exs) names = Object.fromEntries(exs.map(e => [e.id, e.name]))
          }
          setDayExercises(el.map(e => ({
            ...e,
            exercise_name: e.exercise_id ? names[e.exercise_id] || "Exercício" : "Exercício",
          })))

          // Coluna "Anterior" (estilo Hevy): última sessão registada por exercício.
          // A RLS restringe session_exercises às sessões do próprio aluno.
          const weIds = el.map(e => e.id)
          const { data: prev } = await supabase
            .from("session_exercises")
            .select("workout_exercise_id, created_at, session_series(set_number, reps_done, load_kg, rpe)")
            .in("workout_exercise_id", weIds)
            .order("created_at", { ascending: false })
          if (prev && prev.length > 0) {
            const map: PreviousSets = {}
            for (const row of prev) {
              const weId = row.workout_exercise_id
              if (!weId || map[weId]) continue // mantém apenas a sessão mais recente
              const series = (row.session_series ?? [])
                .map(s => ({ set_number: s.set_number, reps_done: s.reps_done, load_kg: s.load_kg, rpe: s.rpe }))
                .sort((a, b) => a.set_number - b.set_number)
              map[weId] = series
            }
            setPreviousSets(map)
          }
        } else {
          setDayExercises([])
        }
      } catch { setDayExercises([]) }
      finally { setIsExercisesLoading(false) }
    }
    load()
  }, [selectedDayId, supabase])

  /* ---- lazy load refeições ---- */
  useEffect(() => {
    if (!selectedMealDayId) return
    const mealDayId = selectedMealDayId
    async function load() {
      setIsMealsLoading(true)
      try {
        const { data: meals } = await supabase
          .from("meals").select("id, day_id, meal_type, name, time_scheduled")
          .eq("day_id", mealDayId).order("time_scheduled", { ascending: true })
        if (meals && meals.length > 0) {
          const mealIds = meals.map(m => m.id)
          const { data: items } = await supabase
            .from("meal_items").select("id, meal_id, name, quantity, unit, calories")
            .in("meal_id", mealIds)
          setDayMeals(meals.map(m => ({ ...m, items: (items || []).filter(i => i.meal_id === m.id) })))
        } else {
          setDayMeals([])
        }
      } catch { setDayMeals([]) }
      finally { setIsMealsLoading(false) }
    }
    load()
  }, [selectedMealDayId, supabase])

  return {
    userName, clientId, profile, isLoading, hasAnamnese,
    trainerName,
    activePlan, planWeeks, planDays,
    sessions, setSessions,
    assessments,
    checkIns, setCheckIns,
    progressiveLogs, setProgressiveLogs,
    activeMealPlan, mealDays,
    selectedDayId, setSelectedDayId,
    dayExercises, isExercisesLoading, previousSets,
    selectedMealDayId, setSelectedMealDayId,
    dayMeals, isMealsLoading,
  }
}
