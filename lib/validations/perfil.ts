import { z } from 'zod'

export const perfilSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').nullable().optional(),
  genero: z.enum(['masculino', 'feminino', 'outro']).nullable().optional(),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD').nullable().optional(),
  hora_nascimento: z.string().regex(/^\d{2}:\d{2}$/, 'Formato: HH:MM').nullable().optional(),
  local_nascimento_cidade: z.string().max(100).nullable().optional(),
  local_nascimento_pais: z.string().max(100).nullable().optional(),
  nacionalidade: z.string().max(100).nullable().optional(),
  cidade_residencia: z.string().max(100).nullable().optional(),
  pais_residencia: z.string().max(100).nullable().optional(),
  telefone: z.string().max(20).nullable().optional(),
  observacoes: z.string().max(1000).nullable().optional(),
})

export type PerfilSchemaType = z.infer<typeof perfilSchema>
