'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'
import { WORKOUT_PRESETS, type PresetKey } from '@/constants/workout-presets'
import type { Database } from '@/types/database'

type PlanStatus = Database['public']['Enums']['plan_status']

type TrainerAuthResult =
  | { authenticated: false; userId: string | null; role: null; error: string }
  | { authenticated: true; userId: string; role: 'trainer' | 'admin'; error: null }

async function verifyTrainerOrAdmin(supabase: SupabaseClient): Promise<TrainerAuthResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { authenticated: false, userId: null, role: null, error: 'Utilizador não autenticado' }
  }

  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !userRole || (userRole.role !== 'trainer' && userRole.role !== 'admin')) {
    return { authenticated: false, userId: user.id, role: null, error: 'Apenas treinadores ou administradores podem executar esta ação.' }
  }

  return { authenticated: true, userId: user.id, role: userRole.role as 'trainer' | 'admin', error: null }
}

/**
 * Guarda de ownership (C-3/C-6): garante que o plano pertence ao treinador autenticado.
 * Admins têm acesso total. Devolve mensagem de erro ou null se autorizado.
 */
async function assertOwnsPlan(
  supabase: SupabaseClient,
  planId: string,
  auth: { userId: string | null; role: 'trainer' | 'admin' | null }
): Promise<string | null> {
  if (auth.role === 'admin') return null
  const { data, error } = await supabase
    .from('workout_plans')
    .select('trainer_id')
    .eq('id', planId)
    .single()
  if (error || !data) return 'Plano não encontrado.'
  if (data.trainer_id !== auth.userId) return 'Não autorizado: este plano pertence a outro treinador.'
  return null
}

interface DayInput {
  name: string
  day_number: number
  focus: string
  exercises: { exercise_id: string; sets: number; reps: string; rest_seconds: number; notes: string | null }[]
}

async function insertDaysAndExercises(
  supabase: SupabaseClient,
  weekId: string,
  days: DayInput[]
): Promise<void> {
  for (const d of days) {
    const { data: day, error: dayErr } = await supabase
      .from('workout_days')
      .insert({ week_id: weekId, day_number: d.day_number, name: d.name, focus: d.focus })
      .select('id').single()

    if (dayErr || !day) throw new Error(dayErr?.message || `Falha ao criar Dia ${d.day_number}`)

    for (let i = 0; i < d.exercises.length; i++) {
      const ex = d.exercises[i]
      const { error: exErr } = await supabase
        .from('workout_exercises')
        .insert({ day_id: day.id, exercise_id: ex.exercise_id, order_index: i + 1, sets: ex.sets, reps: ex.reps, rest_seconds: ex.rest_seconds, notes: ex.notes })
      if (exErr) throw new Error(exErr.message)
    }
  }
}

// ---- Tipos públicos ----

export interface CustomExerciseInput {
  exercise_id: string
  sets: number
  reps: string
  rest_seconds: number
  notes: string | null
}

export interface CustomDayInput {
  name: string
  day_number: number
  focus: string
  exercises: CustomExerciseInput[]
}

export interface CustomPlanStructure {
  days: CustomDayInput[]
}

// ---- Actions ----

export async function createWorkoutPlan(clientId: string, name: string, startDate: string, presetType?: string) {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  const { data: plan, error } = await supabase
    .from('workout_plans')
    .insert({ trainer_id: auth.userId, client_id: clientId, name, status: 'active', start_date: startDate || new Date().toISOString().split('T')[0] })
    .select('id').single()

  if (error || !plan) {
    console.error('Erro ao criar plano:', error)
    return { success: false, error: 'Erro ao prescrever plano.' }
  }

  if (presetType && presetType in WORKOUT_PRESETS) {
    try {
      const { data: week, error: weekErr } = await supabase
        .from('workout_weeks')
        .insert({ plan_id: plan.id, week_number: 1, name: 'Semana 1' })
        .select('id').single()

      if (weekErr || !week) throw new Error(weekErr?.message || 'Erro ao criar semana do preset')

      await insertDaysAndExercises(supabase, week.id, WORKOUT_PRESETS[presetType as PresetKey])
    } catch (presetErr: unknown) {
      const msg = presetErr instanceof Error ? presetErr.message : 'Erro desconhecido'
      console.error('Erro ao povoar preset:', presetErr)
      return { success: false, error: `Erro ao povoar o plano com o preset: ${msg}` }
    }
  }

  revalidatePath('/trainer')
  return { success: true }
}

