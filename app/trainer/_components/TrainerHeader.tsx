// app/trainer/_components/TrainerHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"

interface TrainerHeaderProps {
  trainerName: string
  logoutLoading: boolean
  isLoading: boolean
  handleLogout: () => Promise<void>
}

export function TrainerHeader({
  trainerName,
  logoutLoading,
  isLoading,
  handleLogout
}: TrainerHeaderProps) {
  return (
    <>
      {/* Mobile Header (compact, hidden on xl+) */}
      <header className="px-4 pt-5 pb-4 mx-auto w-full max-w-5xl xl:hidden flex items-center justify-between border-b border-white/5 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* SSOT Trident Logo on mobile header */}
          <svg viewBox="0 0 40 40" className="w-8 h-8 fill-none stroke-primary stroke-[1.8] shrink-0 transition-transform duration-300 hover:scale-105">
            <path d="M12 28V14L16 18L20 10L24 18L28 14V28" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M20 10V30" strokeLinecap="round" />
            <circle cx="20" cy="30" r="1" fill="currentColor" />
          </svg>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">
              Olá, <span className="text-primary">{trainerName.split(" ")[0]}</span>
            </h1>
            <span className="text-[9px] text-pillar-mind bg-pillar-mind/10 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Treinador
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={handleLogout}
          disabled={logoutLoading || isLoading}
          className="border-white/5 bg-card hover:bg-destructive/10 hover:text-destructive text-[10px] cursor-pointer"
        >
          {logoutLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
        </Button>
      </header>

      {/* Desktop Header (visible on xl+) */}
      <header className="hidden xl:block px-8 pt-8 pb-4 mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Olá, <span className="text-primary">{trainerName.split(" ")[0]}</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Prescreva treinos e agende avaliações para os seus alunos.</p>
          </div>
          <span className="text-xs font-bold text-pillar-mind bg-pillar-mind/10 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse-glow">
            Painel do Treinador (TRAINER)
          </span>
        </div>
      </header>
    </>
  )
}
