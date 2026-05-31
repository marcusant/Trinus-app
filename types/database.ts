export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      anamnese: {
        Row: {
          alergias_alimentares: string[] | null
          alimentos_nao_gosta: string[] | null
          anamnese_anterior_id: string | null
          circunferencia_cintura: number | null
          circunferencia_quadril: number | null
          compromisso: number | null
          consumo_agua_litros: number | null
          cozinha_propria: boolean | null
          created_at: string | null
          data_avaliacao: string | null
          dores_atuais: string[] | null
          equipamentos_disponiveis: string[] | null
          exercicios_evitar: string[] | null
          exercicios_favoritos: string[] | null
          frequencia_anterior: number | null
          frequencia_come_fora: number | null
          horario_acordar: string | null
          horario_dormir: string | null
          horario_treino: string | null
          horas_sono_media: number | null
          id: string
          lesoes_anteriores: string[] | null
          local_treino: string | null
          maior_dificuldade: string | null
          medicamentos: string[] | null
          modalidades_previas: string[] | null
          motivacao_principal: string | null
          nivel_energia: number | null
          nivel_stress: number | null
          objetivo_nutricional: string | null
          observacoes: string | null
          orcamento_alimentacao: string | null
          percentual_gordura: number | null
          perfil_id: string | null
          peso_avaliacao: number | null
          prefere_maquinas: boolean | null
          preferencias_alimentares: string[] | null
          proxima_reavaliacao: string | null
          refeicoes_dia: number | null
          restricoes_alimentares: string[] | null
          restricoes_medicas: string | null
          suplementos_atuais: string[] | null
          tempo_preparacao_minutos: number | null
          tempo_treino_meses: number | null
          tipo_anamnese: string | null
          trabalho_tipo: string | null
        }
        Insert: {
          alergias_alimentares?: string[] | null
          alimentos_nao_gosta?: string[] | null
          anamnese_anterior_id?: string | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          compromisso?: number | null
          consumo_agua_litros?: number | null
          cozinha_propria?: boolean | null
          created_at?: string | null
          data_avaliacao?: string | null
          dores_atuais?: string[] | null
          equipamentos_disponiveis?: string[] | null
          exercicios_evitar?: string[] | null
          exercicios_favoritos?: string[] | null
          frequencia_anterior?: number | null
          frequencia_come_fora?: number | null
          horario_acordar?: string | null
          horario_dormir?: string | null
          horario_treino?: string | null
          horas_sono_media?: number | null
          id?: string
          lesoes_anteriores?: string[] | null
          local_treino?: string | null
          maior_dificuldade?: string | null
          medicamentos?: string[] | null
          modalidades_previas?: string[] | null
          motivacao_principal?: string | null
          nivel_energia?: number | null
          nivel_stress?: number | null
          objetivo_nutricional?: string | null
          observacoes?: string | null
          orcamento_alimentacao?: string | null
          percentual_gordura?: number | null
          perfil_id?: string | null
          peso_avaliacao?: number | null
          prefere_maquinas?: boolean | null
          preferencias_alimentares?: string[] | null
          proxima_reavaliacao?: string | null
          refeicoes_dia?: number | null
          restricoes_alimentares?: string[] | null
          restricoes_medicas?: string | null
          suplementos_atuais?: string[] | null
          tempo_preparacao_minutos?: number | null
          tempo_treino_meses?: number | null
          tipo_anamnese?: string | null
          trabalho_tipo?: string | null
        }
        Update: {
          alergias_alimentares?: string[] | null
          alimentos_nao_gosta?: string[] | null
          anamnese_anterior_id?: string | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          compromisso?: number | null
          consumo_agua_litros?: number | null
          cozinha_propria?: boolean | null
          created_at?: string | null
          data_avaliacao?: string | null
          dores_atuais?: string[] | null
          equipamentos_disponiveis?: string[] | null
          exercicios_evitar?: string[] | null
          exercicios_favoritos?: string[] | null
          frequencia_anterior?: number | null
          frequencia_come_fora?: number | null
          horario_acordar?: string | null
          horario_dormir?: string | null
          horario_treino?: string | null
          horas_sono_media?: number | null
          id?: string
          lesoes_anteriores?: string[] | null
          local_treino?: string | null
          maior_dificuldade?: string | null
          medicamentos?: string[] | null
          modalidades_previas?: string[] | null
          motivacao_principal?: string | null
          nivel_energia?: number | null
          nivel_stress?: number | null
          objetivo_nutricional?: string | null
          observacoes?: string | null
          orcamento_alimentacao?: string | null
          percentual_gordura?: number | null
          perfil_id?: string | null
          peso_avaliacao?: number | null
          prefere_maquinas?: boolean | null
          preferencias_alimentares?: string[] | null
          proxima_reavaliacao?: string | null
          refeicoes_dia?: number | null
          restricoes_alimentares?: string[] | null
          restricoes_medicas?: string | null
          suplementos_atuais?: string[] | null
          tempo_preparacao_minutos?: number | null
          tempo_treino_meses?: number | null
          tipo_anamnese?: string | null
          trabalho_tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "vw_ultima_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vw_reavaliacao_pendente"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      cardio_config: {
        Row: {
          created_at: string | null
          duracao_min: number | null
          frequencia_semanal: number | null
          id: number
          intensidade: string | null
          momento: string | null
          nivel: string | null
          objetivo: string | null
        }
        Insert: {
          created_at?: string | null
          duracao_min?: number | null
          frequencia_semanal?: number | null
          id?: number
          intensidade?: string | null
          momento?: string | null
          nivel?: string | null
          objetivo?: string | null
        }
        Update: {
          created_at?: string | null
          duracao_min?: number | null
          frequencia_semanal?: number | null
          id?: number
          intensidade?: string | null
          momento?: string | null
          nivel?: string | null
          objetivo?: string | null
        }
        Relationships: []
      }
      checkin: {
        Row: {
          acao_sugerida: string | null
          created_at: string | null
          dor_articular: boolean | null
          id: string
          motivacao: number | null
          observacoes: string | null
          plano_id: string | null
          qualidade_sono: number | null
          rpe_percebido: number | null
          semana: number | null
          treinos_completados: number | null
        }
        Insert: {
          acao_sugerida?: string | null
          created_at?: string | null
          dor_articular?: boolean | null
          id?: string
          motivacao?: number | null
          observacoes?: string | null
          plano_id?: string | null
          qualidade_sono?: number | null
          rpe_percebido?: number | null
          semana?: number | null
          treinos_completados?: number | null
        }
        Update: {
          acao_sugerida?: string | null
          created_at?: string | null
          dor_articular?: boolean | null
          id?: string
          motivacao?: number | null
          observacoes?: string | null
          plano_id?: string | null
          qualidade_sono?: number | null
          rpe_percebido?: number | null
          semana?: number | null
          treinos_completados?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_checkin_plano"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_treino"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios: {
        Row: {
          categoria: string | null
          created_at: string | null
          descricao: string | null
          dificuldade: string | null
          equipamento: string
          gif_url: string | null
          grupo_muscular: string
          id: string
          instrucoes: string[] | null
          local: string | null
          musculo_alvo: string
          musculos_secundarios: string[] | null
          nivel: string | null
          nome: string
          nome_en: string
          padrao_movimento: string | null
          pode_ser_principal: boolean | null
          slug: string | null
          tipo_grupo: string | null
          tipo_movimento: string | null
          variacao_de: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          dificuldade?: string | null
          equipamento: string
          gif_url?: string | null
          grupo_muscular: string
          id: string
          instrucoes?: string[] | null
          local?: string | null
          musculo_alvo: string
          musculos_secundarios?: string[] | null
          nivel?: string | null
          nome: string
          nome_en: string
          padrao_movimento?: string | null
          pode_ser_principal?: boolean | null
          slug?: string | null
          tipo_grupo?: string | null
          tipo_movimento?: string | null
          variacao_de?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          dificuldade?: string | null
          equipamento?: string
          gif_url?: string | null
          grupo_muscular?: string
          id?: string
          instrucoes?: string[] | null
          local?: string | null
          musculo_alvo?: string
          musculos_secundarios?: string[] | null
          nivel?: string | null
          nome?: string
          nome_en?: string
          padrao_movimento?: string | null
          pode_ser_principal?: boolean | null
          slug?: string | null
          tipo_grupo?: string | null
          tipo_movimento?: string | null
          variacao_de?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_variacao_de_fkey"
            columns: ["variacao_de"]
            isOneToOne: false
            referencedRelation: "exercicios"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios_cardio: {
        Row: {
          calorias_hora_media: number | null
          created_at: string | null
          id: number
          impacto: string | null
          intensidade_recomendada: string | null
          local: string | null
          nome: string
        }
        Insert: {
          calorias_hora_media?: number | null
          created_at?: string | null
          id?: number
          impacto?: string | null
          intensidade_recomendada?: string | null
          local?: string | null
          nome: string
        }
        Update: {
          calorias_hora_media?: number | null
          created_at?: string | null
          id?: number
          impacto?: string | null
          intensidade_recomendada?: string | null
          local?: string | null
          nome?: string
        }
        Relationships: []
      }
      medicoes: {
        Row: {
          created_at: string | null
          data: string | null
          fotos_urls: Json | null
          id: string
          notas: string | null
          percentual_gordura: number | null
          perfil_id: string | null
          perimetros: Json | null
          peso: number | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          fotos_urls?: Json | null
          id: string
          notas?: string | null
          percentual_gordura?: number | null
          perfil_id?: string | null
          perimetros?: Json | null
          peso?: number | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          fotos_urls?: Json | null
          id?: string
          notas?: string | null
          percentual_gordura?: number | null
          perfil_id?: string | null
          perimetros?: Json | null
          peso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_medicoes_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_medicoes_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vw_reavaliacao_pendente"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      mesociclo_template: {
        Row: {
          acao: string
          created_at: string | null
          id: string
          nivel: string
          rpe_max: number
          rpe_min: number
          semana: number
          zona: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          id?: string
          nivel: string
          rpe_max: number
          rpe_min: number
          semana: number
          zona: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          id?: string
          nivel?: string
          rpe_max?: number
          rpe_min?: number
          semana?: number
          zona?: string
        }
        Relationships: []
      }
      overlap_muscular: {
        Row: {
          coeficiente: number | null
          created_at: string | null
          exercicio_ref: string
          grupo_muscular: string
          id: string
        }
        Insert: {
          coeficiente?: number | null
          created_at?: string | null
          exercicio_ref: string
          grupo_muscular: string
          id?: string
        }
        Update: {
          coeficiente?: number | null
          created_at?: string | null
          exercicio_ref?: string
          grupo_muscular?: string
          id?: string
        }
        Relationships: []
      }
      perfil_utilizador: {
        Row: {
          alergias_alimentares: string[] | null
          altura_cm: number | null
          cidade_residencia: string | null
          circunferencia_cintura: number | null
          condicoes_saude: string[] | null
          created_at: string | null
          data_nascimento: string | null
          dias_disponiveis: string[] | null
          dores_atuais: string[] | null
          email: string | null
          equipamento_disponivel: string[] | null
          frequencia_treino_semanal: number | null
          genero: string | null
          hora_nascimento: string | null
          horas_sono_media: number | null
          id: string
          lesoes_anteriores: string[] | null
          local_nascimento_cidade: string | null
          local_nascimento_pais: string | null
          local_treino: string | null
          nacionalidade: string | null
          nivel_experiencia: string | null
          nivel_stress: number | null
          nome: string
          objetivo_principal: string | null
          objetivos_secundarios: string[] | null
          observacoes: string | null
          onboarding_completo: boolean | null
          onboarding_step: number | null
          pais_residencia: string | null
          percentual_gordura: number | null
          peso_avaliacao: number | null
          restricoes_medicas: string | null
          role: string | null
          telefone: string | null
          tempo_disponivel_minutos: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alergias_alimentares?: string[] | null
          altura_cm?: number | null
          cidade_residencia?: string | null
          circunferencia_cintura?: number | null
          condicoes_saude?: string[] | null
          created_at?: string | null
          data_nascimento?: string | null
          dias_disponiveis?: string[] | null
          dores_atuais?: string[] | null
          email?: string | null
          equipamento_disponivel?: string[] | null
          frequencia_treino_semanal?: number | null
          genero?: string | null
          hora_nascimento?: string | null
          horas_sono_media?: number | null
          id?: string
          lesoes_anteriores?: string[] | null
          local_nascimento_cidade?: string | null
          local_nascimento_pais?: string | null
          local_treino?: string | null
          nacionalidade?: string | null
          nivel_experiencia?: string | null
          nivel_stress?: number | null
          nome: string
          objetivo_principal?: string | null
          objetivos_secundarios?: string[] | null
          observacoes?: string | null
          onboarding_completo?: boolean | null
          onboarding_step?: number | null
          pais_residencia?: string | null
          percentual_gordura?: number | null
          peso_avaliacao?: number | null
          restricoes_medicas?: string | null
          role?: string | null
          telefone?: string | null
          tempo_disponivel_minutos?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alergias_alimentares?: string[] | null
          altura_cm?: number | null
          cidade_residencia?: string | null
          circunferencia_cintura?: number | null
          condicoes_saude?: string[] | null
          created_at?: string | null
          data_nascimento?: string | null
          dias_disponiveis?: string[] | null
          dores_atuais?: string[] | null
          email?: string | null
          equipamento_disponivel?: string[] | null
          frequencia_treino_semanal?: number | null
          genero?: string | null
          hora_nascimento?: string | null
          horas_sono_media?: number | null
          id?: string
          lesoes_anteriores?: string[] | null
          local_nascimento_cidade?: string | null
          local_nascimento_pais?: string | null
          local_treino?: string | null
          nacionalidade?: string | null
          nivel_experiencia?: string | null
          nivel_stress?: number | null
          nome?: string
          objetivo_principal?: string | null
          objetivos_secundarios?: string[] | null
          observacoes?: string | null
          onboarding_completo?: boolean | null
          onboarding_step?: number | null
          pais_residencia?: string | null
          percentual_gordura?: number | null
          peso_avaliacao?: number | null
          restricoes_medicas?: string | null
          role?: string | null
          telefone?: string | null
          tempo_disponivel_minutos?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      plano_exercicio: {
        Row: {
          created_at: string | null
          descanso_seg: number | null
          exercicio_id: string | null
          id: string
          observacao: string | null
          ordem: number | null
          reps_max: number | null
          reps_min: number | null
          rpe_alvo: number | null
          series: number | null
          sessao_id: string | null
        }
        Insert: {
          created_at?: string | null
          descanso_seg?: number | null
          exercicio_id?: string | null
          id?: string
          observacao?: string | null
          ordem?: number | null
          reps_max?: number | null
          reps_min?: number | null
          rpe_alvo?: number | null
          series?: number | null
          sessao_id?: string | null
        }
        Update: {
          created_at?: string | null
          descanso_seg?: number | null
          exercicio_id?: string | null
          id?: string
          observacao?: string | null
          ordem?: number | null
          reps_max?: number | null
          reps_min?: number | null
          rpe_alvo?: number | null
          series?: number | null
          sessao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plano_exercicio_exercicio_id_fkey"
            columns: ["exercicio_id"]
            isOneToOne: false
            referencedRelation: "exercicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_exercicio_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "plano_sessao"
            referencedColumns: ["id"]
          },
        ]
      }
      plano_sessao: {
        Row: {
          created_at: string | null
          foco: string | null
          id: string
          letra: string | null
          ordem: number | null
          plano_id: string | null
        }
        Insert: {
          created_at?: string | null
          foco?: string | null
          id?: string
          letra?: string | null
          ordem?: number | null
          plano_id?: string | null
        }
        Update: {
          created_at?: string | null
          foco?: string | null
          id?: string
          letra?: string | null
          ordem?: number | null
          plano_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_plano_sessao_plano"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_treino"
            referencedColumns: ["id"]
          },
        ]
      }
      plano_volume: {
        Row: {
          created_at: string | null
          grupo_muscular: string | null
          id: string
          plano_id: string | null
          series_diretas: number | null
          series_indiretas: number | null
          total_efetivo: number | null
          zona: string | null
        }
        Insert: {
          created_at?: string | null
          grupo_muscular?: string | null
          id?: string
          plano_id?: string | null
          series_diretas?: number | null
          series_indiretas?: number | null
          total_efetivo?: number | null
          zona?: string | null
        }
        Update: {
          created_at?: string | null
          grupo_muscular?: string | null
          id?: string
          plano_id?: string | null
          series_diretas?: number | null
          series_indiretas?: number | null
          total_efetivo?: number | null
          zona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_plano_volume_plano"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_treino"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_alimentares: {
        Row: {
          altura: number | null
          anamnese_id: string | null
          ativo: boolean | null
          contexto: string | null
          created_at: string | null
          duracao_semanas: number | null
          id: string
          idade: number | null
          idioma: string | null
          kcal_diarias: number | null
          localizacao: string | null
          nome: string | null
          objetivo: string | null
          perfil_id: string | null
          peso: number | null
          plano: string | null
          refeicoes_dia: number | null
          restricoes: string | null
          tipo: string | null
        }
        Insert: {
          altura?: number | null
          anamnese_id?: string | null
          ativo?: boolean | null
          contexto?: string | null
          created_at?: string | null
          duracao_semanas?: number | null
          id?: string
          idade?: number | null
          idioma?: string | null
          kcal_diarias?: number | null
          localizacao?: string | null
          nome?: string | null
          objetivo?: string | null
          perfil_id?: string | null
          peso?: number | null
          plano?: string | null
          refeicoes_dia?: number | null
          restricoes?: string | null
          tipo?: string | null
        }
        Update: {
          altura?: number | null
          anamnese_id?: string | null
          ativo?: boolean | null
          contexto?: string | null
          created_at?: string | null
          duracao_semanas?: number | null
          id?: string
          idade?: number | null
          idioma?: string | null
          kcal_diarias?: number | null
          localizacao?: string | null
          nome?: string | null
          objetivo?: string | null
          perfil_id?: string | null
          peso?: number | null
          plano?: string | null
          refeicoes_dia?: number | null
          restricoes?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_planos_alimentares_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_planos_alimentares_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vw_reavaliacao_pendente"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "planos_alimentares_anamnese_id_fkey"
            columns: ["anamnese_id"]
            isOneToOne: false
            referencedRelation: "anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_alimentares_anamnese_id_fkey"
            columns: ["anamnese_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_alimentares_anamnese_id_fkey"
            columns: ["anamnese_id"]
            isOneToOne: false
            referencedRelation: "vw_ultima_anamnese"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_treino: {
        Row: {
          anamnese_id: string | null
          ativo: boolean | null
          conteudo: string | null
          created_at: string | null
          duracao_semanas: number | null
          frequencia_semanal: number | null
          id: string
          local_treino: string | null
          nivel: string | null
          nome: string | null
          objetivo: string
          observacoes: string | null
          perfil_id: string
          tempo_treino: number | null
          updated_at: string | null
        }
        Insert: {
          anamnese_id?: string | null
          ativo?: boolean | null
          conteudo?: string | null
          created_at?: string | null
          duracao_semanas?: number | null
          frequencia_semanal?: number | null
          id?: string
          local_treino?: string | null
          nivel?: string | null
          nome?: string | null
          objetivo: string
          observacoes?: string | null
          perfil_id: string
          tempo_treino?: number | null
          updated_at?: string | null
        }
        Update: {
          anamnese_id?: string | null
          ativo?: boolean | null
          conteudo?: string | null
          created_at?: string | null
          duracao_semanas?: number | null
          frequencia_semanal?: number | null
          id?: string
          local_treino?: string | null
          nivel?: string | null
          nome?: string | null
          objetivo?: string
          observacoes?: string | null
          perfil_id?: string
          tempo_treino?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_plano_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_plano_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vw_reavaliacao_pendente"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fk_planos_treino_anamnese"
            columns: ["anamnese_id"]
            isOneToOne: false
            referencedRelation: "anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_planos_treino_anamnese"
            columns: ["anamnese_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_planos_treino_anamnese"
            columns: ["anamnese_id"]
            isOneToOne: false
            referencedRelation: "vw_ultima_anamnese"
            referencedColumns: ["id"]
          },
        ]
      }
      rpe_config: {
        Row: {
          created_at: string | null
          id: string
          nivel: string
          rpe_deload_max: number | null
          rpe_deload_min: number | null
          rpe_maximo: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          nivel: string
          rpe_deload_max?: number | null
          rpe_deload_min?: number | null
          rpe_maximo: number
        }
        Update: {
          created_at?: string | null
          id?: string
          nivel?: string
          rpe_deload_max?: number | null
          rpe_deload_min?: number | null
          rpe_maximo?: number
        }
        Relationships: []
      }
      split_template: {
        Row: {
          created_at: string | null
          dias_semana: number
          distribuicao: Json
          id: string
          nivel_recomendado: string[] | null
          nome: string
        }
        Insert: {
          created_at?: string | null
          dias_semana: number
          distribuicao: Json
          id?: string
          nivel_recomendado?: string[] | null
          nome: string
        }
        Update: {
          created_at?: string | null
          dias_semana?: number
          distribuicao?: Json
          id?: string
          nivel_recomendado?: string[] | null
          nome?: string
        }
        Relationships: []
      }
      volume_config: {
        Row: {
          created_at: string | null
          genero: string
          grupo_muscular: string | null
          grupo_tipo: string
          id: string
          limite_sessao: number | null
          mav_max: number
          mav_min: number
          mev_max: number
          mev_min: number
          mrv: number
          nivel: string
        }
        Insert: {
          created_at?: string | null
          genero: string
          grupo_muscular?: string | null
          grupo_tipo: string
          id?: string
          limite_sessao?: number | null
          mav_max: number
          mav_min: number
          mev_max: number
          mev_min: number
          mrv: number
          nivel: string
        }
        Update: {
          created_at?: string | null
          genero?: string
          grupo_muscular?: string | null
          grupo_tipo?: string
          id?: string
          limite_sessao?: number | null
          mav_max?: number
          mav_min?: number
          mev_max?: number
          mev_min?: number
          mrv?: number
          nivel?: string
        }
        Relationships: []
      }
    }
    Views: {
      vw_historico_anamnese: {
        Row: {
          anamnese_anterior_id: string | null
          data_anterior: string | null
          data_avaliacao: string | null
          delta_gordura: number | null
          delta_peso: number | null
          gordura_anterior: number | null
          horas_sono_media: number | null
          id: string | null
          nivel_energia: number | null
          nivel_stress: number | null
          numero_avaliacao: number | null
          percentual_gordura: number | null
          perfil_id: string | null
          peso_anterior: number | null
          peso_avaliacao: number | null
          tipo_anamnese: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "vw_ultima_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vw_reavaliacao_pendente"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      vw_reavaliacao_pendente: {
        Row: {
          dias_atraso: number | null
          email: string | null
          nome: string | null
          perfil_id: string | null
          proxima_reavaliacao: string | null
          status_reavaliacao: string | null
          ultima_avaliacao: string | null
        }
        Relationships: []
      }
      vw_ultima_anamnese: {
        Row: {
          alergias_alimentares: string[] | null
          alimentos_nao_gosta: string[] | null
          anamnese_anterior_id: string | null
          circunferencia_cintura: number | null
          circunferencia_quadril: number | null
          compromisso: number | null
          consumo_agua_litros: number | null
          cozinha_propria: boolean | null
          created_at: string | null
          data_avaliacao: string | null
          dores_atuais: string[] | null
          equipamentos_disponiveis: string[] | null
          exercicios_evitar: string[] | null
          exercicios_favoritos: string[] | null
          frequencia_anterior: number | null
          frequencia_come_fora: number | null
          horario_acordar: string | null
          horario_dormir: string | null
          horario_treino: string | null
          horas_sono_media: number | null
          id: string | null
          lesoes_anteriores: string[] | null
          maior_dificuldade: string | null
          medicamentos: string[] | null
          modalidades_previas: string[] | null
          motivacao_principal: string | null
          nivel_energia: number | null
          nivel_stress: number | null
          objetivo_nutricional: string | null
          observacoes: string | null
          orcamento_alimentacao: string | null
          percentual_gordura: number | null
          perfil_id: string | null
          peso_avaliacao: number | null
          prefere_maquinas: boolean | null
          preferencias_alimentares: string[] | null
          proxima_reavaliacao: string | null
          refeicoes_dia: number | null
          restricoes_alimentares: string[] | null
          restricoes_medicas: string | null
          suplementos_atuais: string[] | null
          tempo_preparacao_minutos: number | null
          tempo_treino_meses: number | null
          tipo_anamnese: string | null
          trabalho_tipo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_anamnese_anterior_id_fkey"
            columns: ["anamnese_anterior_id"]
            isOneToOne: false
            referencedRelation: "vw_ultima_anamnese"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vw_reavaliacao_pendente"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
    }
    Functions: {
      fn_criar_reavaliacao: {
        Args: { p_perfil_id: string; p_tipo?: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
