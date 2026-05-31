// app/trainer/_types/trainer.types.ts
// Interfaces centralizadas do painel do Treinador

export interface ClientProfile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  metadata?: Record<string, unknown>
}

export interface WorkoutSession {
  id: string
  started_at: string
  finished_at: string
  duration_seconds: number
}

export interface Assessment {
  id: string
  client_id: string
  scheduled_at: string
  notes: string | null
  status: 'pending' | 'done'
  created_at: string
  client_name?: string
}

export interface WorkoutPlan {
  id: string
  name: string
  status: string
  start_date: string
  created_at: string
}

export interface LocalExercise {
  exercise_id: string
  exercise_name: string
  sets: number
  reps: string
  rest_seconds: number
  notes: string
}

export interface LocalDay {
  name: string
  day_number: number
  focus: string
  exercises: LocalExercise[]
}

export type TrainerTab = "dashboard" | "clients" | "assessments"
