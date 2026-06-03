// components/forms/AnamneseFormWizard.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveAnamneseCompleta } from '@/lib/actions/anamnese'

// Tipos e Constantes
import { AnamneseData, AnamneseFormWizardProps } from './anamnese/types'
import { STEPS } from './anamnese/constants'

// Componentes de Passo
import { StepHistorico } from './anamnese/steps/StepHistorico'
import { StepMedidas } from './anamnese/steps/StepMedidas'
import { StepSaude } from './anamnese/steps/StepSaude'
import { StepRotina } from './anamnese/steps/StepRotina'
import { StepAlimentacao } from './anamnese/steps/StepAlimentacao'
import { StepPreferencias } from './anamnese/steps/StepPreferencias'
import { StepMotivacao } from './anamnese/steps/StepMotivacao'

export function AnamneseFormWizard({ 
  perfilId, 
  alunoNome, 
  modo,
  dadosIniciais,
  redirectTo = '/alunos'
}: AnamneseFormWizardProps) {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<AnamneseData>({
    // Histórico
    tempo_treino_meses: dadosIniciais?.tempo_treino_meses ?? null,
    frequencia_anterior: dadosIniciais?.frequencia_anterior ?? null,
    modalidades_previas: dadosIniciais?.modalidades_previas ?? [],
    
    // Medidas
    altura_cm: dadosIniciais?.altura_cm ?? null,
    peso_avaliacao: dadosIniciais?.peso_avaliacao ?? null,
    percentual_gordura: dadosIniciais?.percentual_gordura ?? null,
    circunferencia_cintura: dadosIniciais?.circunferencia_cintura ?? null,
    circunferencia_quadril: dadosIniciais?.circunferencia_quadril ?? null,
    
    // Saúde
    lesoes_anteriores: dadosIniciais?.lesoes_anteriores ?? [],
    dores_atuais: dadosIniciais?.dores_atuais ?? [],
    medicamentos: dadosIniciais?.medicamentos ?? [],
    restricoes_medicas: dadosIniciais?.restricoes_medicas ?? '',
    
    // Rotina
    horas_sono_media: dadosIniciais?.horas_sono_media ?? null,
    horario_acordar: dadosIniciais?.horario_acordar ?? '',
    horario_dormir: dadosIniciais?.horario_dormir ?? '',
    horario_treino: dadosIniciais?.horario_treino ?? '',
    nivel_stress: dadosIniciais?.nivel_stress ?? 3,
    nivel_energia: dadosIniciais?.nivel_energia ?? 3,
    trabalho_tipo: dadosIniciais?.trabalho_tipo ?? '',
    
    // Alimentação
    refeicoes_dia: dadosIniciais?.refeicoes_dia ?? null,
    consumo_agua_litros: dadosIniciais?.consumo_agua_litros ?? null,
    restricoes_alimentares: dadosIniciais?.restricoes_alimentares ?? [],
    alergias_alimentares: dadosIniciais?.alergias_alimentares ?? [],
    preferencias_alimentares: dadosIniciais?.preferencias_alimentares ?? [],
    alimentos_nao_gosta: dadosIniciais?.alimentos_nao_gosta ?? [],
    suplementos_atuais: dadosIniciais?.suplementos_atuais ?? [],
    objetivo_nutricional: dadosIniciais?.objetivo_nutricional ?? '',
    orcamento_alimentacao: dadosIniciais?.orcamento_alimentacao ?? '',
    cozinha_propria: dadosIniciais?.cozinha_propria ?? null,
    tempo_preparacao_minutos: dadosIniciais?.tempo_preparacao_minutos ?? null,
    frequencia_come_fora: dadosIniciais?.frequencia_come_fora ?? null,
    
    // Preferências
    local_treino: dadosIniciais?.local_treino ?? '',
    exercicios_favoritos: dadosIniciais?.exercicios_favoritos ?? [],
    exercicios_evitar: dadosIniciais?.exercicios_evitar ?? [],
    equipamentos_disponiveis: dadosIniciais?.equipamentos_disponiveis ?? [],
    prefere_maquinas: dadosIniciais?.prefere_maquinas ?? null,
    
    // Motivação
    motivacao_principal: dadosIniciais?.motivacao_principal ?? '',
    maior_dificuldade: dadosIniciais?.maior_dificuldade ?? '',
    compromisso: dadosIniciais?.compromisso ?? 3,
    observacoes: dadosIniciais?.observacoes ?? '',
  })

  // Helpers
  const updateField = <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: keyof AnamneseData, item: string) => {
    const currentArray = (formData[field] as string[]) || []
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item]
    updateField(field, newArray as AnamneseData[typeof field])
  }

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 2: // Medidas
        if (!formData.altura_cm) return 'A altura é obrigatória.'
        if (formData.altura_cm < 100 || formData.altura_cm > 250) return 'A altura deve ser entre 100 cm e 250 cm.'
        if (!formData.peso_avaliacao) return 'O peso atual é obrigatório.'
        if (formData.peso_avaliacao < 30 || formData.peso_avaliacao > 300) return 'O peso deve ser entre 30 kg e 300 kg.'
        return null
      case 3: // Saúde
        if (!formData.lesoes_anteriores || formData.lesoes_anteriores.length === 0) {
          return 'Seleciona pelo menos uma opção em lesões anteriores (ou "Nenhuma").'
        }
        if (!formData.dores_atuais || formData.dores_atuais.length === 0) {
          return 'Seleciona pelo menos uma opção em dores atuais (ou "Nenhuma").'
        }
        return null
      case 5: // Alimentação
        if (!formData.alergias_alimentares || formData.alergias_alimentares.length === 0) {
          return 'Seleciona pelo menos uma opção em alergias alimentares (ou "Nenhuma").'
        }
        if (!formData.objetivo_nutricional) {
          return 'O objetivo nutricional é obrigatório.'
        }
        return null
      case 6: // Preferências (Local de Treino)
        if (!formData.local_treino) {
          return 'O local de treino é obrigatório.'
        }
        return null
      case 7: // Motivação
        if (!formData.motivacao_principal || !formData.motivacao_principal.trim()) {
          return 'A motivação principal é obrigatória.'
        }
        return null
      default:
        return null
    }
  }

  const nextStep = () => {
    const validationError = validateStep(currentStep)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setError(null)
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  // Submit
  const handleSubmit = async () => {
    const validationError = validateStep(currentStep)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // A persistência (encriptação AES-256-GCM + merge em profiles.metadata)
      // corre numa server action, pois a ENCRYPTION_KEY é server-only. O merge
      // é idempotente, por isso 'criar' e 'editar' usam o mesmo caminho.
      const result = await saveAnamneseCompleta(perfilId, formData)

      if (!result.success) {
        setError(result.error || 'Erro ao salvar. Tenta novamente.')
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      console.error('Erro ao salvar anamnese:', err)
      setError('Erro ao salvar. Tenta novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ============================================
  // RENDER STEPS
  // ============================================

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepHistorico
            formData={formData}
            updateField={updateField}
            toggleArrayItem={toggleArrayItem}
          />
        )
      case 2:
        return (
          <StepMedidas
            formData={formData}
            updateField={updateField}
          />
        )
      case 3:
        return (
          <StepSaude
            formData={formData}
            updateField={updateField}
            toggleArrayItem={toggleArrayItem}
          />
        )
      case 4:
        return (
          <StepRotina
            formData={formData}
            updateField={updateField}
          />
        )
      case 5:
        return (
          <StepAlimentacao
            formData={formData}
            updateField={updateField}
            toggleArrayItem={toggleArrayItem}
          />
        )
      case 6:
        return (
          <StepPreferencias
            formData={formData}
            updateField={updateField}
            toggleArrayItem={toggleArrayItem}
          />
        )
      case 7:
        return (
          <StepMotivacao
            formData={formData}
            updateField={updateField}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[.3em] uppercase text-primary mb-2 font-semibold">
          {modo === 'criar' ? 'Nova Anamnese' : 'Editar Anamnese'}
        </p>
        <h1 className="font-serif text-[1.75rem] font-light text-white">
          Olá, <span className="text-primary font-medium">{alunoNome.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Vamos conhecer-te melhor para criar o plano perfeito.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 overflow-x-auto pb-2 scrollbar-none gap-2">
        {STEPS.map((step) => {
          const isCurrent = step.id === currentStep;
          const isPassed = step.id < currentStep;
          
          return (
            <button
              key={step.id}
              onClick={() => {
                if (step.id < currentStep) {
                  setCurrentStep(step.id)
                  setError(null)
                }
              }}
              className={`flex flex-col items-center min-w-[64px] transition-all cursor-pointer ${
                isCurrent
                  ? 'text-primary'
                  : isPassed
                  ? 'text-success'
                  : 'text-muted-foreground/40'
              }`}
            >
              <span className="text-xl mb-1">{step.icon}</span>
              <span className="text-[0.65rem] whitespace-nowrap font-medium">{step.title}</span>
              <div className={`h-1 w-full mt-2 rounded transition-colors ${
                isCurrent 
                  ? 'bg-primary' 
                  : isPassed 
                  ? 'bg-success' 
                  : 'bg-border/30'
              }`} />
            </button>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-glow-whisper">
        {renderStep()}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
          >
            ← Anterior
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors font-semibold cursor-pointer shadow-sm"
            >
              Próximo →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  A guardar...
                </>
              ) : (
                <>✓ {modo === 'criar' ? 'Concluir' : 'Atualizar'}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
