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
  title?: string | null
  notes?: string | null
}

/**
 * Instantâneo capturado ao concluir o treino, exibido no ecrã de resumo
 * (estilo Hevy) antes de o aluno guardar/descartar. A persistência só acontece
 * quando o aluno confirma em "Salvar".
 */
export interface WorkoutSummaryData {
  dayId: string
  durationSeconds: number
  volumeKg: number
  setsCount: number
  /** ISO da conclusão (campo "When" do resumo). */
  finishedAt: string
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

/** Estado editável de uma série durante o registo de treino (estilo Hevy). */
export interface SetEntry {
  reps_done: string
  load_kg: string
  /** PSE/RPE selecionado (6..10, passos de 0.5) ou null se não registado. */
  rpe: number | null
  completed: boolean
}

/** Mapa keyed pelo id do workout_exercise (prescrição) → séries do aluno. */
export type WorkoutLogs = Record<string, SetEntry[]>

/** Desempenho de uma série na sessão anterior (coluna "Anterior" estilo Hevy). */
export interface PreviousSet {
  set_number: number
  reps_done: number | null
  load_kg: number | null
  rpe: number | null
}

/** Mapa keyed pelo id do workout_exercise → séries da última sessão registada. */
export type PreviousSets = Record<string, PreviousSet[]>

/** Payload enviado à server action de persistência. */
export interface SeriesPayload {
  set_number: number
  reps_done: number | null
  load_kg: number | null
  rpe: number | null
  completed: boolean
}

export interface ExerciseLogPayload {
  workout_exercise_id: string | null
  exercise_id: string | null
  order_index: number
  series: SeriesPayload[]
}
