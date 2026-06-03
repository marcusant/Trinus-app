'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'

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

export async function scheduleAssessment(clientId: string, scheduledAt: string, notes: string) {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  const { error } = await supabase
    .from('assessments')
    .insert({ trainer_id: auth.userId, client_id: clientId, scheduled_at: scheduledAt, notes: notes || null, status: 'pending' })

  if (error) {
    console.error('Erro ao agendar avaliação:', error)
    return { success: false, error: 'Erro ao agendar avaliação.' }
  }

  revalidatePath('/trainer')
  return { success: true }
}

export async function completeAssessment(assessmentId: string, notes: string) {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  // Ownership (C-5): um treinador só conclui as suas próprias avaliações; admin conclui qualquer uma.
  const updateQuery = supabase
    .from('assessments')
    .update({ status: 'done', notes: notes || null, updated_at: new Date().toISOString() })
    .eq('id', assessmentId)
  if (auth.role !== 'admin') {
    updateQuery.eq('trainer_id', auth.userId)
  }
  const { data: updated, error } = await updateQuery.select('id')

  if (error) {
    console.error('Erro ao concluir avaliação:', error)
    return { success: false, error: 'Erro ao concluir avaliação.' }
  }
  if (!updated || updated.length === 0) {
    return { success: false, error: 'Avaliação não encontrada ou não autorizada.' }
  }

  revalidatePath('/trainer')
  return { success: true }
}
