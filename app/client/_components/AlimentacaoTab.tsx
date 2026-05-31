// app/client/_components/AlimentacaoTab.tsx
"use client"

import {
  Clock,
  Loader2,
  ChevronDown,
  Apple,
  UtensilsCrossed,
} from "lucide-react"
import type { MealPlan, MealDay, Meal } from "../_types/client.types"

const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Pequeno-almoço",
  morning_snack: "Lanche manhã",
  lunch: "Almoço",
  afternoon_snack: "Lanche tarde",
  dinner: "Jantar",
  supper: "Ceia",
}

interface AlimentacaoTabProps {
  activeMealPlan: MealPlan | null
  mealDays: MealDay[]
  selectedMealDayId: string | null
  setSelectedMealDayId: (id: string | null) => void
  dayMeals: Meal[]
  isMealsLoading: boolean
}

export function AlimentacaoTab({
  activeMealPlan,
  mealDays,
  selectedMealDayId,
  setSelectedMealDayId,
  dayMeals,
  isMealsLoading,
}: AlimentacaoTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
        <UtensilsCrossed className="h-4 w-4 text-primary" /> Plano Alimentar
      </h3>

      {activeMealPlan ? (
        <>
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm shadow-glow-whisper">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-foreground block">{activeMealPlan.name}</span>
                <span className="text-[10px] text-muted-foreground">{mealDays.length} dia{mealDays.length !== 1 ? "s" : ""} configurado{mealDays.length !== 1 ? "s" : ""}</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase text-primary bg-primary/10">Ativo</span>
            </div>
          </div>

          {/* Meal days */}
          <div className="space-y-2">
            {mealDays.map(md => (
              <div key={md.id} onClick={() => setSelectedMealDayId(selectedMealDayId === md.id ? null : md.id)} className={`flex items-center justify-between p-3 bg-card/30 border rounded-2xl cursor-pointer transition ${selectedMealDayId === md.id ? "border-primary bg-primary-subtle shadow-glow-whisper" : "border-white/5 hover:border-white/10"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">{md.day_number}</div>
                  <span className="font-bold text-sm text-foreground">{md.name || `Dia ${md.day_number}`}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${selectedMealDayId === md.id ? "rotate-180" : ""}`} />
              </div>
            ))}
          </div>

          {/* Meals expanded */}
          {selectedMealDayId && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              {isMealsLoading ? (
                <div className="py-6 flex justify-center text-muted-foreground gap-2 text-xs"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Carregando refeições...</div>
              ) : dayMeals.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">Sem refeições configuradas para este dia.</div>
              ) : dayMeals.map(meal => (
                <div key={meal.id} className="rounded-2xl border border-white/5 bg-card/40 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-foreground">{meal.name || MEAL_TYPE_LABEL[meal.meal_type] || meal.meal_type}</span>
                    {meal.time_scheduled && <span className="text-[10px] text-muted-foreground bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{meal.time_scheduled.substring(0, 5)}</span>}
                  </div>
                  {meal.items.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground italic">Sem alimentos listados.</span>
                  ) : (
                    <div className="space-y-1.5">
                      {meal.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-black/30 rounded-xl border border-white/5">
                          <span className="text-xs text-foreground">{item.name}</span>
                          <div className="flex items-center gap-2">
                            {item.quantity && item.unit && <span className="text-[9px] text-muted-foreground">{item.quantity}{item.unit}</span>}
                            {item.calories && <span className="text-[9px] text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded-full">{item.calories}kcal</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card/30 rounded-2xl border border-white/5">
          <Apple className="h-8 w-8 mx-auto mb-3 text-zinc-600" />
          Sem plano alimentar ativo. O seu treinador irá prescrever um.
        </div>
      )}
    </div>
  )
}
