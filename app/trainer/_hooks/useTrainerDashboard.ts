// app/trainer/_hooks/useTrainerDashboard.ts
"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  scheduleAssessment,
  completeAssessment,
  deleteWorkoutPlan,
  createCustomWorkoutPlan,
  updateCustomWorkoutPlan,
  getTrainerDashboardData
} from "@/lib/actions/trainer"
import { toast } from "sonner"
import type {
  ClientProfile,
  WorkoutSession,
  Assessment,
  WorkoutPlan,
  LocalExercise,
  LocalDay,
  TrainerTab
} from "../_types/trainer.types"

export function useTrainerDashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [trainerName, setTrainerName] = useState("Treinador")
  const [trainerId, setTrainerId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Tabs
  const [activeTab, setActiveTab] = useState<TrainerTab>("dashboard")

  // Estado Geral de Dados
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [allAssessments, setAllAssessments] = useState<Assessment[]>([])
  const [trainerPlansCount, setTrainerPlansCount] = useState(0)

  // Estados dos Alunos (Filtros, Seleção)
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null)

  // Dados Específicos do Aluno Selecionado
  const [clientSessions, setClientSessions] = useState<WorkoutSession[]>([])
  const [clientAssessments, setClientAssessments] = useState<Assessment[]>([])
  const [clientPlans, setClientPlans] = useState<WorkoutPlan[]>([])
  const [isClientDetailsLoading, setIsClientDetailsLoading] = useState(false)

  // Formulário - Agendar Avaliação
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleNotes, setScheduleNotes] = useState("")

  // Formulário - Concluir Avaliação
  const [completingAssessmentId, setCompletingAssessmentId] = useState<string | null>(null)
  const [completeNotes, setCompleteNotes] = useState("")

  // Formulário - Prescrever Treino
  const [showPrescribeModal, setShowPrescribeModal] = useState(false)
  const [planName, setPlanName] = useState("")
  const [planStartDate, setPlanStartDate] = useState("")
  const [presetType, setPresetType] = useState<string>("")

  // Wizard e Editor Customizado
  const [createStep, setCreateStep] = useState<number>(1)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [exercisesLibrary, setExercisesLibrary] = useState<{ id: string; name: string }[]>([])
  const [localStructure, setLocalStructure] = useState<LocalDay[]>([])
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false)
  const [focusedDayIdxForSearch, setFocusedDayIdxForSearch] = useState<number | null>(null)
  const [draggedExIndex, setDraggedExIndex] = useState<number | null>(null)

  // Inteligência de Preenchimento de Treino baseado no Onboarding
  useEffect(() => {
    if (showPrescribeModal && selectedClient) {
      const meta = (selectedClient.metadata || {}) as Record<string, string>
      if (meta.objetivo) {
        const obj = meta.objetivo
        const loc = meta.local_treino ? ` (${meta.local_treino})` : ""
        setPlanName(`${obj} - 8 Semanas${loc}`)

        if (obj === 'Hipertrofia') {
          setPresetType('hipertrofia')
        } else if (obj === 'Emagrecer') {
          setPresetType('emagrecimento')
        } else if (meta.local_treino === 'Casa' || meta.local_treino === 'Ar Livre') {
          setPresetType('funcional_casa')
        } else {
          setPresetType('')
        }
      } else {
        setPlanName("")
        setPresetType("")
      }
    }
  }, [showPrescribeModal, selectedClient])

  // Carregar biblioteca de exercícios ao montar a página
  useEffect(() => {
    async function loadExercises() {
      try {
        const { data, error } = await supabase
          .from("exercises")
          .select("id, name")
          .order("name")
        if (!error && data) {
          setExercisesLibrary(data)
        }
      } catch (err) {
        console.error("Erro ao buscar biblioteca de exercícios:", err)
      }
    }
    loadExercises()
  }, [supabase])

  // Carregar dados gerais do treinador
  useEffect(() => {
    async function loadTrainerData() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setTrainerId(user.id)
          const { data: perfil } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single()

          if (perfil?.full_name) {
            setTrainerName(perfil.full_name)
          }
        }

        if (user) {
          const res = await getTrainerDashboardData()
          if (res.success && res.clients && res.allAssessments) {
            setClients(res.clients)
            setAllAssessments(res.allAssessments)
            setTrainerPlansCount(res.trainerPlansCount)
          } else {
            throw new Error(res.error || "Falha ao obter dados do treinador")
          }
        }

      } catch (err) {
        console.error("Erro ao carregar dados do Treinador:", err)
        toast.error("Erro ao sincronizar informações com o banco.")
      } finally {
        setIsLoading(false)
      }
    }
    loadTrainerData()
  }, [supabase])

  // Buscar detalhes do aluno selecionado
  useEffect(() => {
    if (!selectedClient) return

    async function loadClientDetails() {
      const client = selectedClient
      if (!client) return

      setIsClientDetailsLoading(true)
      try {
        const { data: sessionsList, error: sessionsError } = await supabase
          .from("workout_sessions")
          .select("id, started_at, finished_at, duration_seconds")
          .eq("client_id", client.id)
          .order("started_at", { ascending: false })

        if (sessionsError) throw sessionsError
        setClientSessions(sessionsList || [])

        const { data: assessmentsList, error: assessError } = await supabase
          .from("assessments")
          .select("id, client_id, scheduled_at, notes, status, created_at")
          .eq("client_id", client.id)
          .order("scheduled_at", { ascending: false })

        if (assessError) throw assessError
        setClientAssessments(assessmentsList || [])

        const { data: plansList, error: plansError } = await supabase
          .from("workout_plans")
          .select("id, name, status, start_date, created_at")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false })

        if (plansError) throw plansError
        setClientPlans(plansList || [])

      } catch (err) {
        console.error("Erro ao carregar detalhes do aluno:", err)
        toast.error("Falha ao puxar sessões ou avaliações do aluno.")
      } finally {
        setIsClientDetailsLoading(false)
      }
    }
    loadClientDetails()
  }, [selectedClient, supabase])

  // ==================== HANDLERS ====================

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success("Sessão terminada com sucesso.")
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 800)
    } catch {
      toast.error("Erro ao encerrar sessão.")
      setLogoutLoading(false)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return
    if (!scheduleDate) {
      toast.error("Por favor, selecione uma data e hora para a avaliação.")
      return
    }

    startTransition(async () => {
      try {
        const result = await scheduleAssessment(selectedClient.id, scheduleDate, scheduleNotes)
        if (result.success) {
          toast.success("Avaliação corporal agendada com sucesso!")
          setShowScheduleModal(false)
          setScheduleDate("")
          setScheduleNotes("")

          const { data: assessmentsList } = await supabase
            .from("assessments")
            .select("id, client_id, scheduled_at, notes, status, created_at")
            .eq("client_id", selectedClient.id)
            .order("scheduled_at", { ascending: false })
          setClientAssessments(assessmentsList || [])

          const { data: allList } = await supabase
            .from("assessments")
            .select("id, client_id, scheduled_at, notes, status, created_at")
            .eq("trainer_id", trainerId)
            .order("scheduled_at", { ascending: true })

          const enriched = await Promise.all(
            (allList || []).map(async (as) => {
              const { data: clientProfile } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", as.client_id)
                .single()
              return { ...as, client_name: clientProfile?.full_name || "Sem nome" }
            })
          )
          setAllAssessments(enriched)

        } else {
          toast.error(result.error || "Erro ao agendar avaliação.")
        }
      } catch {
        toast.error("Erro de rede ao agendar.")
      }
    })
  }

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!completingAssessmentId) return

    startTransition(async () => {
      try {
        const result = await completeAssessment(completingAssessmentId, completeNotes)
        if (result.success) {
          toast.success("Avaliação finalizada com sucesso!")
          setCompletingAssessmentId(null)
          setCompleteNotes("")

          setAllAssessments(prev => prev.map(as => as.id === completingAssessmentId ? { ...as, status: 'done' as const, notes: completeNotes } : as))
          if (selectedClient) {
            setClientAssessments(prev => prev.map(as => as.id === completingAssessmentId ? { ...as, status: 'done' as const, notes: completeNotes } : as))
          }
        } else {
          toast.error(result.error || "Erro ao finalizar avaliação.")
        }
      } catch {
        toast.error("Erro de rede ao finalizar.")
      }
    })
  }

  const handleAddExerciseToDay = (dayIdx: number, exerciseId: string, name: string) => {
    setLocalStructure(prev => {
      const copy = [...prev]
      const day = { ...copy[dayIdx] }
      day.exercises = [
        ...day.exercises,
        {
          exercise_id: exerciseId,
          exercise_name: name,
          sets: 3,
          reps: "10",
          rest_seconds: 60,
          notes: ""
        }
      ]
      copy[dayIdx] = day
      return copy
    })
    setSearchQuery("")
    setShowSearchDropdown(false)
    toast.success(`Adicionado: ${name}`)
  }

  const handleRemoveExerciseFromDay = (dayIdx: number, exerciseIdx: number) => {
    setLocalStructure(prev => {
      const copy = [...prev]
      const day = { ...copy[dayIdx] }
      day.exercises = day.exercises.filter((_, idx) => idx !== exerciseIdx)
      copy[dayIdx] = day
      return copy
    })
  }

  const handleReorderExercises = (dayIdx: number, fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return
    setLocalStructure(prev => {
      const copy = [...prev]
      const day = { ...copy[dayIdx] }
      const exercises = [...day.exercises]
      const [moved] = exercises.splice(fromIdx, 1)
      exercises.splice(toIdx, 0, moved)
      day.exercises = exercises
      copy[dayIdx] = day
      return copy
    })
  }

  const handleMoveExercise = (dayIdx: number, index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= localStructure[dayIdx].exercises.length) return
    handleReorderExercises(dayIdx, index, targetIdx)
  }

  const handleEditExerciseField = (dayIdx: number, exerciseIdx: number, field: keyof LocalExercise, value: string | number) => {
    setLocalStructure(prev => {
      const copy = [...prev]
      const day = { ...copy[dayIdx] }
      const exercisesCopy = [...day.exercises]
      exercisesCopy[exerciseIdx] = {
        ...exercisesCopy[exerciseIdx],
        [field]: value
      }
      day.exercises = exercisesCopy
      copy[dayIdx] = day
      return copy
    })
  }

  const handleApplyComboToDay = (dayIdx: number, comboKey: string) => {
    const COMBOS: Record<string, { id: string; name: string; sets: number; reps: string; rest: number }[]> = {
      push: [
        { id: '475acb10-f5cd-46a3-8080-8ec717aa707f', name: 'Supino Reto com Barra', sets: 3, reps: '10-12', rest: 90 },
        { id: '577c90da-2601-4824-9f48-b3f3c6e7bc74', name: 'Desenvolvimento com Halteres', sets: 3, reps: '10-12', rest: 90 },
        { id: '7562d60c-a085-482c-8583-26f2968bcaf7', name: 'Tríceps na Polia (Corda)', sets: 3, reps: '12-15', rest: 60 }
      ],
      pull: [
        { id: '952005b7-9f0a-4e6d-90af-1b0953c5e9fe', name: 'Puxada Vertical / Barra Fixa', sets: 3, reps: '8-10', rest: 90 },
        { id: 'e1b12943-a5bc-43dc-838c-6c34d459d0e1', name: 'Remada Curvada com Barra', sets: 3, reps: '10-12', rest: 90 },
        { id: 'a6f29601-da28-4019-9a65-307eb6799475', name: 'Rosca Direta com Barra', sets: 3, reps: '10-12', rest: 60 }
      ],
      legs: [
        { id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', name: 'Agachamento Livre', sets: 3, reps: '10-12', rest: 90 },
        { id: '11a4ab9b-4177-4283-9a10-ab012ce6bb37', name: 'Leg Press 45', sets: 3, reps: '12', rest: 90 },
        { id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', name: 'Prancha Frontal Isométrica', sets: 3, reps: '45s', rest: 60 }
      ],
      cardio: [
        { id: '34d08c36-f394-4e13-b177-9f30e4f36716', name: 'Corrida na Esteira', sets: 1, reps: '15 min', rest: 0 },
        { id: 'df1c99ab-09dd-4149-aff7-9bee606c505f', name: 'Abdominal Bicicleta', sets: 3, reps: '20', rest: 45 },
        { id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', name: 'Prancha Frontal Isométrica', sets: 3, reps: '45s', rest: 60 }
      ]
    }

    const items = COMBOS[comboKey]
    if (!items) return

    setLocalStructure(prev => {
      const copy = [...prev]
      const day = { ...copy[dayIdx] }

      const newExercises = items.map(it => ({
        exercise_id: it.id,
        exercise_name: it.name,
        sets: it.sets,
        reps: it.reps,
        rest_seconds: it.rest,
        notes: ""
      }))

      day.exercises = [...day.exercises, ...newExercises]
      copy[dayIdx] = day
      return copy
    })

    toast.success("Combinação de exercícios adicionada!")
  }

  const handleEditPlan = async (plan: WorkoutPlan) => {
    setIsClientDetailsLoading(true)
    try {
      const { data: weeks, error: weeksErr } = await supabase
        .from('workout_weeks')
        .select('id')
        .eq('plan_id', plan.id)
        .eq('week_number', 1)
        .maybeSingle()

      if (weeksErr) throw weeksErr
      if (!weeks) {
        setEditingPlan(plan)
        setPlanName(plan.name)
        setPlanStartDate(plan.start_date)
        setLocalStructure([
          { name: 'Dia A', day_number: 1, focus: 'Condicionamento Geral', exercises: [] },
          { name: 'Dia B', day_number: 2, focus: 'Condicionamento Geral', exercises: [] },
          { name: 'Dia C', day_number: 3, focus: 'Condicionamento Geral', exercises: [] }
        ])
        setCreateStep(2)
        setShowPrescribeModal(true)
        return
      }

      const { data: days, error: daysErr } = await supabase
        .from('workout_days')
        .select('id, name, day_number, focus')
        .eq('week_id', weeks.id)
        .order('day_number')

      if (daysErr) throw daysErr

      const formattedDays: LocalDay[] = []

      for (const d of (days || [])) {
        const { data: exs, error: exsErr } = await supabase
          .from('workout_exercises')
          .select('id, exercise_id, sets, reps, rest_seconds, notes, order_index')
          .eq('day_id', d.id)
          .order('order_index')

        if (exsErr) throw exsErr

        const formattedExercises: LocalExercise[] = []
        for (const ex of (exs || [])) {
          let exName = 'Exercício'
          if (ex.exercise_id) {
            const libEx = exercisesLibrary.find(e => e.id === ex.exercise_id)
            if (libEx) {
              exName = libEx.name
            } else {
              const { data: directEx } = await supabase
                .from('exercises')
                .select('name')
                .eq('id', ex.exercise_id)
                .maybeSingle()
              if (directEx) exName = directEx.name
            }
          }

          formattedExercises.push({
            exercise_id: ex.exercise_id || '',
            exercise_name: exName,
            sets: ex.sets || 3,
            reps: ex.reps || '10',
            rest_seconds: ex.rest_seconds || 60,
            notes: ex.notes || ''
          })
        }

        formattedDays.push({
          name: d.name || `Dia ${d.day_number}`,
          day_number: d.day_number,
          focus: d.focus || 'Geral',
          exercises: formattedExercises
        })
      }

      setEditingPlan(plan)
      setPlanName(plan.name)
      setPlanStartDate(plan.start_date)
      setPresetType('')
      setLocalStructure(formattedDays)
      setCreateStep(2)
      setShowPrescribeModal(true)
    } catch (err) {
      console.error('Erro ao carregar detalhes do plano:', err)
      toast.error('Erro ao carregar estrutura do plano de treino.')
    } finally {
      setIsClientDetailsLoading(false)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("Tem a certeza que deseja excluir permanentemente este plano de treino e todos os seus exercícios? Esta ação não pode ser desfeita.")) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteWorkoutPlan(planId)
        if (result.success) {
          toast.success("Plano de treino excluído com sucesso!")

          if (selectedClient) {
            const { data: plansList } = await supabase
              .from("workout_plans")
              .select("id, name, status, start_date, created_at")
              .eq("client_id", selectedClient.id)
              .order("created_at", { ascending: false })
            setClientPlans(plansList || [])
          }
          setTrainerPlansCount(prev => Math.max(0, prev - 1))
        } else {
          toast.error(result.error || "Erro ao excluir o plano.")
        }
      } catch {
        toast.error("Erro de rede ao excluir o plano.")
      }
    })
  }

  const handlePrescribeSubmit = async (e: React.FormEvent, status: string = 'active') => {
    e.preventDefault()
    if (!selectedClient) return
    if (!planName) {
      toast.error("Por favor, dê um nome ao plano de treino.")
      return
    }

    const formattedStructure = {
      days: localStructure.map(d => ({
        name: d.name,
        day_number: d.day_number,
        focus: d.focus,
        exercises: d.exercises.map(ex => ({
          exercise_id: ex.exercise_id,
          sets: Number(ex.sets),
          reps: String(ex.reps),
          rest_seconds: Number(ex.rest_seconds),
          notes: ex.notes || null
        }))
      }))
    }

    startTransition(async () => {
      try {
        let result
        if (editingPlan) {
          result = await updateCustomWorkoutPlan(editingPlan.id, planName, planStartDate, status, formattedStructure)
        } else {
          result = await createCustomWorkoutPlan(selectedClient.id, planName, planStartDate, status, formattedStructure)
        }

        if (result.success) {
          toast.success(editingPlan ? "Alterações gravadas com sucesso!" : "Plano de treino prescrito com sucesso!")
          setShowPrescribeModal(false)
          setPlanName("")
          setPlanStartDate("")
          setPresetType("")
          setEditingPlan(null)
          setLocalStructure([])
          setCreateStep(1)

          const { data: plansList } = await supabase
            .from("workout_plans")
            .select("id, name, status, start_date, created_at")
            .eq("client_id", selectedClient.id)
            .order("created_at", { ascending: false })
          setClientPlans(plansList || [])

          if (!editingPlan) {
            setTrainerPlansCount(prev => prev + 1)
          }
        } else {
          toast.error(result.error || "Erro ao guardar treino.")
        }
      } catch {
        toast.error("Erro de rede ao guardar plano.")
      }
    })
  }

  // Derived state
  const filteredClients = clients.filter(c =>
    (c.full_name || "").toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(clientSearch.toLowerCase())
  )

  const pendingAssessments = allAssessments.filter(as => as.status === "pending")
  const completedAssessments = allAssessments.filter(as => as.status === "done")

  return {
    // Core state
    trainerName,
    trainerId,
    isLoading,
    logoutLoading,
    isPending,
    activeTab,
    setActiveTab,

    // Clients
    clients,
    filteredClients,
    clientSearch,
    setClientSearch,
    selectedClient,
    setSelectedClient,

    // Client details
    clientSessions,
    clientAssessments,
    clientPlans,
    isClientDetailsLoading,

    // Assessments
    allAssessments,
    pendingAssessments,
    completedAssessments,

    // Stats
    trainerPlansCount,

    // Schedule modal
    showScheduleModal,
    setShowScheduleModal,
    scheduleDate,
    setScheduleDate,
    scheduleNotes,
    setScheduleNotes,

    // Complete assessment
    completingAssessmentId,
    setCompletingAssessmentId,
    completeNotes,
    setCompleteNotes,

    // Prescribe modal
    showPrescribeModal,
    setShowPrescribeModal,
    planName,
    setPlanName,
    planStartDate,
    setPlanStartDate,
    presetType,
    setPresetType,

    // Wizard
    createStep,
    setCreateStep,
    editingPlan,
    setEditingPlan,
    exercisesLibrary,
    localStructure,
    setLocalStructure,
    activeDayIndex,
    setActiveDayIndex,
    searchQuery,
    setSearchQuery,
    showSearchDropdown,
    setShowSearchDropdown,
    focusedDayIdxForSearch,
    setFocusedDayIdxForSearch,
    draggedExIndex,
    setDraggedExIndex,

    // Handlers
    handleLogout,
    handleScheduleSubmit,
    handleCompleteSubmit,
    handleAddExerciseToDay,
    handleRemoveExerciseFromDay,
    handleReorderExercises,
    handleMoveExercise,
    handleEditExerciseField,
    handleApplyComboToDay,
    handleEditPlan,
    handleDeletePlan,
    handlePrescribeSubmit,
  }
}
