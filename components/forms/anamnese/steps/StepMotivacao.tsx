// components/forms/anamnese/steps/StepMotivacao.tsx
'use client'

import { AnamneseData } from '../types'
import { SliderInput } from '../primitives/SliderInput'

interface StepMotivacaoProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
}

export function StepMotivacao({
  formData,
  updateField,
}: StepMotivacaoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        🎯 Motivação & Compromisso
      </h2>
      
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Qual a tua motivação principal?
        </label>
        <textarea
          value={formData.motivacao_principal ?? ''}
          onChange={(e) => updateField('motivacao_principal', e.target.value)}
          rows={3}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          placeholder="Ex: Quero ter mais energia, melhorar a saúde, preparar-me para um evento..."
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Qual a tua maior dificuldade?
        </label>
        <textarea
          value={formData.maior_dificuldade ?? ''}
          onChange={(e) => updateField('maior_dificuldade', e.target.value)}
          rows={3}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          placeholder="Ex: Manter consistência, alimentação, tempo..."
        />
      </div>

      <SliderInput
        label="Nível de compromisso"
        value={formData.compromisso ?? 3}
        onChange={(v) => updateField('compromisso', v)}
        labelLeft="Vou tentar"
        labelRight="100% comprometido"
      />

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Observações adicionais
        </label>
        <textarea
          value={formData.observacoes ?? ''}
          onChange={(e) => updateField('observacoes', e.target.value)}
          rows={3}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          placeholder="Algo mais que queiras partilhar?"
        />
      </div>
    </div>
  )
}
