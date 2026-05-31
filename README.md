# Trinus App

Este é o projeto principal do **Trinus**, migrado para a stack moderna do Next.js 15 (App Router).

## 🚀 Tecnologias (Stack Atual)

- **Framework:** [Next.js 15](https://nextjs.org/) (React, App Router, Server Actions)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Componentes:** Radix UI / shadcn/ui
- **Animações:** Framer Motion & CSS customizado
- **Banco de Dados & Auth:** Supabase (SSR)
- **Integrações de IA:** Gemini AI API (via SDK oficial)

## 🛠 Como rodar o projeto localmente

1. Certifique-se de ter o Node.js instalado (v18.17 ou superior).
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie o `.env.example` para `.env.local`
   - Preencha com suas chaves do Supabase e Gemini API.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎨 Fonte Única de Verdade (SSOT) & Design System

Para garantir que a aplicação se mantenha profissional, de alta performance e simples de evoluir, todos os novos recursos e páginas **DEVEM** seguir rigorosamente as diretrizes da **Fonte Única de Verdade (SSOT)**:

1. **Cores do Tema (CSS Variables)**:
   * Nenhuma cor deve ser definida de forma estática nas páginas (evitar classes como `bg-[#121212]` ou `text-[#8340f0]`).
   * Todas as cores são mapeadas em `:root` no [globals.css](file:///c:/dev/INTEGRA-APP/app/globals.css) e consumidas semântica e automaticamente via utilidades do Tailwind CSS v4 (ex: `bg-background`, `text-primary`, `border-card`).
2. **Componentes Universais**:
   * Elementos de interface comuns (como botões `<Button>`, inputs, avatars) devem ser importados exclusivamente da pasta `components/ui/` (ex: [button.tsx](file:///c:/dev/INTEGRA-APP/components/ui/button.tsx)).
3. **Menus Laterais e Layouts de Painel**:
   * Qualquer barra lateral, caixa de perfil ou navegação repetida em painéis (`/client`, `/trainer`, `/admin`) **DEVE** utilizar as classes SSOT do CSS global:
     * `.sidebar-container` $\rightarrow$ Para a estrutura visual Aside e backgrounds translúcidos.
     * `.sidebar-profile-card` $\rightarrow$ Para o display de perfil do utilizador.
     * `.sidebar-nav` $\rightarrow$ Para o empilhamento vertical do menu.
     * `.sidebar-nav-item` / `.sidebar-nav-item.active` $\rightarrow$ Para hovers, cores e reações físicas premium.
     * `.sidebar-footer` $\rightarrow$ Para o rodapé da sidebar.

---

## 📖 Regras para IA

Veja o arquivo [AGENTS.md](file:///c:/dev/INTEGRA-APP/AGENTS.md) na raiz do projeto para entender as diretrizes de arquitetura, segurança e boas práticas exigidas pelos agentes autônomos que dão manutenção ao código. Todas as criações e edições de código devem obedecer a este manifesto.
