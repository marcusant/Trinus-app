'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { decrypt, decryptObject, encrypt } from '@/lib/utils/crypto'


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
    return { success: false, error: `Erro ao registar sessão: ${error.message}` }
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

  const { error } = await supabase
    .from('check_ins')
    .insert({
      client_id: user.id,
      date: date,
      weight_kg: weightKg,
      notes: notes || null,
      mood: mood,
      energy_level: energyLevel,
    })

  if (error) {
    console.error('Erro ao submeter check-in:', error)
    return { success: false, error: `Erro ao submeter check-in: ${error.message}` }
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
export async function submitProgressiveAnamnese(key: string, value: string, xp: number = 50) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  // Encriptar a resposta em servidor antes de gravar
  const encryptedValue = encrypt(value)

  const { error } = await supabase
    .from('progressive_anamnese')
    .insert({
      client_id: user.id,
      key: key,
      value: encryptedValue,
      xp_awarded: xp,
    })

  if (error) {
    console.error('Erro ao submeter anamnese progressiva:', error)
    return { success: false, error: `Erro ao submeter: ${error.message}` }
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