export async function createCustomWorkoutPlan(
  clientId: string,
  name: string,
  startDate: string,
  status: string,
  structure: CustomPlanStructure
): Promise<{ success: boolean; planId?: string; error?: string }> {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  try {
    const { data: plan, error: planErr } = await supabase
      .from('workout_plans')
      .insert({ trainer_id: auth.userId, client_id: clientId, name, status: (status || 'active') as PlanStatus, start_date: startDate || new Date().toISOString().split('T')[0] })
      .select('id').single()

    if (planErr || !plan) throw new Error(planErr?.message || 'Falha ao recuperar ID do plano criado')

    const { data: week, error: weekErr } = await supabase
      .from('workout_weeks')
      .insert({ plan_id: plan.id, week_number: 1, name: 'Semana 1' })
      .select('id').single()

    if (weekErr || !week) throw new Error(weekErr?.message || 'Falha ao criar Semana 1')

    await insertDaysAndExercises(supabase, week.id, structure.days)

    revalidatePath('/trainer')
    return { success: true, planId: plan.id }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao criar plano customizado:', err)
    return { success: false, error: `Erro ao criar plano de treino: ${msg}` }
  }
}

export async function updateCustomWorkoutPlan(
  planId: string,
  name: string,
  startDate: string,
  status: string,
  structure: CustomPlanStructure
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  const ownershipError = await assertOwnsPlan(supabase, planId, auth)
  if (ownershipError) return { success: false, error: ownershipError }

  try {
    const { error: planErr } = await supabase
      .from('workout_plans')
      .update({ name, status: status as PlanStatus, start_date: startDate || new Date().toISOString().split('T')[0], updated_at: new Date().toISOString() })
      .eq('id', planId)
    if (planErr) throw new Error(planErr.message)

    let { data: week, error: weekSearchErr } = await supabase
      .from('workout_weeks').select('id').eq('plan_id', planId).eq('week_number', 1).maybeSingle()
    if (weekSearchErr) throw new Error(weekSearchErr.message)

    if (!week) {
      const { data: newWeek, error: weekInsertErr } = await supabase
        .from('workout_weeks').insert({ plan_id: planId, week_number: 1, name: 'Semana 1' }).select('id').single()
      if (weekInsertErr || !newWeek) throw new Error(weekInsertErr?.message || 'Falha ao criar Semana 1')
      week = newWeek
    }

    // Limpa estrutura antiga antes de reinserir
    const { data: oldDays } = await supabase.from('workout_days').select('id').eq('week_id', week.id)
    if (oldDays && oldDays.length > 0) {
      const oldDayIds = oldDays.map(d => d.id)
      await supabase.from('workout_exercises').delete().in('day_id', oldDayIds)
      await supabase.from('workout_days').delete().in('id', oldDayIds)
    }

    await insertDaysAndExercises(supabase, week.id, structure.days)

    revalidatePath('/trainer')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao atualizar plano:', err)
    return { success: false, error: `Erro ao salvar alterações: ${msg}` }
  }
}

export async function deleteWorkoutPlan(planId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  const ownershipError = await assertOwnsPlan(supabase, planId, auth)
  if (ownershipError) return { success: false, error: ownershipError }

  try {
    const { data: weeks, error: weeksErr } = await supabase.from('workout_weeks').select('id').eq('plan_id', planId)
    if (weeksErr) throw weeksErr

    if (weeks && weeks.length > 0) {
      const weekIds = weeks.map(w => w.id)
      const { data: days, error: daysErr } = await supabase.from('workout_days').select('id').in('week_id', weekIds)
      if (daysErr) throw daysErr

      if (days && days.length > 0) {
        const dayIds = days.map(d => d.id)
        const { error: exsDelErr } = await supabase.from('workout_exercises').delete().in('day_id', dayIds)
        if (exsDelErr) throw exsDelErr
        const { error: daysDelErr } = await supabase.from('workout_days').delete().in('id', dayIds)
        if (daysDelErr) throw daysDelErr
      }

      const { error: weeksDelErr } = await supabase.from('workout_weeks').delete().in('id', weekIds)
      if (weeksDelErr) throw weeksDelErr
    }

    const { error: planDelErr } = await supabase.from('workout_plans').delete().eq('id', planId)
    if (planDelErr) throw planDelErr

    revalidatePath('/trainer')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao excluir plano:', err)
    return { success: false, error: `Erro ao excluir plano de treino: ${msg}` }
  }
}
