'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { decrypt, decryptObject, encrypt } from '@/lib/utils/crypto'

// Allowlist das chaves de anamnese progressiva (SSOT em useProgressiveAnamnese.ts).
// Impede inserção de chaves arbitrárias (H-5).
const VALID_PROGRESSIVE_KEYS = new Set<string>([
  'horario_dormir', 'horario_acordar', 'acompanhamento_psicologico', 'lidar_com_stress',
  'horas_ecra', 'rotina_matinal', 'dreno_energia', 'porque_profundo', 'caminho_inspirador', 'rede_apoio',
])
// XP fixo no servidor — alinhado com gemini.md e o toast da UI. Nunca confiar no cliente.
const PROGRESSIVE_XP = 10
const MAX_ANSWER_LENGTH = 2000

// Validação de check-in (M-4): ranges sãos para evitar corrupção de estatísticas.
const checkInSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Data inválida'),
  weightKg: z.number().min(20).max(400).nullable(),
  mood: z.number().int().min(1).max(5).nullable(),
  energyLevel: z.number().int().min(1).max(5).nullable(),
  notes: z.string().max(MAX_ANSWER_LENGTH),
})


/**
 * Regista uma nova sessão de treino concluída pelo aluno.
 * Necessita de um workout_day_id válido (dia do plano de treino).
 */
export async function logWorkoutSession(
  workoutDayId: string,
  durationSeconds: number
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  // Validação de duração (1s..24h) para evitar valores absurdos
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > 86400) {
    return { success: false, error: 'Duração de treino inválida.' }
  }

  const now = new Date()
  const startedAt = new Date(now.getTime() - durationSeconds * 1000)

  const { error } = await supabase
    .from('workout_sessions')
    .insert({
      client_id: user.id,
      workout_day_id: workoutDayId,
      started_at: startedAt.toISOString(),
      finished_at: now.toISOString(),
      duration_seconds: durationSeconds,
    })

  if (error) {
    console.error('Erro ao registar sessão de treino:', error)
    return { success: false, error: 'Erro ao registar sessão de treino.' }
  }

  revalidatePath('/client')
  return { success: true }
}

/* ----------------------------------------------------------------------------
 * Registo de treino com séries (estilo Hevy).
 * Persiste a cadeia workout_sessions → session_exercises → session_series com
 * as reps/carga REAIS introduzidas pelo aluno. A RLS garante posse via
 * workout_sessions.client_id = auth.uid() em toda a cadeia.
 * -------------------------------------------------------------------------- */

interface SeriesInput {
  set_number: number
  reps_done: number | null
  load_kg: number | null
  rpe: number | null
  completed: boolean
}

interface ExerciseLogInput {
  workout_exercise_id: string | null
  exercise_id: string | null
  order_index: number
  series: SeriesInput[]
}

const MAX_REPS = 1000
const MAX_LOAD_KG = 1000
const MAX_SETS_PER_EXERCISE = 50

function clampInt(v: number | null, min: number, max: number): number | null {
  if (v === null || !Number.isFinite(v)) return null
  return Math.min(Math.max(Math.round(v), min), max)
}

function clampNum(v: number | null, min: number, max: number): number | null {
  if (v === null || !Number.isFinite(v)) return null
  return Math.min(Math.max(v, min), max)
}

// PSE/RPE válido: escala 6..10 em passos de 0.5. Qualquer outro valor → null.
function clampRpe(v: number | null): number | null {
  if (v === null || !Number.isFinite(v)) return null
  const snapped = Math.round(v * 2) / 2
  if (snapped < 6 || snapped > 10) return null
  return snapped
}

const MAX_TITLE_LENGTH = 120
const MAX_NOTES_LENGTH = 2000

// Normaliza texto opcional do resumo: trim, descarta vazio, limita comprimento.
function sanitizeText(value: string | null | undefined, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed === '') return null
  return trimmed.slice(0, maxLength)
}

