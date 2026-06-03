"use client"

import Link from "next/link"
import { Menu, X, User as UserIcon } from "lucide-react"
import { BrandLogo } from "@/components/ui/brand-logo"
import { EntrarDropdown } from "@/components/EntrarDropdown"
import { NAV_ITEMS, WHATSAPP_URL } from "@/constants/landing"

interface LandingNavbarProps {
  scrolled: boolean
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  scrollTo: (id: string) => void
}

export function LandingNavbar({ scrolled, menuOpen, setMenuOpen, scrollTo }: LandingNavbarProps) {
  return (
    <>
      <nav
        className={`fixed top-[36px] left-0 w-full z-40 transition-all duration-300 ${
          scrolled ? "border-b border-white/5 bg-black/40 backdrop-blur-md shadow-glow-whisper" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1200px] flex items-center justify-between px-5 py-4">
          <button onClick={() => scrollTo("hero")} className="cursor-pointer select-none shrink-0">
            <BrandLogo variant="dynamic" scrolled={scrolled} />
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map(({ label, id }) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              >
                {label}
              </button>
            ))}
            <EntrarDropdown />
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-card/98 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-5 py-5">
            <BrandLogo variant="full" className="h-8 w-auto" />
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_ITEMS.map(({ label, id }) => (
              <button key={label} onClick={() => scrollTo(id)} className="text-2xl font-semibold text-foreground cursor-pointer">
                {label}
              </button>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-2xl font-semibold text-foreground"
            >
              <UserIcon className="h-6 w-6" />
              Programa
            </a>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-2xl font-semibold text-foreground"
            >
              <UserIcon className="h-6 w-6" />
              Entrar
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
