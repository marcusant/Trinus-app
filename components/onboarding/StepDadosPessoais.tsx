// components/onboarding/StepDadosPessoais.tsx

'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'

type Props = {
  register: UseFormRegister<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

const generoOptions = [
  { value: 'Masculino', label: 'Masculino', icon: '♂️' },
  { value: 'Feminino', label: 'Feminino', icon: '♀️' },
  { value: 'Outro', label: 'Outro', icon: '👤' },
  { value: 'Prefiro não dizer', label: 'Prefiro não dizer', icon: '🔒' },
]

export function StepDadosPessoais({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Quem és tu?</h2>
        <p className="text-zinc-400 text-xs mt-1">Conta-nos um pouco sobre ti para personalizarmos a tua experiência.</p>
      </div>

      {/* Nome */}
      <div>
        <label htmlFor="nome" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Nome Completo
        </label>
        <input
          {...register('nome')}
          type="text"
          id="nome"
          placeholder="O teu nome"
          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all duration-200 font-semibold"
        />
        {errors.nome && (
          <p className="mt-1.5 text-xs text-destructive font-semibold">{errors.nome.message}</p>
        )}
      </div>

      {/* Data de Nascimento */}
      <div>
        <label htmlFor="data_nascimento" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Data de Nascimento
        </label>
        <input
          {...register('data_nascimento')}
          type="date"
          id="data_nascimento"
          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all duration-200 font-semibold cursor-pointer"
        />
        {errors.data_nascimento && (
          <p className="mt-1.5 text-xs text-destructive font-semibold">{errors.data_nascimento.message}</p>
        )}
      </div>

      {/* Género */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Género
        </label>
        <div className="grid grid-cols-2 gap-3">
          {generoOptions.map((option) => (
            <label
              key={option.value}
              className="relative flex items-center justify-center gap-2 p-3.5 bg-black/40 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 group active:scale-98"
            >
              <input
                {...register('genero')}
                type="radio"
                value={option.value}
                className="sr-only"
              />
              <span className="text-xs font-bold text-zinc-400 group-has-[:checked]:text-primary transition-colors duration-300 flex items-center gap-1.5">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.genero && (
          <p className="mt-2 text-xs text-destructive font-semibold">{errors.genero.message}</p>
        )}
      </div>
    </div>
  )
}
