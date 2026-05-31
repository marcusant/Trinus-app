// components/forms/anamnese/steps/StepMedidas.tsx
'use client'

import { AnamneseData } from '../types'

interface StepMedidasProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
}

export function StepMedidas({
  formData,
  updateField,
}: StepMedidasProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        📏 Medidas Corporais
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* ALTURA */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Altura (cm) <span className="text-destructive font-medium">*</span>
          </label>
          <input
            type="number"
            value={formData.altura_cm ?? ''}
            onChange={(e) => updateField('altura_cm', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 175"
          />
        </div>

        {/* PESO */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Peso atual (kg) <span className="text-destructive font-medium">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.peso_avaliacao ?? ''}
            onChange={(e) => updateField('peso_avaliacao', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 75.5"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            % Gordura
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.percentual_gordura ?? ''}
            onChange={(e) => updateField('percentual_gordura', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 18"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Cintura (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.circunferencia_cintura ?? ''}
            onChange={(e) => updateField('circunferencia_cintura', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 80"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Quadril (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.circunferencia_quadril ?? ''}
            onChange={(e) => updateField('circunferencia_quadril', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 95"
          />
        </div>
      </div>
    </div>
  )
}
