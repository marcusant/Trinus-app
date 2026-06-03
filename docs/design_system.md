# 🎨 Design System — Regra de Fonte Única da Verdade

## Princípio
> "Altere em um lugar → muda em toda a app."

Nenhum componente deve conter cores, tamanhos ou estilos hardcoded.
Tudo flui de cima para baixo:

```
tailwind.config.ts   →  Fontes e tipografia fluida
        ↓
app/globals.css      →  @theme (tokens de cor, sombras, raios, animações)
        ↓
components/ui/       →  Componentes com CVA (variantes semânticas)
        ↓
Componentes JSX      →  Usam apenas classes semânticas (zero hex, zero amber-*)
```

---

## Stack: Tailwind v4 + CSS @theme

O projeto usa **Tailwind CSS v4** com tokens nativos declarados via `@theme` em `app/globals.css`.
O `tailwind.config.ts` apenas estende fontes e tipografia fluida — **não define cores**.

### Regra de Ouro
```tsx
/* ❌ PROIBIDO — hex hardcoded */
<div className="text-[#9e57c8]">

/* ❌ PROIBIDO — named color do Tailwind */
<div className="text-purple-500 bg-amber-500">

/* ✅ CORRETO — token semântico */
<div className="text-primary bg-mood-1">

/* ✅ CORRETO — CSS variable via style prop (quando não existe classe utilitária) */
<div style={{ color: "var(--color-mood-3)" }}>
```

---

## 🔑 Tokens Principais — `app/globals.css` (@theme)

### Superfícies
| Token                | Classe Tailwind       | Uso                          |
|----------------------|-----------------------|------------------------------|
| `--color-background` | `bg-background`       | Fundo geral da app           |
| `--color-foreground` | `text-foreground`     | Texto principal              |
| `--color-card`       | `bg-card`             | Cards e painéis              |
| `--color-muted`      | `bg-muted`            | Áreas secundárias            |
| `--color-muted-foreground` | `text-muted-foreground` | Texto de apoio         |

### Marca — Fonte única do roxo
> **Regra:** todo o roxo da app deriva de `--brand-purple` (= a barra de urgência do topo da landing).
> Mudar `--brand-purple` no `globals.css` → muda **todos** os roxos da app de uma só vez.

| Token                  | Valor / Deriva de         | Uso                                |
|------------------------|---------------------------|------------------------------------|
| `--brand-purple`       | `#715FDB` (periwinkle)    | 🎯 **Fonte única** — a barra do topo |
| `--brand-purple-rgb`   | `113, 95, 219`            | Base de alphas e sombras           |
| `--brand-purple-soft`  | `#8d7ce6`                 | Tom mais claro — accent / hover    |
| `--color-primary`      | → `var(--brand-purple)`   | `bg-primary` — botões, ícones CTA  |
| `--color-accent`       | → `var(--brand-purple-soft)` | `bg-accent` — destaques         |
| `--color-urgency-bar`  | → `var(--brand-purple)`   | Barra de urgência                  |
| `--color-ring`, `--color-sidebar-primary`, `--color-chart-1`, `--color-pillar-essence` | → `var(--brand-purple)` | Ring, sidebar, gráficos, pilar Essência |

### Pilares (3 colunas da app)
| Token                    | Classe Tailwind        | Pilar         |
|--------------------------|------------------------|---------------|
| `--color-pillar-body`    | `text-pillar-body`     | Corpo (laranja) |
| `--color-pillar-mind`    | `text-pillar-mind`     | Mente (verde)  |
| `--color-pillar-essence` | `text-pillar-essence`  | Essência (violeta) |

### Semânticas
| Token                  | Classe Tailwind     | Uso                   |
|------------------------|---------------------|-----------------------|
| `--color-destructive`  | `bg-destructive`    | Erros, ações perigosas |
| `--color-success`      | `bg-success`        | Confirmações           |
| `--color-warning`      | `bg-warning`        | Alertas                |

### Humor (Mood Selector)
| Token             | Uso              |
|-------------------|------------------|
| `--color-mood-1`  | Difícil  (vermelho) |
| `--color-mood-2`  | Neutro   (âmbar)    |
| `--color-mood-3`  | Bom      (verde)    |
| `--color-mood-4`  | Ótimo    (azul)     |
| `--color-mood-5`  | Incrível (violeta)  |

### Chama de Sequência (Streak)
| Token                  | Uso                    |
|------------------------|------------------------|
| `--color-flame-cold`   | 0 dias (cinza frio)    |
| `--color-flame-low`    | 1-2 dias (cinza claro) |
| `--color-flame-warm`   | 3-6 dias (âmbar)       |
| `--color-flame-hot`    | 7-13 dias (laranja)    |
| `--color-flame-max`    | 14+ dias (vermelho)    |

### Gamificação — Níveis
| Variável CSS        | Nível    |
|---------------------|----------|
| `--level-bronze`    | Bronze   |
| `--level-silver`    | Prata    |
| `--level-gold`      | Ouro     |
| `--level-platinum`  | Platina  |
| `--level-diamond`   | Diamante |

---

## 🧩 Botões — `components/ui/button.tsx` (CVA)

**Único lugar para alterar estilos de botão.** Usa `class-variance-authority`.

| Variante           | Uso                                        |
|--------------------|--------------------------------------------|
| `default`          | Botão padrão com primary                   |
| `primary`          | Com shadow-glow — CTA principal            |
| `landing-primary`  | CTA da landing (gradiente âmbar)           |
| `landing-secondary`| Botão outline da landing                   |
| `destructive`      | Ações destrutivas                          |
| `outline`          | Bordas visíveis                            |
| `ghost`            | Sem fundo                                  |
| `link`             | Estilo âncora                              |

```tsx
/* ❌ PROIBIDO */
<button className="bg-violet-600 text-white px-8 py-4 rounded-xl">

/* ✅ CORRETO */
<Button variant="primary" size="lg">Começar</Button>
```

---

## 📐 Utilitários Globais — `app/globals.css` (@layer utilities)

| Classe             | Uso                                        |
|--------------------|--------------------------------------------|
| `.text-hero`       | Título hero responsivo (clamp)             |
| `.text-h2`         | Título de secção                           |
| `.text-eyebrow`    | Label pequeno acima do título              |
| `.section-padding` | Padding padrão de secção (`px-5 py-20`)    |
| `.shadow-glow`     | Brilho violeta em cards/botões             |
| `.shadow-glow-whisper` | Brilho sutil                          |
| `.animate-flame`   | Animação de chama (streak ativo)           |

---

## 🔄 Fluxo de Alteração

**Mudar a cor de destaque de toda a app:**
1. Abrir `app/globals.css`
2. Alterar `--color-primary: oklch(...)` dentro do bloco `@theme`
3. Guardar → toda a app atualiza automaticamente

**Mudar o estilo de todos os botões:**
1. Abrir `components/ui/button.tsx`
2. Editar a variante correspondente no CVA
3. Guardar → todos os botões da app mudam

**Adicionar novo token de cor:**
1. Declarar em `@theme` no `app/globals.css`
2. O Tailwind v4 gera automaticamente `bg-*`, `text-*`, `border-*`
3. Usar a classe utilitária no componente

**Adicionar cor que só existe em style prop (ex: via `color-mix`):**
1. Declarar a variável CSS em `@theme` ou na secção de variáveis correspondente
2. Referenciar via `style={{ color: "var(--minha-variavel)" }}`

---

*Atualizado: 2026-06-01*
*Stack: Next.js App Router + Tailwind CSS v4 + CVA*
*Paleta: Preto Absoluto + Violeta Místico + 3 Pilares*
