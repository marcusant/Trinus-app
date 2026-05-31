// components/onboarding/StepObjetivos.tsx

'use client'

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'

type Props = {
  register: UseFormRegister<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
  watch: UseFormWatch<OnboardingFormData>
  setValue: UseFormSetValue<OnboardingFormData>
}

const objetivosOptions = [
  { value: 'Emagrecer', label: '🔥 Emagrecer', desc: 'Queimar gordura e perder peso corporal' },
  { value: 'Hipertrofia', label: '💪 Hipertrofia', desc: 'Ganhar massa muscular e força' },
  { value: 'Saúde Geral', label: '❤️ Saúde Geral', desc: 'Melhorar bem-estar, vitalidade e longevidade' },
  { value: 'Performance', label: '🏆 Performance', desc: 'Melhorar rendimento físico e potência' },
  { value: 'Recomposição Corporal', label: '⚖️ Recomposição', desc: 'Perder gordura e ganhar músculo em simultâneo' },
  { value: 'Flexibilidade', label: '🧘 Mobilidade', desc: 'Melhorar flexibilidade, postura e articulações' },
]

const nivelOptions = [
  { value: 'Iniciante', label: '🌱 Iniciante', desc: 'Comecei há pouco tempo / sem ritmo regular' },
  { value: 'Intermediário', label: '🏃 Intermediário', desc: 'Treino regularmente há alguns meses' },
  { value: 'Avançado', label: '🏋️ Avançado', desc: 'Treino de forma estruturada há vários anos' },
]

const localOptions = [
  { value: 'Ginásio', label: '🏢 Ginásio' },
  { value: 'Casa', label: '🏠 Casa' },
  { value: 'Ar Livre', label: '🌳 Ar Livre' },
  { value: 'Híbrido', label: '🔄 Híbrido' },
]

const diasOptions = [1, 2, 3, 4, 5, 6, 7]
const minutosOptions = [30, 45, 60, 75, 90, 120]

