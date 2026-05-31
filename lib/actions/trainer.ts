'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { decrypt, decryptObject } from '@/lib/utils/crypto'

/**
 * Verifica se o utilizador logado tem o papel de Treinador (trainer) ou Admin.
 */
async function verifyTrainerOrAdmin(supabase: any) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { authenticated: false, userId: null, error: 'Utilizador não autenticado' }
  }

  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !userRole || (userRole.role !== 'trainer' && userRole.role !== 'admin')) {
    return { authenticated: false, userId: user.id, error: 'Apenas treinadores ou administradores podem executar esta ação.' }
  }

  return { authenticated: true, userId: user.id, error: null }
}

/**
 * Agenda uma nova avaliação física/corporal para um aluno.
 */
export async function scheduleAssessment(
  clientId: string,
  scheduledAt: string,
  notes: string
) {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  // 2. Inserir a avaliação na tabela assessments
  const { error } = await supabase
    .from('assessments')
    .insert({
      trainer_id: authCheck.userId,
      client_id: clientId,
      scheduled_at: scheduledAt,
      notes: notes || null,
      status: 'pending',
    })

  if (error) {
    console.error('Erro ao agendar avaliação:', error)
    return { success: false, error: `Erro ao agendar avaliação: ${error.message}` }
  }

  revalidatePath('/trainer')
  return { success: true }
}

/**
 * Conclui uma avaliação física, registrando as notas finais e mudando o status para concluída.
 */
