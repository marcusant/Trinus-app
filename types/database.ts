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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anamnese: {
        Row: {
          alergias_alimentares: string[]
          alimentos_nao_gosta: string[]
          altura_cm: number | null
          circunferencia_cintura: number | null
          circunferencia_quadril: number | null
          client_id: string
          compromisso: number | null
          consumo_agua_litros: number | null
          cozinha_propria: boolean | null
          created_at: string
          data_avaliacao: string
          dores_atuais: string[]
          equipamentos_disponiveis: string[]
          exercicios_evitar: string[]
          exercicios_favoritos: string[]
          frequencia_anterior: number | null
          frequencia_come_fora: number | null
          horario_acordar: string | null
          horario_dormir: string | null
          horario_treino: string | null
          horas_sono_media: number | null
          id: string
          lesoes_anteriores: string[]
          local_treino: string | null
          maior_dificuldade: string | null
          medicamentos: string[]
          modalidades_previas: string[]
          motivacao_principal: string | null
          nivel_energia: number | null
          nivel_stress: number | null
          objetivo_nutricional: string | null
          observacoes: string | null
          orcamento_alimentacao: string | null
          percentual_gordura: number | null
          peso_avaliacao: number | null
          prefere_maquinas: boolean | null
          preferencias_alimentares: string[]
          proxima_reavaliacao: string | null
          refeicoes_dia: number | null
          restricoes_alimentares: string[]
          restricoes_medicas: string | null
          suplementos_atuais: string[]
          tempo_preparacao_minutos: number | null
          tempo_treino_meses: number | null
          tipo: string
          trabalho_tipo: string | null
          updated_at: string
        }
        Insert: {
          alergias_alimentares?: string[]
          alimentos_nao_gosta?: string[]
          altura_cm?: number | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          client_id: string
          compromisso?: number | null
          consumo_agua_litros?: number | null
          cozinha_propria?: boolean | null
          created_at?: string
          data_avaliacao?: string
          dores_atuais?: string[]
          equipamentos_disponiveis?: string[]
          exercicios_evitar?: string[]
          exercicios_favoritos?: string[]
          frequencia_anterior?: number | null
          frequencia_come_fora?: number | null
          horario_acordar?: string | null
          horario_dormir?: string | null
          horario_treino?: string | null
          horas_sono_media?: number | null
          id?: string
          lesoes_anteriores?: string[]
          local_treino?: string | null
          maior_dificuldade?: string | null
          medicamentos?: string[]
          modalidades_previas?: string[]
          motivacao_principal?: string | null
          nivel_energia?: number | null
          nivel_stress?: number | null
          objetivo_nutricional?: string | null
          observacoes?: string | null
          orcamento_alimentacao?: string | null
          percentual_gordura?: number | null
          peso_avaliacao?: number | null
          prefere_maquinas?: boolean | null
          preferencias_alimentares?: string[]
          proxima_reavaliacao?: string | null
          refeicoes_dia?: number | null
          restricoes_alimentares?: string[]
          restricoes_medicas?: string | null
          suplementos_atuais?: string[]
          tempo_preparacao_minutos?: number | null
          tempo_treino_meses?: number | null
          tipo?: string
          trabalho_tipo?: string | null
          updated_at?: string
        }
        Update: {
          alergias_alimentares?: string[]
          alimentos_nao_gosta?: string[]
          altura_cm?: number | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          client_id?: string
          compromisso?: number | null
          consumo_agua_litros?: number | null
          cozinha_propria?: boolean | null
          created_at?: string
          data_avaliacao?: string
          dores_atuais?: string[]
          equipamentos_disponiveis?: string[]
          exercicios_evitar?: string[]
          exercicios_favoritos?: string[]
          frequencia_anterior?: number | null
          frequencia_come_fora?: number | null
          horario_acordar?: string | null
          horario_dormir?: string | null
          horario_treino?: string | null
          horas_sono_media?: number | null
          id?: string
          lesoes_anteriores?: string[]
          local_treino?: string | null
          maior_dificuldade?: string | null
          medicamentos?: string[]
          modalidades_previas?: string[]
          motivacao_principal?: string | null
          nivel_energia?: number | null
          nivel_stress?: number | null
          objetivo_nutricional?: string | null
          observacoes?: string | null
          orcamento_alimentacao?: string | null
          percentual_gordura?: number | null
          peso_avaliacao?: number | null
          prefere_maquinas?: boolean | null
          preferencias_alimentares?: string[]
          proxima_reavaliacao?: string | null
          refeicoes_dia?: number | null
          restricoes_alimentares?: string[]
          restricoes_medicas?: string | null
          suplementos_atuais?: string[]
          tempo_preparacao_minutos?: number | null
          tempo_treino_meses?: number | null
          tipo?: string
          trabalho_tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["assessment_status"]
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["assessment_status"]
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["assessment_status"]
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          client_id: string
          created_at: string
          date: string
          energy_level: number | null
          id: string
          mood: number | null
          notes: string | null
          photo_url: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          client_id: string
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          photo_url?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          photo_url?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: string | null
          created_at: string
          difficulty: string | null
          equipment: string | null
          exercise_code: string | null
          exercise_type: string
          id: string
          location: string | null
          muscle_group: string | null
          name: string
          secondary_muscles: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          difficulty?: string | null
          equipment?: string | null
          exercise_code?: string | null
          exercise_type?: string
          id?: string
          location?: string | null
          muscle_group?: string | null
          name: string
          secondary_muscles?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          difficulty?: string | null
          equipment?: string | null
          exercise_code?: string | null
          exercise_type?: string
          id?: string
          location?: string | null
          muscle_group?: string | null
          name?: string
          secondary_muscles?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      meal_days: {
        Row: {
          created_at: string
          day_number: number
          id: string
          name: string | null
          plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_number: number
          id?: string
          name?: string | null
          plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_number?: number
          id?: string
          name?: string | null
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_items: {
        Row: {
          calories: number | null
          created_at: string
          id: string
          meal_id: string
          name: string
          quantity: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          id?: string
          meal_id: string
          name: string
          quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          id?: string
          meal_id?: string
          name?: string
          quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          client_id: string
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["plan_status"]
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["plan_status"]
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["plan_status"]
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          day_id: string
          id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          time_scheduled: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_id: string
          id?: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          time_scheduled?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_id?: string
          id?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          name?: string
          time_scheduled?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "meal_days"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          metadata: Json | null
          par_q_alert: boolean | null
          par_q_caminho_alternativo: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          metadata?: Json | null
          par_q_alert?: boolean | null
          par_q_caminho_alternativo?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json | null
          par_q_alert?: boolean | null
          par_q_caminho_alternativo?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      progressive_anamnese: {
        Row: {
          answered_at: string
          client_id: string
          id: string
          key: string
          value: string
          xp_awarded: number
        }
        Insert: {
          answered_at?: string
          client_id: string
          id?: string
          key: string
          value: string
          xp_awarded?: number
        }
        Update: {
          answered_at?: string
          client_id?: string
          id?: string
          key?: string
          value?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "progressive_anamnese_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_exercises: {
        Row: {
          created_at: string
          exercise_id: string | null
          id: string
          order_index: number
          session_id: string
          workout_exercise_id: string | null
        }
        Insert: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          order_index?: number
          session_id: string
          workout_exercise_id?: string | null
        }
        Update: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          order_index?: number
          session_id?: string
          workout_exercise_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      session_series: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          load_kg: number | null
          reps_done: number | null
          rpe: number | null
          session_exercise_id: string
          set_number: number
          time_seconds: number | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          load_kg?: number | null
          reps_done?: number | null
          rpe?: number | null
          session_exercise_id: string
          set_number: number
          time_seconds?: number | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          load_kg?: number | null
          reps_done?: number | null
          rpe?: number | null
          session_exercise_id?: string
          set_number?: number
          time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_series_session_exercise_id_fkey"
            columns: ["session_exercise_id"]
            isOneToOne: false
            referencedRelation: "session_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_clients: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          trainer_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          trainer_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_clients_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_days: {
        Row: {
          created_at: string
          day_number: number
          focus: string | null
          id: string
          name: string | null
          updated_at: string
          week_id: string
        }
        Insert: {
          created_at?: string
          day_number: number
          focus?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          week_id: string
        }
        Update: {
          created_at?: string
          day_number?: number
          focus?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_days_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "workout_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string
          day_id: string
          exercise_id: string | null
          id: string
          load_kg: number | null
          notes: string | null
          order_index: number
          reps: string | null
          rest_seconds: number | null
          sets: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_id: string
          exercise_id?: string | null
          id?: string
          load_kg?: number | null
          notes?: string | null
          order_index?: number
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_id?: string
          exercise_id?: string | null
          id?: string
          load_kg?: number | null
          notes?: string | null
          order_index?: number
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          client_id: string
          created_at: string
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["plan_status"]
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          name: string
          start_date?: string
          status?: Database["public"]["Enums"]["plan_status"]
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["plan_status"]
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          client_id: string
          created_at: string
          duration_seconds: number
          finished_at: string
          id: string
          notes: string | null
          started_at: string
          title: string | null
          workout_day_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          duration_seconds: number
          finished_at?: string
          id?: string
          notes?: string | null
          started_at: string
          title?: string | null
          workout_day_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          duration_seconds?: number
          finished_at?: string
          id?: string
          notes?: string | null
          started_at?: string
          title?: string | null
          workout_day_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_workout_day_id_fkey"
            columns: ["workout_day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_weeks: {
        Row: {
          created_at: string
          id: string
          name: string | null
          plan_id: string
          updated_at: string
          week_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          plan_id: string
          updated_at?: string
          week_number: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          plan_id?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_weeks_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_meal_plan: {
        Args: { _plan_id: string; _user_id: string }
        Returns: boolean
      }
      can_access_workout_plan: {
        Args: { _plan_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_trainer_of: {
        Args: { _client_id: string; _trainer_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "trainer" | "client"
      assessment_status: "pending" | "done"
      meal_type:
        | "pequeno_almoco"
        | "lanche_manha"
        | "almoco"
        | "lanche_tarde"
        | "jantar"
        | "ceia"
      plan_status: "active" | "inactive" | "draft" | "completed" | "template"
      workout_status: "pendente" | "em_progresso" | "concluido" | "pulado"
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
    Enums: {
      app_role: ["admin", "trainer", "client"],
      assessment_status: ["pending", "done"],
      meal_type: [
        "pequeno_almoco",
        "lanche_manha",
        "almoco",
        "lanche_tarde",
        "jantar",
        "ceia",
      ],
      plan_status: ["active", "inactive", "draft", "completed", "template"],
      workout_status: ["pendente", "em_progresso", "concluido", "pulado"],
    },
  },
} as const
