# 🔍 Findings — TRINUS-APP

## 📌 Pesquisas e Descobertas

### Design e UX
- Extraído conteúdo da Landing Page original do `pt-app`.
- Mapeado Design System para **Preto Absoluto + Violeta Místico** (evolução do Preset B — Midnight Luxe).
- Navegação horizontal esticada no PC degrada a usabilidade em ecrãs largos; a barra lateral fixa (Sidebar) esquerda resolve a proporção visual e melhora a UX desktop.
- Modal flutuante global centralizado resolve problemas de quebras de layout causadas por formulários de check-in inline que expandem e empurram outros elementos.

### Auditoria de SSOT — 2026-06-01
- `mood-selector.tsx` usava classes hardcoded (`text-red-500`, `bg-amber-500/10`, etc.) fora do design system. **Corrigido:** substituído por tokens `--color-mood-{1-5}` via `color-mix()`.
- `streak-card.tsx` função `getFlameColor()` retornava classes Tailwind hardcoded. **Corrigido:** `getFlameColorVar()` retorna `var(--color-flame-*)`.
- `LandingHero.tsx` usava `bg-black` hardcoded. **Corrigido:** `bg-background`.
- `design_system.md` referenciava `tailwind.config.js` e `src/index.css` (stack antiga). **Corrigido:** atualizado para Tailwind v4 + `app/globals.css` + CVA.

### Arquitetura
- Auditoria de 30/05/2026 identificou 3 God Files (Trainer: 2079 linhas, Client: 1653 linhas, AnamneseFormWizard: 1260 linhas) — todos decompostos com sucesso na Fase 3.1.

### Auditoria de Segurança & BD — 2026-06-01
Via agentes `security-reviewer` + `database-reviewer`. Resumo dos achados:

**CRITICAL (código):**
- `crypto.ts`: chave hardcoded com fallback inseguro (`trinus_default_dev...`); fallback silencioso na decifração GCM devolve dados em claro/cifra em vez de falhar → anula integridade AES-256-GCM.
- IDOR: `updateCustomWorkoutPlan`, `deleteWorkoutPlan`, `completeAssessment` não verificam ownership (`trainer_id`). Qualquer trainer mexe nos dados de outro.

**CRITICAL (Supabase):** RLS não verificável (sem migrations locais). Tabelas de dados clínicos (`perfil_utilizador`, `anamnese`, `medicoes` com `fotos_urls`) potencialmente sem isolamento entre utilizadores.

**HIGH:**
- **Schema divergente**: `types/database.ts` tem tabelas em PT (`perfil_utilizador`, `anamnese`) mas `lib/actions/` usa tabelas em EN (`profiles`, `workout_plans`). Dois schemas paralelos — tipos desatualizados ou desalinhados com o remoto.
- `getAlertasAdmin` não valida `is_admin()`; `handleDemoLogin` com credenciais hardcoded (`trinus123`) cria contas admin/trainer via anon key; `xp` controlável pelo cliente em `submitProgressiveAnamnese`; N+1 (45+ queries) na criação de planos.

> Plano de correção rastreado em `task_plan.md` Fase 6.

### Auditoria via Supabase MCP — 2026-06-02 (RLS confirmada + advisors)
Com acesso MCP ao projeto `sksvsmofgomovpmkfchq`, auditoria definitiva do remoto:

