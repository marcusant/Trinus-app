export interface Alimento {
  nome: string;
  quantidade: string;
  kcal: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
}

export interface Refeicao {
  numero: number;
  nome: string;
  horario: string;
  alimentos: Alimento[];
  totalKcal: number;
  totalProteina: number;
  totalCarboidrato: number;
  totalGordura: number;
}

export interface ResumoNutricional {
  caloriasTotais: number;
  proteinas: { gramas: number; percentual: number };
  carboidratos: { gramas: number; percentual: number };
  gorduras: { gramas: number; percentual: number };
}

export interface OndeEncontrar {
  categoria: string;
  alimentos: string;
  locais: string[];
}

export interface PlanoAlimentar {
  id?: string;
  alunoId: string;
  alunoNome: string;
  criadoEm: string;
  objetivo: string;
  peso: number;
  altura: number;
  idade: number;
  restricoes?: string;
  resumo: ResumoNutricional;
  refeicoes: Refeicao[];
  ondeEncontrar?: OndeEncontrar[];
  dicas: string[];
  hidratacao: string;
  aviso: string;
}
