"use client"

import { CreditCard, ArrowRight, CheckCircle2, Shield, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const INCLUSO = [
  { title: "Módulo Corpo Ativo",                  desc: "(treinos + alimentação)" },
  { title: "Módulo Mente Clara",                  desc: "(hábitos + foco + rotina)" },
  { title: "Módulo Essência Desperta",            desc: "(autoconhecimento + propósito)" },
  { title: "Comunidade privada de apoio",         desc: "" },
  { title: "Acompanhamento e suporte direto",     desc: "" },
  { title: "Atualizações contínuas do programa",  desc: "" },
  { title: "Bônus: Guia de Respiração e Presença",desc: "" },
  { title: "Bônus: Template de Rotina Semanal Integrada", desc: "" },
]

export function LandingPreco() {
  return (
    <section id="preco" className="bg-card section-padding">
      <div className="mx-auto max-w-3xl">
        <div className="text-center reveal flex flex-col items-center">
          <div className="mb-5">
            <span className="flex items-center gap-2 rounded-full border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-1 text-xs font-semibold text-[var(--color-warning)]">
              <CreditCard className="h-3.5 w-3.5" /> Investimento
            </span>
          </div>
          <h2 className="text-[22px] sm:text-h2 font-bold leading-tight">Seu acesso completo ao Trinus</h2>
        </div>

        <div className="reveal mt-12 rounded-3xl border border-success/60 bg-card p-6 sm:p-10 shadow-glow">
          {/* Caixa de Preço */}
          <div className="rounded-2xl bg-[var(--color-surface-deep)] p-8 text-center border border-white/5 shadow-inner">
            <div className="flex justify-center mb-6">
              <span className="flex items-center gap-2 rounded-full border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-1 text-xs font-semibold text-[var(--color-warning)]">
                🔥 60% OFF — Por tempo limitado
              </span>
            </div>

            <p className="text-xl font-bold text-muted-foreground line-through decoration-success/50">De R$ 497</p>

            <div className="my-2 flex items-baseline justify-center gap-2 whitespace-nowrap">
              <span className="text-4xl font-bold text-foreground sm:text-5xl">12x</span>
              <span className="text-5xl font-extrabold tracking-tighter text-success sm:text-6xl leading-none">R$ 18,89</span>
            </div>

            <p className="text-base text-muted-foreground">
              Ou <strong className="text-foreground">R$ 197</strong> à vista
            </p>
            <p className="mt-4 text-[11px] min-[400px]:text-[13px] sm:text-sm font-semibold text-success text-center whitespace-nowrap">
              Menos de R$ 0,60 por dia para sua transformação
            </p>
          </div>

          {/* Incluso */}
          <div className="mt-10">
            <h4 className="text-center text-lg font-bold text-foreground mb-8">O que está incluso:</h4>
            <ul className="space-y-4">
              {INCLUSO.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-left">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-success" />
                  <div>
                    <span className="text-base font-semibold text-foreground">{item.title}</span>
                    {item.desc && <span className="block text-sm text-muted-foreground">{item.desc}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Button variant="landing-primary" size="xl" className="group" fullWidth>
              Garantir Minha Vaga
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Button>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Shield     className="h-[18px] w-[18px] text-success" strokeWidth={1.5} /> Compra segura</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-[18px] w-[18px] text-success" strokeWidth={1.5} /> 7 dias de garantia incondicional.</span>
              <span className="flex items-center gap-2"><Clock      className="h-[18px] w-[18px] text-success" strokeWidth={1.5} /> Acesso imediato</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
