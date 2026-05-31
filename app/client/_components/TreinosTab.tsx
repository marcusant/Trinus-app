// app/client/_components/TreinosTab.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronDown,
  Loader2,
  Play,
  Square,
  BarChart3,
  Activity,
  Heart,
  Shield,
} from "lucide-react"
import type {
  WorkoutPlan,
  WorkoutDay,
  WorkoutExercise,
  WorkoutSession,
  UserProfile,
} from "../_types/client.types"

interface TreinosTabProps {
  profile: UserProfile | null
  trainerName: string | null
  activePlan: WorkoutPlan | null
  planDays: WorkoutDay[]
  selectedDayId: string | null
  setSelectedDayId: (id: string | null) => void
  dayExercises: WorkoutExercise[]
  isExercisesLoading: boolean
  sessions: WorkoutSession[]
  isTimerRunning: boolean
  timerSeconds: number
  activeWorkoutDayId: string | null
  isPending: boolean
  fmt: (s: number) => string
  handleStartWorkout: (dayId: string) => void
  handleStopWorkout: () => void
}

export function TreinosTab({
  profile,
  trainerName,
  activePlan,
  planDays,
  selectedDayId,
  setSelectedDayId,
  dayExercises,
  isExercisesLoading,
  sessions,
  isTimerRunning,
  timerSeconds,
  activeWorkoutDayId,
  isPending,
  fmt,
  handleStartWorkout,
  handleStopWorkout,
}: TreinosTabProps) {
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
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Atividades Recomendadas (Foco em Regeneração & Mente)</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-primary/30 transition duration-300">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-xs text-foreground block">Mobilidade Articular</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">Rotina de 15 min de ativação articular e alongamento passivo.</span>
              </div>

              <div className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-[#38bdf8]/30 transition duration-300">
                <div className="w-8 h-8 rounded-full bg-[#38bdf8]/10 flex items-center justify-center mb-3">
                  <Heart className="h-4 w-4 text-[#38bdf8]" />
                </div>
                <span className="font-bold text-xs text-foreground block">Pranayama / Respiração</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">Técnicas de respiração controlada de 5-10 min para relaxamento e foco.</span>
              </div>

              <div className="p-4 bg-black/30 border border-[#8b5cf6]/20 rounded-xl hover:border-[#8b5cf6]/40 transition duration-300">
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mb-3">
                  <Sparkles className="h-4 w-4 text-[#8b5cf6]" />
                </div>
                <span className="font-bold text-xs text-foreground block">Mente e Essência</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">Acede ao Pilar da Mente Clara e foca-te em organizar a rotina de sono e propósito.</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
            <p className="text-[10px] font-bold text-destructive">
              ⚠️ O teu Treinador ({trainerName || "Equipa TRINUS"}) foi notificado e está a rever o teu caso.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Dias de treino */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-primary" /> Dias de Treino
        </h3>
        {activePlan ? (
          <div className="space-y-2">
            {planDays.map(day => {
              const done = sessions.some(s => s.workout_day_id === day.id)
              return (
                <div key={day.id} onClick={() => setSelectedDayId(selectedDayId === day.id ? null : day.id)} className={`flex items-center justify-between p-3 sm:p-4 bg-card/30 border rounded-2xl cursor-pointer transition ${selectedDayId === day.id ? "border-primary bg-primary-subtle shadow-glow-whisper" : "border-white/5 hover:border-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${done ? "bg-[#25D366]/10 text-[#25D366]" : "bg-primary/10 text-primary"}`}>
                      {done ? <CheckCircle className="h-4 w-4" /> : `D${day.day_number}`}
                    </div>
                    <div>
                      <span className="font-bold block text-sm text-foreground">{day.name || `Dia ${day.day_number}`}</span>
                      <span className="text-[10px] text-muted-foreground">{day.focus || "Treino geral"}</span>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${selectedDayId === day.id ? "rotate-180" : ""}`} />
                </div>
              )
            })}
            {planDays.length === 0 && (
              <div className="text-center py-8 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">Plano sem dias configurados.</div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">
            <Dumbbell className="h-6 w-6 mx-auto mb-2 text-zinc-600" />Sem plano de treino ativo.
          </div>
        )}
      </div>

      {/* Exercícios expandidos */}
      {selectedDayId && (
        <div className="space-y-3 animate-in slide-in-from-top-2">
          {/* Start/Stop button */}
          {(() => {
            const done = sessions.some(s => s.workout_day_id === selectedDayId)
            return (
              <div className="flex gap-2">
                {done ? (
                  <span className="text-xs font-bold text-[#25D366] bg-[#25D366]/10 px-4 py-2 rounded-xl flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5" /> Concluído</span>
                ) : isTimerRunning && activeWorkoutDayId === selectedDayId ? (
                  <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold cursor-pointer flex-1" onClick={handleStopWorkout} disabled={isPending}>
                    <Square className="h-3.5 w-3.5 mr-1" /> Parar ({fmt(timerSeconds)})
                  </Button>
                ) : (
                  <Button size="sm" className="bg-primary/90 hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer flex-1" onClick={() => handleStartWorkout(selectedDayId)} disabled={isTimerRunning}>
                    <Play className="h-3.5 w-3.5 mr-1" /> Iniciar Treino
                  </Button>
                )}
              </div>
            )
          })()}

          {/* Exercises list */}
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 shadow-glow-whisper">
            {isExercisesLoading ? (
              <div className="py-6 flex justify-center text-muted-foreground gap-2 text-xs"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Carregando...</div>
            ) : dayExercises.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Nenhum exercício prescrito.</div>
            ) : (
              <div className="space-y-2">
                {dayExercises.map((ex, idx) => (
                  <div key={ex.id} className="flex items-center gap-3 p-3 bg-black/30 border border-white/5 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[10px] shrink-0">{idx + 1}</div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold block text-xs text-foreground truncate">{ex.exercise_name}</span>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap text-[9px]">
                        {ex.sets && (
                          <span className="bg-black/40 px-2 py-0.5 rounded-full text-muted-foreground">
                            <span className="font-bold text-zinc-500">Sets:</span> {ex.sets}
                          </span>
                        )}
                        {ex.reps && (
                          <span className="bg-black/40 px-2 py-0.5 rounded-full text-muted-foreground">
                            <span className="font-bold text-zinc-500">Reps:</span> {ex.reps}
                          </span>
                        )}
                        {ex.rest_seconds !== undefined && ex.rest_seconds !== null && (
                          <span className="bg-black/40 px-2 py-0.5 rounded-full text-muted-foreground">
                            <span className="font-bold text-zinc-500">Desc(s):</span> {ex.rest_seconds}s
                          </span>
                        )}
                        {ex.load_kg && (
                          <span className="bg-primary/10 px-2 py-0.5 rounded-full text-primary font-semibold">
                            <span className="font-bold">Carga:</span> {ex.load_kg}kg
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Histórico */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-4 shadow-glow-whisper">
        <h4 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-pillar-mind" /> Histórico
        </h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground bg-black/20 rounded-xl border border-white/5">Sem sessões registadas.</div>
          ) : sessions.slice(0, 8).map(s => (
            <div key={s.id} className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[#25D366]" />
                <span className="text-[11px] text-foreground font-medium">{new Date(s.started_at).toLocaleDateString('pt-PT')}</span>
              </div>
              <span className="text-[10px] text-muted-foreground bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />{Math.round(s.duration_seconds / 60)}min
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
