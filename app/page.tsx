"use client"

/**
 * ⚠️ REGRA DE CAMADA
 * Este arquivo é CAMADA 3 (tela). Proibido:
 *   - Hardcoded oklch/hex/rgb
 *   - box-shadow inline
 *   - border-radius em pixels
 * Tudo deve vir de variáveis CSS (styles.css) ou classes utilitárias.
 */

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { EntrarDropdown } from "@/components/EntrarDropdown"
import { TransparentImage } from "@/components/TransparentImage"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AvatarSeeded as Avatar, AvatarStack } from "@/components/ui/avatar-stack"
import {
  Menu,
  X,
  Check,
  CheckCircle2,
  Flame,
  Lock,
  Shield,
  ShieldCheck,
  Zap,
  ArrowRight,
  Brain,
  Sparkles,
  Dumbbell,
  GraduationCap,
  Briefcase,
  CreditCard,
  Star,
  ChevronDown,
  Clock,
  HelpCircle,
  Leaf,
  User as UserIcon,
} from "lucide-react"

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ============================================================
   PAGE
   ============================================================ */
export default function TrinusLanding() {
  useReveal()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (typeof window === "undefined") return

    const redirectToRecovery = () => {
      const hash = window.location.hash || ""
      const search = window.location.search || ""
      window.location.replace(`/reset-password${search}${hash}`)
    }

    const hash = window.location.hash || ""
    const search = window.location.search || ""
    const isRecoveryHash = hash.includes("type=recovery") || hash.includes("access_token=")
    const hasCode = new URLSearchParams(search).has("code")

    if (isRecoveryHash || hasCode) {
      redirectToRecovery()
      return
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        redirectToRecovery()
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER CONTAINER - Absolute to float over Hero */}
      <div className="absolute top-0 left-0 w-full z-50">
        {/* ============== 1. TOP BAR ============== */}
        <div className="w-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-center py-2 px-4 text-xs sm:text-sm font-semibold tracking-wide relative">
          🔥 Programa agora disponível — <button onClick={() => scrollTo("preco")} className="underline underline-offset-2 cursor-pointer hover:opacity-80 transition">Garanta sua vaga</button>
        </div>

        {/* ============== 2. NAVBAR ============== */}
        <nav
          className={`transition-all duration-300 ${scrolled ? "fixed top-0 left-0 w-full border-b border-white/5 bg-black/40 backdrop-blur-md shadow-glow-whisper" : "bg-transparent"
            }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 cursor-pointer group">
              {/* Símbolo: logo_trinus.png original (fundo removido dinamicamente) */}
              <TransparentImage
                src="/logo_trinus.png"
                alt="TRINUS Logo"
                className="w-8 h-8 object-contain transition-all duration-300 group-hover:scale-105 shrink-0"
                style={{ filter: "hue-rotate(230deg) saturate(2.5) brightness(1.1)" }}
              />
              <div className={`flex items-center transition-all duration-500 overflow-hidden ${scrolled ? "max-w-0 opacity-0 ml-0" : "max-w-[300px] opacity-100 ml-2"}`}>
                {/* Nome: nome_trinus.png original (fundo removido dinamicamente) */}
                <TransparentImage
                  src="/nome_trinus.png"
                  alt="TRINUS"
                  className="h-7 w-auto object-contain shrink-0"
                  style={{ filter: "hue-rotate(230deg) saturate(2.5) brightness(1.1)" }}
                />
              </div>
            </button>

            <div className="hidden items-center gap-8 md:flex">
              {[
                ["Programa", "pilares"],
                ["Pilares", "pilares"],
                ["Depoimentos", "depoimentos"],
                ["Inscrição", "preco"],
              ].map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => scrollTo(id)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {label}
                </button>
              ))}
              <EntrarDropdown />
            </div>

            <button className="md:hidden text-foreground" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-card/98 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-5 py-5">
            <span className="text-xl font-extrabold text-primary">
              TRINUS <span className="font-light text-foreground">MARCUS</span>
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {[
              ["Programa", "pilares"],
              ["Pilares", "pilares"],
              ["Depoimentos", "depoimentos"],
              ["Inscrição", "preco"],
            ].map(([label, id]) => (
              <button key={label} onClick={() => scrollTo(id)} className="text-2xl font-semibold text-foreground cursor-pointer">
                {label}
              </button>
            ))}
            <a
              href="https://aluno.cakto.com.br/auth/login"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-2xl font-semibold text-foreground"
            >
              <UserIcon className="h-6 w-6" />
              Programa
            </a>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-2xl font-semibold text-foreground"
            >
              <UserIcon className="h-6 w-6" />
              Entrar
            </Link>
          </div>
        </div>
      )}

      {/* ============== 3. HERO ============== */}
      <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden bg-black pt-40 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-golden.png"
            alt="Trinus Marcus - Força e Clareza"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:gap-16 px-5 md:grid-cols-2 md:items-center">
          <div className="reveal">
            <span className="inline-block rounded-full bg-transparent border border-primary/40 px-5 py-2 text-eyebrow text-primary">
              Programa de Transformação Integral
            </span>
            <h1 className="mt-6 text-[32px] min-[400px]:text-[36px] sm:text-4xl md:text-hero font-extrabold tracking-tighter leading-[1.1]">
              <span className="whitespace-nowrap">A versão mais completa</span>
              <br />
              <span className="text-primary">de você mesmo.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Um programa que integra treino, mente e autoconhecimento em um único sistema. Não é só fitness. É
              transformação de verdade.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Button variant="landing-primary" size="xl" className="group w-full sm:w-auto rounded-xl" onClick={() => scrollTo("preco")}>
                Quero Começar Agora
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button variant="landing-secondary" size="xl" className="w-full sm:w-auto rounded-xl" onClick={() => scrollTo("pilares")}>
                Conhecer o Programa
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <AvatarStack>
                {[0, 1, 2, 3, 4].map((seed) => (
                  <Avatar key={seed} size="md" ring="subtle" seed={seed} />
                ))}
              </AvatarStack>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="font-bold text-foreground">+350 pessoas</span> em transformação
              </p>
            </div>
          </div>

          {/* Floating cards — desktop only, horizontal scroll on mobile */}
          <div className="relative hidden h-[26rem] md:block">
            {[
              {
                icon: <Dumbbell className="h-6 w-6 text-pillar-body" />,
                title: "Corpo Ativo",
                border: "border-l-pillar-body",
                top: "10%",
                left: "25%",
                rotate: "-4deg",
              },
              {
                icon: <Brain className="h-6 w-6 text-pillar-mind" />,
                title: "Mente Clara",
                border: "border-l-pillar-mind",
                top: "38%",
                left: "45%",
                rotate: "2deg",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-pillar-essence" />,
                title: "Essência Desperta",
                border: "border-l-pillar-essence",
                top: "66%",
                left: "20%",
                rotate: "-2deg",
              },
            ].map((c, i) => (
              <div
                key={i}
                className={`absolute w-auto pr-8 rounded-3xl border border-white/10 bg-card/50 p-5 backdrop-blur-xl ${c.border} border-l-4 shadow-glow-whisper transition-all duration-500 hover:shadow-glow-active hover:-translate-y-2`}
                style={{ top: c.top, left: c.left, transform: `rotate(${c.rotate})` }}
              >
                <div className="flex items-center gap-3">
                  {c.icon}
                  <span className="font-semibold text-foreground whitespace-nowrap">{c.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile pillar cards — stacked grid */}
        <div className="grid grid-cols-1 gap-3 md:hidden px-5 mt-8">
          {[
            { icon: <Dumbbell className="h-5 w-5 text-pillar-body" />, title: "Corpo Ativo", border: "border-l-pillar-body" },
            { icon: <Brain className="h-5 w-5 text-pillar-mind" />, title: "Mente Clara", border: "border-l-pillar-mind" },
            { icon: <Sparkles className="h-5 w-5 text-pillar-essence" />, title: "Essência Desperta", border: "border-l-pillar-essence" },
          ].map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md ${c.border} border-l-4 shadow-card`}
            >
              <div className="flex-shrink-0">{c.icon}</div>
              <span className="font-semibold text-foreground text-sm">{c.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============== 4. FRASE DE IMPACTO ============== */}
      <section className="border-y border-secondary/20 section-padding">
        <div className="mx-auto max-w-3xl text-center reveal">
          <div className="mx-auto mb-8 h-[3px] w-10 rounded-full bg-primary" />
          <p className="text-[17px] min-[400px]:text-[19px] sm:text-2xl md:text-3xl font-semibold leading-snug text-foreground whitespace-nowrap lg:whitespace-normal">
            Corpo forte. Mente clara. <span className="text-primary">Essência desperta.</span>
          </p>
          <p className="mt-6 text-[12px] min-[400px]:text-[13px] sm:text-sm font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            Três pilares. Uma transformação que não volta atrás.
          </p>
        </div>
      </section>

      {/* ============== 5. OS 3 PILARES ============== */}
      <section id="pilares" className="section-padding">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-4xl text-center reveal">
            <h2 className="text-h2 font-bold">O Programa</h2>
            <p className="mt-5 text-sm min-[400px]:text-base sm:text-lg text-muted-foreground leading-relaxed">
              <span className="block sm:inline whitespace-nowrap">Cada pilar foi desenhado para se integrar aos outros.</span>
              <span className="block sm:inline"> O resultado é maior que a soma das partes.</span>
            </p>
          </div>

          <div className="mt-16 grid gap-7 md:grid-cols-3">
            {[
              {
                num: "01",
                label: "CORPO",
                title: "Corpo Ativo",
                sub: "Mover bem. Nutrir melhor.",
                icon: <Dumbbell className="h-5 w-5 text-pillar-body" />,
                text: "Treinar não é castigo. É o investimento com o maior retorno que você pode fazer em si mesmo. Movimento funcional para a vida real, alimentação consciente e longevidade de verdade.",
                border: "border-l-pillar-body",
                numColor: "text-pillar-body",
                labelColor: "text-pillar-body",
                underlineColor: "bg-pillar-body",
              },
              {
                num: "02",
                label: "MENTE",
                title: "Mente Clara",
                sub: "Pensar com ordem. Agir com consistência.",
                icon: <Brain className="h-5 w-5 text-pillar-mind" />,
                text: "Motivação tem prazo de validade. Sistemas, não. Aqui você constrói uma arquitetura de foco, hábitos e disciplina que funciona mesmo nos dias em que você não quer.",
                border: "border-l-pillar-mind",
                numColor: "text-pillar-mind",
                labelColor: "text-pillar-mind",
                underlineColor: "bg-pillar-mind",
              },
              {
                num: "03",
                label: "ESSÊNCIA",
                title: "Essência Desperta",
                sub: "Conhecer-se. Encontrar direção.",
                icon: <Sparkles className="h-5 w-5 text-pillar-essence" />,
                text: "Você pode ter o shape perfeito e a rotina milimétrica. Se não sabe quem é e pra onde vai, está correndo na esteira da vida sem sair do lugar. Autoconhecimento é o pilar que dá sentido aos outros dois.",
                border: "border-l-pillar-essence",
                numColor: "text-pillar-essence",
                labelColor: "text-pillar-essence",
                underlineColor: "bg-pillar-essence",
              },
            ].map((p) => (
              <article
                key={p.num}
                className={`pilar-card reveal group relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-active ${p.border} border-l-4`}
              >
                {/* Underline animado */}
                <div className={`pilar-underline ${p.underlineColor}`} />

                {/* Número */}
                <div className={`pilar-num text-6xl font-extrabold leading-none ${p.numColor}`}>{p.num}</div>

                {/* Ícone + Label */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="pilar-icon inline-flex">{p.icon}</span>
                  <p className={`pilar-label text-eyebrow ${p.labelColor}`}>
                    {p.label}
                  </p>
                </div>

                <h3 className="mt-2 text-2xl font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{p.sub}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 6. PARA QUEM É / NÃO É ============== */}
      <section className="bg-card section-padding">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <div className="reveal rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur-md shadow-glow-whisper transition-all duration-500 hover:shadow-glow hover:-translate-y-1">
            <h3 className="text-2xl font-semibold text-foreground">Isso é pra você se:</h3>
            <ul className="mt-6 space-y-4">
              {[
                "Sente que treina no piloto automático e não evolui de verdade",
                "Quer um sistema integrado (corpo + mente + essência), não só planilha de treino",
                "Busca longevidade, energia e clareza, não só estética",
                "Está disposto a se comprometer com o processo",
                "Quer mais do que resultado no espelho, quer transformação real",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <span className="text-sm leading-relaxed text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur-md shadow-glow-whisper transition-all duration-500 hover:shadow-glow hover:-translate-y-1">
            <h3 className="text-2xl font-semibold text-foreground">Não é pra você se:</h3>
            <ul className="mt-6 space-y-4">
              {[
                "Procura dieta mágica ou resultado em 7 dias",
                "Quer só estética sem propósito",
                "Não está disposto a olhar pra dentro",
                "Espera que alguém faça o trabalho por você",
                "Procura atalho, não sistema",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <span className="text-sm leading-relaxed text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============== 7. DEPOIMENTOS ============== */}
      <Depoimentos />

      {/* ============== 8. SOBRE O MARCUS ============== */}
      <section className="section-padding">
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-[2fr_3fr] md:items-center">
          <div className="reveal mx-auto w-full max-w-sm">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border-2 border-primary-border bg-gradient-to-br from-card to-background p-1 shadow-glow">
              <img
                src="/marcus.jpg"
                alt="Marcus, criador do programa Trinus Marcus"
                loading="lazy"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
          </div>

          <div className="reveal">
            <p className="text-eyebrow text-primary">Conheça o criador</p>
            <h2 className="mt-3 text-h2 font-bold">Quem é o Marcus?</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Brasileiro, consultor de tecnologia por profissão, Personal Trainer por vocação. O Trinus nasceu da
                fusão entre a disciplina do mundo corporativo e a paixão por desenvolvimento humano completo.
              </p>
              <p>
                Não acredito em separar corpo e mente. Não acredito em treino sem propósito. E não acredito que
                transformação real aconteça sem autoconhecimento.
              </p>
              <p>
                Criei o Trinus porque vi gente demais treinando no automático, mexendo o corpo sem envolver a mente,
                querendo mudança sem mudar por dentro.
              </p>
              <p className="text-foreground">
                Esse programa é o sistema que eu mesmo uso. E que agora compartilho com você.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: <GraduationCap className="h-4 w-4" />, t: "Personal Trainer Certificado" },
                { icon: <Briefcase className="h-4 w-4" />, t: "+10 anos em consultoria tecnológica" },
                { icon: <Brain className="h-4 w-4" />, t: "Estudante contínuo de desenvolvimento humano" },
              ].map((b) => (
                <span
                  key={b.t}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground"
                >
                  <span className="text-primary">{b.icon}</span>
                  {b.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== 9. PREÇO ============== */}
      <section id="preco" className="bg-card section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="text-center reveal flex flex-col items-center">
            <div className="mb-5">
              <span className="flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1 text-xs font-semibold text-[#F97316]">
                <CreditCard className="h-3.5 w-3.5" /> Investimento
              </span>
            </div>
            <h2 className="text-[22px] sm:text-h2 font-bold leading-tight">Seu acesso completo ao Trinus</h2>
          </div>

          <div className="reveal mt-12 rounded-3xl border border-success/60 bg-card p-6 sm:p-10 shadow-glow">

            {/* Caixa de Preço (Top) */}
            <div className="rounded-2xl bg-[#161616] p-8 text-center border border-white/5 shadow-inner">
              <div className="flex justify-center mb-6">
                <span className="flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1 text-xs font-semibold text-[#F97316]">
                  🔥 60% OFF — Por tempo limitado
                </span>
              </div>

              <p className="text-xl font-bold text-muted-foreground line-through decoration-success/50">De R$ 497</p>

              <div className="my-2 flex items-baseline justify-center gap-2 whitespace-nowrap">
                <span className="text-4xl font-bold text-foreground sm:text-5xl">12x</span>
                <span className="text-5xl font-extrabold tracking-tighter text-success sm:text-6xl leading-none">
                  R$ 18,89
                </span>
              </div>

              <p className="text-base text-muted-foreground">
                Ou <strong className="text-foreground">R$ 197</strong> à vista
              </p>
              <p className="mt-4 text-[11px] min-[400px]:text-[13px] sm:text-sm font-semibold text-success text-center whitespace-nowrap">
                Menos de R$ 0,60 por dia para sua transformação
              </p>
            </div>

            {/* O que está incluso */}
            <div className="mt-10">
              <h4 className="text-center text-lg font-bold text-foreground mb-8">O que está incluso:</h4>
              <ul className="space-y-4">
                {[
                  { title: "Módulo Corpo Ativo", desc: "(treinos + alimentação)" },
                  { title: "Módulo Mente Clara", desc: "(hábitos + foco + rotina)" },
                  { title: "Módulo Essência Desperta", desc: "(autoconhecimento + propósito)" },
                  { title: "Comunidade privada de apoio", desc: "" },
                  { title: "Acompanhamento e suporte direto", desc: "" },
                  { title: "Atualizações contínuas do programa", desc: "" },
                  { title: "Bônus: Guia de Respiração e Presença", desc: "" },
                  { title: "Bônus: Template de Rotina Semanal Integrada", desc: "" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-left">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-success" />
                    <div>
                      <span className="text-base font-semibold text-foreground">{item.title}</span>
                      {item.desc && (
                        <span className="block text-sm text-muted-foreground">{item.desc}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botão e Badges */}
            <div className="mt-10">
              <Button variant="landing-primary" size="xl" className="group" fullWidth>
                Garantir Minha Vaga
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="h-[18px] w-[18px] text-success" strokeWidth={1.5} /> Compra segura
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-[18px] w-[18px] text-success" strokeWidth={1.5} /> 7 dias de garantia incondicional.
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-[18px] w-[18px] text-success" strokeWidth={1.5} /> Acesso imediato
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 10. FAQ ============== */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <div className="text-center reveal flex flex-col items-center">
            <div className="mb-6">
              <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-1.5 text-sm font-semibold text-primary">
                <HelpCircle className="h-4 w-4" /> Perguntas Frequentes
              </span>
            </div>
            <h2 className="mt-2 text-[36px] min-[400px]:text-[44px] sm:text-6xl font-extrabold tracking-tighter leading-tight whitespace-nowrap">
              Ainda tem <span className="text-primary">dúvidas?</span>
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {FAQ.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={f.q} className="reveal">
                  <div className={`overflow-hidden rounded-[1.25rem] border transition-all duration-300 ${open ? "border-primary/50 bg-[#121212]" : "border-white/[0.04] bg-[#0c0c0c] hover:bg-[#121212]"
                    }`}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
                    >
                      <span className={`text-base font-medium sm:font-semibold transition-colors duration-300 ${open ? "text-primary" : "text-foreground group-hover:text-primary"
                        }`}>{f.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className="grid transition-all duration-300 ease-out"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============== 11. CTA FINAL ============== */}
      <section
        className="relative overflow-hidden pt-8 pb-24"
        style={{ background: "var(--gradient-cta-section)" }}
      >
        <Leaf
          className="pointer-events-none absolute -right-10 top-10 h-96 w-96 text-primary-faint"
          strokeWidth={1}
        />
        <div className="relative mx-auto max-w-2xl text-center reveal">
          <h2 className="text-lg font-medium text-zinc-400">
            Sem mais dúvidas?
          </h2>

          <Button variant="landing-primary" size="xl" className="mt-6" onClick={() => scrollTo("preco")}>
            Quero Minha Vaga no Trinus
          </Button>


        </div>
      </section>

      {/* ============== 12. FOOTER ============== */}
      <footer className="bg-footer px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-2xl font-extrabold text-primary">
                TRINUS <span className="font-light text-foreground">MARCUS</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Corpo forte. Mente clara. Essência desperta.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { label: "Programa", href: "#pilares" },
                { label: "FAQ", href: "#faq" },
                { label: "Termos", href: "#" },
                { label: "Privacidade", href: "#" },
                { label: "Contato", href: "https://wa.me/5567999919646?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Programa%20Trinus%3F", target: "_blank" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.target || "_self"}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>

          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            © 2026 Trinus Marcus. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp */}
      <a
        href="https://wa.me/5567999919646?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Programa%20Trinus%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 group"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <svg
          className="h-8 w-8 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Tooltip opcional */}
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
          Dúvidas? Fale conosco!
        </span>
      </a>
    </div>
  )
}

/* ============================================================
   DEPOIMENTOS · carrossel infinito
   ============================================================ */
const DEPOIMENTOS = [
  {
    name: "Pedro Henrique",
    age: 42,
    role: "Empresário",
    text: "Entrei pelo treino. Fiquei pelo autoconhecimento. Hoje lidero minha empresa com uma clareza que não tinha.",
    colorToken: "var(--chart-1)",
  },
  {
    name: "Carolina Silva",
    age: 35,
    role: "Professora",
    text: "Pela primeira vez na vida, sinto que minha rotina faz sentido inteira. Corpo, mente, tudo conectado.",
    colorToken: "var(--chart-2)",
  },
  {
    name: "Ricardo Almeida",
    age: 50,
    role: "Engenheiro",
    text: "Achei que aos 50 já era tarde pra mudar. Estou no melhor shape e na melhor fase mental da minha vida.",
    colorToken: "var(--chart-3)",
  },
  {
    name: "Ana Beatriz",
    age: 28,
    role: "Designer",
    text: "O Integra não é um treino. É um sistema operacional pra vida.",
    colorToken: "var(--chart-4)",
  },
  {
    name: "Tomás Ferreira",
    age: 38,
    role: "Médico",
    text: "Como profissional de saúde, reconheço a qualidade técnica. Como aluno, confirmo a transformação.",
    colorToken: "var(--chart-5)",
  },
  {
    name: "Juliana Costa",
    age: 45,
    role: "Gestora",
    text: "Finalmente um programa que respeita minha inteligência. Sem promessa vazia. Só resultado.",
    colorToken: "var(--chart-1)",
  },
]

function Depoimentos() {
  const trackRef = useRef<HTMLDivElement>(null)
  const items = [...DEPOIMENTOS, ...DEPOIMENTOS]

  return (
    <section id="depoimentos" className="overflow-hidden bg-background px-0 section-padding">
      <div className="mx-auto max-w-5xl px-5 text-center reveal">
        <h2 className="text-h2 font-bold">
          Quem vive o Trinus, não volta atrás
        </h2>
      </div>

      <div className="mt-14 overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-7 animate-scroll-x px-5">
          {items.map((d, i) => (
            <article
              key={i}
              className="flex w-80 flex-shrink-0 flex-col rounded-2xl border border-border bg-card p-7"
            >
              <div className="flex items-center gap-4">
                <Avatar size="lg" ring="primary" initials={d.name} colorToken={d.colorToken} />
                <div>
                  <p className="font-semibold text-foreground">
                    {d.name}, {d.age}
                  </p>
                  <p className="text-sm text-muted-foreground">{d.role}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="mt-4 italic leading-relaxed text-muted-foreground">"{d.text}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  {
    q: "Preciso ter experiência com treino?",
    a: "Não. O programa é adaptável ao seu nível. O que importa é disposição pra começar.",
  },
  {
    q: "É só treino físico?",
    a: "Não. O Trinus é um sistema com três pilares: Corpo, Mente e Essência. Treino é um deles, não o único.",
  },
  {
    q: "Quanto tempo por dia preciso dedicar?",
    a: "Entre 30 a 60 minutos. O programa foi pensado pra quem trabalha, tem família e vida real. Nada de rotina de atleta profissional.",
  },
  {
    q: "Funciona pra quem tem mais de 40, 50 anos?",
    a: "Sim. E é onde o programa mais brilha. Longevidade e qualidade de movimento são prioridade, não exceção.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia incondicional. Sem perguntas, sem burocracia. O risco é zero.",
  },
  {
    q: "Como acesso o programa?",
    a: "Imediatamente após a compra, você recebe os dados de acesso na plataforma. Começa na hora.",
  },
  {
    q: "Tem suporte?",
    a: "Sim. Comunidade privada + suporte direto. Você não fica sozinho.",
  },
  {
    q: "É diferente de um plano de treino?",
    a: "Completamente. Plano de treino mexe seu corpo. O Trinus transforma seu sistema de vida.",
  },
]
