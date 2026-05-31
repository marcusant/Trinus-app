// components/forms/anamnese/steps/StepRotina.tsx
'use client'

import { AnamneseData } from '../types'
import { TRABALHO_TIPOS, HORARIOS_TREINO, selectStyles } from '../constants'
import { SliderInput } from '../primitives/SliderInput'

interface StepRotinaProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
}

export function StepRotina({
  formData,
  updateField,
}: StepRotinaProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        ⏰ Rotina & Lifestyle
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Horas de sono (média)
          </label>
          <input
            type="number"
            min="0"
            max="12"
            step="0.5"
            value={formData.horas_sono_media ?? ''}
            onChange={(e) => updateField('horas_sono_media', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 7"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Tipo de trabalho
          </label>
          <select
            value={formData.trabalho_tipo ?? ''}
            onChange={(e) => updateField('trabalho_tipo', e.target.value)}
            className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
            style={selectStyles}
          >
            <option value="" className="bg-card">Seleciona...</option>
            {TRABALHO_TIPOS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-card">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Horário de acordar
          </label>
          <input
            type="time"
            value={formData.horario_acordar ?? ''}
            onChange={(e) => updateField('horario_acordar', e.target.value)}
            className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Horário de dormir
          </label>
          <input
            type="time"
            value={formData.horario_dormir ?? ''}
            onChange={(e) => updateField('horario_dormir', e.target.value)}
            className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Melhor horário para treinar
        </label>
        <select
          value={formData.horario_treino ?? ''}
          onChange={(e) => updateField('horario_treino', e.target.value)}
          className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
          style={selectStyles}
        >
          <option value="" className="bg-card">Seleciona...</option>
          {HORARIOS_TREINO.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-card">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <SliderInput
        label="Nível de stress"
        value={formData.nivel_stress ?? 3}
        onChange={(v) => updateField('nivel_stress', v)}
        labelLeft="Tranquilo"
        labelRight="Muito stressado"
      />

      <SliderInput
        label="Nível de energia"
        value={formData.nivel_energia ?? 3}
        onChange={(v) => updateField('nivel_energia', v)}
        labelLeft="Sem energia"
        labelRight="Muita energia"
      />
    </div>
  )
}
