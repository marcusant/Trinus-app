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
- [x] Ajustar escala tipográfica e acessibilidade de fontes globalmente em todos os painéis, sidebars e parâmetros de treinos (Sets, Reps, Carga, Descanso) - Aluno, Treinador, Administrador (Hevy/Trainerize & SSOT Standard)
- [x] Substituição, tintagem dinâmica e calibração de logotipos e Navbar (Estilo Voss Academy com logo em #A082FF e barra de urgência de 36px em #715FDB, com wrapper em max-w-1200px e posicionamento cirúrgico de precisão)
- [x] Efeito de Scroll com Tridente 100% Estático e Letras Dissolvidas (sub-pixel perfect immobile alignment na Navbar e scroll falso no scroll)
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
- [/] Documentação final
  - [x] Documentar todas as perguntas e etapas da Anamnese em `docs/anamnese_questions.md` para análise do usuário.
  - [x] Implementar obrigatoriedade e validação dinâmica dos campos de Saúde (lesões, dores), Alimentação (alergias, objetivo nutricional) e Motivação (motivação principal) no wizard e atualizar a documentação.

### 🔒 Fase 6: Segurança & Base de Dados (Auditoria 01/06/2026)
> Auditoria via agentes `security-reviewer` + `database-reviewer`. Detalhe completo em `findings.md`.

#### 🔴 CRITICAL — Código (corrigível no repo) ✅ CONCLUÍDO (02/06)
- [x] C-1: Removido fallback de chave hardcoded em `crypto.ts`; `getKey()` lazy valida `ENCRYPTION_KEY` (mín. 32 chars) e lança sem fallback; adicionado a `.env.example`
- [x] C-2: Decifração GCM agora LANÇA em falha de autenticação (testado: adulteração → erro). Mantida tolerância só a texto não-encriptado
- [x] C-3/C-6: `assertOwnsPlan()` valida `trainer_id` em `updateCustomWorkoutPlan` e `deleteWorkoutPlan` (admin tem acesso total)
- [x] C-5: `completeAssessment` filtra por `trainer_id` (exceto admin) e devolve erro se não autorizado
- [x] Verificado: `npx tsc --noEmit` limpo, `npm run build` OK, teste runtime de cripto passou

#### 🔴 CRITICAL — Supabase (auditado via MCP 02/06) ✅ RESOLVIDO (falso alarme)
- [x] Auditado `pg_class.relrowsecurity` via MCP: **todas as 18 tabelas `public` têm RLS ativa** com políticas restritivas (posse via `auth.uid()`, `is_trainer_of`, `has_role`). O "anon LÊ" do diagnóstico anon era tabela vazia, não RLS desligada.
- [x] `profiles`, `progressive_anamnese`, `user_roles`, `trainer_clients`, `meals` — confirmadas protegidas (políticas inspecionadas, nenhuma `USING (true)`).
- [x] `workout_plans`, `assessments`, `workout_sessions`, `check_ins` — RLS ativa via `is_trainer_of`.
- [x] **Hardening aplicado** (migração `harden_security_definer_function_grants`): revogado EXECUTE por `anon` em 6 funções `SECURITY DEFINER` + por `authenticated` nas 3 de trigger. Advisors de segurança: 13 → 5 lints.
- [ ] **Config Auth (não-SQL) — AÇÃO MANUAL DO UTILIZADOR:** Ativar Leaked Password Protection no Dashboard → Auth → Password Security (verifica passwords contra HaveIBeenPwned).

#### 🟠 HIGH
- [x] H-5: ✅ `submitProgressiveAnamnese` valida `key` (allowlist 10 chaves) + tamanho; XP fixo no servidor (10, ignora cliente). `submitCheckIn` valida ranges via Zod (peso 20-400, mood/energy 1-5, data). `logWorkoutSession` valida duração (1s-24h). Mensagens de erro do Postgres já não vazam ao cliente (M-3 parcial)
- [x] L-2: ✅ Sanitizado `next` redirect no login (só caminhos internos)
- [x] H-1: Schema divergente RESOLVIDO — `types/database.ts` **regenerado via MCP** com o schema EN real (18 tabelas, enums `app_role`/`assessment_status`/`meal_type`/`plan_status`/`workout_status`, funções). `project_id` corrigido `pt-app`→`trinus-app`. Generic `<Database>` pronto mas ainda **não ligado** aos clientes (ligar surfaçou bug do wizard — ver abaixo). Tipos servem já como SSOT correto.
- [ ] **🐞 NOVO (ALTA):** `AnamneseFormWizard.tsx` grava em tabelas inexistentes (`anamnese`/`perfil_utilizador`) → form de anamnese completa falha em runtime. Decidir persistência EN (tabela `anamnese` nova ou `profiles.metadata`). Detalhe em `findings.md`.
- [x] H-2: `getAlertasAdmin` (`lib/queries/alertas-admin.ts`) era código morto (0 consumidores; o painel admin usa botões mock) e referenciava 4 tabelas PT inexistentes. **Ficheiro removido** (02/06)
- [ ] H-3: `handleDemoLogin` — gated por `NODE_ENV==='development'` (eliminado do bundle de produção). Baixa prioridade; remover/mover para seed server-side antes de partilhar a app
- [ ] H-4: Registo de `full_name` em claro — exposição transitória (onboarding re-encripta logo a seguir; `decrypt` agora tolera plaintext sem crashar). Precisa converter registo client-side em Server Action encriptada
- [ ] H-6: Batch insert em `insertDaysAndExercises` (N+1: 45+ queries/plano) — performance, não segurança
- [x] Verificado: `tsc --noEmit` limpo + `npm run build` OK

#### 🟡 MEDIUM / 🔵 LOW
- [x] Não expor `error.message` do Postgres ao cliente — corrigido em `admin.ts` (2), `client.ts`, `trainer/assessments.ts`, `trainer/workout-plans.ts`, `trainer/dashboard.ts` (4). Detalhe logado via `console.error` no servidor; cliente recebe mensagem genérica. `onboarding.ts` mantém mensagem de validação Zod (user-facing, seguro). Build + tsc OK (02/06)
- [ ] CHECK constraint no `role`; índices em FKs (perfil_id, trainer_id, etc.); views com `security_invoker=true`; validar ranges de `mood`/`energy`/`weight`; sanitizar `next` redirect

---

### 🏋️ Fase 7: Registo de Treino estilo Hevy (Workout Logging + Resumo) (02/06/2026)
> **Contexto:** Replicar a experiência de registo de treino do HEVY no painel do Aluno (`app/client`), a partir de 5 screenshots de referência. Inclui reordenação de colunas, colunas ANTERIOR + PSE, cronómetro de descanso, e ecrã de resumo pós-treino.
> **DB live afetada:** projeto `sksvsmofgomovpmkfchq` (2 migrações aditivas).

#### P1 — Base de Dados (migrações aplicadas na DB live) ✅
- [x] `add_rpe_to_session_series` — coluna `rpe numeric(3,1)` nullable em `session_series` (escala PSE/RPE 6.0–10.0). Ficheiro: `supabase/migrations/20260602164916_add_rpe_to_session_series.sql`
- [x] `add_title_notes_to_workout_sessions` — colunas `title text` + `notes text` nullable em `workout_sessions`. Ficheiro: `supabase/migrations/20260602170000_add_title_notes_to_workout_sessions.sql`
- [x] `types/database.ts` editado à mão (o script `types:sync` aponta para o projeto inativo `ptvvzdheedtuwfpzlrhg`) para incluir `rpe`, `title`, `notes`

#### P2 — Reordenação de colunas da prescrição (read-only) ✅
- [x] Preview da prescrição reordenado de `Séries · Reps · Desc · Carga` → **`Série · Kg · Reps · Desc`** em `TreinosTab.tsx`

#### P3 — Modo de registo ativo (estilo Hevy) ✅
- [x] Colunas durante o treino: `SÉRIE · ANTERIOR · KG · REPS · PSE · ✓`
- [x] **Coluna ANTERIOR:** carrega a `session_series` mais recente por exercício (`useClientData.ts`) e mostra `20kg×10` por série (protegida por RLS)
- [x] **Coluna PSE:** botão por série que abre a folha de seleção de RPE
- [x] Barra de estatísticas em direto: `Duração · Volume (Σ kg×reps) · Séries` (componente `WorkoutStats`)

#### P4 — Folha de PSE/RPE (bottom sheet) ✅
- [x] Componente `PseSheet.tsx` — escala `6 · 7 · 7.5 · 8 · 8.5 · 9 · 9.5 · 10`, valor grande + descrição do esforço, botão **Feito**
- [x] `useWorkoutLogger.ts` — `SetEntry.rpe`, ação `setRpe`, e `buildPayload` inclui `rpe`
- [x] `client.ts` — validação `clampRpe` (snap a 6–10, passos de 0.5) ao persistir

#### P5 — Cronómetro de descanso (contagem decrescente) ✅
- [x] Hook `useRestTimer.ts` — `startRest`, `addRestTime` (±15s), `skipRest`, tick e toast ao terminar
- [x] Componente `RestTimerBar.tsx` — barra ancorada ao fundo com `-15s / +15s / Pular` e barra de progresso
- [x] Auto-inicia ao concluir uma série (usa `rest_seconds` do exercício); tocável manualmente no rótulo "Descanso"

#### P6 — Ecrã de resumo pós-treino (estilo Hevy) ✅
- [x] Componente `WorkoutSummary.tsx` — ecrã inteiro com top bar (← descartar · "Guardar treino" · **Salvar**)
- [x] Título editável (pré-preenchido com nome do dia), estatísticas, campo "Quando" (data/hora pt-PT)
- [x] Placeholder "Adicionar foto/vídeo" (UI apenas — upload adiado, decisão do utilizador)
- [x] Campo de descrição (`notes`) e "Descartar Treino" (com confirmação)
- [x] Opções HEVY não-aplicáveis (Visibilidade / Sincronizar Apple Health/Strava / Config. Rotina) **omitidas** por decisão do utilizador
- [x] Fluxo refatorado em `useWorkoutTimer.ts`: `handleFinishWorkout` (abre resumo, sem persistir) → `handleSaveWorkout` (persiste com title/notes) / `handleDiscardWorkout`
- [x] `logWorkoutSessionWithSets` aceita `summary { title, notes }` com sanitização (trim, limites 120/2000 chars)

#### P7 — Validação ✅
- [x] `npx tsc --noEmit` limpo (2 ciclos)
- [x] `/client` compila no dev server (307 → login; sem 500)
- [ ] ⚠️ **Verificação interativa pendente:** o fluxo clicável (registar séries, PSE, descanso, resumo) não foi testado por exigir login com plano ativo. Requer credenciais de teste.
- [ ] 🔜 **Follow-up:** upload real de foto/vídeo (bucket Supabase Storage + `photo_url`); corrigir `package.json` `types:sync` (`ptvvzdheedtuwfpzlrhg` → `sksvsmofgomovpmkfchq`)
