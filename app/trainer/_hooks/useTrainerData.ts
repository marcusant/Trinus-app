"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getTrainerDashboardData } from "@/lib/actions/trainer"
import { toast } from "sonner"
import type { ClientProfile, Assessment } from "../_types/trainer.types"

export function useTrainerData() {
  const supabase = createClient()
  const [trainerName, setTrainerName] = useState("Treinador")
  const [trainerId, setTrainerId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [allAssessments, setAllAssessments] = useState<Assessment[]>([])
  const [trainerPlansCount, setTrainerPlansCount] = useState(0)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setTrainerId(user.id)
        const { data: perfil } = await supabase
          .from("profiles").select("full_name").eq("id", user.id).single()
        if (perfil?.full_name) setTrainerName(perfil.full_name)

        const res = await getTrainerDashboardData()
        if (res.success && res.clients && res.allAssessments) {
          setClients(res.clients)
          setAllAssessments(res.allAssessments)
          setTrainerPlansCount(res.trainerPlansCount)
        } else {
          throw new Error(res.error || "Falha ao obter dados do treinador")
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Treinador:", err)
        toast.error("Erro ao sincronizar informações com o banco.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [supabase])

  return {
    trainerName, trainerId, isLoading,
    clients,
    allAssessments, setAllAssessments,
    trainerPlansCount, setTrainerPlansCount,
  }
}
