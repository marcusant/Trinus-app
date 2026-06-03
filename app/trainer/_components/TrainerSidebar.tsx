// app/trainer/_components/TrainerSidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut, LayoutGrid, Users, Clipboard } from "lucide-react"
import type { TrainerTab } from "../_types/trainer.types"
import { BrandLogo } from "@/components/ui/brand-logo"

interface TrainerSidebarProps {
  trainerName: string
  activeTab: TrainerTab
  setActiveTab: (tab: TrainerTab) => void
  logoutLoading: boolean
  isLoading: boolean
  handleLogout: () => Promise<void>
}

export function TrainerSidebar({
  trainerName,
  activeTab,
  setActiveTab,
  logoutLoading,
  isLoading,
  handleLogout
}: TrainerSidebarProps) {
  return (
    <aside className="sidebar-container">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <BrandLogo variant="full" className="h-8 w-auto transition-all duration-300 hover:scale-[1.02]" />
        </div>

        {/* Profile Card in Sidebar */}
        <div className="sidebar-profile-card mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0 border border-primary/20">
            {(trainerName || "A").substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-sm sm:text-base text-foreground block truncate">{trainerName}</span>
            <span className="text-[11px] text-pillar-mind bg-pillar-mind/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              Treinador
            </span>
          </div>
        </div>

        {/* Desktop Tabs list */}
        <nav className="sidebar-nav">
          {[
            { key: "dashboard", label: "Visão Geral", icon: <LayoutGrid className="h-5 w-5" /> },
            { key: "clients", label: "Meus Alunos", icon: <Users className="h-5 w-5" /> },
            { key: "assessments", label: "Avaliações", icon: <Clipboard className="h-5 w-5" /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as TrainerTab)}
              className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="sidebar-footer">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={logoutLoading || isLoading}
          className="w-full border-white/5 bg-black/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer flex items-center justify-center py-5 rounded-xl font-bold"
        >
          {logoutLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 mr-2" />
          )}
          Sair
        </Button>
      </div>
    </aside>
  )
}
