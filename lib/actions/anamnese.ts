// lib/actions/anamnese.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import type { AnamneseData } from '@/components/forms/anamnese/types'
import type { TablesInsert } from '@/types/database'

interface SaveAnamneseResult {
  success: boolean
  error?: string
}

interface GetAnamneseResult {
  success: boolean
  data?: AnamneseData
  error?: string
}

/**
 * Confirma que o `caller` pode ler/escrever a anamnese de `perfilId`.
 * Defesa em profundidade sobre o RLS da tabela `anamnese`: o próprio cliente,
 * um treinador desse cliente (`is_trainer_of`) ou um admin.
 */
async function assertCanAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  perfilId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { ok: false, error: 'Utilizador não autenticado.' }
  }

  if (user.id === perfilId) return { ok: true }

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (role?.role === 'admin') return { ok: true }

  const { data: isTrainer, error: trainerError } = await supabase.rpc('is_trainer_of', {
    _client_id: perfilId,
    _trainer_id: user.id,
  })

  if (trainerError || !isTrainer) {
    return { ok: false, error: 'Não autorizado a aceder à anamnese deste cliente.' }
  }

  return { ok: true }
}

/** Limpa o sentinela "Nenhuma/Nenhum" dos arrays de chips. */
const cleanArray = (arr: string[] | undefined, noneValue: string): string[] =>
  arr?.filter(item => item !== noneValue) ?? []

/** Converte string vazia em null (colunas opcionais de texto/time). */
const emptyToNull = (value: string | undefined | null): string | null =>
  value && value.trim() ? value.trim() : null

/**
 * Persiste a Anamnese Completa na tabela dedicada `public.anamnese`.
 *
 * Modelo: 1 linha por cliente (UPSERT por `client_id`), idempotente — "criar"
 * e "editar" usam o mesmo caminho. Os dados clínicos ficam em claro, protegidos
 * por RLS + encriptação at-rest do Supabase (sem encriptação app-layer).
 */
export async function saveAnamneseCompleta(
  perfilId: string,
  data: AnamneseData,
): Promise<SaveAnamneseResult> {
  const supabase = await createClient()

  const access = await assertCanAccess(supabase, perfilId)
  if (!access.ok) return { success: false, error: access.error }

  const today = new Date().toISOString().split('T')[0]
  const nextEval = new Date()
  nextEval.setDate(nextEval.getDate() + 30)

  const payload: TablesInsert<'anamnese'> = {
    client_id: perfilId,
    tipo: 'completa',
    data_avaliacao: today,
    proxima_reavaliacao: nextEval.toISOString().split('T')[0],

    // Histórico
    tempo_treino_meses: data.tempo_treino_meses ?? null,
    frequencia_anterior: data.frequencia_anterior ?? null,
    modalidades_previas: data.modalidades_previas ?? [],

    // Medidas
    altura_cm: data.altura_cm ?? null,
    peso_avaliacao: data.peso_avaliacao ?? null,
    percentual_gordura: data.percentual_gordura ?? null,
    circunferencia_cintura: data.circunferencia_cintura ?? null,
    circunferencia_quadril: data.circunferencia_quadril ?? null,

    // Saúde
    lesoes_anteriores: cleanArray(data.lesoes_anteriores, 'Nenhuma'),
    dores_atuais: cleanArray(data.dores_atuais, 'Nenhuma'),
    medicamentos: data.medicamentos?.filter(Boolean) ?? [],
    restricoes_medicas: emptyToNull(data.restricoes_medicas),

    // Rotina & Lifestyle
    horas_sono_media: data.horas_sono_media ?? null,
    horario_acordar: emptyToNull(data.horario_acordar),
    horario_dormir: emptyToNull(data.horario_dormir),
    horario_treino: emptyToNull(data.horario_treino),
    nivel_stress: data.nivel_stress ?? null,
    nivel_energia: data.nivel_energia ?? null,
    trabalho_tipo: emptyToNull(data.trabalho_tipo),

    // Alimentação
    refeicoes_dia: data.refeicoes_dia ?? null,
    consumo_agua_litros: data.consumo_agua_litros ?? null,
    restricoes_alimentares: cleanArray(data.restricoes_alimentares, 'Nenhuma'),
    alergias_alimentares: cleanArray(data.alergias_alimentares, 'Nenhuma'),
    preferencias_alimentares: data.preferencias_alimentares ?? [],
    alimentos_nao_gosta: data.alimentos_nao_gosta?.filter(Boolean) ?? [],
    suplementos_atuais: cleanArray(data.suplementos_atuais, 'Nenhum'),
    objetivo_nutricional: emptyToNull(data.objetivo_nutricional),
    orcamento_alimentacao: emptyToNull(data.orcamento_alimentacao),
    cozinha_propria: data.cozinha_propria ?? null,
    tempo_preparacao_minutos: data.tempo_preparacao_minutos ?? null,
    frequencia_come_fora: data.frequencia_come_fora ?? null,

    // Preferências de Treino
    local_treino: emptyToNull(data.local_treino),
    exercicios_favoritos: data.exercicios_favoritos ?? [],
    exercicios_evitar: data.exercicios_evitar ?? [],
    equipamentos_disponiveis: cleanArray(data.equipamentos_disponiveis, 'Nenhum específico'),
    prefere_maquinas: data.prefere_maquinas ?? null,

    // Motivação & Compromisso
    motivacao_principal: emptyToNull(data.motivacao_principal),
    maior_dificuldade: emptyToNull(data.maior_dificuldade),
    compromisso: data.compromisso ?? null,
    observacoes: emptyToNull(data.observacoes),
  }

  const { error: upsertError } = await supabase
    .from('anamnese')
    .upsert(payload, { onConflict: 'client_id' })

  if (upsertError) {
    console.error('Erro ao guardar anamnese:', upsertError)
    return { success: false, error: 'Erro ao guardar a anamnese.' }
  }

  return { success: true }
}

