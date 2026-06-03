# 🧰 ECC Toolkit — TRINUS-APP

> Referência **local** dos agentes e skills ECC relevantes para o stack desta app.
> Sobrepõe a tabela genérica de `~/.claude/rules/ecc/common/agents.md` (que lista agentes de
> outras linguagens que não se aplicam aqui).
>
> **Stack:** Next.js App Router · Supabase (PostgreSQL) · Tailwind v4 + CVA · TypeScript · Zod

---

## 🤖 Agentes Recomendados

Localizados em `~/.claude/agents/`. Curados para este projecto.

### Planeamento & Arquitetura
| Agente | Quando usar |
|--------|-------------|
| `planner` | Features complexas, refactoring (já usado na Fase 3.1) |
| `code-architect` | Blueprint de nova feature seguindo padrões existentes |
| `code-explorer` | Mapear uma feature existente antes de a alterar |
| `architect` | Decisões de arquitetura de sistema |

### Revisão de Código (usar APÓS escrever código)
| Agente | Quando usar |
|--------|-------------|
| `typescript-reviewer` | **Padrão do projecto** — toda alteração TS/TSX |
| `code-reviewer` | Qualidade geral, padrões, manutenibilidade |
| `security-reviewer` | ⚠️ **Crítico** — `lib/utils/crypto.ts`, Server Actions, dados de saúde |
| `database-reviewer` | ⚠️ **Supabase** — queries, RLS, schema, migrations |
| `a11y-architect` | Formulários de anamnese/onboarding (WCAG 2.2) |
| `silent-failure-hunter` | Caçar erros engolidos nas Server Actions |
| `performance-optimizer` | Core Web Vitals da landing + dashboards |

### Build, Testes & Manutenção
| Agente | Quando usar |
|--------|-------------|
| `build-error-resolver` | Quando `npm run build` falha |
| `tdd-guide` | ⚠️ **Gap actual: 0% testes** — novas features |
| `e2e-runner` | Fluxos críticos (login, onboarding, check-in) |
| `refactor-cleaner` | Dead code (knip, depcheck, ts-prune) |
| `code-simplifier` | Simplificar código recém-modificado |
| `doc-updater` | Actualizar codemaps e docs |

---

## 🎯 Skills ECC de Alto Valor

Invocar com a Skill tool ou referenciar para padrões aprofundados.

| Skill | Aplicação na TRINUS-APP |
|-------|-------------------------|
| `postgres-patterns` | Otimização de queries, RLS, índices — *based on Supabase best practices* |
| `security-review` | Checklist para auth, secrets, encriptação de dados sensíveis |
| `frontend-patterns` | Padrões React/Next, state management, performance |
| `frontend-design-direction` | Reforça anti-template na landing cinematográfica |
| `motion-ui` | Sistema de motion React/Next — **Fase 4 (GSAP pendente)** |
| `e2e-testing` | Playwright POM, CI/CD, gestão de flaky tests |
| `database-migrations` | Schema changes zero-downtime no Supabase |
| `api-design` | Padrões REST para as Server Actions / endpoints |

---

## ⭐ Skills instaladas para esta app (2026-06-01)

Copiadas selectivamente do repo-fonte ECC para `.claude/skills/ecc/` — invocáveis via Skill tool.

| Skill | Uso directo na TRINUS-APP |
|-------|---------------------------|
| `design-system` | Auditar SSOT, consistência visual, PRs de styling (cores/tipografia/botões) |
| `healthcare-emr-patterns` | Entrada de dados clínicos acessível — anamnese, histórico de saúde |
| `healthcare-cdss-patterns` | Scoring clínico — o **PAR-Q** é um screening; severidade de alertas |
| `accessibility` | WCAG 2.2 AA — formulários de anamnese e onboarding |
| `click-path-audit` | Rastrear botões com estado partilhado (debugging de login/check-in) |
| `nextjs-turbopack` | Next.js 16+ — velocidade de dev, Turbopack vs webpack |
| `ios-icon-gen` | Geração de ícones PWA |
| `browser-qa` | Verificação visual/UI pós-deploy (gap de testes) |

> **Mecanismo:** skills usam *progressive disclosure* — só `name`+`description` no índice; o corpo
> carrega quando a skill é disparada. Instalá-las não pesa no contexto por comando.

---

## 📋 Gaps Prioritários (estado actual)

1. **🔴 Testes: 0%** — viola a rule de 80% mínimo. Começar com `tdd-guide` + `e2e-testing` nos fluxos críticos.
2. **🟠 Segurança não auditada** — `crypto.ts` + Server Actions de saúde nunca passaram por `security-reviewer`.
3. **🟡 RLS/Supabase sem revisão** — correr `database-reviewer` sobre as policies.
4. **🟡 `any` implícitos** — correr `typescript-reviewer` sobre `lib/actions/`.

---

*Criado: 2026-06-01 · Curadoria local sobre o ECC global*
