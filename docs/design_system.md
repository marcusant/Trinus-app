# 🎨 Design System — Regra de Fonte Única da Verdade

## Princípio
> "Altere em um lugar → muda em toda a app."

Nenhum componente deve conter cores, tamanhos ou estilos hardcoded.
Tudo flui de cima para baixo:

```
tailwind.config.js   →  Tokens (cores, fontes, sombras, bordas)
         ↓
src/index.css        →  Componentes globais (btn-primary, card, badge, section-padding)
         ↓
Componentes JSX      →  Usam apenas classes semânticas (zero hex, zero amber-*)
```

---

## 🔑 tailwind.config.js — Tokens de Design

**Único lugar para alterar cores, fontes, sombras e border-radius.**

| Token        | Uso                                              |
|--------------|--------------------------------------------------|
| `accent`     | Cor de destaque — botões, ícones, links, badges  |
| `primary`    | Cor base escura — hero, footer, cards escuros    |
| `background` | Fundo claro das secções                          |
| `surface`    | Cards sobre fundo escuro                         |
| `muted`      | Textos secundários                               |
| `success`    | Verde — garantia, checks, live indicators        |

**Para mudar a cor de acento de toda a app:**
```js
// tailwind.config.js
accent: "#9e57c8",  // ← muda aqui → muda em TODA a app
```

---

## 🧩 src/index.css — Componentes Globais

**Único lugar para alterar estilo de botões, cards, badges e secções.**

| Classe             | Uso                                      |
|--------------------|------------------------------------------|
| `.btn-primary`     | Botão principal (fundo accent)           |
| `.btn-primary-lg`  | Botão principal grande                   |
| `.btn-secondary`   | Botão secundário (borda branca)          |
| `.btn-outline`     | Botão outline (hover accent)             |
| `.card`            | Card escuro (superfície dark)            |
| `.card-light`      | Card claro (superfície white)            |
| `.badge`           | Badge accent                             |
| `.badge-success`   | Badge verde                              |
| `.section-padding` | Padding padrão de secção (py-24 px-6)    |
| `.section-title`   | Título de secção (4xl-5xl font-black)    |
| `.section-subtitle`| Subtítulo de secção (muted, max-xl)      |
| `.text-drama`      | Texto serif italic accent                |
| `.accent-line`     | Linha decorativa accent                  |

**Para mudar o estilo de todos os botões:**
```css
/* src/index.css */
.btn-primary {
  @apply bg-accent text-white px-8 py-4 rounded-2xl ...;
  /* ← muda aqui → todos os botões mudam */
}
```

---

## ✅ Componentes JSX — Regra de Ouro

```jsx
/* ❌ PROIBIDO — hardcoded */
<button className="bg-[#9e57c8] text-white px-8 py-4 rounded-xl hover:bg-purple-600">

/* ❌ PROIBIDO — named color do Tailwind */
<button className="bg-amber-500 text-black px-8 py-4 rounded-xl hover:bg-amber-400">

/* ✅ CORRETO — semântico */
<button className="btn-primary">
```

---

## 🔄 Fluxo de Alteração

**Mudar a cor de acento:**
1. Abrir `tailwind.config.js`
2. Alterar `accent: "#nova-cor"`
3. Guardar → toda a app atualiza automaticamente

**Mudar o estilo de botões:**
1. Abrir `src/index.css`
2. Editar `.btn-primary { ... }`
3. Guardar → todos os botões da app mudam

**Adicionar novo componente:**
1. Criar a classe global em `src/index.css`
2. Usar a classe no componente JSX

---

*Regra documentada em: 2026-05-12*
*Protocolo A.N.T. — Camada 1: Arquitetura*
