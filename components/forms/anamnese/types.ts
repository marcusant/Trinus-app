// components/forms/anamnese/types.ts

export interface AnamneseFormWizardProps {
  perfilId: string
  alunoNome: string
  modo: 'criar' | 'editar'
  dadosIniciais?: AnamneseData
  anamneseId?: string
  redirectTo?: string
}

export interface AnamneseData {
  // Histórico
  tempo_treino_meses?: number | null
  frequencia_anterior?: number | null
  modalidades_previas?: string[]
  
  // Medidas
  altura_cm?: number | null
  peso_avaliacao?: number | null
  percentual_gordura?: number | null
  circunferencia_cintura?: number | null
  circunferencia_quadril?: number | null
  
  // Saúde
  lesoes_anteriores?: string[]
  dores_atuais?: string[]
  medicamentos?: string[]
  restricoes_medicas?: string
  
  // Rotina
  horas_sono_media?: number | null
  horario_acordar?: string
  horario_dormir?: string
  horario_treino?: string
  nivel_stress?: number
  nivel_energia?: number
  trabalho_tipo?: string
  
  // Alimentação
  refeicoes_dia?: number | null
  consumo_agua_litros?: number | null
  restricoes_alimentares?: string[]
  alergias_alimentares?: string[]
  preferencias_alimentares?: string[]
  alimentos_nao_gosta?: string[]
  suplementos_atuais?: string[]
  objetivo_nutricional?: string
  orcamento_alimentacao?: string
  cozinha_propria?: boolean | null
  tempo_preparacao_minutos?: number | null
  frequencia_come_fora?: number | null
  
  // Preferências de Treino
  local_treino?: string
  exercicios_favoritos?: string[]
  exercicios_evitar?: string[]
  equipamentos_disponiveis?: string[]
  prefere_maquinas?: boolean | null
  
  // Motivação
  motivacao_principal?: string
  maior_dificuldade?: string
  compromisso?: number
  observacoes?: string
}
