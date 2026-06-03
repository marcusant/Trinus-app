"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema, OnboardingFormData } from "@/lib/validations/onboarding"
import { saveOnboarding } from "@/lib/actions/onboarding"
import { StepDadosPessoais } from "@/components/onboarding/StepDadosPessoais"
import { StepOrigem } from "@/components/onboarding/StepOrigem"
import { StepObjetivos } from "@/components/onboarding/StepObjetivos"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { BrandLogo } from "@/components/ui/brand-logo"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationStep, setCelebrationStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Sessão terminada.")
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 800)
    } catch {
      toast.error("Erro ao sair.")
    }
  }

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      data_nascimento: "",
      genero: undefined,
      telefone: "",
      nacionalidade: "",
      cidade_residencia: "",
      pais_residencia: "",
      objetivo: undefined,
      nivel: undefined,
      dias_disponiveis: 3,
      minutos_por_sessao: 60,
      local_treino: undefined,
      par_q_dor_peito: false,
      par_q_perda_equilibrio: false,
      par_q_problema_cardiaco: false,
      par_q_proibido_medico: false,
      par_q_pressao_alta: false,
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  // Definir campos para validação de cada etapa
  const triggerStepValidation = async () => {
    let fieldsToValidate: Array<keyof OnboardingFormData> = []

    if (step === 1) {
      fieldsToValidate = ["nome", "data_nascimento", "genero"]
    } else if (step === 2) {
      fieldsToValidate = ["nacionalidade", "pais_residencia", "cidade_residencia"]
    }

    const isStepValid = await form.trigger(fieldsToValidate)
    return isStepValid
  }

  const handleNext = async () => {
    const isStepValid = await triggerStepValidation()
    if (isStepValid) {
      setStep((prev) => prev + 1)
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios corretamente.")
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true)
    try {
      const result = await saveOnboarding(data)
      if (result.success) {
        setShowCelebration(true)
        // Simular cálculo de métricas personalizadas
        setTimeout(() => {
          setCelebrationStep(2)
        }, 1600)
        // Redirecionar para o painel de cliente principal
        setTimeout(() => {
          router.push("/client")
          router.refresh()
        }, 3900)
      } else {
        toast.error(result.error || "Ocorreu um erro ao guardar os dados.")
        setIsLoading(false)
      }
    } catch {
      toast.error("Ocorreu um erro de rede inesperado.")
      setIsLoading(false)
    }
  }

  if (showCelebration) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-10 relative overflow-hidden select-none">
        {/* Background neons */}
        <div className="absolute top-1/4 left-1/4 -z-10 w-[50vw] h-[50vh] opacity-20 blur-[120px]" style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 -z-10 w-[50vw] h-[50vh] opacity-25 blur-[120px]" style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }} />

        <div className="w-full max-w-[500px] rounded-3xl border border-white/5 bg-card/40 backdrop-blur-2xl p-10 text-center shadow-glow-whisper relative animate-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-6">
            <BrandLogo variant="full" className="h-8 w-auto transition-transform duration-300 hover:scale-[1.02]" />
          </div>
          {celebrationStep === 1 ? (
            <div className="space-y-6 py-6 flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
              <h3 className="text-lg font-black text-white tracking-tight">Análise de Performance</h3>
              <p className="text-xs text-zinc-400 max-w-[280px]">Estamos a estruturar o teu ecossistema de treino personalizado com base nas tuas respostas...</p>
            </div>
          ) : (
            <div className="space-y-6 py-4 flex flex-col items-center animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-2 shadow-glow animate-bounce">
                <Check className="h-8 w-8 text-primary stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Perfil Configurado!</h3>
              <div className="border-t border-white/5 my-4 pt-4 text-left">
                <p className="text-xs italic text-zinc-400 leading-relaxed text-center">
                  &quot;A disciplina é a ponte entre as tuas metas e as tuas conquistas. Bem-vindo ao TRINUS.&quot;
                </p>
              </div>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider animate-pulse mt-2">A preparar a tua Área de Cliente...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-10 relative">
      {/* Background neons */}
      <div className="absolute top-0 right-0 -z-10 w-[35vw] h-[35vh] opacity-15 blur-[100px]" style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 -z-10 w-[40vw] h-[40vh] opacity-10 blur-[100px]" style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }} />

      <div className="w-full max-w-[580px] rounded-3xl border border-white/5 bg-card/40 backdrop-blur-2xl p-8 sm:p-10 shadow-glow-whisper">
        <div className="flex justify-center mb-8">
          <BrandLogo variant="full" className="h-9 w-auto transition-transform duration-300 hover:scale-[1.02]" />
        </div>

        {/* Barra de Progresso Dinâmica */}
        <div className="mb-10 select-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Passo {step} de 3
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleLogout}
              className="border-white/5 bg-card hover:bg-destructive/10 hover:text-destructive text-[10px] cursor-pointer"
            >
              Terminar Sessão
            </Button>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-primary shadow-glow transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Formulário Wizard */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <StepDadosPessoais register={register} errors={errors} />
          )}

          {step === 2 && (
            <StepOrigem register={register} errors={errors} />
          )}

          {step === 3 && (
            <StepObjetivos
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8 select-none">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="border-white/5 cursor-pointer text-xs font-bold py-5 px-5 rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            ) : (
              <div /> // Espaçador
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs py-5 px-5 rounded-xl"
              >
                Seguinte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary/90 hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer text-xs py-5 px-5 rounded-xl shadow-glow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  <>
                    Concluir
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
