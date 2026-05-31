// app/client/_types/client.types.ts
// Interfaces centralizadas do painel do Aluno

export interface WorkoutPlan {
  id: string
  name: string
  status: string
  start_date: string
  created_at: string
  trainer_id: string
}

export interface WorkoutWeek {
  id: string
  plan_id: string
  week_number: number
  name: string | null
}

export interface WorkoutDay {
  id: string
  week_id: string
  day_number: number
  name: string | null
  focus: string | null
}

export interface WorkoutExercise {
  id: string
  day_id: string
  exercise_id: string | null
  order_index: number
  sets: number | null
  reps: string | null
  rest_seconds: number | null
  load_kg: number | null
  notes: string | null
  exercise_name?: string
}

export interface WorkoutSession {
  id: string
  started_at: string
  finished_at: string
  duration_seconds: number
  workout_day_id: string
}

export interface Assessment {
  id: string
  trainer_id: string
  scheduled_at: string
  notes: string | null
  status: "pending" | "done"
  created_at: string
}

export interface CheckIn {
  id: string
  date: string
  weight_kg: number | null
  notes: string | null
  created_at: string
  mood?: number | null
  energy_level?: number | null
}

export interface MealPlan {
  id: string
  name: string
  status: string
  created_at: string
}

export interface MealDay {
  id: string
  plan_id: string
  day_number: number
  name: string | null
}

export interface Meal {
  id: string
  day_id: string
  meal_type: string
  name: string | null
  time_scheduled: string | null
  items: MealItem[]
}

export interface MealItem {
  id: string
  meal_id: string
  name: string
  quantity: number | null
  unit: string | null
  calories: number | null
}

export interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: string | null
  created_at: string
  metadata?: Record<string, unknown>
  par_q_alert?: boolean
  par_q_caminho_alternativo?: boolean
}

export type TabKey = "dashboard" | "treino" | "alimentacao" | "progresso" | "perfil"

export interface LevelInfo {
  name: string
  icon: string
  color: string
  minXP: number
  maxXP: number
}
