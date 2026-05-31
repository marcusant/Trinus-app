export const EQUIPAMENTOS_CASA = [
  'peso_corporal',
  'halteres',
  'elasticos',
  'barra_fixa',
  'tapete'
] as const

export const EQUIPAMENTOS_GINASIO = [
  'maquinas',
  'barras',
  'halteres',
  'cabos',
  'smith',
  'leg_press',
  'hack_squat'
] as const

export type EquipamentoCasa = typeof EQUIPAMENTOS_CASA[number]
export type EquipamentoGinasio = typeof EQUIPAMENTOS_GINASIO[number]
