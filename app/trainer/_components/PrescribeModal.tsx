// app/trainer/_components/PrescribeModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { ClientProfile, LocalDay, LocalExercise, WorkoutPlan } from "../_types/trainer.types"

interface PrescribeModalProps {
  selectedClient: ClientProfile
  editingPlan: WorkoutPlan | null
  createStep: number
  setCreateStep: (v: number) => void
  planName: string
  setPlanName: (v: string) => void
  planStartDate: string
  setPlanStartDate: (v: string) => void
  presetType: string
  setPresetType: (v: string) => void
  localStructure: LocalDay[]
  setLocalStructure: (fn: (prev: LocalDay[]) => LocalDay[]) => void
  activeDayIndex: number
  setActiveDayIndex: (v: number) => void
  exercisesLibrary: { id: string; name: string }[]
  searchQuery: string
  setSearchQuery: (v: string) => void
  showSearchDropdown: boolean
  setShowSearchDropdown: (v: boolean) => void
  focusedDayIdxForSearch: number | null
  setFocusedDayIdxForSearch: (v: number | null) => void
  draggedExIndex: number | null
  setDraggedExIndex: (v: number | null) => void
  isPending: boolean
  onAddExercise: (dayIdx: number, id: string, name: string) => void
  onRemoveExercise: (dayIdx: number, exIdx: number) => void
  onReorderExercises: (dayIdx: number, from: number, to: number) => void
  onMoveExercise: (dayIdx: number, idx: number, dir: 'up' | 'down') => void
  onEditExerciseField: (dayIdx: number, exIdx: number, field: keyof LocalExercise, value: string | number) => void
  onApplyCombo: (dayIdx: number, key: string) => void
  onSubmit: (e: React.FormEvent, status: string) => void
  onClose: () => void
}

