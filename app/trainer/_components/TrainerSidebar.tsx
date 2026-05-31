// app/trainer/_components/TrainerSidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut, LayoutGrid, Users, Clipboard } from "lucide-react"
import type { TrainerTab } from "../_types/trainer.types"

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
          <svg viewBox="0 0 40 40" className="w-9 h-9 fill-none stroke-primary stroke-[1.8] transition-all duration-300 hover:scale-105 shrink-0">
            <path d="M12 28V14L16 18L20 10L24 18L28 14V28" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M20 10V30" strokeLinecap="round" />
            <circle cx="20" cy="30" r="1" fill="currentColor" />
          </svg>
          <div className="flex items-baseline gap-1">
            <span className="font-black tracking-tight text-primary text-base">TRINUS</span>
          </div>
        </div>

        {/* Profile Card in Sidebar */}
        <div className="sidebar-profile-card mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0 border border-primary/20">
            {(trainerName || "A").substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-sm text-foreground block truncate">{trainerName}</span>
            <span className="text-[10px] text-pillar-mind bg-pillar-mind/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
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
