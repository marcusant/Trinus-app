# 📝 Task Plan - TRINUS-APP

## 🎯 Objetivo Geral
Construir a plataforma TRINUS-APP (Next.js App Router + Supabase) com Landing Page cinematográfica, painéis seguros (Client, Trainer, Admin), Onboarding progressivo gamificado, e encriptação Zero-Knowledge.

---

## 📋 Checklist de Fases

### 🟢 Fase 0: Inicialização ✅
- [x] Criar estrutura de memória (`task_plan.md`, `findings.md`, `progress.md`)
- [x] Criar `gemini.md` (Constituição)
- [x] Definir Regra de Landing Page (`Landing_page.md`)
- [x] Responder Perguntas de Descoberta (Via mapeamento do `pt-app`)

### 🏛️ Fase 1: Visão (Parcial)
- [ ] Definir JSON Data Schema em `gemini.md`
- [x] Inicializar projeto Vite + React + Tailwind + GSAP
- [ ] Configurar Tailwind e Design System

### ⚡ Fase 2: Link
- [x] Validar `.env` e conexões de API
- [x] Scripts de handshake em `tools/` (criados scripts de provisionamento de usuários e diagnóstico de banco em `scripts/`)

### ⚙️ Fase 3: Arquitetura
- [ ] Criar POPs em `architecture/`
- [ ] Implementar lógica determinística em `tools/`
- [ ] Otimizar Fronteiras de SSR Híbrido (SSR para painéis protegidos, SSG para Landing Page)
- [ ] Estruturar Internacionalização (i18n) para suporte multi-idiomas (PT, EN, ES)

### 🔥 Fase 3.1: Refatoração Arquitetural — Decomposição de God Files
> **Contexto:** Auditoria de 30/05/2026 identificou 3 ficheiros monolíticos que concentram ~50% do código lógico.
> **Referência completa:** Artefato `system_architecture_report.md`

#### P0 — Limpeza de Dead Code (~5 min)
- [x] Eliminar `components/forms/AnamneseForm.tsx` (0 linhas — vazio)
- [x] Eliminar `components/forms/AlunoForm.tsx` (0 linhas — vazio)

#### P1 — Decompor `app/trainer/page.tsx` (2079 → ~150 linhas) (~3h)
- [x] Criar pasta `app/trainer/_types/trainer.types.ts` — extrair ~15 interfaces
- [x] Criar `app/trainer/_hooks/useTrainerDashboard.ts` — extrair ~20 useState + useEffect
- [x] Criar `app/trainer/_components/TrainerSidebar.tsx` — extrair sidebar desktop + mobile header
- [x] Criar `app/trainer/_components/TrainerHeader.tsx` — extrair header desktop
- [x] Criar `app/trainer/_components/DashboardTab.tsx` — extrair aba Dashboard (stats + bento grid)
- [x] Criar `app/trainer/_components/AlunosTab.tsx` — extrair aba Alunos (listagem + detalhes)
- [x] Criar `app/trainer/_components/CriarPlanoTab.tsx` — extrair aba Criar Plano
- [x] Criar `app/trainer/_components/PlanoCustomTab.tsx` — extrair aba Plano Personalizado
- [x] Criar `app/trainer/_components/AvaliacoesTab.tsx` — extrair aba Avaliações
- [x] Criar `app/trainer/_components/AnamneseViewTab.tsx` — extrair aba Anamnese
- [x] Refatorar `app/trainer/page.tsx` como orquestrador puro (~150 linhas)
- [x] Validar compilação (`npm run build`) após refatoração do Trainer

