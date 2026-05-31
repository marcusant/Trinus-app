// components/forms/anamnese/steps/StepAlimentacao.tsx
'use client'

import { AnamneseData } from '../types'
import {
  RESTRICOES_ALIMENTARES,
  ALERGIAS_COMUNS,
  PREFERENCIAS_ALIMENTARES,
  SUPLEMENTOS,
  OBJETIVOS_NUTRICIONAIS,
  ORCAMENTOS,
  selectStyles
} from '../constants'
import { ChipSelector } from '../primitives/ChipSelector'
import { BooleanToggle } from '../primitives/BooleanToggle'

interface StepAlimentacaoProps {
  formData: AnamneseData
  updateField: <K extends keyof AnamneseData>(field: K, value: AnamneseData[K]) => void
  toggleArrayItem: (field: keyof AnamneseData, item: string) => void
}

export function StepAlimentacao({
  formData,
  updateField,
  toggleArrayItem,
}: StepAlimentacaoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold flex items-center gap-2">
        🥗 Alimentação
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Refeições por dia
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.refeicoes_dia ?? ''}
            onChange={(e) => updateField('refeicoes_dia', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 4"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Água por dia (litros)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={formData.consumo_agua_litros ?? ''}
            onChange={(e) => updateField('consumo_agua_litros', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Restrições alimentares
        </label>
        <ChipSelector
          options={RESTRICOES_ALIMENTARES}
          selected={formData.restricoes_alimentares ?? []}
          onToggle={(item) => toggleArrayItem('restricoes_alimentares', item)}
          colorSelected="orange"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Alergias alimentares
        </label>
        <ChipSelector
          options={ALERGIAS_COMUNS}
          selected={formData.alergias_alimentares ?? []}
          onToggle={(item) => toggleArrayItem('alergias_alimentares', item)}
          colorSelected="red"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Preferências alimentares
        </label>
        <ChipSelector
          options={PREFERENCIAS_ALIMENTARES}
          selected={formData.preferencias_alimentares ?? []}
          onToggle={(item) => toggleArrayItem('preferencias_alimentares', item)}
          colorSelected="green"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Alimentos que não gostas
        </label>
        <input
          type="text"
          value={formData.alimentos_nao_gosta?.join(', ') ?? ''}
          onChange={(e) => updateField('alimentos_nao_gosta', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Ex: Fígado, Beterraba, Couve-flor (separados por vírgula)"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          Suplementos que usas
        </label>
        <ChipSelector
          options={SUPLEMENTOS}
          selected={formData.suplementos_atuais ?? []}
          onToggle={(item) => toggleArrayItem('suplementos_atuais', item)}
          colorSelected="blue"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Objetivo nutricional
          </label>
          <select
            value={formData.objetivo_nutricional ?? ''}
            onChange={(e) => updateField('objetivo_nutricional', e.target.value)}
            className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
            style={selectStyles}
          >
            <option value="" className="bg-card">Seleciona...</option>
            {OBJETIVOS_NUTRICIONAIS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-card">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Orçamento alimentação
          </label>
          <select
            value={formData.orcamento_alimentacao ?? ''}
            onChange={(e) => updateField('orcamento_alimentacao', e.target.value)}
            className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
            style={selectStyles}
          >
            <option value="" className="bg-card">Seleciona...</option>
            {ORCAMENTOS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-card">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Tens cozinha própria?
        </label>
        <BooleanToggle
          value={formData.cozinha_propria}
          onChange={(v) => updateField('cozinha_propria', v)}
          labelTrue="Sim"
          labelFalse="Não"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Tempo para preparar refeições
          </label>
          <input
            type="number"
            min="0"
            value={formData.tempo_preparacao_minutos ?? ''}
            onChange={(e) => updateField('tempo_preparacao_minutos', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="minutos"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Refeições fora por semana
          </label>
          <input
            type="number"
            min="0"
            max="21"
            value={formData.frequencia_come_fora ?? ''}
            onChange={(e) => updateField('frequencia_come_fora', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: 2"
          />
        </div>
      </div>
    </div>
  )
}
