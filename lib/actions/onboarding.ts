// lib/actions/onboarding.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { onboardingSchema, OnboardingFormData } from '@/lib/validations/onboarding'
import { encrypt, encryptObject } from '@/lib/utils/crypto'

export async function saveOnboarding(data: OnboardingFormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  // Validação server-side
  const parsed = onboardingSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  // Verificar se há alertas no PAR-Q (Segurança Física)
  const hasParQAlert = 
    parsed.data.par_q_dor_peito ||
    parsed.data.par_q_perda_equilibrio ||
    parsed.data.par_q_problema_cardiaco ||
    parsed.data.par_q_proibido_medico ||
    parsed.data.par_q_pressao_alta

  // Montar o objeto de metadados legível e depois encriptá-lo totalmente
  const metadataPayload = {
    data_nascimento: parsed.data.data_nascimento,
    genero: parsed.data.genero,
    telefone: parsed.data.telefone || null,
    nacionalidade: parsed.data.nacionalidade,
    cidade_residencia: parsed.data.cidade_residencia,
    pais_residencia: parsed.data.pais_residencia,
    objetivo: parsed.data.objetivo,
    nivel: parsed.data.nivel,
    dias_disponiveis: parsed.data.dias_disponiveis,
    minutos_por_sessao: parsed.data.minutos_por_sessao,
    local_treino: parsed.data.local_treino,
    par_q_dor_peito: parsed.data.par_q_dor_peito,
    par_q_perda_equilibrio: parsed.data.par_q_perda_equilibrio,
    par_q_problema_cardiaco: parsed.data.par_q_problema_cardiaco,
    par_q_proibido_medico: parsed.data.par_q_proibido_medico,
    par_q_pressao_alta: parsed.data.par_q_pressao_alta,
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: encrypt(parsed.data.nome), // Encriptar nome completo
      email: user.email,
      role: 'client',
      par_q_alert: hasParQAlert, // Flag pública de segurança física
      par_q_caminho_alternativo: hasParQAlert, // Redirecionamento de treino
      metadata: encryptObject(metadataPayload), // Encriptação AES-256-GCM dos metadados
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Erro ao salvar perfil:', error)
    return { success: false, error: 'Erro ao guardar dados' }
  }

  return { success: true }
}

