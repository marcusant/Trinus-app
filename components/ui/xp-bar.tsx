"use client"

import { useState } from "react"
import { Award } from "lucide-react"

interface XPBarProps {
  currentXP: number
  levelName: string
  levelIcon: string
  levelColor: string
  minXP: number
  nextLevelXP: number
  /** Mostra o guia colapsável de patentes. Desligado no dashboard (vive no Perfil). */
  showLevels?: boolean
}

export const XP_LEVELS = [
  { name: "Bronze", icon: "🥉", xp: "0 - 999 XP" },
  { name: "Prata", icon: "🥈", xp: "1.000 - 2.499 XP" },
  { name: "Ouro", icon: "🥇", xp: "2.500 - 4.499 XP" },
  { name: "Platina", icon: "🏆", xp: "4.500 - 6.999 XP" },
  { name: "Diamante", icon: "💎", xp: "7.000+ XP" },
]

export function XPBar({
  currentXP,
  levelName,
  levelIcon,
  levelColor,
  minXP,
  nextLevelXP,
  showLevels = true,
}: XPBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Calculate relative progress between current level's minXP and next level's XP threshold
  const totalInLevel = nextLevelXP - minXP
  const earnedInLevel = Math.max(0, currentXP - minXP)
  const progressPercentage = totalInLevel > 0 
    ? Math.min(100, Math.max(0, (earnedInLevel / totalInLevel) * 100))
    : 100

  const remainingXP = nextLevelXP - currentXP

  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-5 backdrop-blur-md shadow-glow-whisper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* Nível atual */}
        <div className="flex items-center gap-2.5">
          <div 
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/40 border border-white/5 text-lg"
            style={{ color: levelColor }}
          >
            {levelIcon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Nível Atual
              </span>
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: levelColor }} 
              />
            </div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
              {levelName}
              <span className="text-xs text-muted-foreground font-medium">
                ({currentXP} XP)
              </span>
            </h3>
          </div>
        </div>

        {/* Informações de XP restante */}
        <div className="text-left sm:text-right">
          {remainingXP > 0 ? (
            <p className="text-xs text-muted-foreground font-medium">
              Faltam <span className="text-foreground font-bold tabular-nums">{remainingXP} XP</span> para o próximo nível
            </p>
          ) : (
            <p className="text-xs text-primary font-bold flex items-center sm:justify-end gap-1">
              <Award className="h-4 w-4" /> Nível Máximo Atingido!
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        <div className="h-3 w-full rounded-full bg-black/40 border border-white/5 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) relative"
            style={{
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, var(--brand-purple) 0%, ${levelColor} 100%)`,
            }}
          >
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] bg-[length:200%_100%] animate-pulse" />
          </div>
        </div>
        
        {/* Progress thresholds labels */}
        <div className="flex justify-between items-center mt-1.5 px-0.5 text-xs text-muted-foreground font-medium tabular-nums">
          <span>{minXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
      </div>

      {/* Guia de Patentes Colapsável */}
      {showLevels && (
      <div className="mt-4 pt-3 border-t border-white/5 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary animate-pulse" />
            Tabela de Patentes & Progressão
          </span>
          <span className="text-[11px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md transition font-extrabold">
            {isOpen ? "Ocultar ↑" : "Mostrar ↓"}
          </span>
        </button>

        {isOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {XP_LEVELS.map((lvl) => {
              const isCurrent = levelName === lvl.name
              return (
                <div
                  key={lvl.name}
                  className={`p-3 rounded-xl border flex flex-row sm:flex-col items-center justify-between sm:justify-center text-center gap-2 transition duration-300 ${
                    isCurrent
                      ? "bg-primary/10 border-primary/30 text-white shadow-glow-whisper"
                      : "bg-black/30 border-white/5 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center sm:flex-col gap-1.5">
                    <span className="text-lg">{lvl.icon}</span>
                    <span className={`text-xs font-bold ${isCurrent ? "text-primary" : "text-white"}`}>
                      {lvl.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold opacity-80 tabular-nums">
                    {lvl.xp}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
      )}
    </div>
  )
}
