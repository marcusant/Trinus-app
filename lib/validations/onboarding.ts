// lib/validations/onboarding.ts

import { z } from 'zod'

export const onboardingSchema = z.object({
  // Step 1 - Dados Pessoais
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  data_nascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória'),
  genero: z
    .enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer']),
  telefone: z
    .string()
    .optional(),  // Opcional no onboarding

  // Step 2 - Origem
  nacionalidade: z
    .string()
    .min(1, 'Nacionalidade é obrigatória'),
  cidade_residencia: z
    .string()
    .min(1, 'Cidade é obrigatória'),
  pais_residencia: z
    .string()
    .min(1, 'País é obrigatório'),

  // Step 3 - Objetivos
  objetivo: z.enum([
    'Emagrecer',
    'Hipertrofia',
    'Saúde Geral',
    'Performance',
    'Recomposição Corporal',
    'Flexibilidade',
  ]),
  nivel: z.enum([
    'Iniciante',
    'Intermediário',
    'Avançado',
  ]),
  dias_disponiveis: z
    .number()
    .min(1, 'Mínimo 1 dia')
    .max(7, 'Máximo 7 dias'),
  minutos_por_sessao: z
    .number()
    .min(15, 'Mínimo 15 minutos')
    .max(180, 'Máximo 180 minutos'),
  local_treino: z.enum([
    'Ginásio',
    'Casa',
    'Ar Livre',
    'Híbrido',
  ]),
  // PAR-Q Simplificado (Segurança)
  par_q_dor_peito: z.boolean(),
  par_q_perda_equilibrio: z.boolean(),
  par_q_problema_cardiaco: z.boolean(),
  par_q_proibido_medico: z.boolean(),
  par_q_pressao_alta: z.boolean(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
