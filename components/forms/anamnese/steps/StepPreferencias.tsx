// components/forms/anamnese/steps/StepPreferencias.tsx
'use client'

import { AnamneseData } from '../types'
import { EXERCICIOS_POPULARES, EQUIPAMENTOS, LOCAIS_TREINO } from '../constants'
import { ChipSelector } from '../primitives/ChipSelector'
import { BooleanToggle } from '../primitives/BooleanToggle'

interface StepPreferenciasProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
  toggleArrayItem: (field: keyof AnamneseData, item: string) => void
}

export function StepPreferencias({
  formData,
  updateField,
  toggleArrayItem,
}: StepPreferenciasProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        ⭐ Preferências de Treino
      </h2>

      {/* LOCAL DE TREINO - NOVO */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Onde vais treinar? <span className="text-destructive font-medium">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {LOCAIS_TREINO.map((local) => (
            <button
              key={local.value}
              type="button"
              onClick={() => updateField('local_treino', local.value)}
              className={`p-3 rounded-lg text-sm font-semibold transition-all cursor-pointer border border-transparent ${
                formData.local_treino === local.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-input text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {local.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Exercícios favoritos
        </label>
        <ChipSelector
          options={EXERCICIOS_POPULARES}
          selected={formData.exercicios_favoritos ?? []}
          onToggle={(item) => toggleArrayItem('exercicios_favoritos', item)}
          colorSelected="green"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Exercícios a evitar
        </label>
        <ChipSelector
          options={EXERCICIOS_POPULARES}
          selected={formData.exercicios_evitar ?? []}
          onToggle={(item) => toggleArrayItem('exercicios_evitar', item)}
          colorSelected="red"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Equipamentos disponíveis
        </label>
        <ChipSelector
          options={EQUIPAMENTOS}
          selected={formData.equipamentos_disponiveis ?? []}
          onToggle={(item) => toggleArrayItem('equipamentos_disponiveis', item)}
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Preferes máquinas ou pesos livres?
        </label>
        <BooleanToggle
          value={formData.prefere_maquinas}
          onChange={(v) => updateField('prefere_maquinas', v)}
          labelTrue="Máquinas"
          labelFalse="Pesos Livres"
        />
      </div>
    </div>
  )
}
