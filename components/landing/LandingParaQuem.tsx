"use client"

import { Check, X } from "lucide-react"
import { PARA_QUEM_SIM, PARA_QUEM_NAO } from "@/constants/landing"

export function LandingParaQuem() {
  return (
    <section className="bg-card section-padding">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <div className="reveal rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur-md shadow-glow-whisper transition-all duration-500 hover:shadow-glow hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-foreground">Isso é pra você se:</h3>
          <ul className="mt-6 space-y-4">
            {PARA_QUEM_SIM.map(t => (
              <li key={t} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <span className="text-sm leading-relaxed text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur-md shadow-glow-whisper transition-all duration-500 hover:shadow-glow hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-foreground">Não é pra você se:</h3>
          <ul className="mt-6 space-y-4">
            {PARA_QUEM_NAO.map(t => (
              <li key={t} className="flex gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm leading-relaxed text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
