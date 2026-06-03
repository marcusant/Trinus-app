'use server'

import { createClient } from '@/lib/supabase/server'
import { decrypt, decryptObject } from '@/lib/utils/crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClientProfile } from '@/app/trainer/_types/trainer.types'

type RawClientProfile = ClientProfile & {
  par_q_alert: string | null
  par_q_caminho_alternativo: string | null
}

type TrainerAuthResult =
  | { authenticated: false; userId: string | null; error: string }
  | { authenticated: true; userId: string; error: null }

async function verifyTrainerOrAdmin(supabase: SupabaseClient): Promise<TrainerAuthResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { authenticated: false, userId: null, error: 'Utilizador não autenticado' }
  }

  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !userRole || (userRole.role !== 'trainer' && userRole.role !== 'admin')) {
    return { authenticated: false, userId: user.id, error: 'Apenas treinadores ou administradores podem executar esta ação.' }
  }

  return { authenticated: true, userId: user.id, error: null }
}

export async function getTrainerDashboardData() {
  const supabase = await createClient()
  const auth = await verifyTrainerOrAdmin(supabase)
  if (!auth.authenticated) return { success: false, error: auth.error ?? undefined }

  // Alunos vinculados
  const { data: connectionList, error: connError } = await supabase
    .from('trainer_clients')
    .select('client_id')
    .eq('trainer_id', auth.userId)

  if (connError) {
    console.error('Erro ao buscar alunos vinculados:', connError)
    return { success: false, error: 'Erro ao carregar os alunos vinculados.' }
  }

  const clientIds = (connectionList || []).map(c => c.client_id)
  let decryptedClients: RawClientProfile[] = []

  if (clientIds.length > 0) {
    const { data: profilesList, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, created_at, metadata, par_q_alert, par_q_caminho_alternativo')
      .in('id', clientIds)

    if (profilesError) {
      console.error('Erro ao buscar perfis dos alunos:', profilesError)
      return { success: false, error: 'Erro ao carregar os perfis dos alunos.' }
    }

    decryptedClients = (profilesList || []).map(p => ({
      ...p,
      full_name: p.full_name ? decrypt(p.full_name) : null,
      metadata:  p.metadata  ? decryptObject(p.metadata) : null,
    })) as RawClientProfile[]
  }

  // Avaliações — JOIN com profiles para evitar N+1
  // Cada assessment retorna o client_name diretamente via foreign key hint
  const { data: assessmentsList, error: assessError } = await supabase
    .from('assessments')
    .select(`
      id,
      client_id,
      scheduled_at,
      notes,
      status,
      created_at,
      profiles!assessments_client_id_fkey ( full_name )
    `)
    .eq('trainer_id', auth.userId)
    .order('scheduled_at', { ascending: true })

  if (assessError) {
    console.error('Erro ao buscar avaliações:', assessError)
    return { success: false, error: 'Erro ao carregar as avaliações.' }
  }

  const enrichedAssessments = (assessmentsList || []).map(as => {
    const rawName = (as.profiles as { full_name?: string } | null)?.full_name ?? ''
    return {
      id: as.id,
      client_id: as.client_id,
      scheduled_at: as.scheduled_at,
      notes: as.notes,
      status: as.status as 'pending' | 'done',
      created_at: as.created_at,
      client_name: rawName ? decrypt(rawName) : 'Sem nome',
    }
  })

  // Contagem de planos do treinador
  const { count: plansCount, error: plansError } = await supabase
    .from('workout_plans')
    .select('*', { count: 'exact', head: true })
    .eq('trainer_id', auth.userId)

  if (plansError) {
    console.error('Erro ao contar planos do treinador:', plansError)
    return { success: false, error: 'Erro ao carregar os planos do treinador.' }
  }

  return {
    success: true,
    clients: decryptedClients,
    allAssessments: enrichedAssessments,
    trainerPlansCount: plansCount || 0,
  }
}
