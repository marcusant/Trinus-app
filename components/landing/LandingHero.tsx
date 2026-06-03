"use client"

import { Dumbbell, Brain, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvatarSeeded as Avatar, AvatarStack } from "@/components/ui/avatar-stack"

interface LandingHeroProps {
  scrollTo: (id: string) => void
}

export function LandingHero({ scrollTo }: LandingHeroProps) {
  const floatingCards = [
    { icon: <Dumbbell className="h-6 w-6 text-pillar-body" />,    title: "Corpo Ativo",       border: "border-l-pillar-body",    top: "10%", left: "25%", rotate: "-4deg" },
    { icon: <Brain    className="h-6 w-6 text-pillar-mind" />,    title: "Mente Clara",       border: "border-l-pillar-mind",    top: "38%", left: "45%", rotate: "2deg"  },
    { icon: <Sparkles className="h-6 w-6 text-pillar-essence" />, title: "Essência Desperta", border: "border-l-pillar-essence", top: "66%", left: "20%", rotate: "-2deg" },
  ]

  const mobileCards = [
    { icon: <Dumbbell className="h-5 w-5 text-pillar-body" />,    title: "Corpo Ativo",       border: "border-l-pillar-body"    },
    { icon: <Brain    className="h-5 w-5 text-pillar-mind" />,    title: "Mente Clara",       border: "border-l-pillar-mind"    },
    { icon: <Sparkles className="h-5 w-5 text-pillar-essence" />, title: "Essência Desperta", border: "border-l-pillar-essence" },
  ]

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden bg-background pt-40 pb-20">
      <div className="absolute inset-0 z-0">
        <img src="/hero-golden.png" alt="Trinus Marcus - Força e Clareza" className="w-full h-full object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:gap-16 px-5 md:grid-cols-2 md:items-center">
        <div className="reveal">
          <span className="inline-block rounded-full bg-transparent border border-primary/40 px-5 py-2 text-eyebrow text-primary">
            Programa de Transformação Integral
          </span>
          <h1 className="mt-6 text-[32px] min-[400px]:text-[36px] sm:text-4xl md:text-hero font-extrabold tracking-tighter leading-[1.1]">
            <span className="whitespace-nowrap">A versão mais completa</span>
            <br />
            <span className="text-primary">de você mesmo.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Um programa que integra treino, mente e autoconhecimento em um único sistema. Não é só fitness. É transformação de verdade.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button variant="landing-primary" size="xl" className="group w-full sm:w-auto rounded-xl" onClick={() => scrollTo("preco")}>
              Quero Começar Agora
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button variant="landing-secondary" size="xl" className="w-full sm:w-auto rounded-xl" onClick={() => scrollTo("pilares")}>
              Conhecer o Programa
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <AvatarStack>
              {[0, 1, 2, 3, 4].map(seed => <Avatar key={seed} size="md" ring="subtle" seed={seed} />)}
            </AvatarStack>
            <p className="text-sm font-medium text-muted-foreground">
              <span className="font-bold text-foreground">+350 pessoas</span> em transformação
            </p>
          </div>
        </div>

        {/* Desktop — cards flutuantes */}
        <div className="relative hidden h-[26rem] md:block">
          {floatingCards.map((c, i) => (
            <div
              key={i}
              className={`absolute w-auto pr-8 rounded-3xl border border-white/10 bg-card/50 p-5 backdrop-blur-xl ${c.border} border-l-4 shadow-glow-whisper transition-all duration-500 hover:shadow-glow-active hover:-translate-y-2`}
              style={{ top: c.top, left: c.left, transform: `rotate(${c.rotate})` }}
            >
              <div className="flex items-center gap-3">
                {c.icon}
                <span className="font-semibold text-foreground whitespace-nowrap">{c.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — cards empilhados */}
      <div className="grid grid-cols-1 gap-3 md:hidden px-5 mt-8">
        {mobileCards.map((c, i) => (
          <div key={i} className={`flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md ${c.border} border-l-4 shadow-card`}>
            <div className="flex-shrink-0">{c.icon}</div>
            <span className="font-semibold text-foreground text-sm">{c.title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
