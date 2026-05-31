export interface PerfilUtilizador {
  id: string
  user_id: string | null
  nome: string
  email: string | null
  genero: 'masculino' | 'feminino' | 'outro' | null
  data_nascimento: string | null // formato: YYYY-MM-DD
  hora_nascimento: string | null // formato: HH:MM
  local_nascimento_cidade: string | null
  local_nascimento_pais: string | null
  nacionalidade: string | null
  cidade_residencia: string | null
  pais_residencia: string | null
  telefone: string | null
  role: 'user' | 'admin' | 'trainer'
  onboarding_completo: boolean
  onboarding_step: number
  observacoes: string | null
  created_at: string
  updated_at: string
}

export type PerfilFormData = Omit<PerfilUtilizador, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'role' | 'onboarding_completo' | 'onboarding_step'>
