// app/client/_components/AnamneseProgressivaWidget.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Award } from "lucide-react"

interface ProgressiveQuestion {
  key: string
  label: string
  question: string
  placeholder?: string
  type: string
  options?: string[]
}

interface AnamneseProgressivaWidgetProps {
  hasOnboarding: boolean
  progressiveProgress: number
  progressiveLogs: Record<string, unknown>[]
  totalQuestions: number
  nextProgressiveQuestion: ProgressiveQuestion | undefined
  questionValue: string
  setQuestionValue: (v: string) => void
  isSubmittingQuestion: boolean
  handleProgressiveSubmit: (e: React.FormEvent) => void
  onGoToOnboarding: () => void
}

export function AnamneseProgressivaWidget({
  hasOnboarding,
  progressiveProgress,
  progressiveLogs,
  totalQuestions,
  nextProgressiveQuestion,
  questionValue,
  setQuestionValue,
  isSubmittingQuestion,
  handleProgressiveSubmit,
  onGoToOnboarding,
}: AnamneseProgressivaWidgetProps) {
  // Premium Onboarding Alert Banner for existing clients without metadata
  if (!hasOnboarding) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background/40 to-primary/5 p-5 backdrop-blur-md shadow-glow-whisper flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-500 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <h4 className="font-extrabold text-sm text-foreground">Configure o seu Perfil Desportivo!</h4>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            Ainda não definiu os seus objetivos e preferências de treino. Complete o seu perfil para que possamos otimizar a sua jornada de alta performance.
          </p>
        </div>
        <Button
          onClick={onGoToOnboarding}
          className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs py-2.5 px-4 rounded-xl shadow-glow self-start sm:self-auto shrink-0"
        >
          Completar Perfil
        </Button>
      </div>
    )
  }

  // Widget de Anamnese Progressiva (Sintonia de Perfil)
  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-r from-primary/5 via-card/40 to-pillar-mind/5 p-6 backdrop-blur-md shadow-glow-whisper space-y-4 select-none animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
          <h4 className="font-extrabold text-sm text-foreground tracking-tight">Sintonizar Corpo · Mente · Essência</h4>
        </div>
        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full self-start sm:self-auto shrink-0 select-none">
          💎 {progressiveProgress}% Completado ({progressiveLogs.length}/{totalQuestions})
        </span>
      </div>

      {nextProgressiveQuestion ? (
        <form onSubmit={handleProgressiveSubmit} className="space-y-4">
          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                {nextProgressiveQuestion.label}
              </span>
              <span className="text-xs font-bold text-primary flex items-center gap-1 select-none">
                💎 +10 XP
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              {nextProgressiveQuestion.question}
            </p>

            {nextProgressiveQuestion.type === "select" ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5 select-none">
                {nextProgressiveQuestion.options?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQuestionValue(opt)}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition duration-300 active:scale-95 cursor-pointer ${
                      questionValue === opt
                        ? "border-primary bg-primary/10 text-primary shadow-glow-whisper"
                        : "border-white/5 bg-black/40 text-zinc-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : nextProgressiveQuestion.type === "textarea" ? (
              <textarea
                value={questionValue}
                onChange={(e) => setQuestionValue(e.target.value)}
                placeholder={nextProgressiveQuestion.placeholder}
                rows={2}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 transition resize-none"
              />
            ) : (
              <input
                type="text"
                value={questionValue}
                onChange={(e) => setQuestionValue(e.target.value)}
                placeholder={nextProgressiveQuestion.placeholder}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 transition"
              />
            )}
          </div>

          <div className="flex justify-end select-none">
            <Button
              type="submit"
              disabled={isSubmittingQuestion || !questionValue.trim()}
              size="sm"
              className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs py-2.5 px-4 rounded-xl shadow-glow"
            >
              {isSubmittingQuestion ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                  A sintonizar...
                </>
              ) : (
                "Submeter Resposta"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 animate-bounce">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-xs text-foreground block">
              Perfil 100% Sintonizado com o Cosmos!
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed block mt-0.5">
              Parabéns! Completaste todas as etapas da tua Anamnese Progressiva. O teu AI Coach agora opera com precisão total em memória e todas as abas da aplicação estão desbloqueadas.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
