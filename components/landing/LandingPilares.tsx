"use client"

import { Dumbbell, Brain, Sparkles } from "lucide-react"

const PILARES = [
  {
    num: "01", label: "CORPO", title: "Corpo Ativo", sub: "Mover bem. Nutrir melhor.",
    icon: <Dumbbell className="h-5 w-5 text-pillar-body" />,
    text: "Treinar não é castigo. É o investimento com o maior retorno que você pode fazer em si mesmo. Movimento funcional para a vida real, alimentação consciente e longevidade de verdade.",
    border: "border-l-pillar-body", numColor: "text-pillar-body", labelColor: "text-pillar-body", underlineColor: "bg-pillar-body",
  },
  {
    num: "02", label: "MENTE", title: "Mente Clara", sub: "Pensar com ordem. Agir com consistência.",
    icon: <Brain className="h-5 w-5 text-pillar-mind" />,
    text: "Motivação tem prazo de validade. Sistemas, não. Aqui você constrói uma arquitetura de foco, hábitos e disciplina que funciona mesmo nos dias em que você não quer.",
    border: "border-l-pillar-mind", numColor: "text-pillar-mind", labelColor: "text-pillar-mind", underlineColor: "bg-pillar-mind",
  },
  {
    num: "03", label: "ESSÊNCIA", title: "Essência Desperta", sub: "Conhecer-se. Encontrar direção.",
    icon: <Sparkles className="h-5 w-5 text-pillar-essence" />,
    text: "Você pode ter o shape perfeito e a rotina milimétrica. Se não sabe quem é e pra onde vai, está correndo na esteira da vida sem sair do lugar. Autoconhecimento é o pilar que dá sentido aos outros dois.",
    border: "border-l-pillar-essence", numColor: "text-pillar-essence", labelColor: "text-pillar-essence", underlineColor: "bg-pillar-essence",
  },
]

export function LandingPilares() {
  return (
    <section id="pilares" className="section-padding">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-4xl text-center reveal">
          <h2 className="text-h2 font-bold">O Programa</h2>
          <p className="mt-5 text-sm min-[400px]:text-base sm:text-lg text-muted-foreground leading-relaxed">
            <span className="block sm:inline whitespace-nowrap">Cada pilar foi desenhado para se integrar aos outros.</span>
            <span className="block sm:inline"> O resultado é maior que a soma das partes.</span>
          </p>
        </div>

        <div className="mt-16 grid gap-7 md:grid-cols-3">
          {PILARES.map(p => (
            <article
              key={p.num}
              className={`pilar-card reveal group relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-active ${p.border} border-l-4`}
            >
              <div className={`pilar-underline ${p.underlineColor}`} />
              <div className={`pilar-num text-6xl font-extrabold leading-none ${p.numColor}`}>{p.num}</div>
              <div className="mt-4 flex items-center gap-2">
                <span className="pilar-icon inline-flex">{p.icon}</span>
                <p className={`pilar-label text-eyebrow ${p.labelColor}`}>{p.label}</p>
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{p.sub}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
