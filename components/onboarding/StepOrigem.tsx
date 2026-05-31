// components/onboarding/StepOrigem.tsx

'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'

type Props = {
  register: UseFormRegister<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

const paisesPopulares = [
  { value: 'Portugal', label: '🇵🇹 Portugal' },
  { value: 'Brasil', label: '🇧🇷 Brasil' },
  { value: 'Angola', label: '🇦🇴 Angola' },
  { value: 'Moçambique', label: '🇲🇿 Moçambique' },
  { value: 'Cabo Verde', label: '🇨🇻 Cabo Verde' },
  { value: 'Espanha', label: '🇪🇸 Espanha' },
  { value: 'França', label: '🇫🇷 França' },
  { value: 'Reino Unido', label: '🇬🇧 Reino Unido' },
  { value: 'Alemanha', label: '🇩🇪 Alemanha' },
  { value: 'Estados Unidos', label: '🇺🇸 Estados Unidos' },
  { value: 'Suíça', label: '🇨🇭 Suíça' },
  { value: 'Luxemburgo', label: '🇱🇺 Luxemburgo' },
]

const nacionalidades = [
  { value: 'Portuguesa', label: 'Portuguesa' },
  { value: 'Brasileira', label: 'Brasileira' },
  { value: 'Angolana', label: 'Angolana' },
  { value: 'Moçambicana', label: 'Moçambicana' },
  { value: 'Cabo-verdiana', label: 'Cabo-verdiana' },
  { value: 'Espanhola', label: 'Espanhola' },
  { value: 'Francesa', label: 'Francesa' },
  { value: 'Britânica', label: 'Britânica' },
  { value: 'Alemã', label: 'Alemã' },
  { value: 'Americana', label: 'Americana' },
  { value: 'Outra', label: 'Outra' },
]

export function StepOrigem({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">De onde vens?</h2>
        <p className="text-zinc-400 text-xs mt-1">Conta-nos um pouco sobre a tua origem e localização atual.</p>
      </div>

      {/* Nacionalidade */}
      <div>
        <label htmlFor="nacionalidade" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Nacionalidade
        </label>
        <div className="relative">
          <select
            {...register('nacionalidade')}
            id="nacionalidade"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-primary transition-all duration-200 cursor-pointer font-semibold appearance-none"
          >
            <option value="" className="bg-zinc-950 text-zinc-400">Seleciona a tua nacionalidade</option>
            {nacionalidades.map((n) => (
              <option key={n.value} value={n.value} className="bg-zinc-950 text-white">
                {n.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {errors.nacionalidade && (
          <p className="mt-1.5 text-xs text-destructive font-semibold">{errors.nacionalidade.message}</p>
        )}
      </div>

      {/* País de Residência */}
      <div>
        <label htmlFor="pais_residencia" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          País de Residência
        </label>
        <div className="relative">
          <select
            {...register('pais_residencia')}
            id="pais_residencia"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-primary transition-all duration-200 cursor-pointer font-semibold appearance-none"
          >
            <option value="" className="bg-zinc-950 text-zinc-400">Seleciona o teu país</option>
            {paisesPopulares.map((pais) => (
              <option key={pais.value} value={pais.value} className="bg-zinc-950 text-white">
                {pais.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {errors.pais_residencia && (
          <p className="mt-1.5 text-xs text-destructive font-semibold">{errors.pais_residencia.message}</p>
        )}
      </div>

      {/* Cidade de Residência */}
      <div>
        <label htmlFor="cidade_residencia" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Cidade de Residência
        </label>
        <input
          {...register('cidade_residencia')}
          type="text"
          id="cidade_residencia"
          placeholder="Ex: Lisboa, Porto, São Paulo..."
          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all duration-200 font-semibold"
        />
        {errors.cidade_residencia && (
          <p className="mt-1.5 text-xs text-destructive font-semibold">{errors.cidade_residencia.message}</p>
        )}
      </div>
    </div>
  )
}
