export interface Anamnese {
    id: string
    perfil_id: string | null
    data_avaliacao: string
    proxima_reavaliacao: string | null
    
    // Medidas
    peso_avaliacao: number | null
    altura_cm: number | null
    percentual_gordura: number | null
    circunferencia_cintura: number | null
    circunferencia_quadril: number | null
    
    // Histórico Treino
    tempo_treino_meses: number | null
    frequencia_anterior: number | null
    modalidades_previas: string[] | null
    
    // Saúde
    lesoes_anteriores: string[] | null
    dores_atuais: string[] | null
    medicamentos: string[] | null
    restricoes_medicas: string | null
    
    // Lifestyle
    horas_sono_media: number | null
    horario_acordar: string | null
    horario_dormir: string | null
    nivel_stress: number | null // 1-10
    nivel_energia: number | null // 1-10
    trabalho_tipo: 'sedentario' | 'leve' | 'moderado' | 'intenso' | null
    
    // Preferências Treino
    objetivo: string | null
    nivel: 'iniciante' | 'intermediario' | 'avancado' | null
    dias_disponiveis: number | null
    minutos_por_sessao: number | null
    local_treino: 'academia' | 'casa' | 'ar_livre' | 'hibrido' | null
    horario_treino: 'manha' | 'tarde' | 'noite' | 'flexivel' | null
    exercicios_favoritos: string[] | null
    exercicios_evitar: string[] | null
    equipamentos_disponiveis: string[] | null
    prefere_maquinas: boolean
    
    // Nutrição
    refeicoes_dia: number | null
    consumo_agua_litros: number | null
    restricoes_alimentares: string[] | null
    alergias_alimentares: string[] | null
    preferencias_alimentares: string[] | null
    alimentos_nao_gosta: string[] | null
    suplementos_atuais: string[] | null
    objetivo_nutricional: string | null
    orcamento_alimentacao: 'baixo' | 'medio' | 'alto' | null
    cozinha_propria: boolean | null
    tempo_preparacao_minutos: number | null
    frequencia_come_fora: number | null
    
    // Meta
    motivacao_principal: string | null
    maior_dificuldade: string | null
    compromisso: number | null // 1-10
    observacoes: string | null
    
    created_at: string
  }
  
  export type AnamneseFormData = Omit<Anamnese, 'id' | 'created_at'>
  