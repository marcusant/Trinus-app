"use client"

import { Award } from "lucide-react"

interface XPBarProps {
  currentXP: number
  levelName: string
  levelIcon: string
  levelColor: string
  minXP: number
  nextLevelXP: number
}

export function XPBar({
  currentXP,
  levelName,
  levelIcon,
  levelColor,
  minXP,
  nextLevelXP,
}: XPBarProps) {
  // Calculate relative progress between current level's minXP and next level's XP threshold
  const totalInLevel = nextLevelXP - minXP
  const earnedInLevel = Math.max(0, currentXP - minXP)
  const progressPercentage = totalInLevel > 0 
    ? Math.min(100, Math.max(0, (earnedInLevel / totalInLevel) * 100))
    : 100

  const remainingXP = nextLevelXP - currentXP

  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-5 backdrop-blur-sm shadow-glow-whisper">
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
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
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
              background: `linear-gradient(90deg, oklch(0.59 0.20 290) 0%, ${levelColor} 100%)`,
            }}
          >
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] bg-[length:200%_100%] animate-pulse" />
          </div>
        </div>
        
        {/* Progress thresholds labels */}
        <div className="flex justify-between items-center mt-1.5 px-0.5 text-[10px] text-muted-foreground font-medium tabular-nums">
          <span>{minXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  )
}