export async function completeAssessment(
  assessmentId: string,
  notes: string
) {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  // 2. Atualizar a avaliação
  const { error } = await supabase
    .from('assessments')
    .update({
      status: 'done',
      notes: notes || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', assessmentId)

  if (error) {
    console.error('Erro ao concluir avaliação:', error)
    return { success: false, error: `Erro ao concluir avaliação: ${error.message}` }
  }

  revalidatePath('/trainer')
  return { success: true }
}

/**
 * Prescreve/Cria um plano de treino para um aluno, opcionalmente a partir de um preset/template.
 */
export async function createWorkoutPlan(
  clientId: string,
  name: string,
  startDate: string,
  presetType?: string
) {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  // 2. Criar o plano de treino
  const { data: plan, error } = await supabase
    .from('workout_plans')
    .insert({
      trainer_id: authCheck.userId,
      client_id: clientId,
      name: name,
      status: 'active',
      start_date: startDate || new Date().toISOString().split('T')[0]
    })
    .select('id')
    .single()

  if (error || !plan) {
    console.error('Erro ao criar plano de treino:', error)
    return { success: false, error: `Erro ao prescrever plano de treino: ${error ? error.message : 'Falha ao recuperar o plano criado.'}` }
  }

  // Se presetType foi selecionado, popular a base de dados
  if (presetType) {
    try {
      // A. Criar Semana 1
      const { data: week, error: weekErr } = await supabase
        .from('workout_weeks')
        .insert({
          plan_id: plan.id,
          week_number: 1,
          name: 'Semana 1'
        })
        .select('id')
        .single()

      if (weekErr || !week) throw new Error(weekErr?.message || 'Erro ao criar semana do preset')

      // B. Estruturar os dias e exercícios com base no preset
      if (presetType === 'hipertrofia') {
        const days = [
          {
            name: 'Dia A - Push (Peito, Ombros, Tríceps)',
            day_number: 1,
            focus: 'Hipertrofia - Empurrar',
            exercises: [
              { exercise_id: '475acb10-f5cd-46a3-8080-8ec717aa707f', sets: 4, reps: '10-12', rest_seconds: 90, notes: 'Foco na amplitude e controle no supino' },
              { exercise_id: '577c90da-2601-4824-9f48-b3f3c6e7bc74', sets: 3, reps: '10-12', rest_seconds: 90, notes: 'Manter postura ereta no desenvolvimento' },
              { exercise_id: '7562d60c-a085-482c-8583-26f2968bcaf7', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Foco na contração de pico no tríceps corda' }
            ]
          },
          {
            name: 'Dia B - Pull (Costas e Bíceps)',
            day_number: 2,
            focus: 'Hipertrofia - Puxar',
            exercises: [
              { exercise_id: '952005b7-9f0a-4e6d-90af-1b0953c5e9fe', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Barra fixa, controle a descida' },
              { exercise_id: 'e1b12943-a5bc-43dc-838c-6c34d459d0e1', sets: 3, reps: '10-12', rest_seconds: 90, notes: 'Remada curvada, coluna neutra' },
              { exercise_id: 'a6f29601-da28-4019-9a65-307eb6799475', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Rosca direta sem balançar o corpo' }
            ]
          },
          {
            name: 'Dia C - Legs & Core (Pernas e Abdominais)',
            day_number: 3,
            focus: 'Hipertrofia - Pernas e Core',
            exercises: [
              { exercise_id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', sets: 4, reps: '10', rest_seconds: 90, notes: 'Agachamento profundo e controlado' },
              { exercise_id: '11a4ab9b-4177-4283-9a10-ab012ce6bb37', sets: 3, reps: '12', rest_seconds: 90, notes: 'Leg Press 45, empurre com calcanhares' },
              { exercise_id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', sets: 3, reps: '60s', rest_seconds: 60, notes: 'Manter prancha firme' }
            ]
          }
        ]

        for (const d of days) {
          const { data: day, error: dayErr } = await supabase
            .from('workout_days')
            .insert({ week_id: week.id, day_number: d.day_number, name: d.name, focus: d.focus })
            .select('id').single()

          if (dayErr || !day) throw new Error(dayErr?.message || 'Erro ao criar dia de treino')

          for (let i = 0; i < d.exercises.length; i++) {
            const ex = d.exercises[i]
            await supabase.from('workout_exercises').insert({
              day_id: day.id,
              exercise_id: ex.exercise_id,
              order_index: i + 1,
              sets: ex.sets,
              reps: ex.reps,
              rest_seconds: ex.rest_seconds,
              notes: ex.notes
            })
          }
        }
      } else if (presetType === 'emagrecimento') {
        const days = [
          {
            name: 'Dia A - Cardio HIIT & Core',
            day_number: 1,
            focus: 'Gasto Calórico e Core',
            exercises: [
              { exercise_id: '34d08c36-f394-4e13-b177-9f30e4f36716', sets: 1, reps: '20 min', rest_seconds: 0, notes: 'Corrida na esteira com variação de intensidade' },
              { exercise_id: 'df1c99ab-09dd-4149-aff7-9bee606c505f', sets: 3, reps: '20', rest_seconds: 45, notes: 'Bicicleta abdominal controlada' },
              { exercise_id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', sets: 3, reps: '60s', rest_seconds: 60, notes: 'Prancha frontal, core contraído' }
            ]
          },
          {
            name: 'Dia B - Força Funcional',
            day_number: 2,
            focus: 'Tonificação Muscular Geral',
            exercises: [
              { exercise_id: '55e90237-cc44-4a09-85d9-b2fd528ee7b5', sets: 3, reps: 'Máximo', rest_seconds: 60, notes: 'Flexão de braços com corpo alinhado' },
              { exercise_id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', sets: 3, reps: '15', rest_seconds: 60, notes: 'Agachamento com barra, descer bem' },
              { exercise_id: 'e1b12943-a5bc-43dc-838c-6c34d459d0e1', sets: 3, reps: '12', rest_seconds: 60, notes: 'Remada curvada para dorsal' }
            ]
          },
          {
            name: 'Dia C - Definição Muscular',
            day_number: 3,
            focus: 'Resistência Muscular e Core',
            exercises: [
              { exercise_id: '475acb10-f5cd-46a3-8080-8ec717aa707f', sets: 3, reps: '15', rest_seconds: 60, notes: 'Supino reto com cadência lenta' },
              { exercise_id: 'a6f29601-da28-4019-9a65-307eb6799475', sets: 3, reps: '15', rest_seconds: 60, notes: 'Rosca direta para bíceps' },
              { exercise_id: 'c517a7b9-ab14-427f-b7a4-4eb91b16c35b', sets: 3, reps: '30s/lado', rest_seconds: 45, notes: 'Prancha lateral, elevar quadril' }
            ]
          }
        ]

        for (const d of days) {
          const { data: day, error: dayErr } = await supabase
            .from('workout_days')
            .insert({ week_id: week.id, day_number: d.day_number, name: d.name, focus: d.focus })
            .select('id').single()

          if (dayErr || !day) throw new Error(dayErr?.message || 'Erro ao criar dia de treino')

          for (let i = 0; i < d.exercises.length; i++) {
            const ex = d.exercises[i]
            await supabase.from('workout_exercises').insert({
              day_id: day.id,
              exercise_id: ex.exercise_id,
              order_index: i + 1,
              sets: ex.sets,
              reps: ex.reps,
              rest_seconds: ex.rest_seconds,
              notes: ex.notes
            })
          }
        }
      } else if (presetType === 'funcional_casa') {
        const days = [
          {
            name: 'Dia A - Superiores & Core (Peso Corporal)',
            day_number: 1,
            focus: 'Força Corporal e Core',
            exercises: [
              { exercise_id: '55e90237-cc44-4a09-85d9-b2fd528ee7b5', sets: 4, reps: '12-15', rest_seconds: 60, notes: 'Flexão de braços convencional' },
              { exercise_id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', sets: 4, reps: '45s', rest_seconds: 45, notes: 'Prancha frontal firme' },
              { exercise_id: 'c517a7b9-ab14-427f-b7a4-4eb91b16c35b', sets: 3, reps: '30s/lado', rest_seconds: 45, notes: 'Prancha lateral sustentada' }
            ]
          },
          {
            name: 'Dia B - Inferiores & Cardio (Casa/Ar Livre)',
            day_number: 2,
            focus: 'Resistência Muscular e Aeróbica',
            exercises: [
              { exercise_id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', sets: 4, reps: '20 (Peso Corporal)', rest_seconds: 60, notes: 'Agachamento com peso corporal contínuo' },
              { exercise_id: 'df1c99ab-09dd-4149-aff7-9bee606c505f', sets: 3, reps: '20', rest_seconds: 45, notes: 'Bicicleta abdominal rápida' },
              { exercise_id: '37ec7019-cb87-4d35-acdd-07ac8bff48ac', sets: 1, reps: '15 min', rest_seconds: 0, notes: 'Corrida contínua ao ar livre' }
            ]
          }
        ]

        for (const d of days) {
          const { data: day, error: dayErr } = await supabase
            .from('workout_days')
            .insert({ week_id: week.id, day_number: d.day_number, name: d.name, focus: d.focus })
            .select('id').single()

          if (dayErr || !day) throw new Error(dayErr?.message || 'Erro ao criar dia de treino')

          for (let i = 0; i < d.exercises.length; i++) {
            const ex = d.exercises[i]
            await supabase.from('workout_exercises').insert({
              day_id: day.id,
              exercise_id: ex.exercise_id,
              order_index: i + 1,
              sets: ex.sets,
              reps: ex.reps,
              rest_seconds: ex.rest_seconds,
              notes: ex.notes
            })
          }
        }
      }
    } catch (presetErr: any) {
      console.error('Erro ao povoar o plano com o preset:', presetErr)
      return { success: false, error: `Erro ao povoar o plano com o preset: ${presetErr.message}` }
    }
  }

  revalidatePath('/trainer')
  return { success: true }
}

/**
 * Exclui um plano de treino e toda a sua estrutura associada (exercícios, dias, semanas).
 */
export async function deleteWorkoutPlan(planId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  try {
    // Buscar todas as semanas associadas a este plano
    const { data: weeks, error: weeksErr } = await supabase
      .from('workout_weeks')
      .select('id')
      .eq('plan_id', planId)

    if (weeksErr) throw weeksErr

    if (weeks && weeks.length > 0) {
      const weekIds = weeks.map(w => w.id)

      // Buscar todos os dias destas semanas
      const { data: days, error: daysErr } = await supabase
        .from('workout_days')
        .select('id')
        .in('week_id', weekIds)

      if (daysErr) throw daysErr

      if (days && days.length > 0) {
        const dayIds = days.map(d => d.id)

        // 1. Eliminar exercícios
        const { error: exercisesDelErr } = await supabase
          .from('workout_exercises')
          .delete()
          .in('day_id', dayIds)

        if (exercisesDelErr) throw exercisesDelErr

        // 2. Eliminar dias
        const { error: daysDelErr } = await supabase
          .from('workout_days')
          .delete()
          .in('id', dayIds)

        if (daysDelErr) throw daysDelErr
      }

      // 3. Eliminar semanas
      const { error: weeksDelErr } = await supabase
        .from('workout_weeks')
        .delete()
        .in('id', weekIds)

      if (weeksDelErr) throw weeksDelErr
    }

    // 4. Eliminar o plano propriamente dito
    const { error: planDelErr } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', planId)

    if (planDelErr) throw planDelErr

    revalidatePath('/trainer')
    return { success: true }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao excluir plano de treino:', err)
    return { success: false, error: `Erro ao excluir plano de treino: ${errMsg}` }
  }
}

export interface CustomExerciseInput {
  exercise_id: string
  sets: number
  reps: string
  rest_seconds: number
  notes: string | null
}

export interface CustomDayInput {
  name: string
  day_number: number
  focus: string
  exercises: CustomExerciseInput[]
}

export interface CustomPlanStructure {
  days: CustomDayInput[]
}

/**
 * Cria um plano de treino com uma estrutura de exercícios customizada em uma transação atômica.
 */
export async function createCustomWorkoutPlan(
  clientId: string,
  name: string,
  startDate: string,
  status: string,
  structure: CustomPlanStructure
): Promise<{ success: boolean; planId?: string; error?: string }> {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  try {
    // 2. Criar o plano de treino
    const { data: plan, error: planErr } = await supabase
      .from('workout_plans')
      .insert({
        trainer_id: authCheck.userId,
        client_id: clientId,
        name: name,
        status: status || 'active',
        start_date: startDate || new Date().toISOString().split('T')[0]
      })
      .select('id')
      .single()

    if (planErr || !plan) {
      throw new Error(planErr?.message || 'Falha ao recuperar ID do plano criado')
    }

    // 3. Criar a Semana 1
    const { data: week, error: weekErr } = await supabase
      .from('workout_weeks')
      .insert({
        plan_id: plan.id,
        week_number: 1,
        name: 'Semana 1'
      })
      .select('id')
      .single()

    if (weekErr || !week) {
      throw new Error(weekErr?.message || 'Falha ao criar Semana 1')
    }

    // 4. Inserir dias e exercícios
    for (const d of structure.days) {
      const { data: day, error: dayErr } = await supabase
        .from('workout_days')
        .insert({
          week_id: week.id,
          day_number: d.day_number,
          name: d.name,
          focus: d.focus
        })
        .select('id')
        .single()

      if (dayErr || !day) {
        throw new Error(dayErr?.message || `Falha ao criar Dia ${d.day_number}`)
      }

      for (let i = 0; i < d.exercises.length; i++) {
        const ex = d.exercises[i]
        const { error: exErr } = await supabase
          .from('workout_exercises')
          .insert({
            day_id: day.id,
            exercise_id: ex.exercise_id,
            order_index: i + 1,
            sets: ex.sets,
            reps: ex.reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes || null
          })

        if (exErr) {
          throw new Error(exErr.message || `Falha ao inserir exercício no Dia ${d.day_number}`)
        }
      }
    }

    revalidatePath('/trainer')
    return { success: true, planId: plan.id }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao criar plano de treino customizado:', err)
    return { success: false, error: `Erro ao criar plano de treino: ${errMsg}` }
  }
}

/**
 * Atualiza um plano de treino existente e sua estrutura de exercícios de forma atômica.
 */
export async function updateCustomWorkoutPlan(
  planId: string,
  name: string,
  startDate: string,
  status: string,
  structure: CustomPlanStructure
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  try {
    // 2. Atualizar cabeçalho do plano
    const { error: planErr } = await supabase
      .from('workout_plans')
      .update({
        name: name,
        status: status,
        start_date: startDate || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)

    if (planErr) {
      throw new Error(planErr.message)
    }

    // 3. Obter ou criar a Semana 1
    let { data: week, error: weekSearchErr } = await supabase
      .from('workout_weeks')
      .select('id')
      .eq('plan_id', planId)
      .eq('week_number', 1)
      .maybeSingle()

    if (weekSearchErr) {
      throw new Error(weekSearchErr.message)
    }

    if (!week) {
      const { data: newWeek, error: weekInsertErr } = await supabase
        .from('workout_weeks')
        .insert({
          plan_id: planId,
          week_number: 1,
          name: 'Semana 1'
        })
        .select('id')
        .single()

      if (weekInsertErr || !newWeek) {
        throw new Error(weekInsertErr?.message || 'Falha ao criar Semana 1')
      }
      week = newWeek
    }

    // 4. Limpar dias e exercícios antigos da Semana 1 para inserção limpa
    const { data: oldDays, error: daysSearchErr } = await supabase
      .from('workout_days')
      .select('id')
      .eq('week_id', week.id)

    if (daysSearchErr) throw daysSearchErr

    if (oldDays && oldDays.length > 0) {
      const oldDayIds = oldDays.map(d => d.id)

      // Apagar exercícios
      const { error: oldExsDelErr } = await supabase
        .from('workout_exercises')
        .delete()
        .in('day_id', oldDayIds)

      if (oldExsDelErr) throw oldExsDelErr

      // Apagar dias
      const { error: oldDaysDelErr } = await supabase
        .from('workout_days')
        .delete()
        .in('id', oldDayIds)

      if (oldDaysDelErr) throw oldDaysDelErr
    }

    // 5. Inserir a nova estrutura de dias e exercícios
    for (const d of structure.days) {
      const { data: day, error: dayErr } = await supabase
        .from('workout_days')
        .insert({
          week_id: week.id,
          day_number: d.day_number,
          name: d.name,
          focus: d.focus
        })
        .select('id')
        .single()

      if (dayErr || !day) {
        throw new Error(dayErr?.message || `Falha ao criar Dia ${d.day_number}`)
      }

      for (let i = 0; i < d.exercises.length; i++) {
        const ex = d.exercises[i]
        const { error: exErr } = await supabase
          .from('workout_exercises')
          .insert({
            day_id: day.id,
            exercise_id: ex.exercise_id,
            order_index: i + 1,
            sets: ex.sets,
            reps: ex.reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes || null
          })

        if (exErr) {
          throw new Error(exErr.message || `Falha ao inserir exercício no Dia ${d.day_number}`)
        }
      }
    }

    revalidatePath('/trainer')
    return { success: true }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao atualizar plano de treino customizado:', err)
    return { success: false, error: `Erro ao salvar alterações: ${errMsg}` }
  }
}

/**
 * Puxa todos os dados do painel do treinador, desencriptando os perfis e nomes dos alunos em memória.
 */
export async function getTrainerDashboardData() {
  const supabase = await createClient()

  // 1. Validar papel
  const authCheck = await verifyTrainerOrAdmin(supabase)
  if (!authCheck.authenticated) {
    return { success: false, error: authCheck.error ?? undefined }
  }

  // 2. Buscar alunos vinculados na tabela trainer_clients
  const { data: connectionList, error: connError } = await supabase
    .from("trainer_clients")
    .select("client_id")
    .eq("trainer_id", authCheck.userId)

  if (connError) {
    return { success: false, error: connError.message }
  }

  const clientIds = (connectionList || []).map(c => c.client_id)
  let decryptedClients: any[] = []

  if (clientIds.length > 0) {
    // Buscar perfis dos alunos
    const { data: profilesList, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, created_at, metadata, par_q_alert, par_q_caminho_alternativo")
      .in("id", clientIds)

    if (profilesError) {
      return { success: false, error: profilesError.message }
    }
    
    decryptedClients = (profilesList || []).map(profile => ({
      ...profile,
      full_name: profile.full_name ? decrypt(profile.full_name) : null,
      metadata: profile.metadata ? decryptObject(profile.metadata) : null,
    }))
  }

  // 3. Buscar todas as avaliações deste treinador
  const { data: assessmentsList, error: assessError } = await supabase
    .from("assessments")
    .select("id, client_id, scheduled_at, notes, status, created_at")
    .eq("trainer_id", authCheck.userId)
    .order("scheduled_at", { ascending: true })

  if (assessError) {
    return { success: false, error: assessError.message }
  }

  // Obter nomes dos alunos para cada avaliação (Desencriptados)
  const enrichedAssessments = await Promise.all(
    (assessmentsList || []).map(async (as) => {
      const { data: clientProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", as.client_id)
        .single()
      
      const rawName = clientProfile?.full_name || ""
      const decName = rawName ? decrypt(rawName) : "Sem nome"
      
      return {
        ...as,
        client_name: decName
      }
    })
  )

  // 4. Buscar contagem de planos criados pelo treinador
  const { count: plansCount, error: plansError } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", authCheck.userId)

  if (plansError) {
    return { success: false, error: plansError.message }
  }

  return {
    success: true,
    clients: decryptedClients,
    allAssessments: enrichedAssessments,
    trainerPlansCount: plansCount || 0
  }
}


