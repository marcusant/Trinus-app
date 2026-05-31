// components/forms/anamnese/steps/StepHistorico.tsx
'use client'

import { AnamneseData } from '../types'
import { MODALIDADES } from '../constants'
import { ChipSelector } from '../primitives/ChipSelector'

interface StepHistoricoProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
  toggleArrayItem: (field: keyof AnamneseData, item: string) => void
}

export function StepHistorico({
  formData,
  updateField,
  toggleArrayItem,
}: StepHistoricoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        🏋️ Histórico de Treino
      </h2>
      
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Há quanto tempo treinas? (meses)
        </label>
        <input
          type="number"
          min="0"
          value={formData.tempo_treino_meses ?? ''}
          onChange={(e) => updateField('tempo_treino_meses', e.target.value ? Number(e.target.value) : null)}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="0 = nunca treinei"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Frequência anterior (dias/semana)
        </label>
        <input
          type="number"
          min="0"
          max="7"
          value={formData.frequencia_anterior ?? ''}
          onChange={(e) => updateField('frequencia_anterior', e.target.value ? Number(e.target.value) : null)}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Modalidades que já praticaste
        </label>
        <ChipSelector
          options={MODALIDADES}
          selected={formData.modalidades_previas ?? []}
          onToggle={(item) => toggleArrayItem('modalidades_previas', item)}
        />
      </div>
    </div>
  )
}
