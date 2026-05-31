import { User } from '@supabase/supabase-js'
import { LogoutButton } from './LogoutButton'
import { UserCircle } from 'lucide-react'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="md:hidden">
        <span className="text-lg font-bold text-gray-900">Trinus Marcus</span>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserCircle className="h-5 w-5" />
          <span className="hidden sm:inline">{user.email}</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
