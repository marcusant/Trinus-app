// app/client/_components/BottomNav.tsx
"use client"

import {
  LayoutGrid,
  Dumbbell,
  Apple,
  TrendingUp,
  User,
} from "lucide-react"
import type { TabKey } from "../_types/client.types"

interface BottomNavProps {
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
  planDays: { id: string }[]
  selectedDayId: string | null
  setSelectedDayId: (id: string | null) => void
}

const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
  { key: "treino", label: "Treino", icon: <Dumbbell className="h-5 w-5" /> },
  { key: "alimentacao", label: "Alimentação", icon: <Apple className="h-5 w-5" /> },
  { key: "progresso", label: "Progresso", icon: <TrendingUp className="h-5 w-5" /> },
  { key: "perfil", label: "Perfil", icon: <User className="h-5 w-5" /> },
]

export function BottomNav({
  activeTab,
  setActiveTab,
  planDays,
  selectedDayId,
  setSelectedDayId,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-white/5 xl:hidden">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => {
              setActiveTab(item.key);
              if (item.key === "treino" && planDays[0] && !selectedDayId) {
                setSelectedDayId(planDays[0].id);
              }
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl cursor-pointer transition-all min-w-[56px] ${activeTab === item.key
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {item.icon}
            <span className={`text-[9px] font-semibold ${activeTab === item.key ? "text-primary" : ""}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