#### P2 — Decompor `app/client/page.tsx` (1653 → ~150 linhas) (~3h)
- [x] Criar pasta `app/client/_types/client.types.ts` — extrair ~12 interfaces
- [x] Criar `app/client/_hooks/useClientDashboard.ts` — extrair ~18 useState + useEffect + lógica XP
- [x] Criar `app/client/_components/ClientSidebar.tsx` — extrair sidebar desktop + mobile header
- [x] Criar `app/client/_components/ClientHeader.tsx` — extrair header desktop
- [x] Criar `app/client/_components/DashboardTab.tsx` — extrair aba Visão Geral (bento + XP + streak)
- [x] Criar `app/client/_components/TreinosTab.tsx` — extrair aba Treinos (timer + sessões)
- [x] Criar `app/client/_components/ProgressoTab.tsx` — extrair aba Progresso (gráficos + check-in)
- [x] Criar `app/client/_components/PerfilTab.tsx` — extrair aba Perfil
- [x] Criar `app/client/_components/WorkoutTimer.tsx` — extrair componente de cronómetro
- [x] Criar `app/client/_components/AnamneseProgressivaWidget.tsx` — extrair widget de perguntas progressivas
- [x] Refatorar `app/client/page.tsx` como orquestrador puro (~264 linhas)
- [x] Validar compilação (`npm run build`) após refatoração do Client

#### P3 — Modularizar `AnamneseFormWizard.tsx` (1260 → ~300 linhas) (~2h)
- [x] Criar `components/forms/anamnese/types.ts` — extrair AnamneseData + Props
- [x] Criar `components/forms/anamnese/constants.ts` — extrair ~12 arrays de constantes
- [x] Criar `components/forms/anamnese/primitives/ChipSelector.tsx` — extrair sub-componente
- [x] Criar `components/forms/anamnese/primitives/SliderInput.tsx` — extrair sub-componente
- [x] Criar `components/forms/anamnese/primitives/BooleanToggle.tsx` — extrair sub-componente
- [x] Criar `components/forms/anamnese/steps/StepHistorico.tsx` — extrair step 1
- [x] Criar `components/forms/anamnese/steps/StepMedidas.tsx` — extrair step 2
- [x] Criar `components/forms/anamnese/steps/StepSaude.tsx` — extrair step 3
- [x] Criar `components/forms/anamnese/steps/StepRotina.tsx` — extrair step 4
- [x] Criar `components/forms/anamnese/steps/StepAlimentacao.tsx` — extrair step 5
- [x] Criar `components/forms/anamnese/steps/StepPreferencias.tsx` — extrair step 6
- [x] Criar `components/forms/anamnese/steps/StepMotivacao.tsx` — extrair step 7
- [x] Refatorar `AnamneseFormWizard.tsx` como orquestrador (~340 linhas)
- [x] Corrigir cores hardcoded (`#c8a96e`, `rgba(...)`) para usar variáveis CSS do SSOT e Tailwind v4 tokens
- [x] Validar compilação (`npm run build`) após modularização do Wizard

#### P4 — Extrair Constantes e Tipos Residuais (~30 min)
- [x] Mover constantes inline de dados (arrays de opções) para `constants/` e `_constants/` locais
- [x] Consolidar interfaces dispersas em `types/` e `_types/` de cada módulo

#### P5 — Preparação Futura: `app/admin/page.tsx` (862 linhas)
- [x] Monitorizar — analisado e mantido sob observação (atualmente saudável abaixo de 1000 linhas)

---

### ✨ Fase 4: Estilo
- [ ] Implementar Landing Page Cinematográfica (App.jsx)
- [ ] Refinar animações GSAP
- [ ] Implementar Marquee CSS Ultra-Suave (Ticker infinito por GPU)
- [ ] Desenvolver Suporte Completo a Light/Dark Mode
- [ ] Implementar Sistema de Breakpoints e Responsividade Mobile-First
  - [ ] Criar ficheiro centralizado de variáveis/tokens de breakpoints
  - [ ] Adaptar a sidebar existente (colapsável em mobile, visível em desktop)
  - [ ] Adaptar containers principais e bento grids
  - [ ] Integrar diretrizes: touch targets (min 44px), safe areas iOS, inputs min 16px, tipografia fluida com clamp(), imagens responsivas

### 🚀 Fase 5: Gatilho
- [ ] Implementar Schema Markup (JSON-LD) completo para SEO (Pendente até domínio próprio)
- [ ] Implementar Banner de Consentimento de Cookies RGPD
- [ ] Deploy e Automação
- [ ] Documentação final