/**
 * Carrega a Anamnese Completa de um cliente, mapeada para o shape do wizard
 * (`AnamneseData`) para hidratar `dadosIniciais`. Devolve `data: undefined`
 * quando ainda não existe anamnese (não é erro).
 */
export async function getAnamnese(perfilId: string): Promise<GetAnamneseResult> {
  const supabase = await createClient()

  const access = await assertCanAccess(supabase, perfilId)
  if (!access.ok) return { success: false, error: access.error }

  const { data: row, error } = await supabase
    .from('anamnese')
    .select('*')
    .eq('client_id', perfilId)
    .maybeSingle()

  if (error) {
    console.error('Erro ao carregar anamnese:', error)
    return { success: false, error: 'Erro ao carregar a anamnese.' }
  }

  if (!row) return { success: true, data: undefined }

  // Time vem como "HH:MM:SS"; o input do wizard usa "HH:MM".
  const trimTime = (t: string | null): string => (t ? t.slice(0, 5) : '')

  const data: AnamneseData = {
    tempo_treino_meses: row.tempo_treino_meses,
    frequencia_anterior: row.frequencia_anterior,
    modalidades_previas: row.modalidades_previas,

    altura_cm: row.altura_cm,
    peso_avaliacao: row.peso_avaliacao,
    percentual_gordura: row.percentual_gordura,
    circunferencia_cintura: row.circunferencia_cintura,
    circunferencia_quadril: row.circunferencia_quadril,

    lesoes_anteriores: row.lesoes_anteriores,
    dores_atuais: row.dores_atuais,
    medicamentos: row.medicamentos,
    restricoes_medicas: row.restricoes_medicas ?? '',

    horas_sono_media: row.horas_sono_media,
    horario_acordar: trimTime(row.horario_acordar),
    horario_dormir: trimTime(row.horario_dormir),
    horario_treino: row.horario_treino ?? '',
    nivel_stress: row.nivel_stress ?? 3,
    nivel_energia: row.nivel_energia ?? 3,
    trabalho_tipo: row.trabalho_tipo ?? '',

    refeicoes_dia: row.refeicoes_dia,
    consumo_agua_litros: row.consumo_agua_litros,
    restricoes_alimentares: row.restricoes_alimentares,
    alergias_alimentares: row.alergias_alimentares,
    preferencias_alimentares: row.preferencias_alimentares,
    alimentos_nao_gosta: row.alimentos_nao_gosta,
    suplementos_atuais: row.suplementos_atuais,
    objetivo_nutricional: row.objetivo_nutricional ?? '',
    orcamento_alimentacao: row.orcamento_alimentacao ?? '',
    cozinha_propria: row.cozinha_propria,
    tempo_preparacao_minutos: row.tempo_preparacao_minutos,
    frequencia_come_fora: row.frequencia_come_fora,

    local_treino: row.local_treino ?? '',
    exercicios_favoritos: row.exercicios_favoritos,
    exercicios_evitar: row.exercicios_evitar,
    equipamentos_disponiveis: row.equipamentos_disponiveis,
    prefere_maquinas: row.prefere_maquinas,

    motivacao_principal: row.motivacao_principal ?? '',
    maior_dificuldade: row.maior_dificuldade ?? '',
    compromisso: row.compromisso ?? 3,
    observacoes: row.observacoes ?? '',
  }

  return { success: true, data }
}
