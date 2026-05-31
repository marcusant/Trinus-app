// components/forms/anamnese/constants.ts

export const MODALIDADES = [
  'Musculação', 'Crossfit', 'Funcional', 'Pilates', 'Yoga',
  'Natação', 'Corrida', 'Ciclismo', 'Artes Marciais', 'Dança',
  'HIIT', 'Calistenia', 'Outro'
]

export const LESOES_COMUNS = [
  'Ombro', 'Joelho', 'Lombar', 'Cervical', 'Tornozelo',
  'Punho', 'Quadril', 'Cotovelo', 'Nenhuma'
]

export const DORES_COMUNS = [
  'Lombar', 'Cervical', 'Joelho', 'Ombro', 'Cabeça',
  'Punho', 'Quadril', 'Nenhuma'
]

export const RESTRICOES_ALIMENTARES = [
  'Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose',
  'Low Carb', 'Kosher', 'Halal', 'Nenhuma'
]

export const ALERGIAS_COMUNS = [
  'Amendoim', 'Frutos do Mar', 'Ovo', 'Leite', 'Soja',
  'Trigo', 'Nozes', 'Nenhuma'
]

export const PREFERENCIAS_ALIMENTARES = [
  'Comida Caseira', 'Meal Prep', 'Delivery Saudável',
  'Refeições Rápidas', 'Cozinhar Elaborado'
]

export const SUPLEMENTOS = [
  'Whey Protein', 'Creatina', 'BCAA', 'Pré-treino',
  'Multivitamínico', 'Ômega 3', 'Cafeína', 'Glutamina', 'Nenhum'
]

export const EQUIPAMENTOS = [
  'Halteres', 'Barras', 'Máquinas', 'Cabos', 'Kettlebell',
  'Elásticos', 'TRX', 'Bola Suíça', 'Step', 'Banco', 'Nenhum específico'
]

export const EXERCICIOS_POPULARES = [
  'Agachamento', 'Supino', 'Levantamento Terra', 'Remada',
  'Pull-up', 'Leg Press', 'Desenvolvimento', 'Rosca Bíceps',
  'Tríceps', 'Abdominais', 'Cardio', 'Funcional', 'Stiff', 'Afundo'
]

export const TRABALHO_TIPOS = [
  { value: 'sedentario', label: 'Sedentário (escritório)' },
  { value: 'leve', label: 'Atividade Leve' },
  { value: 'moderado', label: 'Moderado (em pé, caminha)' },
  { value: 'ativo', label: 'Ativo (trabalho físico)' },
  { value: 'remoto', label: 'Remoto/Home office' },
]

export const HORARIOS_TREINO = [
  { value: 'manha_cedo', label: 'Manhã cedo (6h-8h)' },
  { value: 'manha', label: 'Manhã (8h-12h)' },
  { value: 'almoco', label: 'Hora de almoço (12h-14h)' },
  { value: 'tarde', label: 'Tarde (14h-18h)' },
  { value: 'noite', label: 'Noite (18h-21h)' },
  { value: 'noite_tarde', label: 'Noite tarde (21h+)' },
  { value: 'flexivel', label: 'Flexível' },
]

export const LOCAIS_TREINO = [
  { value: 'ginasio', label: '🏋️ Ginásio' },
  { value: 'casa', label: '🏠 Casa' },
  { value: 'ar_livre', label: '🌳 Ar Livre' },
  { value: 'misto', label: '🔄 Misto (varia)' },
]

export const OBJETIVOS_NUTRICIONAIS = [
  { value: 'perda_peso', label: 'Perda de peso' },
  { value: 'ganho_massa', label: 'Ganho de massa muscular' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'performance', label: 'Performance esportiva' },
  { value: 'saude', label: 'Saúde geral' },
  { value: 'recomposicao', label: 'Recomposição corporal' },
]

export const ORCAMENTOS = [
  { value: 'economico', label: 'Económico (até €150/mês)' },
  { value: 'moderado', label: 'Moderado (€150-300/mês)' },
  { value: 'confortavel', label: 'Confortável (€300-500/mês)' },
  { value: 'sem_restricao', label: 'Sem restrição' },
]

export const STEPS = [
  { id: 1, key: 'historico', title: 'Histórico', icon: '🏋️' },
  { id: 2, key: 'medidas', title: 'Medidas', icon: '📏' },
  { id: 3, key: 'saude', title: 'Saúde', icon: '🩺' },
  { id: 4, key: 'rotina', title: 'Rotina', icon: '⏰' },
  { id: 5, key: 'alimentacao', title: 'Alimentação', icon: '🥗' },
  { id: 6, key: 'preferencias', title: 'Preferências', icon: '⭐' },
  { id: 7, key: 'motivacao', title: 'Motivação', icon: '🎯' },
]

// Estilos reutilizáveis
export const selectStyles = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238340f0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '20px'
} as React.CSSProperties