- **RLS afinal CORRETA (falso alarme):** TODAS as 18 tabelas `public` têm RLS ativa com políticas restritivas escopadas por `auth.uid()` (posse), relação trainer-cliente (`trainer_clients`/`is_trainer_of`) ou role admin (`has_role`). Nenhuma `USING (true)`. O diagnóstico anterior via anon key (`scripts/diagnose-schema.js`) não distinguia "RLS ativa + tabela vazia" de "RLS desligada" → o "anon LÊ rows=0" era tabela vazia, não falha de RLS. `profiles`, `progressive_anamnese` (dados clínicos), `user_roles`, `trainer_clients`, `meals` — todas protegidas.
- **CORRIGIDO — `SECURITY DEFINER` expostas via RPC:** advisor reportou 6 funções executáveis por `anon`. Migração `harden_security_definer_function_grants`: revogado EXECUTE de `anon`/`public` nos helpers de política (`is_trainer_of`, `has_role`, `can_access_meal_plan`, `can_access_workout_plan`) mantendo `authenticated`; revogado de `anon`+`authenticated`+`public` nas funções de trigger (`handle_new_user`, `prevent_profile_role_change`, `rls_auto_enable`). Advisors: 13 → 5 lints.
- **WARNs remanescentes (aceitáveis):** 4 helpers continuam executáveis por `authenticated` — **necessário**, pois as políticas RLS avaliam-nas no contexto do utilizador autenticado e são `SECURITY DEFINER` para evitar recursão de RLS. Não removíveis sem quebrar o RLS.
- **PENDENTE (config Auth, não-SQL):** `leaked_password_protection` desativado — ativar no Dashboard → Auth → Password Security (verifica contra HaveIBeenPwned).

### 🐞 Bug latente descoberto via tipagem EN (2026-06-02) — ✅ RESOLVIDO
Ao gerar os tipos EN reais (`types/database.ts`) e ligar o generic `<Database>` aos clientes Supabase, o `tsc` revelou:

- **`components/forms/AnamneseFormWizard.tsx` gravava em tabelas INEXISTENTES** (`anamnese` e `perfil_utilizador`, ~45 campos). No schema EN real só existe `progressive_anamnese` (chave/valor) e `profiles.metadata` (JSON encriptado). O formulário de Anamnese Completa falhava silenciosamente ao gravar no banco ativo. Mesma classe de bug que o ex-`getAlertasAdmin`.

**Resolução (2026-06-02):**
- **Decisão de persistência:** serializar para `profiles.metadata` sob a chave `anamnese_completa` (opção b). Motivos: o wizard ainda não está montado em nenhuma página (feature latente), não há caminho de leitura/filtragem do trainer sobre a anamnese completa, e o padrão de dados clínicos de intake já existente (onboarding) serializa JSON encriptado para `profiles.metadata`. Evita migração + RLS nova e mantém os dados clínicos encriptados em repouso.
- **Nova server action `lib/actions/anamnese.ts` → `saveAnamneseCompleta(perfilId, data)`:** persistência movida para o servidor (a `ENCRYPTION_KEY` é server-only, o browser client não podia encriptar). Encripta os leafs string via `encryptObject` (AES-256-GCM), faz **merge não-destrutivo** com o metadata existente (preserva onboarding), e autoriza por posse (`user.id === perfilId`), `is_trainer_of` (RPC) ou role admin — defesa em profundidade sobre o RLS de `profiles`.
- **Wizard reescrito:** submit chama a server action (caminho idempotente para criar/editar); removidos os escritas diretas para tabelas-fantasma e a prop `anamneseId` (não usada).
- **Generic `<Database>` ligado** em `lib/supabase/client.ts` e `lib/supabase/server.ts` (`createBrowserClient<Database>` / `createServerClient<Database>`).
- **Mismatches de nulabilidade corrigidos:** `created_at: string | null` (`UserProfile` em `admin/page.tsx`); locais não-nuláveis capturados antes de async em `useClientData.ts` (selectedDayId/selectedMealDayId) e guarda em `useTrainerDashboard.ts` (trainerId); helpers `verifyTrainerOrAdmin` em `trainer/{assessments,dashboard,workout-plans}.ts` convertidos em **união discriminada** (`authenticated: true ⇒ userId: string`); casts de `plan_status` em `workout-plans.ts`.
- **`components/layout/Sidebar.tsx`** (não usado; usa o seu próprio client não-tipado `lib/supabase.ts`) continua a referenciar `perfil_utilizador` — fora do âmbito, não afetado pelo generic, candidato a remoção.
- **Validação:** `npx tsc --noEmit` limpo + `npm run build` verde.

## ⚠️ Restrições e Limitações
- Requer GSAP para as animações cinematográficas da Landing Page (pendente).
- O painel do aluno requer autenticação ativa no Supabase e vinculação correta do treinador na tabela `trainer_clients` para carregar dados reais e evitar estados vazios.
- Decifração AES-256-GCM apenas em memória de servidor — nunca expor ao cliente.
