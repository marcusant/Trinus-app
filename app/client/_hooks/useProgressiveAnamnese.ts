"use client"

import { useState, useCallback } from "react"
import { submitProgressiveAnamnese, getProgressiveAnamnese } from "@/lib/actions/client"
import { toast } from "sonner"

export const PROGRESSIVE_QUESTIONS = [
  { key: "horario_dormir",            label: "💤 Rotina de Sono",    question: "A que horas costumas deitar-te regularmente?",                             placeholder: "Ex: 22:30, 23:00...",                          type: "text"     },
  { key: "horario_acordar",           label: "🌅 Despertar",         question: "A que horas costumas acordar regularmente?",                               placeholder: "Ex: 06:30, 07:00...",                          type: "text"     },
  { key: "acompanhamento_psicologico",label: "🧠 Saúde Mental",      question: "Tens ou já tiveste acompanhamento psicológico?",                           type: "select",  options: ["Sim", "Não", "Já tive"]                },
  { key: "lidar_com_stress",          label: "⚡ Gestão de Stress",  question: "De que forma lidas com picos de stress no teu dia a dia?",                 placeholder: "Ex: Meditação, respiração, desporto...",        type: "textarea" },
  { key: "horas_ecra",                label: "📱 Tempo de Ecrã",     question: "Quantas horas diárias passas, em média, em frente a ecrãs?",               placeholder: "Ex: 4h, 6h, 8h...",                            type: "text"     },
  { key: "rotina_matinal",            label: "☀️ Rotina Matinal",    question: "Tens alguma rotina matinal estabelecida?",                                  type: "select",  options: ["Sim", "Não", "Às vezes"]               },
  { key: "dreno_energia",             label: "🔋 Energia",           question: "Qual consideras ser o maior dreno de energia no teu dia?",                 placeholder: "Ex: Falta de sono, stress de trabalho...",     type: "textarea" },
  { key: "porque_profundo",           label: "✨ Propósito",         question: "Qual é o teu porquê mais profundo para cuidar de ti hoje?",               placeholder: "Escreve a tua reflexão mais sincera...",        type: "textarea" },
  { key: "caminho_inspirador",        label: "🕊️ Inspiração",       question: "Existe alguma tradição filosófica ou espiritual que te inspire?",          placeholder: "Ex: Estoicismo, Budismo, Yoga, nenhuma...",     type: "text"     },
  { key: "rede_apoio",                label: "👥 Rede de Apoio",     question: "Tens uma rede de apoio forte que te apoie neste processo?",                type: "select",  options: ["Forte", "Média", "Fraca", "Nenhuma"]   },
]

interface UseProgressiveAnamneseParams {
  progressiveLogs: Record<string, unknown>[]
  setProgressiveLogs: React.Dispatch<React.SetStateAction<Record<string, unknown>[]>>
}

export function useProgressiveAnamnese({ progressiveLogs, setProgressiveLogs }: UseProgressiveAnamneseParams) {
  const [questionValue, setQuestionValue] = useState("")
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)

  const nextProgressiveQuestion = PROGRESSIVE_QUESTIONS.find(
    q => !progressiveLogs.some(l => l.key === q.key)
  )
  const progressiveProgress = Math.round((progressiveLogs.length / PROGRESSIVE_QUESTIONS.length) * 100)

  const handleProgressiveSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nextProgressiveQuestion || !questionValue.trim()) return
    setIsSubmittingQuestion(true)
    try {
      const res = await submitProgressiveAnamnese(nextProgressiveQuestion.key, questionValue)
      if (res.success) {
        toast.success("Resposta guardada! +10 XP adicionados!")
        setQuestionValue("")
        const progRes = await getProgressiveAnamnese()
        if (progRes.success && progRes.logs) setProgressiveLogs(progRes.logs)
      } else {
        toast.error(res.error || "Erro ao guardar resposta.")
      }
    } catch {
      toast.error("Erro de rede ao submeter.")
    } finally {
      setIsSubmittingQuestion(false)
    }
  }, [nextProgressiveQuestion, questionValue, setProgressiveLogs])

  return {
    questionValue,
    setQuestionValue,
    isSubmittingQuestion,
    nextProgressiveQuestion,
    progressiveProgress,
    handleProgressiveSubmit,
  }
}
