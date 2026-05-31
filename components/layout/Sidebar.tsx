// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  async function fetchUserInfo() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('perfil_utilizador')
        .select('nome, role')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserRole(data.role)
        setUserName(data.nome)
      }
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navigationAdmin = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Alunos', href: '/alunos', icon: '👥' },
  ]

  const navigationAluno = [
    { name: 'Dashboard', href: '/painel', icon: '📊' },
    { name: 'Meu Perfil', href: '/perfil', icon: '👤' },
    { name: 'Minha Anamnese', href: '/minha-anamnese', icon: '📋' },
    { name: 'Meus Treinos', href: '/treinos', icon: '🏋️' },
    { name: 'Minha Alimentação', href: '/alimentacao', icon: '🥗' },
  ]

  const navigation = userRole === 'admin' ? navigationAdmin : navigationAluno

  if (loading) {
    return (
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#262626] hidden md:flex flex-col">
        <div className="p-6">
          <div className="animate-pulse bg-[#262626] h-8 w-32 rounded"></div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#262626] hidden md:flex flex-col min-h-screen">
      <div className="p-6 border-b border-[#262626]">
        <Link href={userRole === 'admin' ? '/admin' : '/painel'} className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="text-white">Trinus</span>{' '}
            <span className="text-[#d4a574]">Marcus</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && item.href !== '/painel' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#1a1a1a] text-[#d4a574] border border-[#d4a574]/30'
                  : 'text-[#a3a3a3] hover:bg-[#141414] hover:text-white border border-transparent'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#262626]">
        <div className="mb-3">
          <p className="text-[#525252] text-xs">Logado como</p>
          <p className="text-white text-sm font-medium truncate">{userName}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#737373] hover:text-red-400 hover:bg-[#141414] rounded-lg transition-all"
        >
          <span className="w-6 h-6 bg-[#262626] rounded-full flex items-center justify-center text-xs">
            {userName.charAt(0).toUpperCase()}
          </span>
          Sair
        </button>
      </div>
    </aside>
  )
}
