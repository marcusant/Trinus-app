// app/client/_components/TreinosTab.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Sparkles,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Play,
  Check,
  Plus,
  Minus,
  Activity,
  Heart,
  Shield,
  Timer,
} from "lucide-react"
import { PseSheet } from "./PseSheet"
import type {
  WorkoutPlan,
  WorkoutDay,
  WorkoutExercise,
  WorkoutSession,
  UserProfile,
  WorkoutLogs,
  PreviousSets,
} from "../_types/client.types"

interface TreinosTabProps {
  profile: UserProfile | null
  trainerName: string | null
  activePlan: WorkoutPlan | null
  planDays: WorkoutDay[]
  selectedDayId: string | null
  setSelectedDayId: (id: string | null) => void
  dayExercises: WorkoutExercise[]
  previousSets: PreviousSets
  isExercisesLoading: boolean
  sessions: WorkoutSession[]
  isTimerRunning: boolean
  timerSeconds: number
  activeWorkoutDayId: string | null
  fmt: (s: number) => string
  handleStartWorkout: (dayId: string) => void
  // Registo de séries (Hevy)
  workoutLogs: WorkoutLogs
  updateSet: (exId: string, setIdx: number, field: "reps_done" | "load_kg", value: string) => void
  toggleSet: (exId: string, setIdx: number) => void
  setRpe: (exId: string, setIdx: number, value: number | null) => void
  addSet: (exId: string) => void
  removeSet: (exId: string, setIdx: number) => void
  startRest: (seconds?: number | null) => void
}

