"use client"

import { useState, useCallback, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { submitCheckIn } from "@/lib/actions/client"
import { toast } from "sonner"
import type { CheckIn } from "../_types/client.types"

interface UseCheckInParams {
  clientId: string | null
  setCheckIns: React.Dispatch<React.SetStateAction<CheckIn[]>>
}

export function useCheckIn({ clientId, setCheckIns }: UseCheckInParams) {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [checkInWeight, setCheckInWeight] = useState("")
  const [checkInNotes, setCheckInNotes] = useState("")
  const [checkInMood, setCheckInMood] = useState<number | null>(null)
  const [checkInEnergy, setCheckInEnergy] = useState<number>(80)

  const handleCheckInSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const w = checkInWeight ? parseFloat(checkInWeight) : null
        const r = await submitCheckIn(
          new Date().toISOString().split("T")[0],
          w,
          checkInNotes,
          checkInMood,
          checkInEnergy
        )
        if (r.success) {
          toast.success("Check-in registado!")
          setShowCheckInModal(false)
          setCheckInWeight("")
          setCheckInNotes("")
          setCheckInMood(null)
          setCheckInEnergy(80)
          if (clientId) {
            const { data: nc } = await supabase
              .from("check_ins")
              .select("id, date, weight_kg, notes, created_at, mood, energy_level")
              .eq("client_id", clientId)
              .order("date", { ascending: false })
            setCheckIns((nc as CheckIn[]) || [])
          }
        } else {
          toast.error(r.error || "Erro.")
        }
      } catch {
        toast.error("Erro de rede.")
      }
    })
  }, [checkInWeight, checkInNotes, checkInMood, checkInEnergy, clientId, supabase, setCheckIns])

  return {
    isPending,
    showCheckInModal,
    setShowCheckInModal,
    checkInWeight,
    setCheckInWeight,
    checkInNotes,
    setCheckInNotes,
    checkInMood,
    setCheckInMood,
    checkInEnergy,
    setCheckInEnergy,
    handleCheckInSubmit,
  }
}
