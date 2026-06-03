"use client"

import { GraduationCap, Briefcase, Brain } from "lucide-react"

const ICON_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Briefcase:     <Briefcase     className="h-4 w-4" />,
  Brain:         <Brain         className="h-4 w-4" />,
}

const CREDENCIAIS = [
  { icon: "GraduationCap", text: "Personal Trainer Certificado" },
  { icon: "Briefcase",     text: "+10 anos em consultoria tecnológica" },
  { icon: "Brain",         text: "Estudante contínuo de desenvolvimento humano" },
]

export function LandingSobre() {
  return (
    <section className="section-padding">
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-[2fr_3fr] md:items-center">
        <div className="reveal mx-auto w-full max-w-sm">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border-2 border-primary-border bg-gradient-to-br from-card to-background p-1 shadow-glow">
            <img
              src="/marcus.jpg"
              alt="Marcus, criador do programa Trinus Marcus"
              loading="lazy"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="reveal">
          <p className="text-eyebrow text-primary">Conheça o criador</p>
          <h2 className="mt-3 text-h2 font-bold">Quem é o Marcus?</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>Brasileiro, consultor de tecnologia por profissão, Personal Trainer por vocação. O Trinus nasceu da fusão entre a disciplina do mundo corporativo e a paixão por desenvolvimento humano completo.</p>
            <p>Não acredito em separar corpo e mente. Não acredito em treino sem propósito. E não acredito que transformação real aconteça sem autoconhecimento.</p>
            <p>Criei o Trinus porque vi gente demais treinando no automático, mexendo o corpo sem envolver a mente, querendo mudança sem mudar por dentro.</p>
            <p className="text-foreground">Esse programa é o sistema que eu mesmo uso. E que agora compartilho com você.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {CREDENCIAIS.map(b => (
              <span key={b.text} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
                <span className="text-primary">{ICON_MAP[b.icon]}</span>
                {b.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
