// app/client/_components/ClientSidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut, LayoutGrid, Dumbbell, Apple, TrendingUp, User } from "lucide-react"
import type { TabKey } from "../_types/client.types"

interface ClientSidebarProps {
  userName: string
  email: string
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
  logoutLoading: boolean
  handleLogout: () => Promise<void>
}

export function ClientSidebar({
  userName,
  email,
  activeTab,
  onSelectTab,
  logoutLoading,
  handleLogout
}: ClientSidebarProps) {
  const navItems = [
    { key: "dashboard" as const, label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
    { key: "treino" as const, label: "Treino", icon: <Dumbbell className="h-5 w-5" /> },
    { key: "alimentacao" as const, label: "Alimentação", icon: <Apple className="h-5 w-5" /> },
    { key: "progresso" as const, label: "Progresso", icon: <TrendingUp className="h-5 w-5" /> },
    { key: "perfil" as const, label: "Perfil", icon: <User className="h-5 w-5" /> },
  ]

  return (
    <aside className="sidebar-container">
      <div>
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
            {(userName || "A").substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-sm text-foreground block truncate">{userName}</span>
            <span className="text-[10px] text-muted-foreground block truncate">{email}</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full border-white/5 bg-black/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer flex items-center justify-center py-5 rounded-xl font-bold transition-colors duration-200"
        >
          {logoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
          Sair
        </Button>
      </div>
    </aside>
  )
}
