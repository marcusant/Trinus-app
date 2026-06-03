# 📜 gemini.md — Constituição do Projeto TRINUS-APP

## ⚖️ Regras Comportamentais
- Atuar como Piloto do Sistema.
- Priorizar confiabilidade sobre velocidade.
- Nunca adivinhar lógica de negócios.
- Antes de qualquer implementação: ler `design_system.md` e respeitar o SSOT.

## 🏗️ Invariantes Arquiteturais
- Seguir arquitetura de 3 camadas A.N.T. (Architecture, Navigation, Tools).
- Lógica de negócios determinística.
- Lógica sensível (XP, streaks, encriptação) → Server Actions em `lib/actions/`.
- Zero lógica de negócios em componentes de UI.
- Componentes de UI devem ser puramente apresentacionais.

## 🗺️ Stack e Estrutura

| Camada       | Tecnologia                              |
|--------------|-----------------------------------------|
| Framework    | Next.js 15 App Router                   |
| Banco        | Supabase (PostgreSQL + Auth + Storage)  |
| Estilo       | Tailwind CSS v4 + CVA                   |
| Componentes  | Radix UI (primitivos acessíveis)        |
| Validação    | Zod                                     |
| Criptografia | AES-256-GCM (lib/utils/crypto.ts)       |

## 🛠️ Esquemas de Dados Principais

### Perfil do Utilizador (Supabase: `profiles`)
```ts
{
  id: uuid
  role: "client" | "trainer" | "admin"
  full_name: string
  trainer_id: uuid | null
  xp: number
  streak: number
  best_streak: number
  onboarding_completed: boolean
  par_q_cleared: boolean      // Questionário de aptidão física
  encrypted_profile: string   // AES-256-GCM
}
```

### Sistema de XP (Gamificação)
```ts
// Ganhos de XP por ação
const XP_GAINS = {
  treino_completo:     50,
  checkin_humor:       10,
  checkin_peso_semanal: 30,
  meta_semanal:        50,
  anamnese_resposta:   10,
}

// Patentes (níveis)
const RANKS = [
  { name: "Bronze",   min: 0,    max: 999   },
  { name: "Prata",    min: 1000, max: 2499  },
  { name: "Ouro",     min: 2500, max: 4499  },
  { name: "Platina",  min: 4500, max: 6999  },
  { name: "Diamante", min: 7000, max: Infinity },
]
```

### Streaks (Consistência)
- Tolerância de **3 dias** entre treinos (não pune descanso ativo)
- Reinicia ao ultrapassar 3 dias sem registo

## 🎨 Design System
> Ver `docs/design_system.md` para referência completa.

- **Paleta:** Preto Absoluto `#0a0a0c` + Roxo da Marca `--brand-purple: #715FDB` (a barra de urgência do topo é a fonte única do roxo; todos os roxos derivam dela)
- **SSOT:** `app/globals.css` (@theme Tailwind v4)
- **Botões:** `components/ui/button.tsx` (CVA)
- **Regra:** Zero hex hardcoded em JSX. Zero named colors do Tailwind (amber-*, red-*, etc.).

## 🧰 Ferramentas ECC
> Ver `docs/ecc_toolkit.md` para os agentes e skills ECC curados para este stack.

## 🔒 Segurança
- Dados sensíveis de saúde → cifrados com AES-256-GCM antes de gravar no Supabase.
- Decifração apenas em memória de servidor (Server Actions).
- Nunca expor dados decifrados ao cliente.

## 🛠️ Log de Manutenção
- 2026-05-12: Inicializado via Protocolo 0.
- 2026-05-31: Refatoração de God Files (Trainer, Client, AnamneseFormWizard).
- 2026-06-01: Auditoria de SSOT — corrigidas cores hardcoded em mood-selector e streak-card. Adicionados tokens `--color-mood-*` e `--color-flame-*`. Design system doc atualizado para Tailwind v4.
