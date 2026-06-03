"use client"

import { HelpCircle, ChevronDown } from "lucide-react"
import { FAQ } from "@/constants/landing"

interface LandingFAQProps {
  openFaq: number | null
  toggleFaq: (i: number) => void
}

export function LandingFAQ({ openFaq, toggleFaq }: LandingFAQProps) {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-4xl">
        <div className="text-center reveal flex flex-col items-center">
          <div className="mb-6">
            <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-1.5 text-sm font-semibold text-primary">
              <HelpCircle className="h-4 w-4" /> Perguntas Frequentes
            </span>
          </div>
          <h2 className="mt-2 text-[36px] min-[400px]:text-[44px] sm:text-6xl font-extrabold tracking-tighter leading-tight whitespace-nowrap">
            Ainda tem <span className="text-primary">dúvidas?</span>
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {FAQ.map((f, i) => {
            const open = openFaq === i
            return (
              <div key={f.q} className="reveal">
                <div className={`overflow-hidden rounded-[1.25rem] border transition-all duration-300 ${
                  open ? "border-primary/50 bg-[var(--color-surface-deep)]" : "border-white/[0.04] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-deep)]"
                }`}>
                  <button
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
                  >
                    <span className={`text-base font-medium sm:font-semibold transition-colors duration-300 ${
                      open ? "text-primary" : "text-foreground group-hover:text-primary"
                    }`}>{f.q}</span>
                    <ChevronDown className={`h-4 w-4 flex-shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
