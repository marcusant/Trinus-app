"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ShieldAlert, Sparkles, User, Dumbbell } from "lucide-react"

// Schemas de validação Zod
const loginSchema = z.object({
  email: z.string().email("Insira um endereço de e-mail válido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
})

const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Insira um endereço de e-mail válido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

function LoginContent() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const nextRedirect = searchParams.get("next") ?? "/"
  const urlError = searchParams.get("error")

  useEffect(() => {
    if (urlError === "unauthorized") {
      toast.error("Não tem permissão para aceder a esta área.", {
        description: "Inicie sessão com a conta correspondente.",
      })
    } else if (urlError === "auth_callback_failed") {
      toast.error("A autenticação falhou.", {
        description: "Tente novamente ou contacte o suporte.",
      })
    }
  }, [urlError])

  // Form de Login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  // Form de Registo
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", password: "" },
  })

  // Submissão do Login
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error("Erro ao entrar", { description: "Credenciais inválidas ou utilizador inexistente." })
      } else {
        toast.success("Sessão iniciada com sucesso!")

        let targetDest = nextRedirect
        if (nextRedirect === "/") {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: perfil } = await supabase
              .from("profiles")
              .select("role, full_name")
              .eq("id", user.id)
              .single()

            const role = perfil?.role || "client"
            const onboardingCompleto = !!perfil?.full_name

            if (role === "admin") {
              targetDest = "/admin"
            } else if (role === "trainer") {
              targetDest = "/trainer"
            } else {
              targetDest = onboardingCompleto ? "/client" : "/onboarding"
            }
          }
        }

        // Forçar um pequeno delay para persistência de cookies
        setTimeout(() => {
          router.push(targetDest)
          router.refresh()
        }, 800)
      }
    } catch (err) {
      toast.error("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Submissão do Registo (Onboarding exemplo/mock)
  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // 1. Criar o utilizador no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.nome,
          }
        }
      })

      if (signUpError) {
        toast.error("Erro ao registar", { description: signUpError.message })
        return
      }

      const user = authData.user
      if (user) {
        // 2. Criar perfil inicial nas tabelas 'profiles' e 'user_roles'
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            full_name: data.nome,
            email: data.email,
            role: "client",
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError)
        }

        const { error: roleError } = await supabase
          .from("user_roles")
          .upsert({
            user_id: user.id,
            role: "client",
          }, {
            onConflict: "user_id"
          })

        if (roleError) {
          console.error("Erro ao criar user role:", roleError)
        }

        toast.success("Conta criada! A iniciar onboarding...", {
          description: "Confirme também a sua caixa de e-mail se necessário.",
        })

        // Redirecionar para o onboarding de exemplo
        setTimeout(() => {
          router.push("/onboarding")
          router.refresh()
        }, 1200)
      }
    } catch (err) {
      toast.error("Ocorreu um erro inesperado no registo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Super robusto Demo Login Bypass & Auto-provisioning
  const handleDemoLogin = async (role: "admin" | "trainer" | "client") => {
    const email = `${role}@trinus.com`
    const password = "trinus123"
    const name = role === "admin" ? "Marcus (Admin)" : role === "trainer" ? "Marcus (Treinador)" : "Marcus (Cliente)"
    const dbRole = role

    setDemoLoading(role)
    try {
      // 1. Tentar fazer login diretamente
      const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // 2. Se falhar por utilizador não encontrado, tentar criar
        toast.info("A provisionar conta de demonstração...", { description: `Criando perfil do tipo ${role.toUpperCase()}` })

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          toast.error("Erro ao provisionar conta demo", { description: signUpError.message })
          return
        }

        const newUser = signUpData.user
        if (newUser) {
          // 3. Inserir o perfil correspondente na base de dados
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: newUser.id,
              full_name: name,
              email,
              role: dbRole,
              updated_at: new Date().toISOString(),
            })

          if (profileError) {
            toast.error("Erro ao provisionar perfil", { description: profileError.message })
            return
          }

          const { error: roleError } = await supabase
            .from("user_roles")
            .upsert({
              user_id: newUser.id,
              role: dbRole,
            }, {
              onConflict: "user_id"
            })

          if (roleError) {
            toast.error("Erro ao provisionar user role", { description: roleError.message })
            return
          }

          // 4. Iniciar sessão agora com a conta criada
          await supabase.auth.signInWithPassword({ email, password })
        }
      } else {
        // Se a conta já existe, garantir que a role na tabela profiles e user_roles está sincronizada
        const user = loginData.user
        if (user) {
          await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              full_name: name,
              email,
              role: dbRole,
              updated_at: new Date().toISOString(),
            })

          await supabase
            .from("user_roles")
            .upsert({
              user_id: user.id,
              role: dbRole,
            }, {
              onConflict: "user_id"
            })
        }
      }

      toast.success(`Acedido como ${name}! Redirecionando...`)
      setTimeout(() => {
        const dest = role === "admin" ? "/admin" : role === "trainer" ? "/trainer" : "/client"
        router.push(dest)
        router.refresh()
      }, 1000)

    } catch (err) {
      toast.error("Ocorreu um erro no provisionamento de demonstração.")
    } finally {
      setDemoLoading(null)
    }
  }

  return (
    <AuthCard
      title={activeTab === "login" ? "Iniciar Sessão" : "Criar Conta"}
      description={activeTab === "login" ? "Aceda ao seu painel de treino integrado." : "Comece a sua transformação hoje mesmo."}
      footer={
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {activeTab === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              onClick={() => {
                setActiveTab(activeTab === "login" ? "register" : "login")
                loginForm.reset()
                registerForm.reset()
              }}
              className="font-semibold text-primary underline decoration-primary/30 hover:text-accent cursor-pointer transition-colors"
            >
              {activeTab === "login" ? "Registe-se aqui" : "Inicie sessão aqui"}
            </button>
          </p>

          {/* PAINEL DE DEMONSTRAÇÃO - Estética bento dark mística - Apenas visível em ambiente local de desenvolvimento */}
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-xl border border-primary/20 bg-primary-subtle p-4 text-left shadow-glow-whisper">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Painel de Acesso Rápido (Demonstração)</span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                Clique num botão para provisionar e simular imediatamente qualquer um dos 3 níveis de acesso da aplicação:
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-black/60 hover:bg-primary/10 border-white/5 text-xs text-foreground cursor-pointer"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={demoLoading !== null || isLoading}
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-pillar-essence" />
                    Administrador (ADMIN)
                  </span>
                  {demoLoading === "admin" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <span className="text-[10px] text-pillar-essence bg-pillar-essence/10 px-2 py-0.5 rounded-full font-semibold">Bypass</span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-black/60 hover:bg-primary/10 border-white/5 text-xs text-foreground cursor-pointer"
                  onClick={() => handleDemoLogin("trainer")}
                  disabled={demoLoading !== null || isLoading}
                >
                  <span className="flex items-center gap-2">
                    <Dumbbell className="h-3.5 w-3.5 text-pillar-mind" />
                    Treinador (TRAINER)
                  </span>
                  {demoLoading === "trainer" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <span className="text-[10px] text-pillar-mind bg-pillar-mind/10 px-2 py-0.5 rounded-full font-semibold">Bypass</span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-black/60 hover:bg-primary/10 border-white/5 text-xs text-foreground cursor-pointer"
                  onClick={() => handleDemoLogin("client")}
                  disabled={demoLoading !== null || isLoading}
                >
                  <span className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-pillar-body" />
                    Aluno/Cliente (CLIENT)
                  </span>
                  {demoLoading === "client" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <span className="text-[10px] text-pillar-body bg-pillar-body/10 px-2 py-0.5 rounded-full font-semibold">Bypass</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      }
    >
      {activeTab === "login" ? (
        /* FORMULÁRIO DE LOGIN */
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="exemplo@email.com"
              disabled={isLoading || demoLoading !== null}
              {...loginForm.register("email")}
              aria-invalid={!!loginForm.formState.errors.email}
            />
            {loginForm.formState.errors.email && (
              <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Palavra-passe</Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                onClick={() => toast.info("Funcionalidade de recuperação em desenvolvimento.")}
              >
                Esqueceu-se?
              </button>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading || demoLoading !== null}
              {...loginForm.register("password")}
              aria-invalid={!!loginForm.formState.errors.password}
            />
            {loginForm.formState.errors.password && (
              <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6 cursor-pointer"
            disabled={isLoading || demoLoading !== null}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A entrar...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      ) : (
        /* FORMULÁRIO DE REGISTO */
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Nome Completo</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="O seu nome"
              disabled={isLoading || demoLoading !== null}
              {...registerForm.register("nome")}
              aria-invalid={!!registerForm.formState.errors.nome}
            />
            {registerForm.formState.errors.nome && (
              <p className="text-xs text-destructive">{registerForm.formState.errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">E-mail</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="exemplo@email.com"
              disabled={isLoading || demoLoading !== null}
              {...registerForm.register("email")}
              aria-invalid={!!registerForm.formState.errors.email}
            />
            {registerForm.formState.errors.email && (
              <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Palavra-passe</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading || demoLoading !== null}
              {...registerForm.register("password")}
              aria-invalid={!!registerForm.formState.errors.password}
            />
            {registerForm.formState.errors.password && (
              <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6 cursor-pointer"
            disabled={isLoading || demoLoading !== null}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A registar...
              </>
            ) : (
              "Criar Conta & Iniciar"
            )}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10 relative">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "var(--gradient-hero-ambient)" }} />
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm font-semibold">Carregando formulário...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
