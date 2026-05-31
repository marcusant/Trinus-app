// Mapeamento de valores do banco para labels amigáveis

export const objetivoTreinoLabels: Record<string, string> = {
    hipertrofia: 'Hipertrofia',
    forca: 'Força',
    emagrecimento: 'Emagrecimento',
    resistencia: 'Resistência',
    saude: 'Saúde Geral',
    reabilitacao: 'Reabilitação',
    performance: 'Performance Desportiva',
  };
  
  export const objetivoNutricionalLabels: Record<string, string> = {
    perda_peso: 'Perda de Peso',
    ganho_massa: 'Ganho de Massa',
    manutencao: 'Manutenção',
    saude_geral: 'Saúde Geral',
    performance: 'Performance Desportiva',
  };
  
  export const nivelAtividadeLabels: Record<string, string> = {
    sedentario: 'Sedentário',
    leve: 'Levemente Ativo',
    moderado: 'Moderadamente Ativo',
    ativo: 'Muito Ativo',
    atleta: 'Atleta',
  };
  
  export const nivelExperienciaLabels: Record<string, string> = {
    iniciante: 'Iniciante',
    intermedio: 'Intermédio',
    avancado: 'Avançado',
  };
  
  export const generoLabels: Record<string, string> = {
    masculino: 'Masculino',
    feminino: 'Feminino',
    outro: 'Outro',
  };
  
  // Função genérica para traduzir
  export function traduzir(valor: string | null | undefined, mapa: Record<string, string>): string {
    if (!valor) return '-';
    return mapa[valor] || valor;
  }
  