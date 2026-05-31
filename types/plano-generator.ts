// types/plano-generator.ts

export interface UserData {
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  genero: string;
  nivel: string;
  objetivo: string;
  frequencia: number;
  local: string;
  restricoes: string[];
  lesoes: string[];
  condicoes_saude: string[];
  stress: number;
  qualidade_sono: string;
}

export interface RAGConfigs {
  volumeConfig: VolumeConfig[];
  rpeConfig: RPEConfig;
  mesocicloTemplate: MesocicloSemana[];
  overlapMuscular: OverlapEntry[];
}

export interface VolumeConfig {
  nivel: string;  
  genero: string; 
  grupo_tipo: string;
  grupo_muscular: string | null;
  mev_min: number;
  mev_max: number;
  mav_min: number;
  mav_max: number;
  mrv: number;
  limite_sessao: number;
}

export interface RPEConfig {
  nivel: string;                    // ← ADICIONADO
  rpe_maximo: number;
  rpe_deload_min: number;
  rpe_deload_max: number;
}

export interface MesocicloSemana {
  nivel: string;                    // ← ADICIONADO
  semana: number;
  zona: string;
  rpe_min: number;
  rpe_max: number;
  acao: string;
}

export interface OverlapEntry {
  exercicio_ref: string;
  grupo_muscular: string;
  coeficiente: number;
}

export interface PlanoGerado {
  sessoes: SessaoGerada[];
  distribuicao_semanal: string[];
  volume_prescrito: VolumeGrupo[];
  duracao_semanas: number;
  observacoes?: string;
}

export interface SessaoGerada {
  letra: string;
  foco: string;
  exercicios: ExercicioGerado[];
}

export interface ExercicioGerado {
  exercicio_id: string;
  nome: string;
  series: number;
  reps_min: number;
  reps_max: number;
  rpe_alvo: number;
  descanso_seg: number;
  observacao: string;
}

export interface VolumeGrupo {
  grupo: string;
  diretas: number;
  indiretas: number;
  total_efetivo: number;
  zona: string;
}
