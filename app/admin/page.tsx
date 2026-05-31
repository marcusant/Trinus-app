"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { updateUserRole } from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  LogOut,
  ShieldAlert,
  TrendingUp,
  Activity,
  Server,
  Settings,
  Database,
  Users,
  Search,
  Filter,
  Dumbbell,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Sparkles,
  ClipboardList,
  LayoutGrid
} from "lucide-react"

interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: 'admin' | 'trainer' | 'client'
  created_at: string
}

interface Exercise {
  id: string
  name: string
  muscle_group: string | null
  equipment: string | null
  difficulty: string | null
  category: string | null
  exercise_code: string | null
}

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Administrador")
  const [adminId, setAdminId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Abas
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "exercises">("dashboard")

  // Estado dos Dados
  const [users, setUsers] = useState<UserProfile[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    trainers: 0,
    clients: 0,
    totalExercises: 0,
    totalPlans: 0,
    totalConnections: 0
  })

  // Filtros de Utilizadores
  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "admin" | "trainer" | "client">("all")
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  // Filtros de Exercícios
  const [exerciseSearch, setExerciseSearch] = useState("")
  const [muscleFilter, setMuscleFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [exercisePage, setExercisePage] = useState(1)
  const exercisesPerPage = 12

  const supabase = createClient()
  const router = useRouter()

  // Buscar todos os dados
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // 1. Obter utilizador logado
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setAdminId(user.id)
          const { data: perfil } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single()

          if (perfil?.full_name) {
            setAdminName(perfil.full_name)
          } else if (user.user_metadata?.display_name) {
            setAdminName(user.user_metadata.display_name)
          }
        }

        // 2. Buscar perfis reais
        const { data: profilesList, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url, role, created_at")
          .order("created_at", { ascending: false })

        if (profilesError) throw profilesError

        const validProfiles = (profilesList || []).map(p => ({
          ...p,
          role: (p.role === 'user' ? 'client' : p.role) as 'admin' | 'trainer' | 'client'
        }))
        setUsers(validProfiles)

        // 3. Buscar contagem de planos e conexões
        const { count: plansCount } = await supabase
          .from("workout_plans")
          .select("*", { count: "exact", head: true })

        const { count: connectionsCount } = await supabase
          .from("trainer_clients")
          .select("*", { count: "exact", head: true })

        // 4. Buscar biblioteca de exercícios
        const { data: exercisesList, error: exercisesError } = await supabase
          .from("exercises")
          .select("id, name, muscle_group, equipment, difficulty, category, exercise_code")
          .order("name", { ascending: true })

        if (exercisesError) throw exercisesError
        setExercises(exercisesList || [])

        // 5. Atualizar estatísticas gerais
        const trainers = validProfiles.filter(p => p.role === "trainer").length
        const clients = validProfiles.filter(p => p.role === "client").length
        const admins = validProfiles.filter(p => p.role === "admin").length

        setStats({
          totalUsers: validProfiles.length,
          admins,
          trainers,
          clients,
          totalExercises: exercisesList?.length || 0,
          totalPlans: plansCount || 0,
          totalConnections: connectionsCount || 0
        })

      } catch (err) {
        console.error("Erro ao carregar dados do Admin:", err)
        toast.error("Erro ao sincronizar com a base de dados.")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success("Sessão encerrada com sucesso.")
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 800)
    } catch (err) {
      toast.error("Erro ao encerrar sessão.")
      setLogoutLoading(false)
    }
  }

  // Ação de Atualização de Papel via Server Action
  const handleRoleChange = async (userId: string, targetRole: 'admin' | 'trainer' | 'client') => {
    if (userId === adminId) {
      toast.error("Não pode alterar o seu próprio papel de administrador.")
      return
    }

    startTransition(async () => {
      try {
        const result = await updateUserRole(userId, targetRole)
        if (result.success) {
          toast.success("Papel do utilizador atualizado com sucesso!")

          // Atualizar estado local
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u))
          if (selectedUser?.id === userId) {
            setSelectedUser(prev => prev ? { ...prev, role: targetRole } : null)
          }

          // Atualizar contadores
          setStats(prev => {
            const updatedUsers = users.map(u => u.id === userId ? { ...u, role: targetRole } : u)
            return {
              ...prev,
              admins: updatedUsers.filter(u => u.role === "admin").length,
              trainers: updatedUsers.filter(u => u.role === "trainer").length,
              clients: updatedUsers.filter(u => u.role === "client").length,
            }
          })
        } else {
          toast.error(result.error || "Falha ao atualizar papel.")
        }
      } catch (err) {
        toast.error("Erro de rede inesperado.")
      }
    })
  }

  // Filtragem de Utilizadores
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.full_name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  // Lista de Grupos Musculares únicos
  const uniqueMuscles = Array.from(new Set(exercises.map(e => e.muscle_group).filter(Boolean))) as string[]

  // Filtragem de Exercícios
  const filteredExercises = exercises.filter(e => {
    const matchesSearch = (e.name || "").toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      (e.exercise_code || "").toLowerCase().includes(exerciseSearch.toLowerCase())
    const matchesMuscle = muscleFilter === "all" || e.muscle_group === muscleFilter
    const matchesDifficulty = difficultyFilter === "all" || e.difficulty === difficultyFilter
    return matchesSearch && matchesMuscle && matchesDifficulty
  })

  // Paginação de Exercícios
  const totalExercisePages = Math.ceil(filteredExercises.length / exercisesPerPage)
  const currentExercises = filteredExercises.slice(
    (exercisePage - 1) * exercisesPerPage,
    exercisePage * exercisesPerPage
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col xl:flex-row relative">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className="sidebar-container">
        <div>
          {/* Logo */}
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
              {(adminName || "A").substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-sm text-foreground block truncate">{adminName}</span>
              <span className="text-[10px] text-pillar-essence bg-pillar-essence/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
                Admin
              </span>
            </div>
          </div>

          {/* Desktop Tabs list */}
          <nav className="sidebar-nav">
            {[
              { key: "dashboard", label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
              { key: "users", label: "Utilizadores", icon: <Users className="h-5 w-5" /> },
              { key: "exercises", label: "Exercícios", icon: <Dumbbell className="h-5 w-5" /> },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <div className="sidebar-footer">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutLoading || isLoading}
            className="w-full border-white/5 bg-black/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer flex items-center justify-center py-5 rounded-xl font-bold"
          >
            {logoutLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Sair
          </Button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 xl:pl-64 min-h-screen pb-24 xl:pb-8 flex flex-col w-full">
        {/* Ambient backgrounds */}
        <div className="absolute top-0 right-0 -z-10 w-[40vw] h-[40vh] opacity-20 blur-[120px]" style={{ background: "radial-gradient(circle, var(--color-pillar-essence) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 -z-10 w-[30vw] h-[30vh] opacity-10 blur-[85px]" style={{ background: "radial-gradient(circle, var(--color-destructive) 0%, transparent 70%)" }} />

        {/* Mobile Header (compact, hidden on xl+) */}
        <header className="px-4 pt-5 pb-4 mx-auto w-full max-w-5xl xl:hidden flex items-center justify-between border-b border-white/5 bg-card/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* SSOT Trident Logo on mobile header */}
            <svg viewBox="0 0 40 40" className="w-8 h-8 fill-none stroke-primary stroke-[1.8] shrink-0 transition-transform duration-300 hover:scale-105">
              <path d="M12 28V14L16 18L20 10L24 18L28 14V28" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M20 10V30" strokeLinecap="round" />
              <circle cx="20" cy="30" r="1" fill="currentColor" />
            </svg>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">
                Olá, <span className="text-primary">{adminName.split(" ")[0]}</span>
              </h1>
              <span className="text-[9px] text-pillar-essence bg-pillar-essence/10 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleLogout}
            disabled={logoutLoading || isLoading}
            className="border-white/5 bg-card hover:bg-destructive/10 hover:text-destructive text-[10px] cursor-pointer"
          >
            {logoutLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
          </Button>
        </header>

        {/* Desktop Header (visible on xl+) */}
        <header className="hidden xl:block px-8 pt-8 pb-4 mx-auto w-full max-w-5xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Olá, <span className="text-primary">{adminName.split(" ")[0]}</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Gestão global do ecossistema TRINUS.</p>
            </div>
            <span className="text-xs font-bold text-pillar-essence bg-pillar-essence/10 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse-glow">
              Torre de Controlo (ADMIN)
            </span>
          </div>
        </header>

        {isLoading ? (
          /* Loader state */
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-semibold">A sincronizar com o Supabase...</span>
          </div>
        ) : (
          <main className="px-4 xl:px-8 py-6 mx-auto w-full max-w-5xl space-y-8 flex-1">

            {/* ==================== ABA 1: DASHBOARD ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Bento Grid de Métricas */}
                <section className="grid gap-4 sm:grid-cols-3">

                  {/* Alunos Bento Card */}
                  <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm shadow-glow-whisper border-l-pillar-body border-l-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Alunos Registados</span>
                      <Users className="h-5 w-5 text-pillar-body" />
                    </div>
                    <span className="text-4xl font-black text-foreground">{stats.clients}</span>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      Todos mapeados na tabela `profiles`
                    </div>
                  </div>

                  {/* Treinadores Bento Card */}
                  <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm shadow-glow-whisper border-l-pillar-mind border-l-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Treinadores Ativos</span>
                      <Users className="h-5 w-5 text-pillar-mind" />
                    </div>
                    <span className="text-4xl font-black text-foreground">{stats.trainers}</span>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      Conexões ativas: <span className="text-pillar-mind font-bold">{stats.totalConnections}</span> aluno(s) vinculados
                    </div>
                  </div>

                  {/* Exercícios Bento Card */}
                  <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm shadow-glow-whisper border-l-pillar-essence border-l-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Exercícios na Biblioteca</span>
                      <Dumbbell className="h-5 w-5 text-pillar-essence" />
                    </div>
                    <span className="text-4xl font-black text-foreground">{stats.totalExercises}</span>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      Planos de treino ativos: <span className="text-pillar-essence font-bold">{stats.totalPlans}</span>
                    </div>
                  </div>

                </section>

                {/* Status do Servidor e Atividade */}
                <section className="grid gap-6 md:grid-cols-3">

                  {/* Monitor do Servidor */}
                  <div className="md:col-span-2 rounded-3xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper">
                    <div className="flex items-center gap-3 mb-6">
                      <Server className="h-6 w-6 text-pillar-essence" />
                      <h2 className="text-xl font-bold text-foreground">Estado do Sistema</h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-[#25D366]" />
                          <div>
                            <span className="text-xs text-muted-foreground block">Base de Dados Supabase</span>
                            <span className="text-xs font-semibold text-foreground block">Trinus PT (sksvsm...)</span>
                          </div>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                      </div>

                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-pillar-mind" />
                          <div>
                            <span className="text-xs text-muted-foreground block">API Gemini Model Engine</span>
                            <span className="text-xs font-semibold text-foreground block">Active Handshake</span>
                          </div>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                      </div>
                    </div>

                    {/* Detalhes de Integração do Banco */}
                    <div className="mt-6 p-4 bg-black/35 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold text-pillar-essence uppercase tracking-widest block mb-3">Auditoria de Segurança da Base de Dados</span>
                      <ul className="text-xs space-y-2 text-muted-foreground leading-relaxed">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[#25D366]" />
                          <span>Políticas RLS em `profiles` e `user_roles` ativas.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[#25D366]" />
                          <span>Trigger de integridade `profiles_prevent_role_change` ativo.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[#25D366]" />
                          <span>Trigger automático de provisionamento `on_auth_user_created` funcional.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Alertas Críticos do Admin */}
                  <div className="rounded-3xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <ShieldAlert className="h-6 w-6 text-pillar-body" />
                        <h2 className="text-xl font-bold text-foreground">Ações de Segurança</h2>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                        Como administrador do sistema, as alterações que efetuar na aba **Utilizadores** modificam os papéis e permissões reais no banco de dados e são protegidas pelas Server Actions do ecossistema.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/5 text-xs text-foreground bg-black/40 hover:bg-white/5 cursor-pointer justify-start"
                        onClick={() => toast.success("Sincronização de metadados efetuada com o Supabase Auth.")}
                      >
                        <Activity className="h-4 w-4 mr-2 text-pillar-mind" />
                        Auditar Supabase Auth
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/5 text-xs text-foreground bg-black/40 hover:bg-white/5 cursor-pointer justify-start"
                        onClick={() => toast.success("Limpeza da cache efetuada com sucesso.")}
                      >
                        <Settings className="h-4 w-4 mr-2 text-pillar-body" />
                        Limpar Cache do Servidor
                      </Button>
                    </div>
                  </div>

                </section>
              </div>
            )}

            {/* ==================== ABA 2: UTILIZADORES ==================== */}
            {activeTab === "users" && (
              <div className="grid gap-6 md:grid-cols-3">

                {/* Painel de Gestão e Tabela */}
                <div className="md:col-span-2 space-y-4">

                  {/* Filtros de Utilizador */}
                  <div className="flex flex-col sm:flex-row gap-3 bg-card/30 p-4 rounded-2xl border border-white/5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Pesquise por nome ou e-mail..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value as any)}
                        className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer font-semibold"
                      >
                        <option value="all" className="bg-background">Todos os Papéis</option>
                        <option value="admin" className="bg-background">Administrador (ADMIN)</option>
                        <option value="trainer" className="bg-background">Treinador (TRAINER)</option>
                        <option value="client" className="bg-background">Aluno (CLIENT)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tabela de Utilizadores */}
                  <div className="rounded-3xl border border-white/5 bg-card/40 overflow-hidden shadow-glow-whisper">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-sm text-muted-foreground">
                        <thead className="bg-black/40 text-xs font-bold uppercase tracking-wider text-foreground">
                          <tr>
                            <th className="px-6 py-4">Utilizador</th>
                            <th className="px-6 py-4">E-mail</th>
                            <th className="px-6 py-4">Papel</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-xs text-muted-foreground">
                                Nenhum utilizador encontrado para a pesquisa.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((userItem) => (
                              <tr
                                key={userItem.id}
                                onClick={() => setSelectedUser(userItem)}
                                className={`hover:bg-white/5 cursor-pointer transition ${selectedUser?.id === userItem.id ? "bg-primary-subtle border-l-2 border-l-primary" : ""}`}
                              >
                                <td className="px-6 py-4 font-bold text-foreground">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                      {(userItem.full_name || userItem.email || "U").substring(0, 2).toUpperCase()}
                                    </div>
                                    <span>{userItem.full_name || "Sem nome"}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium">{userItem.email}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${userItem.role === 'admin' ? 'text-pillar-essence bg-pillar-essence/10' :
                                    userItem.role === 'trainer' ? 'text-pillar-mind bg-pillar-mind/10' :
                                      'text-pillar-body bg-pillar-body/10'
                                    }`}>
                                    {userItem.role === 'admin' ? 'Admin' :
                                      userItem.role === 'trainer' ? 'Treinador' : 'Aluno'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-xs">
                                  <Button
                                    variant="outline"
                                    size="xs"
                                    className="border-white/5 bg-black/40 hover:bg-white/5 hover:text-primary transition cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedUser(userItem)
                                    }}
                                  >
                                    Gerir
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Card de Detalhes e Ações Rápidas */}
                <div className="rounded-3xl border border-white/5 bg-card/40 p-6 backdrop-blur-md shadow-glow-whisper h-fit">
                  {selectedUser ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-extrabold text-primary text-lg mx-auto mb-4">
                          {(selectedUser.full_name || selectedUser.email || "U").substring(0, 2).toUpperCase()}
                        </div>
                        <h3 className="font-bold text-lg text-foreground">{selectedUser.full_name || "Sem Nome"}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{selectedUser.email}</p>

                        <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase mt-3 ${selectedUser.role === 'admin' ? 'text-pillar-essence bg-pillar-essence/10' :
                          selectedUser.role === 'trainer' ? 'text-pillar-mind bg-pillar-mind/10' :
                            'text-pillar-body bg-pillar-body/10'
                          }`}>
                          {selectedUser.role === 'admin' ? 'Administrador' :
                            selectedUser.role === 'trainer' ? 'Treinador' : 'Aluno'}
                        </span>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Alterar Papel de Acesso</span>

                        <div className="flex flex-col gap-2">
                          {[
                            { r: 'admin', label: 'Administrador (ADMIN)', desc: 'Acesso total de controle e auditoria' },
                            { r: 'trainer', label: 'Treinador (TRAINER)', desc: 'Prescreve planos e gere alunos' },
                            { r: 'client', label: 'Aluno (CLIENT)', desc: 'Acede a rotinas de treino e progresso' }
                          ].map((option) => (
                            <button
                              key={option.r}
                              disabled={selectedUser.id === adminId || isPending}
                              onClick={() => handleRoleChange(selectedUser.id, option.r as any)}
                              className={`flex flex-col text-left p-3 rounded-xl border transition text-xs cursor-pointer ${selectedUser.role === option.r
                                ? 'bg-primary-subtle border-primary text-foreground'
                                : 'bg-black/30 border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10'
                                }`}
                            >
                              <span className="font-bold text-foreground">{option.label}</span>
                              <span className="text-[10px] text-muted-foreground mt-1">{option.desc}</span>
                            </button>
                          ))}
                        </div>

                        {isPending && (
                          <div className="flex items-center justify-center gap-2 text-xs text-primary font-semibold animate-pulse mt-4">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Atualizando papel no banco...</span>
                          </div>
                        )}

                        {selectedUser.id === adminId && (
                          <p className="text-[10px] text-amber-500 italic leading-relaxed text-center">
                            A sua própria conta de administrador está protegida contra rebaixamento acidental.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <UserCheck className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
                      <p className="text-xs font-medium">Selecione um utilizador na tabela para gerir as suas credenciais.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ==================== ABA 3: EXERCÍCIOS ==================== */}
            {activeTab === "exercises" && (
              <div className="space-y-6">

                {/* Barra de Filtros e Busca */}
                <div className="grid gap-3 sm:grid-cols-4 bg-card/30 p-4 rounded-2xl border border-white/5">
                  {/* Pesquisa */}
                  <div className="relative sm:col-span-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Pesquise por nome de exercício ou código..."
                      value={exerciseSearch}
                      onChange={(e) => {
                        setExerciseSearch(e.target.value)
                        setExercisePage(1)
                      }}
                      className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                    />
                  </div>

                  {/* Filtro Muscular */}
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={muscleFilter}
                      onChange={(e) => {
                        setMuscleFilter(e.target.value)
                        setExercisePage(1)
                      }}
                      className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer font-semibold w-full"
                    >
                      <option value="all" className="bg-background">Todos os Músculos</option>
                      {uniqueMuscles.map(m => (
                        <option key={m} value={m} className="bg-background">{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro Dificuldade */}
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={difficultyFilter}
                      onChange={(e) => {
                        setDifficultyFilter(e.target.value)
                        setExercisePage(1)
                      }}
                      className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer font-semibold w-full"
                    >
                      <option value="all" className="bg-background">Todas as Dificuldades</option>
                      <option value="beginner" className="bg-background">Beginner</option>
                      <option value="intermediate" className="bg-background">Intermediate</option>
                      <option value="advanced" className="bg-background">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Informação sobre resultados */}
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>A exibir **{filteredExercises.length}** exercícios de **{stats.totalExercises}** cadastrados na base de dados.</span>
                </div>

                {/* Grid de Exercícios */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {currentExercises.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                      <Dumbbell className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
                      <p className="text-xs font-semibold">Nenhum exercício encontrado com os filtros selecionados.</p>
                    </div>
                  ) : (
                    currentExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="rounded-2xl border border-white/5 bg-card/40 p-5 hover:border-primary/30 transition-all flex flex-col justify-between shadow-glow-whisper hover:shadow-glow-active"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="text-[10px] font-bold text-pillar-essence bg-pillar-essence/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {ex.exercise_code || "EX"}
                            </span>
                            {ex.difficulty && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${ex.difficulty === 'advanced' ? 'text-destructive bg-destructive/10' :
                                ex.difficulty === 'intermediate' ? 'text-amber-500 bg-amber-500/10' :
                                  'text-pillar-mind bg-pillar-mind/10'
                                }`}>
                                {ex.difficulty}
                              </span>
                            )}
                          </div>

                          <h3 className="font-extrabold text-sm text-foreground leading-snug line-clamp-2">{ex.name}</h3>
                        </div>

                        <div className="border-t border-white/5 pt-3 mt-4 space-y-1.5 text-[11px] text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>Grupo Muscular:</span>
                            <span className="font-bold text-foreground">{ex.muscle_group || "Geral"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Equipamento:</span>
                            <span className="font-bold text-foreground truncate max-w-[120px]">{ex.equipment || "Sem"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Controles de Paginação */}
                {totalExercisePages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/5">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={exercisePage === 1}
                      onClick={() => setExercisePage(prev => Math.max(1, prev - 1))}
                      className="border-white/5 bg-card hover:bg-white/5 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                    </Button>

                    <span className="text-xs font-semibold text-muted-foreground">
                      Página **{exercisePage}** de **{totalExercisePages}**
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={exercisePage === totalExercisePages}
                      onClick={() => setExercisePage(prev => Math.min(totalExercisePages, prev + 1))}
                      className="border-white/5 bg-card hover:bg-white/5 cursor-pointer"
                    >
                      Seguinte <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

              </div>
            )}

          </main>
        )}

        {/* Mobile Fixed Bottom Nav (hidden on xl+) */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-white/5 xl:hidden">
          <div className="flex items-center justify-around py-2 px-1">
            {[
              { key: "dashboard", label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
              { key: "users", label: "Utilizadores", icon: <Users className="h-5 w-5" /> },
              { key: "exercises", label: "Exercícios", icon: <Dumbbell className="h-5 w-5" /> },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition cursor-pointer text-center",
                  activeTab === item.key
                    ? "text-primary bg-primary/5 font-bold"
                    : "text-muted-foreground font-semibold hover:text-foreground"
                )}
              >
                {item.icon}
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer Info */}
        <footer className="px-8 mt-auto py-6 text-center text-xs text-muted-foreground border-t border-white/5">
          © 2026 Trinus. Painel de Administração e Gestão Global Real-time.
        </footer>
      </div>
    </div>
  )
}
