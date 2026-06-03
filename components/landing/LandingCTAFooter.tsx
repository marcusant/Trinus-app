"use client"

import { Leaf, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/ui/brand-logo"
import { WHATSAPP_URL } from "@/constants/landing"

interface LandingCTAProps {
  scrollTo: (id: string) => void
}

export function LandingCTA({ scrollTo }: LandingCTAProps) {
  return (
    <section
      className="relative overflow-hidden pt-8 pb-24"
      style={{ background: "var(--gradient-cta-section)" }}
    >
      <Leaf className="pointer-events-none absolute -right-10 top-10 h-96 w-96 text-primary-faint" strokeWidth={1} />
      <div className="relative mx-auto max-w-2xl text-center reveal">
        <h2 className="text-lg font-medium text-zinc-400">Sem mais dúvidas?</h2>
        <Button variant="landing-primary" size="xl" className="mt-6" onClick={() => scrollTo("preco")}>
          Quero Minha Vaga no Trinus
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}

const FOOTER_LINKS = [
  { label: "Programa",    href: "#pilares"  },
  { label: "FAQ",         href: "#faq"      },
  { label: "Termos",      href: "#"         },
  { label: "Privacidade", href: "#"         },
  { label: "Contato",     href: WHATSAPP_URL, target: "_blank" },
]

export function LandingFooter() {
  return (
    <footer className="bg-footer px-5 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <BrandLogo variant="full" className="h-[28px] sm:h-[32px] w-auto" />
            <p className="mt-3 text-sm text-muted-foreground">Corpo forte. Mente clara. Essência desperta.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.target || "_self"}
                rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Trinus Marcus. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
