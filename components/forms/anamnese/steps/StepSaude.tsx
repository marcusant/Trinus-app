// components/forms/anamnese/steps/StepSaude.tsx
'use client'

import { AnamneseData } from '../types'
import { LESOES_COMUNS, DORES_COMUNS } from '../constants'
import { ChipSelector } from '../primitives/ChipSelector'

interface StepSaudeProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
  toggleArrayItem: (field: keyof AnamneseData, item: string) => void
}

export function StepSaude({
  formData,
  updateField,
  toggleArrayItem,
}: StepSaudeProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        🩺 Saúde
      </h2>
      
      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Lesões anteriores
        </label>
        <ChipSelector
          options={LESOES_COMUNS}
          selected={formData.lesoes_anteriores ?? []}
          onToggle={(item) => toggleArrayItem('lesoes_anteriores', item)}
          colorSelected="red"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Dores atuais
        </label>
        <ChipSelector
          options={DORES_COMUNS}
          selected={formData.dores_atuais ?? []}
          onToggle={(item) => toggleArrayItem('dores_atuais', item)}
          colorSelected="orange"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Medicamentos em uso
        </label>
        <input
          type="text"
          value={formData.medicamentos?.join(', ') ?? ''}
          onChange={(e) => updateField('medicamentos', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Ex: Omeprazol, Losartana (separados por vírgula)"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Restrições médicas / observações
        </label>
        <textarea
          value={formData.restricoes_medicas ?? ''}
          onChange={(e) => updateField('restricoes_medicas', e.target.value)}
          rows={3}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          placeholder="Ex: Hérnia de disco, evitar impacto..."
        />
      </div>
    </div>
  )
}