export async function logWorkoutSessionWithSets(
  workoutDayId: string,
  durationSeconds: number,
  exercises: ExerciseLogInput[],
  summary?: { title?: string | null; notes?: string | null }
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > 86400) {
    return { success: false, error: 'Duração de treino inválida.' }
  }

  const now = new Date()
  const startedAt = new Date(now.getTime() - durationSeconds * 1000)

  // 1) Sessão (raiz da cadeia de posse para a RLS)
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      client_id: user.id,
      workout_day_id: workoutDayId,
      started_at: startedAt.toISOString(),
      finished_at: now.toISOString(),
      duration_seconds: durationSeconds,
      title: sanitizeText(summary?.title, MAX_TITLE_LENGTH),
      notes: sanitizeText(summary?.notes, MAX_NOTES_LENGTH),
    })
    .select('id')
    .single()

  if (sessionError || !session) {
    console.error('Erro ao registar sessão de treino:', sessionError)
    return { success: false, error: 'Erro ao registar sessão de treino.' }
  }

  // Sanitiza: descarta séries vazias e reindexa order_index sequencial (garante
  // unicidade para o mapeamento session_exercise → séries após o insert).
  const clean = exercises
    .map((ex, i) => ({
      workout_exercise_id: ex.workout_exercise_id ?? null,
      exercise_id: ex.exercise_id ?? null,
      order_index: i,
      series: (ex.series ?? [])
        .filter(s => s.completed || s.reps_done !== null || s.load_kg !== null)
        .slice(0, MAX_SETS_PER_EXERCISE)
        .map((s, si) => ({
          set_number: si + 1,
          reps_done: clampInt(s.reps_done, 0, MAX_REPS),
          load_kg: clampNum(s.load_kg, 0, MAX_LOAD_KG),
          rpe: clampRpe(s.rpe),
          completed: !!s.completed,
        })),
    }))
    .filter(ex => ex.series.length > 0)

  // A sessão já está gravada (duração/streak contam mesmo sem séries detalhadas).
  if (clean.length > 0) {
    const { data: insertedSE, error: seError } = await supabase
      .from('session_exercises')
      .insert(clean.map(ex => ({
        session_id: session.id,
        workout_exercise_id: ex.workout_exercise_id,
        exercise_id: ex.exercise_id,
        order_index: ex.order_index,
      })))
      .select('id, order_index')

    if (seError || !insertedSE) {
      console.error('Erro ao registar exercícios da sessão:', seError)
    } else {
      const idByOrder = new Map(insertedSE.map(r => [r.order_index, r.id]))
      const seriesRows = clean.flatMap(ex => {
        const sessionExerciseId = idByOrder.get(ex.order_index)
        if (!sessionExerciseId) return []
        return ex.series.map(s => ({
          session_exercise_id: sessionExerciseId,
          set_number: s.set_number,
          reps_done: s.reps_done,
          load_kg: s.load_kg,
          rpe: s.rpe,
          completed: s.completed,
          time_seconds: null,
        }))
      })

      if (seriesRows.length > 0) {
        const { error: ssError } = await supabase.from('session_series').insert(seriesRows)
        if (ssError) console.error('Erro ao registar séries da sessão:', ssError)
      }
    }
  }

  revalidatePath('/client')
  return { success: true }
}

/**
 * Regista um check-in semanal do aluno (peso, notas, mood, energy_level).
 */
export async function submitCheckIn(
  date: string,
  weightKg: number | null,
  notes: string,
  mood: number | null,
  energyLevel: number | null
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  // Validação de ranges (M-4)
  const parsed = checkInSchema.safeParse({ date, weightKg, notes: notes ?? '', mood, energyLevel })
  if (!parsed.success) {
    return { success: false, error: 'Dados de check-in inválidos.' }
  }

  const { error } = await supabase
    .from('check_ins')
    .insert({
      client_id: user.id,
      date: parsed.data.date,
      weight_kg: parsed.data.weightKg,
      notes: parsed.data.notes || null,
      mood: parsed.data.mood,
      energy_level: parsed.data.energyLevel,
    })

  if (error) {
    console.error('Erro ao submeter check-in:', error)
    return { success: false, error: 'Erro ao submeter check-in.' }
  }

  revalidatePath('/client')
  return { success: true }
}

/**
 * Procura e retorna o perfil do utilizador desencriptado em memória no servidor.
 */
export async function getClientProfile() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  const { data: perfil, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, role, created_at, metadata, par_q_alert, par_q_caminho_alternativo')
    .eq('id', user.id)
    .single()

  if (error || !perfil) {
    console.error('Erro ao buscar perfil:', error)
    return { success: false, error: 'Perfil não encontrado' }
  }

  // Desencriptar em memória do servidor
  const decryptedProfile = {
    ...perfil,
    full_name: perfil.full_name ? decrypt(perfil.full_name) : null,
    metadata: perfil.metadata ? decryptObject(perfil.metadata) : null,
  }

  return { success: true, profile: decryptedProfile }
}

/**
 * Regista a resposta da pergunta progressiva encriptada com AES-256-GCM e concede XP.
 */
export async function submitProgressiveAnamnese(key: string, value: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  // H-5: validar chave contra allowlist e tamanho da resposta; XP é determinado no servidor.
  if (!VALID_PROGRESSIVE_KEYS.has(key)) {
    return { success: false, error: 'Pergunta inválida.' }
  }
  const trimmed = (value ?? '').trim()
  if (!trimmed || trimmed.length > MAX_ANSWER_LENGTH) {
    return { success: false, error: 'Resposta inválida (vazia ou demasiado longa).' }
  }

  // Encriptar a resposta em servidor antes de gravar
  const encryptedValue = encrypt(trimmed)

  const { error } = await supabase
    .from('progressive_anamnese')
    .insert({
      client_id: user.id,
      key: key,
      value: encryptedValue,
      xp_awarded: PROGRESSIVE_XP,
    })

  if (error) {
    console.error('Erro ao submeter anamnese progressiva:', error)
    return { success: false, error: 'Erro ao submeter resposta.' }
  }

  revalidatePath('/client')
  return { success: true }
}

/**
 * Procura e retorna todas as respostas da anamnese progressiva do utilizador desencriptadas.
 */
export async function getProgressiveAnamnese() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado', logs: [] }
  }

  const { data: logs, error } = await supabase
    .from('progressive_anamnese')
    .select('key, value, answered_at, xp_awarded')
    .eq('client_id', user.id)

  if (error || !logs) {
    return { success: true, logs: [] }
  }

  // Desencriptar valores em memória
  const decryptedLogs = logs.map(log => ({
    ...log,
    value: decrypt(log.value)
  }))

  return { success: true, logs: decryptedLogs }
}

