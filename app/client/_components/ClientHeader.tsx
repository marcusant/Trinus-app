// app/client/_components/ClientHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"
import { BrandLogo } from "@/components/ui/brand-logo"

interface ClientHeaderProps {
  trainerName: string | null
  logoutLoading: boolean
  handleLogout: () => Promise<void>
}

export function ClientHeader({
  trainerName,
  logoutLoading,
  handleLogout,
}: ClientHeaderProps) {
  return (
    <>
      {/* Mobile Header (compact, hidden on xl+) */}
      <header className="px-4 pt-5 pb-4 mx-auto w-full max-w-5xl xl:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo variant="trident" className="h-8 w-auto transition-transform duration-300 hover:scale-105" />
            {trainerName && (
              <p className="text-xs text-muted-foreground truncate">
                Treinador: <span className="font-semibold text-pillar-mind">{trainerName}</span>
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="border-white/5 bg-card hover:bg-destructive/10 hover:text-destructive text-xs cursor-pointer shrink-0"
          >
            {logoutLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
          </Button>
        </div>
      </header>

      {/* Desktop Header (visible on xl+) */}
      <header className="hidden xl:block px-8 pt-8 pb-4 mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <BrandLogo variant="full" className="h-9 w-auto" />

          {/* Quick status pill */}
          <div className="flex items-center gap-2.5 bg-card/40 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
            {trainerName && (
              <>
                <span className="text-[11px] font-bold text-muted-foreground select-none">
                  Treinador: <span className="text-pillar-mind">{trainerName}</span>
                </span>
                <span className="w-px h-3 bg-white/10" />
              </>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">Online</span>
          </div>
        </div>
      </header>
    </>
  )
}
