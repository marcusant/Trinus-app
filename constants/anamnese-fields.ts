// Mapeamento entre o formulário e a base de dados

// Função para converter dados do form para DB
export function formToDb(formData: Record<string, any>) {
    return {
      data_nascimento: formData.data_nascimento || null,
      genero: formData.genero || null,
      profissao: formData.profissao || null,
      patologias: formData.patologias || null,
      medicamentos: formData.medicamentos || null,
      lesoes_atuais: formData.lesoes || null,
      alergias: formData.alergias_alimentares || null,
      restricoes_alimentares: formData.restricoes_alimentares || null,
      objetivo_nutricional: formData.objetivo_nutricional || null,
      refeicoes_dia: formData.refeicoes_dia,
      hidratacao_diaria: formData.agua_litros?.toString() || null,
      suplementos_atuais: formData.suplementos || null,
      nivel_atividade: formData.nivel_atividade || null,
      horas_sono: formData.horas_sono,
      qualidade_sono: formData.qualidade_sono,
      objetivo_treino: formData.objetivo_treino || null,
      nivel_experiencia: formData.nivel_experiencia || null,
      dias_disponiveis: formData.dias_disponiveis,
      duracao_sessao: formData.tempo_treino,
      equipamento_disponivel: formData.equipamentos || null,
      mobilidade_limitacoes: formData.limitacoes_fisicas || null,
      peso: formData.peso,
      altura: formData.altura,
      nivel_stress: formData.nivel_stress,
      objetivos_mentais: formData.objetivos_mentais || null,
      observacoes: formData.observacoes || null,
    };
  }
  
  // Função para converter dados da DB para o form
  export function dbToForm(dbData: Record<string, any>) {
    return {
      data_nascimento: dbData.data_nascimento || '',
      genero: dbData.genero || '',
      profissao: dbData.profissao || '',
      patologias: dbData.patologias || '',
      medicamentos: dbData.medicamentos || '',
      lesoes: dbData.lesoes_atuais || '',
      alergias_alimentares: dbData.alergias || '',
      restricoes_alimentares: dbData.restricoes_alimentares || '',
      objetivo_nutricional: dbData.objetivo_nutricional || '',
      refeicoes_dia: dbData.refeicoes_dia || 4,
      agua_litros: parseFloat(dbData.hidratacao_diaria) || 2,
      suplementos: dbData.suplementos_atuais || '',
      nivel_atividade: dbData.nivel_atividade || '',
      horas_sono: dbData.horas_sono || 7,
      qualidade_sono: dbData.qualidade_sono || 7,
      objetivo_treino: dbData.objetivo_treino || '',
      nivel_experiencia: dbData.nivel_experiencia || '',
      dias_disponiveis: dbData.dias_disponiveis || 4,
      tempo_treino: dbData.duracao_sessao || 60,
      equipamentos: dbData.equipamento_disponivel || '',
      limitacoes_fisicas: dbData.mobilidade_limitacoes || '',
      peso: dbData.peso || null,
      altura: dbData.altura || null,
      nivel_stress: dbData.nivel_stress || 5,
      objetivos_mentais: dbData.objetivos_mentais || '',
      observacoes: dbData.observacoes || '',
    };
  }
  