export function StepObjetivos({ register, errors, watch, setValue }: Props) {
  const diasSelecionados = watch('dias_disponiveis')
  const minutosSelecionados = watch('minutos_por_sessao')

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Os teus objetivos</h2>
        <p className="text-zinc-400 text-xs mt-1">Desenha o teu plano. O que procuras alcançar com o TRINUS?</p>
      </div>

      {/* Objetivo */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Objetivo Principal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {objetivosOptions.map((option) => (
            <label
              key={option.value}
              className="relative flex flex-col p-4 bg-black/40 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 group active:scale-98"
            >
              <input
                {...register('objetivo')}
                type="radio"
                value={option.value}
                className="sr-only"
              />
              <span className="text-white font-bold text-sm group-has-[:checked]:text-primary transition-colors duration-300">
                {option.label}
              </span>
              <span className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                {option.desc}
              </span>
            </label>
          ))}
        </div>
        {errors.objetivo && (
          <p className="mt-2 text-xs text-destructive font-semibold">{errors.objetivo.message}</p>
        )}
      </div>

      {/* Nível */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Nível de Experiência
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nivelOptions.map((option) => (
            <label
              key={option.value}
              className="relative flex flex-col p-4 bg-black/40 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 group active:scale-98 text-left"
            >
              <input
                {...register('nivel')}
                type="radio"
                value={option.value}
                className="sr-only"
              />
              <span className="text-white font-bold text-sm group-has-[:checked]:text-primary transition-colors duration-300">
                {option.label}
              </span>
              <span className="text-zinc-400 text-[10px] mt-1 leading-relaxed">
                {option.desc}
              </span>
            </label>
          ))}
        </div>
        {errors.nivel && (
          <p className="mt-2 text-xs text-destructive font-semibold">{errors.nivel.message}</p>
        )}
      </div>

      {/* Local de Treino */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Onde preferes treinar?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {localOptions.map((option) => (
            <label
              key={option.value}
              className="relative flex items-center justify-center p-3.5 bg-black/40 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 group active:scale-98"
            >
              <input
                {...register('local_treino')}
                type="radio"
                value={option.value}
                className="sr-only"
              />
              <span className="text-zinc-300 font-bold text-xs group-has-[:checked]:text-primary transition-colors duration-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.local_treino && (
          <p className="mt-2 text-xs text-destructive font-semibold">{errors.local_treino.message}</p>
        )}
      </div>

      {/* Dias Disponíveis */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Quantos dias por semana tens disponíveis para treinar?
        </label>
        <div className="flex flex-wrap gap-2">
          {diasOptions.map((dia) => (
            <button
              key={dia}
              type="button"
              onClick={() => setValue('dias_disponiveis', dia)}
              className={`w-12 h-12 rounded-2xl border font-bold text-sm transition-all duration-300 active:scale-90 cursor-pointer ${
                diasSelecionados === dia
                  ? 'border-primary bg-primary/10 text-primary shadow-glow-whisper'
                  : 'border-white/10 bg-black/40 text-zinc-400 hover:border-primary/50 hover:text-white'
              }`}
            >
              {dia}
            </button>
          ))}
        </div>
        {errors.dias_disponiveis && (
          <p className="mt-2 text-xs text-destructive font-semibold">{errors.dias_disponiveis.message}</p>
        )}
      </div>

      {/* Minutos por Sessão */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Tempo de treino preferido por sessão? (minutos)
        </label>
        <div className="flex flex-wrap gap-2 select-none">
          {minutosOptions.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setValue('minutos_por_sessao', min)}
              className={`px-4 py-2.5 rounded-2xl border font-bold text-xs transition-all duration-300 active:scale-90 cursor-pointer ${
                minutosSelecionados === min
                  ? 'border-primary bg-primary/10 text-primary shadow-glow-whisper'
                  : 'border-white/10 bg-black/40 text-zinc-400 hover:border-primary/50 hover:text-white'
              }`}
            >
              {min} min
            </button>
          ))}
        </div>
        {errors.minutos_por_sessao && (
          <p className="mt-2 text-xs text-destructive font-semibold">{errors.minutos_por_sessao.message}</p>
        )}
      </div>

      {/* Aptidão Física & Segurança (PAR-Q) */}
      <div className="border-t border-white/5 pt-8 space-y-6">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight">Aptidão Física & Segurança (PAR-Q)</h3>
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
            Por favor, responde com total honestidade para que possamos garantir a tua integridade física.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              id: 'par_q_dor_peito',
              question: 'Sentiste alguma dor no peito ao fazer esforço físico nos últimos meses?',
            },
            {
              id: 'par_q_perda_equilibrio',
              question: 'Perdes frequentemente o equilíbrio ou tens tonturas?',
            },
            {
              id: 'par_q_problema_cardiaco',
              question: 'Tens algum problema cardíaco diagnosticado por um médico?',
            },
            {
              id: 'par_q_proibido_medico',
              question: 'Algum médico já te proibiu expressamente de praticar atividade física?',
            },
            {
              id: 'par_q_pressao_alta',
              question: 'Sofres de pressão arterial elevada (hipertensão) não controlada?',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 border border-white/10 rounded-2xl gap-4 hover:border-primary/30 transition duration-300"
            >
              <span className="text-xs font-semibold text-zinc-300 leading-relaxed max-w-[380px]">
                {item.question}
              </span>
              <div className="flex gap-2 shrink-0 select-none">
                <label className="flex-1 sm:flex-initial">
                  <input
                    {...register(item.id as any)}
                    type="radio"
                    value="false"
                    defaultChecked
                    className="sr-only peer"
                    onClick={() => setValue(item.id as any, false)}
                  />
                  <span className="flex items-center justify-center px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:border-white/20 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition cursor-pointer text-center">
                    Não
                  </span>
                </label>
                <label className="flex-1 sm:flex-initial">
                  <input
                    {...register(item.id as any)}
                    type="radio"
                    value="true"
                    className="sr-only peer"
                    onClick={() => setValue(item.id as any, true)}
                  />
                  <span className="flex items-center justify-center px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:border-white/20 peer-checked:border-destructive peer-checked:bg-destructive/10 peer-checked:text-destructive transition cursor-pointer text-center">
                    Sim
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

