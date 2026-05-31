// ========== PLANO DE TREINO ==========
export interface ExercicioTreino {
    nome: string;
    series: number;
    repeticoes: string;
    descanso_segundos: number;
    observacao?: string;
    equipamento?: string;
  }
  
  export interface DiaTreino {
    dia: number;
    nome: string;
    foco: string[];
    aquecimento?: string;
    exercicios: ExercicioTreino[];
    alongamento?: string;
  }
  
  export interface PlanoTreinoEstruturado {
    nome: string;
    objetivo: string;
    nivel: string;
    frequencia_semanal: number;
    duracao_semanas: number;
    observacoes_gerais?: string;
    dias: DiaTreino[];
  }
  
  // ========== PLANO ALIMENTAR ==========
  export interface AlimentoRefeicao {
    item: string;
    quantidade?: string;
    calorias?: number;
  }
  
  export interface Refeicao {
    nome: string;
    horario: string;
    alimentos: AlimentoRefeicao[];
    calorias_total?: number;
  }
  
  export interface PlanoAlimentarEstruturado {
    nome: string;
    objetivo: string;
    calorias_diarias: number;
    macros: {
      proteina_g: number;
      carboidrato_g: number;
      gordura_g: number;
    };
    refeicoes: Refeicao[];
    observacoes?: string;
    hidratacao_litros?: number;
  }
  