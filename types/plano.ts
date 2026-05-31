// Tipos de Anamnese
export type TipoAnamnese = 'treino' | 'nutricao' | 'completa'

export interface Anamnese {
  id: string
  aluno_id: string
  tipo: TipoAnamnese
  dados: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Tipos de Plano de Treino
export interface Exercicio {
  nome: string
  series: number
  repeticoes: string
  descanso: string
  observacoes?: string
  gif_url?: string
}

export interface DiasTreino {
  dia: string
  foco: string
  exercicios: Exercicio[]
}

export interface PlanoTreino {
  id: string
  aluno_id: string
  anamnese_id: string
  nome: string
  objetivo: string
  frequencia_semanal: number
  dias: DiasTreino[]
  observacoes_gerais?: string
  created_at: string
}

// Tipos de Plano Alimentar
export interface Refeicao {
  nome: string
  horario: string
  alimentos: string[]
  calorias_estimadas: number
  macros: {
    proteina: number
    carboidrato: number
    gordura: number
  }
}

export interface PlanoAlimentar {
  id: string
  aluno_id: string
  anamnese_id: string
  nome: string
  objetivo: string
  calorias_diarias: number
  refeicoes: Refeicao[]
  observacoes?: string
  created_at: string
}
