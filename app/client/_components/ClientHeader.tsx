// app/client/_components/ClientHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut, Sun, CloudSun, Moon } from "lucide-react"
import { BrandLogo } from "@/components/ui/brand-logo"
import type { LevelInfo } from "../_types/client.types"

interface ClientHeaderProps {
  userName: string
  userLevel: LevelInfo
  trainerName: string | null
  logoutLoading: boolean
  handleLogout: () => Promise<void>
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

function getGreetingIcon() {
  const hour = new Date().getHours()
  if (hour < 12) return <Sun className="h-5 w-5 text-amber-400" />
  if (hour < 18) return <CloudSun className="h-5 w-5 text-orange-400" />
  return <Moon className="h-5 w-5 text-indigo-400" />
}

export function ClientHeader({
  userName,
  userLevel,
  trainerName,
  logoutLoading,
  handleLogout
}: ClientHeaderProps) {
  return (
    <>
      {/* Mobile Header (compact, hidden on xl+) */}
      <header className="px-4 pt-5 pb-4 mx-auto w-full max-w-5xl xl:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SSOT Trident Logo on mobile header */}
            <BrandLogo variant="trident" className="h-8 w-auto transition-transform duration-300 hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                {getGreetingIcon()}
                <h1 className="text-base font-extrabold tracking-tight flex items-center gap-2 flex-wrap">
                  {getGreeting()}, <span className="text-primary">{userName.split(" ")[0]}</span>
                  <span className="text-xs bg-black/40 border border-white/5 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold shrink-0 select-none">
                    <span>{userLevel.icon}</span>
                    <span style={{ color: userLevel.color }} className="text-[11px]">{userLevel.name}</span>
                  </span>
                </h1>
              </div>
              {trainerName && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Treinador: <span className="font-semibold text-pillar-mind">{trainerName}</span>
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="border-white/5 bg-card hover:bg-destructive/10 hover:text-destructive text-xs cursor-pointer"
          >
            {logoutLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
          </Button>
        </div>
      </header>

      {/* Desktop Header (visible on xl+) */}
      <header className="hidden xl:block px-8 pt-8 pb-4 mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {getGreetingIcon()}
              <h1 className="text-2xl font-black tracking-tight">
                {getGreeting()}, <span className="text-primary">{userName.split(" ")[0]}</span>
              </h1>
            </div>
            {trainerName && (
              <p className="text-xs text-muted-foreground mt-1">
                O seu plano está sob orientação de <span className="font-bold text-pillar-mind">{trainerName}</span>
              </p>
            )}
          </div>
          {/* Quick status pill / Level Badge */}
          <div className="flex items-center gap-2.5 bg-card/40 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1 select-none">
              <span>{userLevel.icon}</span>
              <span style={{ color: userLevel.color }}>{userLevel.name}</span>
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">Online</span>
          </div>
        </div>
      </header>
    </>
  )
}
