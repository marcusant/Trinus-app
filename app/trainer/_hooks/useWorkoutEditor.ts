"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { ClientProfile, WorkoutPlan, LocalDay, LocalExercise } from "../_types/trainer.types"

interface UseWorkoutEditorParams {
  selectedClient: ClientProfile | null
  setIsClientDetailsLoading: (v: boolean) => void
}

export function useWorkoutEditor({ selectedClient, setIsClientDetailsLoading }: UseWorkoutEditorParams) {
  const supabase = createClient()

  const [showPrescribeModal, setShowPrescribeModal] = useState(false)
  const [planName, setPlanName] = useState("")
  const [planStartDate, setPlanStartDate] = useState("")
  const [presetType, setPresetType] = useState<string>("")
  const [createStep, setCreateStep] = useState<number>(1)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [exercisesLibrary, setExercisesLibrary] = useState<{ id: string; name: string }[]>([])
  const [localStructure, setLocalStructure] = useState<LocalDay[]>([])
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false)
  const [focusedDayIdxForSearch, setFocusedDayIdxForSearch] = useState<number | null>(null)
  const [draggedExIndex, setDraggedExIndex] = useState<number | null>(null)

  // Pré-preenche planName e presetType com base no onboarding do aluno
  useEffect(() => {
    if (!showPrescribeModal || !selectedClient) return
    const meta = (selectedClient.metadata || {}) as Record<string, string>
    if (meta.objetivo) {
      const obj = meta.objetivo
      const loc = meta.local_treino ? ` (${meta.local_treino})` : ""
      setPlanName(`${obj} - 8 Semanas${loc}`)
      if (obj === "Hipertrofia") setPresetType("hipertrofia")
      else if (obj === "Emagrecer") setPresetType("emagrecimento")
      else if (meta.local_treino === "Casa" || meta.local_treino === "Ar Livre") setPresetType("funcional_casa")
      else setPresetType("")
    } else {
      setPlanName("")
      setPresetType("")
    }
  }, [showPrescribeModal, selectedClient])

  // Carrega biblioteca de exercícios
  useEffect(() => {
    async function loadExercises() {
      try {
        const { data, error } = await supabase.from("exercises").select("id, name").order("name")
        if (!error && data) setExercisesLibrary(data)
      } catch (err) {
        console.error("Erro ao buscar biblioteca de exercícios:", err)
      }
    }
    loadExercises()
  }, [supabase])

  const resetEditor = () => {
    setPlanName("")
    setPlanStartDate("")
    setPresetType("")
    setEditingPlan(null)
    setLocalStructure([])
    setCreateStep(1)
    setShowPrescribeModal(false)
  }

  // ---- Manipulação da estrutura local ----

  const handleAddExerciseToDay = (dayIdx: number, exerciseId: string, name: string) => {
    setLocalStructure(prev => {
      const copy = [...prev]
      const day = { ...copy[dayIdx], exercises: [...copy[dayIdx].exercises, { exercise_id: exerciseId, exercise_name: name, sets: 3, reps: "10", rest_seconds: 60, notes: "" }] }
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
      copy[dayIdx] = { ...copy[dayIdx], exercises: copy[dayIdx].exercises.filter((_, i) => i !== exerciseIdx) }
      return copy
    })
  }

  const handleReorderExercises = (dayIdx: number, fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return
    setLocalStructure(prev => {
      const copy = [...prev]
      const exercises = [...copy[dayIdx].exercises]
      const [moved] = exercises.splice(fromIdx, 1)
      exercises.splice(toIdx, 0, moved)
      copy[dayIdx] = { ...copy[dayIdx], exercises }
      return copy
    })
  }

  const handleMoveExercise = (dayIdx: number, index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= localStructure[dayIdx].exercises.length) return
    handleReorderExercises(dayIdx, index, targetIdx)
  }

  const handleEditExerciseField = (dayIdx: number, exerciseIdx: number, field: keyof LocalExercise, value: string | number) => {
    setLocalStructure(prev => {
      const copy = [...prev]
      const exercises = [...copy[dayIdx].exercises]
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], [field]: value }
      copy[dayIdx] = { ...copy[dayIdx], exercises }
      return copy
    })
  }

  const COMBOS: Record<string, { id: string; name: string; sets: number; reps: string; rest: number }[]> = {
    push: [
      { id: "475acb10-f5cd-46a3-8080-8ec717aa707f", name: "Supino Reto com Barra",           sets: 3, reps: "10-12", rest: 90 },
      { id: "577c90da-2601-4824-9f48-b3f3c6e7bc74", name: "Desenvolvimento com Halteres",     sets: 3, reps: "10-12", rest: 90 },
      { id: "7562d60c-a085-482c-8583-26f2968bcaf7", name: "Tríceps na Polia (Corda)",         sets: 3, reps: "12-15", rest: 60 },
    ],
    pull: [
      { id: "952005b7-9f0a-4e6d-90af-1b0953c5e9fe", name: "Puxada Vertical / Barra Fixa",    sets: 3, reps: "8-10",  rest: 90 },
      { id: "e1b12943-a5bc-43dc-838c-6c34d459d0e1", name: "Remada Curvada com Barra",         sets: 3, reps: "10-12", rest: 90 },
      { id: "a6f29601-da28-4019-9a65-307eb6799475", name: "Rosca Direta com Barra",           sets: 3, reps: "10-12", rest: 60 },
    ],
    legs: [
      { id: "cff3c1f7-465f-41e7-8ee9-d008f3affa3c", name: "Agachamento Livre",                sets: 3, reps: "10-12", rest: 90 },
      { id: "11a4ab9b-4177-4283-9a10-ab012ce6bb37", name: "Leg Press 45",                     sets: 3, reps: "12",    rest: 90 },
      { id: "4f7c0cf4-4661-46bf-8ef7-352dc2dc7426", name: "Prancha Frontal Isométrica",       sets: 3, reps: "45s",   rest: 60 },
    ],
    cardio: [
      { id: "34d08c36-f394-4e13-b177-9f30e4f36716", name: "Corrida na Esteira",               sets: 1, reps: "15 min", rest: 0 },
      { id: "df1c99ab-09dd-4149-aff7-9bee606c505f", name: "Abdominal Bicicleta",              sets: 3, reps: "20",    rest: 45 },
      { id: "4f7c0cf4-4661-46bf-8ef7-352dc2dc7426", name: "Prancha Frontal Isométrica",       sets: 3, reps: "45s",   rest: 60 },
    ],
  }

  const handleApplyComboToDay = (dayIdx: number, comboKey: string) => {
    const items = COMBOS[comboKey]
    if (!items) return
    setLocalStructure(prev => {
      const copy = [...prev]
      const newExercises = items.map(it => ({ exercise_id: it.id, exercise_name: it.name, sets: it.sets, reps: it.reps, rest_seconds: it.rest, notes: "" }))
      copy[dayIdx] = { ...copy[dayIdx], exercises: [...copy[dayIdx].exercises, ...newExercises] }
      return copy
    })
    toast.success("Combinação de exercícios adicionada!")
  }

  const handleEditPlan = async (plan: WorkoutPlan) => {
    setIsClientDetailsLoading(true)
    try {
      const { data: week, error: weekErr } = await supabase
        .from("workout_weeks").select("id").eq("plan_id", plan.id).eq("week_number", 1).maybeSingle()
      if (weekErr) throw weekErr

      if (!week) {
        setEditingPlan(plan)
        setPlanName(plan.name)
        setPlanStartDate(plan.start_date)
        setLocalStructure([
          { name: "Dia A", day_number: 1, focus: "Condicionamento Geral", exercises: [] },
          { name: "Dia B", day_number: 2, focus: "Condicionamento Geral", exercises: [] },
          { name: "Dia C", day_number: 3, focus: "Condicionamento Geral", exercises: [] },
        ])
        setCreateStep(2)
        setShowPrescribeModal(true)
        return
      }

      const { data: days, error: daysErr } = await supabase
        .from("workout_days").select("id, name, day_number, focus").eq("week_id", week.id).order("day_number")
      if (daysErr) throw daysErr

      const formattedDays: LocalDay[] = []
      for (const d of days || []) {
        const { data: exs, error: exsErr } = await supabase
          .from("workout_exercises").select("id, exercise_id, sets, reps, rest_seconds, notes, order_index")
          .eq("day_id", d.id).order("order_index")
        if (exsErr) throw exsErr

        const formattedExercises: LocalExercise[] = []
        for (const ex of exs || []) {
          let exName = "Exercício"
          if (ex.exercise_id) {
            const libEx = exercisesLibrary.find(e => e.id === ex.exercise_id)
            if (libEx) {
              exName = libEx.name
            } else {
              const { data: directEx } = await supabase
                .from("exercises").select("name").eq("id", ex.exercise_id).maybeSingle()
              if (directEx) exName = directEx.name
            }
          }
          formattedExercises.push({ exercise_id: ex.exercise_id || "", exercise_name: exName, sets: ex.sets || 3, reps: ex.reps || "10", rest_seconds: ex.rest_seconds || 60, notes: ex.notes || "" })
        }
        formattedDays.push({ name: d.name || `Dia ${d.day_number}`, day_number: d.day_number, focus: d.focus || "Geral", exercises: formattedExercises })
      }

      setEditingPlan(plan)
      setPlanName(plan.name)
      setPlanStartDate(plan.start_date)
      setPresetType("")
      setLocalStructure(formattedDays)
      setCreateStep(2)
      setShowPrescribeModal(true)
    } catch (err) {
      console.error("Erro ao carregar detalhes do plano:", err)
      toast.error("Erro ao carregar estrutura do plano de treino.")
    } finally {
      setIsClientDetailsLoading(false)
    }
  }

  return {
    showPrescribeModal, setShowPrescribeModal,
    planName, setPlanName,
    planStartDate, setPlanStartDate,
    presetType, setPresetType,
    createStep, setCreateStep,
    editingPlan, setEditingPlan,
    exercisesLibrary,
    localStructure, setLocalStructure,
    activeDayIndex, setActiveDayIndex,
    searchQuery, setSearchQuery,
    showSearchDropdown, setShowSearchDropdown,
    focusedDayIdxForSearch, setFocusedDayIdxForSearch,
    draggedExIndex, setDraggedExIndex,
    resetEditor,
    handleAddExerciseToDay,
    handleRemoveExerciseFromDay,
    handleReorderExercises,
    handleMoveExercise,
    handleEditExerciseField,
    handleApplyComboToDay,
    handleEditPlan,
  }
}
