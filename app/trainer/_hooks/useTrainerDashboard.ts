// app/trainer/_hooks/useTrainerDashboard.ts
// Orquestrador: compõe os hooks focados e expõe a interface pública.
"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { scheduleAssessment, completeAssessment, createCustomWorkoutPlan, updateCustomWorkoutPlan, deleteWorkoutPlan } from "@/lib/actions/trainer"
import { toast } from "sonner"

import { useTrainerData } from "./useTrainerData"
import { useWorkoutEditor } from "./useWorkoutEditor"

import type { ClientProfile, WorkoutSession, Assessment, WorkoutPlan, TrainerTab } from "../_types/trainer.types"

export function useTrainerDashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TrainerTab>("dashboard")

  // ---- Aluno selecionado ----
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null)
  const [clientSearch, setClientSearch] = useState("")
  const [clientSessions, setClientSessions] = useState<WorkoutSession[]>([])
  const [clientAssessments, setClientAssessments] = useState<Assessment[]>([])
  const [clientPlans, setClientPlans] = useState<WorkoutPlan[]>([])
  const [isClientDetailsLoading, setIsClientDetailsLoading] = useState(false)

  // ---- Modais de avaliação ----
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleNotes, setScheduleNotes] = useState("")
  const [completingAssessmentId, setCompletingAssessmentId] = useState<string | null>(null)
  const [completeNotes, setCompleteNotes] = useState("")

  const trainerData = useTrainerData()
  const editor = useWorkoutEditor({ selectedClient, setIsClientDetailsLoading })

  /* ---- Detalhes do aluno selecionado ---- */
  useEffect(() => {
    if (!selectedClient) return
    async function loadClientDetails() {
      const client = selectedClient
      if (!client) return
      setIsClientDetailsLoading(true)
      try {
        const { data: sl, error: se } = await supabase
          .from("workout_sessions").select("id, started_at, finished_at, duration_seconds")
          .eq("client_id", client.id).order("started_at", { ascending: false })
        if (se) throw se
        setClientSessions(sl || [])

        const { data: al, error: ae } = await supabase
          .from("assessments").select("id, client_id, scheduled_at, notes, status, created_at")
          .eq("client_id", client.id).order("scheduled_at", { ascending: false })
        if (ae) throw ae
        setClientAssessments(al || [])

        const { data: pl, error: pe } = await supabase
          .from("workout_plans").select("id, name, status, start_date, created_at")
          .eq("client_id", client.id).order("created_at", { ascending: false })
        if (pe) throw pe
        setClientPlans(pl || [])
      } catch (err) {
        console.error("Erro ao carregar detalhes do aluno:", err)
        toast.error("Falha ao puxar sessões ou avaliações do aluno.")
      } finally {
        setIsClientDetailsLoading(false)
      }
    }
    loadClientDetails()
  }, [selectedClient, supabase])

  /* ---- Handlers: avaliações ---- */
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || !scheduleDate) {
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

          const { data: al } = await supabase
            .from("assessments").select("id, client_id, scheduled_at, notes, status, created_at")
            .eq("client_id", selectedClient.id).order("scheduled_at", { ascending: false })
          setClientAssessments(al || [])

          if (!trainerData.trainerId) return
          const { data: allList } = await supabase
            .from("assessments").select("id, client_id, scheduled_at, notes, status, created_at")
            .eq("trainer_id", trainerData.trainerId).order("scheduled_at", { ascending: true })
          const enriched = await Promise.all(
            (allList || []).map(async as => {
              const { data: cp } = await supabase.from("profiles").select("full_name").eq("id", as.client_id).single()
              return { ...as, client_name: cp?.full_name || "Sem nome" }
            })
          )
          trainerData.setAllAssessments(enriched)
        } else {
          toast.error(result.error || "Erro ao agendar avaliação.")
        }
      } catch { toast.error("Erro de rede ao agendar.") }
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
          const update = (as: Assessment) =>
            as.id === completingAssessmentId ? { ...as, status: "done" as const, notes: completeNotes } : as
          trainerData.setAllAssessments(prev => prev.map(update))
          if (selectedClient) setClientAssessments(prev => prev.map(update))
        } else {
          toast.error(result.error || "Erro ao finalizar avaliação.")
        }
      } catch { toast.error("Erro de rede ao finalizar.") }
    })
  }

  /* ---- Handler: prescrever/editar plano ---- */
  const handlePrescribeSubmit = async (e: React.FormEvent, status = "active") => {
    e.preventDefault()
    if (!selectedClient) return
    if (!editor.planName) { toast.error("Por favor, dê um nome ao plano de treino."); return }

    const formattedStructure = {
      days: editor.localStructure.map(d => ({
        name: d.name, day_number: d.day_number, focus: d.focus,
        exercises: d.exercises.map(ex => ({
          exercise_id: ex.exercise_id,
          sets: Number(ex.sets), reps: String(ex.reps),
          rest_seconds: Number(ex.rest_seconds), notes: ex.notes || null,
        })),
      })),
    }

    startTransition(async () => {
      try {
        const result = editor.editingPlan
          ? await updateCustomWorkoutPlan(editor.editingPlan.id, editor.planName, editor.planStartDate, status, formattedStructure)
          : await createCustomWorkoutPlan(selectedClient.id, editor.planName, editor.planStartDate, status, formattedStructure)

        if (result.success) {
          toast.success(editor.editingPlan ? "Alterações gravadas com sucesso!" : "Plano de treino prescrito com sucesso!")
          editor.resetEditor()

          const { data: pl } = await supabase
            .from("workout_plans").select("id, name, status, start_date, created_at")
            .eq("client_id", selectedClient.id).order("created_at", { ascending: false })
          setClientPlans(pl || [])

          if (!editor.editingPlan) trainerData.setTrainerPlansCount(p => p + 1)
        } else {
          toast.error(result.error || "Erro ao guardar treino.")
        }
      } catch { toast.error("Erro de rede ao guardar plano.") }
    })
  }

  /* ---- Handler: excluir plano ---- */
  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("Tem a certeza que deseja excluir permanentemente este plano? Esta ação não pode ser desfeita.")) return
    startTransition(async () => {
      try {
        const result = await deleteWorkoutPlan(planId)
        if (result.success) {
          toast.success("Plano de treino excluído com sucesso!")
          if (selectedClient) {
            const { data: pl } = await supabase
              .from("workout_plans").select("id, name, status, start_date, created_at")
              .eq("client_id", selectedClient.id).order("created_at", { ascending: false })
            setClientPlans(pl || [])
          }
          trainerData.setTrainerPlansCount(p => Math.max(0, p - 1))
        } else {
          toast.error(result.error || "Erro ao excluir o plano.")
        }
      } catch { toast.error("Erro de rede ao excluir o plano.") }
    })
  }

  /* ---- Handler: logout ---- */
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success("Sessão terminada com sucesso.")
      setTimeout(() => { router.push("/login"); router.refresh() }, 800)
    } catch {
      toast.error("Erro ao encerrar sessão.")
      setLogoutLoading(false)
    }
  }

  const filteredClients = trainerData.clients.filter(c =>
    (c.full_name || "").toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(clientSearch.toLowerCase())
  )
  const pendingAssessments   = trainerData.allAssessments.filter(a => a.status === "pending")
  const completedAssessments = trainerData.allAssessments.filter(a => a.status === "done")

  return {
    // Core
    trainerName: trainerData.trainerName,
    trainerId: trainerData.trainerId,
    isLoading: trainerData.isLoading,
    logoutLoading,
    isPending,
    activeTab, setActiveTab,

    // Clientes
    clients: trainerData.clients,
    filteredClients,
    clientSearch, setClientSearch,
    selectedClient, setSelectedClient,

    // Detalhes do aluno
    clientSessions,
    clientAssessments,
    clientPlans,
    isClientDetailsLoading,

    // Avaliações
    allAssessments: trainerData.allAssessments,
    pendingAssessments,
    completedAssessments,

    // Stats
    trainerPlansCount: trainerData.trainerPlansCount,

    // Modal: agendar avaliação
    showScheduleModal, setShowScheduleModal,
    scheduleDate, setScheduleDate,
    scheduleNotes, setScheduleNotes,

    // Modal: concluir avaliação
    completingAssessmentId, setCompletingAssessmentId,
    completeNotes, setCompleteNotes,

    // Editor de plano (passthrough do useWorkoutEditor)
    showPrescribeModal: editor.showPrescribeModal,
    setShowPrescribeModal: editor.setShowPrescribeModal,
    planName: editor.planName,
    setPlanName: editor.setPlanName,
    planStartDate: editor.planStartDate,
    setPlanStartDate: editor.setPlanStartDate,
    presetType: editor.presetType,
    setPresetType: editor.setPresetType,
    createStep: editor.createStep,
    setCreateStep: editor.setCreateStep,
    editingPlan: editor.editingPlan,
    setEditingPlan: editor.setEditingPlan,
    exercisesLibrary: editor.exercisesLibrary,
    localStructure: editor.localStructure,
    setLocalStructure: editor.setLocalStructure,
    activeDayIndex: editor.activeDayIndex,
    setActiveDayIndex: editor.setActiveDayIndex,
    searchQuery: editor.searchQuery,
    setSearchQuery: editor.setSearchQuery,
    showSearchDropdown: editor.showSearchDropdown,
    setShowSearchDropdown: editor.setShowSearchDropdown,
    focusedDayIdxForSearch: editor.focusedDayIdxForSearch,
    setFocusedDayIdxForSearch: editor.setFocusedDayIdxForSearch,
    draggedExIndex: editor.draggedExIndex,
    setDraggedExIndex: editor.setDraggedExIndex,

    // Handlers
    handleLogout,
    handleScheduleSubmit,
    handleCompleteSubmit,
    handleAddExerciseToDay: editor.handleAddExerciseToDay,
    handleRemoveExerciseFromDay: editor.handleRemoveExerciseFromDay,
    handleReorderExercises: editor.handleReorderExercises,
    handleMoveExercise: editor.handleMoveExercise,
    handleEditExerciseField: editor.handleEditExerciseField,
    handleApplyComboToDay: editor.handleApplyComboToDay,
    handleEditPlan: editor.handleEditPlan,
    handleDeletePlan,
    handlePrescribeSubmit,
  }
}
