// app/trainer/anamnese/[clientId]/page.tsx — Anamnese de um cliente (lado do treinador)
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAnamnese } from '@/lib/actions/anamnese'
import { AnamneseFormWizard } from '@/components/forms/AnamneseFormWizard'

export const dynamic = 'force-dynamic'

interface TrainerAnamnesePageProps {
  params: Promise<{ clientId: string }>
}

export default async function TrainerAnamnesePage({ params }: TrainerAnamnesePageProps) {
  const { clientId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // getAnamnese aplica a autorização (próprio/treinador/admin); se não autorizado
  // devolve erro e não há dados para hidratar.
  const { success, data: dadosIniciais } = await getAnamnese(clientId)
  if (!success) redirect('/trainer')

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', clientId)
    .single()

  return (
    <div className="min-h-screen bg-background py-10">
      <AnamneseFormWizard
        perfilId={clientId}
        alunoNome={clientProfile?.full_name || 'Atleta'}
        modo={dadosIniciais ? 'editar' : 'criar'}
        dadosIniciais={dadosIniciais}
        redirectTo="/trainer"
      />
    </div>
  )
}
