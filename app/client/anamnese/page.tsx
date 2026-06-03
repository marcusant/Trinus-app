// app/client/anamnese/page.tsx — Anamnese Completa (self-service do cliente)
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAnamnese } from '@/lib/actions/anamnese'
import { AnamneseFormWizard } from '@/components/forms/AnamneseFormWizard'

export const dynamic = 'force-dynamic'

export default async function ClientAnamnesePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: dadosIniciais } = await getAnamnese(user.id)

  return (
    <div className="min-h-screen bg-background py-10">
      <AnamneseFormWizard
        perfilId={user.id}
        alunoNome={profile?.full_name || 'Atleta'}
        modo={dadosIniciais ? 'editar' : 'criar'}
        dadosIniciais={dadosIniciais}
        redirectTo="/client"
      />
    </div>
  )
}