// Preset data maps
const PRESETS_MAP: Record<string, { name: string; focus: string; exercises: { id: string; name: string; sets: number; reps: string; rest: number; notes: string }[] }[]> = {
  hipertrofia: [
    {
      name: 'Dia A - Push (Peito, Ombros, Tríceps)',
      focus: 'Hipertrofia - Empurrar',
      exercises: [
        { id: '475acb10-f5cd-46a3-8080-8ec717aa707f', name: 'Supino Reto com Barra', sets: 4, reps: '10-12', rest: 90, notes: 'Foco na amplitude e controle no supino' },
        { id: '577c90da-2601-4824-9f48-b3f3c6e7bc74', name: 'Desenvolvimento com Halteres', sets: 3, reps: '10-12', rest: 90, notes: 'Manter postura ereta no desenvolvimento' },
        { id: '7562d60c-a085-482c-8583-26f2968bcaf7', name: 'Tríceps na Polia (Corda)', sets: 3, reps: '12-15', rest: 60, notes: 'Foco na contração de pico no tríceps corda' }
      ]
    },
    {
      name: 'Dia B - Pull (Costas e Bíceps)',
      focus: 'Hipertrofia - Puxar',
      exercises: [
        { id: '952005b7-9f0a-4e6d-90af-1b0953c5e9fe', name: 'Puxada Vertical / Barra Fixa', sets: 4, reps: '8-10', rest: 90, notes: 'Barra fixa, controle a descida' },
        { id: 'e1b12943-a5bc-43dc-838c-6c34d459d0e1', name: 'Remada Curvada com Barra', sets: 3, reps: '10-12', rest: 90, notes: 'Remada curvada, coluna neutra' },
        { id: 'a6f29601-da28-4019-9a65-307eb6799475', name: 'Rosca Direta com Barra', sets: 3, reps: '10-12', rest: 60, notes: 'Rosca direta sem balançar o corpo' }
      ]
    },
    {
      name: 'Dia C - Legs & Core (Pernas e Abdominais)',
      focus: 'Hipertrofia - Pernas e Core',
      exercises: [
        { id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', name: 'Agachamento Livre', sets: 4, reps: '10', rest: 90, notes: 'Agachamento profundo e controlado' },
        { id: '11a4ab9b-4177-4283-9a10-ab012ce6bb37', name: 'Leg Press 45', sets: 3, reps: '12', rest: 90, notes: 'Leg Press 45, empurre com calcanhares' },
        { id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', name: 'Prancha Frontal Isométrica', sets: 3, reps: '60s', rest: 60, notes: 'Manter prancha firme' }
      ]
    }
  ],
  emagrecimento: [
    {
      name: 'Dia A - Cardio HIIT & Core',
      focus: 'Gasto Calórico e Core',
      exercises: [
        { id: '34d08c36-f394-4e13-b177-9f30e4f36716', name: 'Corrida na Esteira', sets: 1, reps: '20 min', rest: 0, notes: 'Corrida na esteira com variação de intensidade' },
        { id: 'df1c99ab-09dd-4149-aff7-9bee606c505f', name: 'Abdominal Bicicleta', sets: 3, reps: '20', rest: 45, notes: 'Bicicleta abdominal controlada' },
        { id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', name: 'Prancha Frontal Isométrica', sets: 3, reps: '60s', rest: 60, notes: 'Prancha frontal, core contraído' }
      ]
    },
    {
      name: 'Dia B - Força Funcional',
      focus: 'Tonificação Muscular Geral',
      exercises: [
        { id: '55e90237-cc44-4a09-85d9-b2fd528ee7b5', name: 'Flexão de Braços', sets: 3, reps: 'Máximo', rest: 60, notes: 'Flexão de braços com corpo alinhado' },
        { id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', name: 'Agachamento Livre', sets: 3, reps: '15', rest: 60, notes: 'Agachamento com barra, descer bem' },
        { id: 'e1b12943-a5bc-43dc-838c-6c34d459d0e1', name: 'Remada Curvada com Barra', sets: 3, reps: '12', rest: 60, notes: 'Remada curvada para dorsal' }
      ]
    },
    {
      name: 'Dia C - Definição Muscular',
      focus: 'Resistência Muscular e Core',
      exercises: [
        { id: '475acb10-f5cd-46a3-8080-8ec717aa707f', name: 'Supino Reto com Barra', sets: 3, reps: '15', rest: 60, notes: 'Supino reto com cadência lenta' },
        { id: 'a6f29601-da28-4019-9a65-307eb6799475', name: 'Rosca Direta com Barra', sets: 3, reps: '15', rest: 60, notes: 'Rosca direta para bíceps' },
        { id: 'c517a7b9-ab14-427f-b7a4-4eb91b16c35b', name: 'Prancha Lateral Isométrica', sets: 3, reps: '30s/lado', rest: 45, notes: 'Prancha lateral, elevar quadril' }
      ]
    }
  ],
  funcional_casa: [
    {
      name: 'Dia A - Superiores & Core (Peso Corporal)',
      focus: 'Força Corporal e Core',
      exercises: [
        { id: '55e90237-cc44-4a09-85d9-b2fd528ee7b5', name: 'Flexão de Braços', sets: 4, reps: '12-15', rest: 60, notes: 'Flexão de braços convencional' },
        { id: '4f7c0cf4-4661-46bf-8ef7-352dc2dc7426', name: 'Prancha Frontal Isométrica', sets: 4, reps: '45s', rest: 45, notes: 'Prancha frontal firme' },
        { id: 'c517a7b9-ab14-427f-b7a4-4eb91b16c35b', name: 'Prancha Lateral Isométrica', sets: 3, reps: '30s/lado', rest: 45, notes: 'Prancha lateral sustentada' }
      ]
    },
    {
      name: 'Dia B - Inferiores & Cardio (Casa/Ar Livre)',
      focus: 'Resistência Muscular e Aeróbica',
      exercises: [
        { id: 'cff3c1f7-465f-41e7-8ee9-d008f3affa3c', name: 'Agachamento Livre', sets: 4, reps: '20 (Peso Corporal)', rest: 60, notes: 'Agachamento com peso corporal contínuo' },
        { id: 'df1c99ab-09dd-4149-aff7-9bee606c505f', name: 'Abdominal Bicicleta', sets: 3, reps: '20', rest: 45, notes: 'Bicicleta abdominal rápida' },
        { id: '37ec7019-cb87-4d35-acdd-07ac8bff48ac', name: 'Corrida ao Ar Livre', sets: 1, reps: '15 min', rest: 0, notes: 'Corrida contínua ao ar livre' }
      ]
    }
  ]
}

function getDayNumber(dname: string) {
  if (dname.includes('Dia A')) return 1
  if (dname.includes('Dia B')) return 2
  if (dname.includes('Dia C')) return 3
  return 1
}

export function PrescribeModal(props: PrescribeModalProps) {
  const {
    selectedClient, editingPlan, createStep, setCreateStep,
    planName, setPlanName, planStartDate, setPlanStartDate,
    presetType, setPresetType,
    localStructure, setLocalStructure,
    activeDayIndex, setActiveDayIndex,
    exercisesLibrary,
    searchQuery, setSearchQuery,
    showSearchDropdown, setShowSearchDropdown,
    focusedDayIdxForSearch, setFocusedDayIdxForSearch,
    draggedExIndex, setDraggedExIndex,
    isPending,
    onAddExercise, onRemoveExercise, onReorderExercises, onMoveExercise,
    onEditExerciseField, onApplyCombo,
    onSubmit, onClose,
  } = props

  const meta = (selectedClient.metadata || {}) as Record<string, string>

  const handleAdvanceToStep2 = () => {
    if (!planName) {
      toast.error("Por favor, dê um nome ao plano.")
      return
    }
    if (!planStartDate) {
      toast.error("Por favor, selecione uma data de início.")
      return
    }

    if (presetType && PRESETS_MAP[presetType]) {
      const daysData = PRESETS_MAP[presetType].map(d => ({
        name: d.name,
        day_number: getDayNumber(d.name),
        focus: d.focus,
        exercises: d.exercises.map(ex => ({
          exercise_id: ex.id,
          exercise_name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest,
          notes: ex.notes
        }))
      }))
      setLocalStructure(() => daysData)
    } else {
      setLocalStructure(() => [
        { name: 'Dia A', day_number: 1, focus: 'Condicionamento Geral', exercises: [] },
        { name: 'Dia B', day_number: 2, focus: 'Condicionamento Geral', exercises: [] },
        { name: 'Dia C', day_number: 3, focus: 'Condicionamento Geral', exercises: [] }
      ])
    }

    setCreateStep(2)
    setActiveDayIndex(0)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className={cn(
        "w-full bg-card rounded-3xl border border-white/10 p-5 sm:p-7 shadow-card transition-all duration-300 reveal visible my-8",
        createStep === 2 ? "max-w-[800px]" : "max-w-[480px]"
      )}>
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {editingPlan ? "Editar Plano de Treino" : "Prescrever Plano de Treino"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Para o aluno: <strong className="text-primary">{selectedClient.full_name}</strong>
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 border border-white/5 px-2.5 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase">
            <span>Passo {createStep} de 3</span>
          </div>
        </div>

        {/* STEP 1 */}
        {createStep === 1 && (
          <div className="space-y-4">
            {meta.objetivo && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 flex flex-col gap-1.5 animate-in fade-in select-none">
                <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wider">Foco de Onboarding</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground">
                    🎯 {meta.objetivo}
                    {meta.local_treino && ` · 🏢 ${meta.local_treino}`}
                    {meta.nivel && ` · 🏃 ${meta.nivel}`}
                  </span>
                  <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">Meta Ativa</span>
                </div>
              </div>
            )}

            <div className="space-y-2 select-none">
              <span className="text-xs font-bold text-foreground block">Escolher Template de Treino (Autopreenchimento)</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'hipertrofia', label: '💪 Hipertrofia', desc: 'Push/Pull/Legs' },
                  { key: 'emagrecimento', label: '🔥 Cardio/HIIT', desc: 'Gasto Calórico' },
                  { key: 'funcional_casa', label: '🏡 Casa/Ar Livre', desc: 'Peso Corporal' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (presetType === item.key) {
                        setPresetType('')
                      } else {
                        setPresetType(item.key)
                        if (item.key === 'hipertrofia') setPlanName('Hipertrofia - 8 Semanas')
                        else if (item.key === 'emagrecimento') setPlanName('Emagrecimento & Cardio')
                        else if (item.key === 'funcional_casa') setPlanName('Treino Funcional (Casa/Ar Livre)')
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition cursor-pointer active:scale-95 duration-200 ${presetType === item.key
                        ? 'border-primary bg-primary/10 text-primary shadow-glow-whisper'
                        : 'border-white/5 bg-black/40 text-zinc-400 hover:border-primary/40 hover:text-white'
                      }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[8px] text-muted-foreground mt-0.5 leading-none block">{item.desc}</span>
                  </button>
                ))}
              </div>
              <div className="text-[9px] text-muted-foreground italic leading-relaxed">
                * O template irá preencher previamente exercícios da biblioteca que você poderá customizar no próximo passo.
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="plan-name" className="text-xs font-bold text-foreground block">Nome do Plano</label>
              <input id="plan-name" type="text" required placeholder="Ex: Hipertrofia 8 Semanas, Emagrecimento Fase 1..." value={planName} onChange={(e) => setPlanName(e.target.value)} className="w-full p-2.5 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition" />
            </div>

            <div className="space-y-2">
              <label htmlFor="plan-start-date" className="text-xs font-bold text-foreground block">Data de Início</label>
              <input id="plan-start-date" type="date" required value={planStartDate} onChange={(e) => setPlanStartDate(e.target.value)} className="w-full p-2.5 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition" />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Button type="button" variant="outline" onClick={onClose} className="border-white/5 cursor-pointer text-xs">Cancelar</Button>
              <Button type="button" onClick={handleAdvanceToStep2} className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs flex items-center gap-1.5">
                Avançar para Exercícios ➔
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {createStep === 2 && localStructure.length > 0 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex border-b border-white/5 pb-2 overflow-x-auto gap-2 select-none">
              {localStructure.map((day, idx) => (
                <button key={idx} type="button" onClick={() => setActiveDayIndex(idx)} className={cn("px-4 py-2 rounded-xl text-xs font-bold cursor-pointer border transition duration-200 shrink-0", activeDayIndex === idx ? "bg-primary/10 border-primary text-primary shadow-glow-whisper" : "border-white/5 bg-black/40 text-muted-foreground hover:text-white")}>
                  {day.name} ({day.exercises.length} Exs)
                </button>
              ))}
            </div>

            <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-4">
              <div className="grid grid-cols-2 gap-3 select-none">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Nome do Dia</label>
                  <input type="text" value={localStructure[activeDayIndex].name} onChange={(e) => { const val = e.target.value; setLocalStructure(prev => { const copy = [...prev]; copy[activeDayIndex] = { ...copy[activeDayIndex], name: val }; return copy }) }} className="w-full p-2 bg-black/40 border border-white/5 rounded-xl text-xs text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Foco Muscular / Objetivo</label>
                  <input type="text" value={localStructure[activeDayIndex].focus} onChange={(e) => { const val = e.target.value; setLocalStructure(prev => { const copy = [...prev]; copy[activeDayIndex] = { ...copy[activeDayIndex], focus: val }; return copy }) }} className="w-full p-2 bg-black/40 border border-white/5 rounded-xl text-xs text-foreground focus:outline-none" />
                </div>
              </div>

              <div className="space-y-3.5">
                <span className="text-xs font-bold text-foreground block border-b border-white/5 pb-1">Exercícios Prescritos</span>
                {localStructure[activeDayIndex].exercises.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-black/20 rounded-xl border border-white/5 border-dashed">
                    Nenhum exercício neste dia ainda. Utilize a busca abaixo para adicionar ou aplique uma combinação rápida!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {localStructure[activeDayIndex].exercises.map((ex, exIdx) => (
                      <div key={exIdx} draggable={true} onDragStart={() => setDraggedExIndex(exIdx)} onDragOver={(e) => e.preventDefault()} onDragEnd={() => setDraggedExIndex(null)} onDrop={() => { if (draggedExIndex !== null) onReorderExercises(activeDayIndex, draggedExIndex, exIdx) }}
                        className={cn("bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 group relative transition hover:border-white/10 select-none", draggedExIndex === exIdx && "opacity-30 border-primary/50 border-dashed")}>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                          <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 font-bold text-sm shrink-0 select-none px-1" title="Arraste para reordenar">☰</div>
                          <div className="flex flex-col gap-0.5 shrink-0 select-none">
                            <button type="button" disabled={exIdx === 0} onClick={() => onMoveExercise(activeDayIndex, exIdx, 'up')} className="text-[9px] text-zinc-500 hover:text-primary disabled:opacity-20 disabled:hover:text-zinc-500 transition leading-none cursor-pointer" title="Subir Exercício">▲</button>
                            <button type="button" disabled={exIdx === localStructure[activeDayIndex].exercises.length - 1} onClick={() => onMoveExercise(activeDayIndex, exIdx, 'down')} className="text-[9px] text-zinc-500 hover:text-primary disabled:opacity-20 disabled:hover:text-zinc-500 transition leading-none cursor-pointer" title="Descer Exercício">▼</button>
                          </div>
                          <span className="text-xs font-bold text-foreground truncate pl-1" title={ex.exercise_name}>{exIdx + 1}. {ex.exercise_name}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1"><span className="text-[9px] text-muted-foreground uppercase font-bold">Sets</span><input type="number" min={1} value={ex.sets} onChange={(e) => onEditExerciseField(activeDayIndex, exIdx, 'sets', Number(e.target.value))} className="w-11 text-center bg-black/60 border border-white/5 py-1 px-1.5 text-xs rounded-lg focus:outline-none focus:border-primary text-foreground" /></div>
                          <div className="flex items-center gap-1"><span className="text-[9px] text-muted-foreground uppercase font-bold">Reps</span><input type="text" value={ex.reps} onChange={(e) => onEditExerciseField(activeDayIndex, exIdx, 'reps', e.target.value)} className="w-14 text-center bg-black/60 border border-white/5 py-1 px-1.5 text-xs rounded-lg focus:outline-none focus:border-primary text-foreground" /></div>
                          <div className="flex items-center gap-1"><span className="text-[9px] text-muted-foreground uppercase font-bold">Desc(s)</span><input type="number" min={0} value={ex.rest_seconds} onChange={(e) => onEditExerciseField(activeDayIndex, exIdx, 'rest_seconds', Number(e.target.value))} className="w-14 text-center bg-black/60 border border-white/5 py-1 px-1.5 text-xs rounded-lg focus:outline-none focus:border-primary text-foreground" /></div>
                          <div className="flex items-center gap-1 flex-1 min-w-[120px]"><input type="text" placeholder="Notas..." value={ex.notes} onChange={(e) => onEditExerciseField(activeDayIndex, exIdx, 'notes', e.target.value)} className="w-full bg-black/60 border border-white/5 py-1 px-2 text-[11px] rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-zinc-700" /></div>
                          <button type="button" onClick={() => onRemoveExercise(activeDayIndex, exIdx)} className="p-1 text-zinc-500 hover:text-destructive hover:bg-destructive/10 rounded-lg transition" title="Remover Exercício"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Combinations */}
              <div className="space-y-2 border-t border-white/5 pt-3 select-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">🪄 Combinações Prontas (Autopreencher Dia)</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'push', label: '🏋️‍♂️ Empurrar (Peito/Ombro/Tríceps)' },
                    { key: 'pull', label: '🦅 Puxar (Costas/Bíceps)' },
                    { key: 'legs', label: '🦵 Pernas (Legs/Core)' },
                    { key: 'cardio', label: '⚡ Cardio & Abs' }
                  ].map((combo) => (
                    <button key={combo.key} type="button" onClick={() => onApplyCombo(activeDayIndex, combo.key)} className="px-2.5 py-1 text-[10px] font-bold border border-white/5 bg-black/40 hover:border-primary/40 hover:text-primary rounded-xl transition cursor-pointer active:scale-95 duration-150">
                      {combo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Exercise Search */}
              <div className="space-y-2 border-t border-white/5 pt-3 select-none relative">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">➕ Pesquisar & Adicionar Exercício da Biblioteca</span>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
                  <input type="text" placeholder="Pesquisar por nome do exercício..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); setFocusedDayIdxForSearch(activeDayIndex) }} onFocus={() => { setShowSearchDropdown(true); setFocusedDayIdxForSearch(activeDayIndex) }} className="w-full pl-8 pr-4 py-1.5 bg-black/40 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-primary transition text-foreground placeholder-zinc-600" />
                  {showSearchDropdown && focusedDayIdxForSearch === activeDayIndex && searchQuery.length > 1 && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowSearchDropdown(false)} />
                      <div className="absolute left-0 right-0 top-full mt-1.5 max-h-[160px] overflow-y-auto bg-card border border-white/10 rounded-2xl shadow-card z-40 p-1.5 space-y-0.5 scrollbar-thin">
                        {exercisesLibrary.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 15).map(ex => (
                          <button key={ex.id} type="button" onClick={() => onAddExercise(activeDayIndex, ex.id, ex.name)} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-primary hover:text-primary-foreground transition cursor-pointer">
                            {ex.name}
                          </button>
                        ))}
                        {exercisesLibrary.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                          <div className="text-center py-4 text-xs text-muted-foreground italic">Nenhum exercício encontrado.</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button type="button" variant="outline" onClick={() => { if (editingPlan) { onClose() } else { setCreateStep(1) } }} className="border-white/5 cursor-pointer text-xs">⬅️ Voltar</Button>
              <Button type="button" onClick={() => {
                const totalExercises = localStructure.reduce((acc, d) => acc + d.exercises.length, 0)
                if (totalExercises === 0) { toast.error("Por favor, adicione pelo menos um exercício em algum dia antes de avançar."); return }
                setCreateStep(3)
              }} className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs flex items-center gap-1">
                Avançar para Envio ➔
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {createStep === 3 && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2 select-none">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Resumo do Plano</span>
              <div className="space-y-1">
                <span className="text-sm font-extrabold text-foreground block">📋 Plano: {planName}</span>
                <span className="text-xs text-muted-foreground block">📅 Data de Início: {new Date(planStartDate).toLocaleDateString('pt-PT')}</span>
                <span className="text-xs text-muted-foreground block">🏋️ Estrutura: {localStructure.length} dias configurados ({localStructure.reduce((a, d) => a + d.exercises.length, 0)} exercícios totais)</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold text-foreground block">Deseja encaminhar este plano ao aluno imediatamente?</span>
              <div className="grid gap-3 select-none">
                <div onClick={(e) => onSubmit(e, 'active')} className="p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition cursor-pointer flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-105 transition shrink-0 mt-0.5">🚀</div>
                  <div>
                    <span className="font-extrabold text-sm text-foreground block">Ativar e Enviar (Recomendado)</span>
                    <span className="text-xs text-muted-foreground block leading-relaxed mt-0.5">O plano de treino ficará ativo imediatamente. O aluno receberá a notificação em seu painel e poderá iniciar os exercícios na data indicada.</span>
                  </div>
                </div>
                <div onClick={(e) => onSubmit(e, 'draft')} className="p-4 rounded-2xl border border-white/5 bg-black/40 hover:border-white/20 hover:bg-black/30 transition cursor-pointer flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 group-hover:scale-105 transition shrink-0 mt-0.5">📁</div>
                  <div>
                    <span className="font-extrabold text-sm text-foreground block">Salvar como Rascunho</span>
                    <span className="text-xs text-muted-foreground block leading-relaxed mt-0.5">O plano ficará salvo na lista de prescrições. O aluno **NÃO** receberá nenhuma notificação.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button type="button" variant="outline" onClick={() => setCreateStep(2)} className="border-white/5 cursor-pointer text-xs">⬅️ Voltar</Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-white/5 cursor-pointer text-xs">Fechar</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