/** Formata o descanso prescrito (segundos → "2min 0s" ou "45s"). */
function fmtRestLabel(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}min ${s}s`
  }
  return `${seconds}s`
}

export function TreinosTab({
  profile,
  trainerName,
  activePlan,
  planDays,
  selectedDayId,
  setSelectedDayId,
  dayExercises,
  previousSets,
  isExercisesLoading,
  sessions,
  isTimerRunning,
  timerSeconds,
  activeWorkoutDayId,
  fmt,
  handleStartWorkout,
  workoutLogs,
  updateSet,
  toggleSet,
  setRpe,
  addSet,
  removeSet,
  startRest,
}: TreinosTabProps) {
  // Folha de PSE/RPE: qual série está a ser anotada.
  const [pseEdit, setPseEdit] = useState<{ exId: string; setIdx: number } | null>(null)

  // PAR-Q safe alternative path
  if (profile?.par_q_caminho_alternativo) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-destructive/20 bg-gradient-to-r from-destructive/10 via-background/40 to-destructive/5 p-6 backdrop-blur-md shadow-glow-whisper space-y-6 select-none animate-in fade-in duration-500">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive animate-pulse" />
              <h3 className="text-lg font-black text-white tracking-tight">🧘 Caminho Alternativo Seguro Ativado</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Detetámos fatores no teu questionário de saúde **PAR-Q** que requerem atenção médica especial. Para garantir a tua integridade e segurança, o plano de treino físico regular está **temporariamente bloqueado** até validação pelo teu treinador.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Atividades Recomendadas (Foco em Regeneração & Mente)</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-primary/30 transition duration-300">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-xs text-foreground block">Mobilidade Articular</span>
                <span className="text-xs text-muted-foreground mt-1 block">Rotina de 15 min de ativação articular e alongamento passivo.</span>
              </div>

              <div className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-[#38bdf8]/30 transition duration-300">
                <div className="w-8 h-8 rounded-full bg-[#38bdf8]/10 flex items-center justify-center mb-3">
                  <Heart className="h-4 w-4 text-[#38bdf8]" />
                </div>
                <span className="font-bold text-xs text-foreground block">Pranayama / Respiração</span>
                <span className="text-xs text-muted-foreground mt-1 block">Técnicas de respiração controlada de 5-10 min para relaxamento e foco.</span>
              </div>

              <div className="p-4 bg-black/30 border border-[#8b5cf6]/20 rounded-xl hover:border-[#8b5cf6]/40 transition duration-300">
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mb-3">
                  <Sparkles className="h-4 w-4 text-[#8b5cf6]" />
                </div>
                <span className="font-bold text-xs text-foreground block">Mente e Essência</span>
                <span className="text-xs text-muted-foreground mt-1 block">Acede ao Pilar da Mente Clara e foca-te em organizar a rotina de sono e propósito.</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
            <p className="text-xs font-bold text-destructive">
              ⚠️ O teu Treinador ({trainerName || "Equipa TRINUS"}) foi notificado e está a rever o teu caso.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Dia selecionado: mostra apenas esse dia (esconde os outros).
  const visibleDays = selectedDayId ? planDays.filter(d => d.id === selectedDayId) : planDays

  // Dia ativo a decorrer → tela dedicada (estilo Hevy): sem cabeçalho de plano
  // nem lista de dias, apenas estatísticas + exercícios (a barra do topo trata
  // do tempo / relógio / Concluir).
  const activeDay = isTimerRunning && activeWorkoutDayId
    ? planDays.find(d => d.id === activeWorkoutDayId) ?? null
    : null

  return (
    <div className="space-y-4">
      {activeDay ? (
        <ActiveWorkoutView
          day={activeDay}
          dayExercises={dayExercises}
          previousSets={previousSets}
          workoutLogs={workoutLogs}
          isExercisesLoading={isExercisesLoading}
          timerSeconds={timerSeconds}
          fmt={fmt}
          updateSet={updateSet}
          toggleSet={toggleSet}
          addSet={addSet}
          removeSet={removeSet}
          startRest={startRest}
          onEditPse={(exId, setIdx) => setPseEdit({ exId, setIdx })}
        />
      ) : activePlan ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">Plano Ativo</span>
              <h2 className="text-base font-black text-foreground truncate">{activePlan.name}</h2>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-muted-foreground bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
              {planDays.length} {planDays.length === 1 ? "dia" : "dias"}
            </span>
          </div>

          {/* Voltar à lista de treinos (quando um dia está selecionado) */}
          {selectedDayId && (
            <button
              type="button"
              onClick={() => setSelectedDayId(null)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Ver todos os treinos
            </button>
          )}

          <div className="space-y-2">
            {visibleDays.map(day => {
              const done = sessions.some(s => s.workout_day_id === day.id)
              const isOpen = selectedDayId === day.id
              return (
                <div key={day.id}>
                  <div
                    onClick={() => setSelectedDayId(isOpen ? null : day.id)}
                    className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer transition border ${isOpen ? "border-primary/40 bg-primary/5" : "border-white/5 bg-card/30 hover:border-white/10"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${done ? "bg-success/10 text-success" : isOpen ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                        {done ? <CheckCircle className="h-4 w-4" /> : `D${day.day_number}`}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold block text-sm text-foreground truncate">{day.name || `Dia ${day.day_number}`}</span>
                        <span className="text-xs text-muted-foreground truncate block">{day.focus || "Treino geral"}</span>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </div>

                  {/* Exercícios do dia selecionado (preview + iniciar) */}
                  {isOpen && (
                    <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                      {done ? (
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-success bg-success/10 border border-success/15 py-2.5 rounded-xl">
                          <CheckCircle className="h-3.5 w-3.5" /> Treino concluído
                        </div>
                      ) : (
                        <Button size="sm" className="w-full bg-primary hover:brightness-110 text-primary-foreground text-xs font-bold cursor-pointer" onClick={() => handleStartWorkout(day.id)} disabled={isTimerRunning || isExercisesLoading}>
                          <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Iniciar treino
                        </Button>
                      )}

                      {isExercisesLoading ? (
                        <div className="rounded-2xl border border-white/5 bg-card/40 py-6 flex justify-center text-muted-foreground gap-2 text-xs shadow-glow-whisper"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Carregando...</div>
                      ) : dayExercises.length === 0 ? (
                        <div className="rounded-2xl border border-white/5 bg-card/40 text-center py-6 text-xs text-muted-foreground shadow-glow-whisper">Nenhum exercício prescrito.</div>
                      ) : (
                        /* ── Preview da prescrição (read-only): Exercício · Série · Kg · Reps · Desc ── */
                        <div className="rounded-2xl border border-white/5 bg-card/40 py-2 shadow-glow-whisper">
                          {/* Cabeçalho de colunas (uma vez) */}
                          <div className="flex items-center gap-2 px-3 pb-2 border-b border-white/5">
                            <span className="w-5 shrink-0" />
                            <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Exercício</span>
                            <span className="w-10 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Série</span>
                            <span className="w-14 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kg</span>
                            <span className="w-14 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reps</span>
                            <span className="w-12 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Desc</span>
                          </div>

                          {/* Linhas */}
                          <div className="divide-y divide-white/5">
                            {dayExercises.map((ex, idx) => (
                              <div key={ex.id} className="flex items-center gap-2 px-3 py-2.5">
                                <span className="w-5 shrink-0 text-center text-[11px] font-bold text-muted-foreground tabular-nums">{idx + 1}</span>
                                <span className="flex-1 min-w-0 truncate text-sm font-bold text-foreground">{ex.exercise_name}</span>
                                <span className="w-10 text-center text-[11px] text-foreground tabular-nums">{ex.sets ?? "—"}</span>
                                <span className={`w-14 text-center text-[11px] tabular-nums ${ex.load_kg ? "text-primary font-bold" : "text-zinc-600"}`}>{ex.load_kg ? `${ex.load_kg}kg` : "—"}</span>
                                <span className="w-14 text-center text-[11px] text-foreground tabular-nums">{ex.reps || "—"}</span>
                                <span className="w-12 text-center text-[11px] text-muted-foreground tabular-nums">{ex.rest_seconds != null ? `${ex.rest_seconds}s` : "—"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {planDays.length === 0 && (
              <div className="text-center py-8 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">Plano sem dias configurados.</div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">
          <Dumbbell className="h-6 w-6 mx-auto mb-2 text-zinc-600" />Sem plano de treino ativo.
        </div>
      )}

      {/* Folha de PSE/RPE */}
      <PseSheet
        open={pseEdit != null}
        setLabel={(() => {
          if (!pseEdit) return null
          const s = (workoutLogs[pseEdit.exId] ?? [])[pseEdit.setIdx]
          if (!s) return null
          return `Série ${pseEdit.setIdx + 1} · ${s.load_kg || "—"} kg × ${s.reps_done || "—"} reps`
        })()}
        value={pseEdit ? (workoutLogs[pseEdit.exId]?.[pseEdit.setIdx]?.rpe ?? null) : null}
        onConfirm={v => { if (pseEdit) setRpe(pseEdit.exId, pseEdit.setIdx, v) }}
        onClose={() => setPseEdit(null)}
      />
    </div>
  )
}

/**
 * Tela dedicada de treino ativo (estilo Hevy): título do dia, estatísticas em
 * direto e registo de séries. Sem cabeçalho de plano nem lista de dias.
 */
function ActiveWorkoutView({
  day,
  dayExercises,
  previousSets,
  workoutLogs,
  isExercisesLoading,
  timerSeconds,
  fmt,
  updateSet,
  toggleSet,
  addSet,
  removeSet,
  startRest,
  onEditPse,
}: {
  day: WorkoutDay
  dayExercises: WorkoutExercise[]
  previousSets: PreviousSets
  workoutLogs: WorkoutLogs
  isExercisesLoading: boolean
  timerSeconds: number
  fmt: (s: number) => string
  updateSet: (exId: string, setIdx: number, field: "reps_done" | "load_kg", value: string) => void
  toggleSet: (exId: string, setIdx: number) => void
  addSet: (exId: string) => void
  removeSet: (exId: string, setIdx: number) => void
  startRest: (seconds?: number | null) => void
  onEditPse: (exId: string, setIdx: number) => void
}) {
  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {/* Título do treino em curso */}
      <div className="min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">Treino em curso</span>
        <h2 className="text-lg font-black text-foreground truncate">{day.name || `Dia ${day.day_number}`}</h2>
        {day.focus && <span className="text-xs text-muted-foreground truncate block">{day.focus}</span>}
      </div>

      {isExercisesLoading ? (
        <div className="rounded-2xl border border-white/5 bg-card/40 py-6 flex justify-center text-muted-foreground gap-2 text-xs shadow-glow-whisper"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Carregando...</div>
      ) : dayExercises.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card/40 text-center py-6 text-xs text-muted-foreground shadow-glow-whisper">Nenhum exercício prescrito.</div>
      ) : (
        <>
          <WorkoutStats workoutLogs={workoutLogs} dayExercises={dayExercises} timerSeconds={timerSeconds} fmt={fmt} />
          <div className="space-y-2">
            {dayExercises.map(ex => {
              const sets = workoutLogs[ex.id] ?? []
              const prev = previousSets[ex.id] ?? []
              return (
                <div key={ex.id} className="rounded-2xl border border-white/5 bg-card/40 p-3 shadow-glow-whisper">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-primary truncate">{ex.exercise_name}</span>
                  </div>
                  {ex.rest_seconds != null && (
                    <button
                      type="button"
                      onClick={() => startRest(ex.rest_seconds)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-primary/80 hover:text-primary mb-2 cursor-pointer transition"
                    >
                      <Timer className="h-3 w-3" /> Descanso: {fmtRestLabel(ex.rest_seconds)}
                    </button>
                  )}

                  {/* Cabeçalho de colunas */}
                  <div className="flex items-center gap-1.5 px-1 pb-1.5">
                    <span className="w-8 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Série</span>
                    <span className="w-16 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Anterior</span>
                    <span className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kg</span>
                    <span className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reps</span>
                    <span className="w-11 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">PSE</span>
                    <span className="w-9 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">✓</span>
                  </div>

                  {/* Linhas de série editáveis */}
                  <div className="space-y-1.5">
                    {sets.map((s, i) => {
                      const p = prev[i]
                      const prevLabel = p && (p.load_kg != null || p.reps_done != null)
                        ? `${p.load_kg ?? "—"}kg×${p.reps_done ?? "—"}`
                        : "—"
                      return (
                        <div key={i} className={`flex items-center gap-1.5 rounded-lg px-1 py-1 transition ${s.completed ? "bg-success/10" : ""}`}>
                          <span className="w-8 text-center text-xs font-bold text-foreground tabular-nums">{i + 1}</span>
                          <span className="w-16 text-center text-[11px] text-muted-foreground tabular-nums truncate">{prevLabel}</span>
                          <input
                            inputMode="decimal"
                            value={s.load_kg}
                            onChange={e => updateSet(ex.id, i, "load_kg", e.target.value)}
                            placeholder={ex.load_kg != null ? String(ex.load_kg) : "—"}
                            className="flex-1 min-w-0 bg-black/30 border border-white/5 rounded-lg px-1 py-2 text-center text-sm text-foreground placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition tabular-nums"
                          />
                          <input
                            inputMode="numeric"
                            value={s.reps_done}
                            onChange={e => updateSet(ex.id, i, "reps_done", e.target.value)}
                            placeholder={ex.reps || "—"}
                            className="flex-1 min-w-0 bg-black/30 border border-white/5 rounded-lg px-1 py-2 text-center text-sm text-foreground placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={() => onEditPse(ex.id, i)}
                            aria-label="Registar PSE"
                            className={`w-11 h-9 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-bold border transition cursor-pointer tabular-nums ${s.rpe != null ? "bg-primary/15 border-primary/40 text-primary" : "bg-black/30 border-white/10 text-muted-foreground hover:border-primary/40"}`}
                          >
                            {s.rpe != null ? s.rpe : "PSE"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Auto-inicia o descanso ao concluir (não ao desmarcar).
                              if (!s.completed && ex.rest_seconds != null) startRest(ex.rest_seconds)
                              toggleSet(ex.id, i)
                            }}
                            aria-label={s.completed ? "Série concluída" : "Marcar série como concluída"}
                            className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition cursor-pointer ${s.completed ? "bg-success border-success text-success-foreground" : "bg-black/30 border-white/10 text-muted-foreground hover:border-success/40"}`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Adicionar / remover série */}
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => addSet(ex.id)} className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary bg-white/5 hover:bg-white/10 rounded-lg py-1.5 transition cursor-pointer">
                      <Plus className="h-3.5 w-3.5" /> Adicionar Série
                    </button>
                    {sets.length > 1 && (
                      <button type="button" onClick={() => removeSet(ex.id, sets.length - 1)} aria-label="Remover última série" className="flex items-center justify-center text-[11px] font-bold text-muted-foreground hover:text-destructive bg-white/5 hover:bg-white/10 rounded-lg py-1.5 px-3 transition cursor-pointer">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/** Barra de estatísticas em direto: duração · volume · séries concluídas (Hevy). */
function WorkoutStats({
  workoutLogs,
  dayExercises,
  timerSeconds,
  fmt,
}: {
  workoutLogs: WorkoutLogs
  dayExercises: WorkoutExercise[]
  timerSeconds: number
  fmt: (s: number) => string
}) {
  let volume = 0
  let doneSets = 0
  for (const ex of dayExercises) {
    for (const s of workoutLogs[ex.id] ?? []) {
      if (!s.completed) continue
      doneSets += 1
      const kg = Number(s.load_kg)
      const reps = Number(s.reps_done)
      if (Number.isFinite(kg) && Number.isFinite(reps)) volume += kg * reps
    }
  }
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-card/40 p-3 shadow-glow-whisper">
      <Stat label="Duração" value={fmt(timerSeconds)} accent />
      <Stat label="Volume" value={`${Math.round(volume)} kg`} />
      <Stat label="Séries" value={String(doneSets)} />
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`block text-sm font-black tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  )
}
