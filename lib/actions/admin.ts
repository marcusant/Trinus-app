'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Atualiza o papel de um utilizador na base de dados de forma segura.
 * Apenas administradores autenticados podem executar esta ação.
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: 'admin' | 'trainer' | 'client'
) {
  const supabase = await createClient()

  // 1. Verificar se o utilizador logado está autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Utilizador não autenticado' }
  }

  // 2. Verificar se o utilizador atual é de facto um Administrador
  const { data: currentUserRole, error: roleCheckError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleCheckError || currentUserRole?.role !== 'admin') {
    return { success: false, error: 'Apenas administradores podem alterar papéis de utilizador.' }
  }

  // Evitar que o próprio admin altere a sua própria role por engano
  if (user.id === targetUserId) {
    return { success: false, error: 'Não pode alterar o seu próprio papel de administrador.' }
  }

  // 3. Atualizar a tabela public.profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq('id', targetUserId)

  if (profileError) {
    console.error('Erro ao atualizar profiles:', profileError)
    return { success: false, error: 'Erro ao atualizar perfil.' }
  }

  // 4. Atualizar/sincronizar a tabela public.user_roles
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({
      user_id: targetUserId,
      role: newRole,
    }, {
      onConflict: 'user_id'
    })

  if (roleError) {
    console.error('Erro ao atualizar user_roles:', roleError)
    return { success: false, error: 'Erro ao atualizar papel do sistema.' }
  }

  revalidatePath('/admin')
  return { success: true }
}
