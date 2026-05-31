import { z } from 'zod'

// Sub-schemas por seção (facilita wizard multi-step)
export const medidasSchema = z.object({
  peso_avaliacao: z.number().min(30).max(300).nullable().optional(),
  altura_cm: z.number().min(100).max(250).nullable().optional(),
  percentual_gordura: z.number().min(3).max(60).nullable().optional(),
  circunferencia_cintura: z.number().min(40).max(200).nullable().optional(),
  circunferencia_quadril: z.number().min(50).max(200).nullable().optional(),
})

export const historicoTreinoSchema = z.object({
  tempo_treino_meses: z.number().min(0).max(600).nullable().optional(),
  frequencia_anterior: z.number().min(0).max(14).nullable().optional(),
  modalidades_previas: z.array(z.string()).nullable().optional(),
})

export const saudeSchema = z.object({
  lesoes_anteriores: z.array(z.string()).nullable().optional(),
  dores_atuais: z.array(z.string()).nullable().optional(),
  medicamentos: z.array(z.string()).nullable().optional(),
  restricoes_medicas: z.string().max(1000).nullable().optional(),
})

export const lifestyleSchema = z.object({
  horas_sono_media: z.number().min(2).max(14).nullable().optional(),
  horario_acordar: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  horario_dormir: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  nivel_stress: z.number().min(1).max(10).nullable().optional(),
  nivel_energia: z.number().min(1).max(10).nullable().optional(),
  trabalho_tipo: z.enum(['sedentario', 'leve', 'moderado', 'intenso']).nullable().optional(),
})

export const preferenciasTreinoSchema = z.object({
  objetivo: z.string().max(200).nullable().optional(),
  nivel: z.enum(['iniciante', 'intermediario', 'avancado']).nullable().optional(),
  dias_disponiveis: z.number().min(1).max(7).nullable().optional(),
  minutos_por_sessao: z.number().min(15).max(180).nullable().optional(),
  local_treino: z.enum(['academia', 'casa', 'ar_livre', 'hibrido']).nullable().optional(),
  horario_treino: z.enum(['manha', 'tarde', 'noite', 'flexivel']).nullable().optional(),
  exercicios_favoritos: z.array(z.string()).nullable().optional(),
  exercicios_evitar: z.array(z.string()).nullable().optional(),
  equipamentos_disponiveis: z.array(z.string()).nullable().optional(),
  prefere_maquinas: z.boolean().default(false),
})

export const nutricaoSchema = z.object({
  refeicoes_dia: z.number().min(1).max(10).nullable().optional(),
  consumo_agua_litros: z.number().min(0).max(10).nullable().optional(),
  restricoes_alimentares: z.array(z.string()).nullable().optional(),
  alergias_alimentares: z.array(z.string()).nullable().optional(),
  preferencias_alimentares: z.array(z.string()).nullable().optional(),
  alimentos_nao_gosta: z.array(z.string()).nullable().optional(),
  suplementos_atuais: z.array(z.string()).nullable().optional(),
  objetivo_nutricional: z.string().max(200).nullable().optional(),
  orcamento_alimentacao: z.enum(['baixo', 'medio', 'alto']).nullable().optional(),
  cozinha_propria: z.boolean().nullable().optional(),
  tempo_preparacao_minutos: z.number().min(5).max(180).nullable().optional(),
  frequencia_come_fora: z.number().min(0).max(21).nullable().optional(),
})

export const metaSchema = z.object({
  motivacao_principal: z.string().max(500).nullable().optional(),
  maior_dificuldade: z.string().max(500).nullable().optional(),
  compromisso: z.number().min(1).max(10).nullable().optional(),
  observacoes: z.string().max(2000).nullable().optional(),
})

// Schema completo
export const anamneseSchema = z.object({
  perfil_id: z.string().uuid().nullable().optional(),
  data_avaliacao: z.string().default(() => new Date().toISOString().split('T')[0]),
  proxima_reavaliacao: z.string().nullable().optional(),
  ...medidasSchema.shape,
  ...historicoTreinoSchema.shape,
  ...saudeSchema.shape,
  ...lifestyleSchema.shape,
  ...preferenciasTreinoSchema.shape,
  ...nutricaoSchema.shape,
  ...metaSchema.shape,
})

export type AnamneseSchemaType = z.infer<typeof anamneseSchema>

// Steps do wizard
export const anamneseSteps = [
  { id: 'medidas', title: 'Medidas', schema: medidasSchema },
  { id: 'historico', title: 'Histórico', schema: historicoTreinoSchema },
  { id: 'saude', title: 'Saúde', schema: saudeSchema },
  { id: 'lifestyle', title: 'Lifestyle', schema: lifestyleSchema },
  { id: 'treino', title: 'Treino', schema: preferenciasTreinoSchema },
  { id: 'nutricao', title: 'Nutrição', schema: nutricaoSchema },
  { id: 'meta', title: 'Objetivos', schema: metaSchema },
] as const
