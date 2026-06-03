"use client"

/**
 * Landing page — orquestrador puro.
 * Lógica em: app/_hooks/useLandingPage.ts
 * Dados em:  constants/landing.ts
 * Seções em: components/landing/
 */

import { useLandingPage } from "./_hooks/useLandingPage"
import { LandingNavbar }      from "@/components/landing/LandingNavbar"
import { LandingHero }        from "@/components/landing/LandingHero"
import { LandingPilares }     from "@/components/landing/LandingPilares"
import { LandingParaQuem }    from "@/components/landing/LandingParaQuem"
import { LandingDepoimentos } from "@/components/landing/LandingDepoimentos"
import { LandingSobre }       from "@/components/landing/LandingSobre"
import { LandingPreco }       from "@/components/landing/LandingPreco"
import { LandingFAQ }         from "@/components/landing/LandingFAQ"
import { LandingCTA, LandingFooter } from "@/components/landing/LandingCTAFooter"
import { LandingWhatsApp }    from "@/components/landing/LandingWhatsApp"

export default function TrinusLanding() {
  const { scrolled, menuOpen, setMenuOpen, openFaq, toggleFaq, scrollTo } = useLandingPage()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de urgência */}
      <div className="fixed top-0 left-0 w-full h-[36px] z-50 bg-[var(--color-urgency-bar)] text-white flex items-center justify-center px-5 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
        <span>
          🔥 Programa agora disponível —{" "}
          <button onClick={() => scrollTo("preco")} className="underline underline-offset-2 cursor-pointer hover:opacity-90 transition font-bold">
            Garanta sua vaga
          </button>
        </span>
      </div>

      <LandingNavbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrollTo={scrollTo} />

      <LandingHero scrollTo={scrollTo} />

      {/* Frase de impacto */}
      <section className="border-y border-secondary/20 section-padding">
        <div className="mx-auto max-w-3xl text-center reveal">
          <div className="mx-auto mb-8 h-[3px] w-10 rounded-full bg-primary" />
          <p className="text-[17px] min-[400px]:text-[19px] sm:text-2xl md:text-3xl font-semibold leading-snug text-foreground whitespace-nowrap lg:whitespace-normal">
            Corpo forte. Mente clara. <span className="text-primary">Essência desperta.</span>
          </p>
          <p className="mt-6 text-[12px] min-[400px]:text-[13px] sm:text-sm font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            Três pilares. Uma transformação que não volta atrás.
          </p>
        </div>
      </section>

      <LandingPilares />
      <LandingParaQuem />
      <LandingDepoimentos />
      <LandingSobre />
      <LandingPreco />
      <LandingFAQ openFaq={openFaq} toggleFaq={toggleFaq} />
      <LandingCTA scrollTo={scrollTo} />
      <LandingFooter />
      <LandingWhatsApp />
    </div>
  )
}
