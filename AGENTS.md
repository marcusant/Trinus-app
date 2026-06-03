<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regras de Contribuição para Agentes de IA

1. **Segurança Primeiro**: NUNCA exponha senhas, chaves privadas ou tokens no código. Remova qualquer menção a credenciais caso existam arquivos de texto isolados.
2. **Arquitetura Next.js**: Respeite a estrutura de App Router (`app/`). Apenas adicione `"use client"` quando hooks do React ou interatividade visual direta forem estritamente necessários.
3. **Migração de Componentes**: A pasta `app/components/` é legada. Sempre crie novos componentes de UI dentro da pasta `components/` na raiz do projeto (como `components/ui/` ou `components/forms/`).
4. **Tipagem de Dados**: Ao alterar estrutura de banco, espere ou simule um fluxo onde os tipos do Supabase sejam gerados, priorizando os que estiverem em `types/` por agora até que um sync automático seja implementado, mas almejando a tipagem automatizada.
5. **Modificações de BD**: Nenhuma política de RLS foi detectada localmente. Caso crie chamadas no frontend que passem pela Auth do usuário logado, lembre que o Supabase Client do SSR (`lib/supabase/server.ts`) deve ser utilizado para contextos de servidor para injetar os cookies corretos.
6. **Regra de Consulta de Documentos**: Para qualquer nova feature, consulte obrigatoriamente a pasta `docs/`: `gemini.md` (Constituição — schemas, invariantes, stack), `design_system.md` (SSOT de cores/tipografia/botões), `task_plan.md` e `progress.md` (estado e roteiro), `findings.md` (descobertas e restrições) e `ecc_toolkit.md` (agentes e skills ECC curados).
7. **Fluxo de Trabalho Obrigatório**: Antes de fazer qualquer commit ou push, vamos testar SEMPRE localmente primeiro. Apenas após validar e atestar localmente que as alterações estão 100% corretas, funcionais e prontas é que realizaremos o commit e o push (sob autorização explícita). NUNCA realize git commit ou git push sem que o utilizador peça explicitamente.
8. **Links Locais Clicáveis e Condicionalidade**: Você só deve enviar o link do servidor local no final da sua mensagem (exemplo: [http://localhost:3000](http://localhost:3000)) se uma alteração real e visual/funcional tiver sido feita no código do projeto (como novos recursos, alteração de páginas ou de lógica) e se você tiver verificado ativamente que o servidor local está de fato rodando e respondendo no momento. Caso contrário, não envie o link desnecessariamente. Se uma alteração foi feita mas o servidor não estiver rodando, você deve executá-lo (ex: `npm run dev`) antes de verificar e enviar o link. O link, quando enviado, deve ser sempre clicável.
9. **Estilização e Fonte Única da Verdade (SSOT)**: NUNCA utilize cores ou estilos hardcoded soltos nas páginas (ex: `bg-[#ff0000]`). Toda cor, tema ou variável global DEVE ser mapeada no `app/globals.css`. Todo elemento repetitivo DEVE utilizar os componentes universais da pasta `components/ui/` (ex: `button.tsx`). Qualquer barra lateral (Sidebar) ou estrutura de menu lateral repetida em painéis (`/client`, `/trainer`, `/admin`) DEVE utilizar obrigatoriamente as classes globais (`.sidebar-container`, `.sidebar-profile-card`, `.sidebar-nav`, `.sidebar-footer` e `.sidebar-nav-item`) centralizadas na raiz do CSS. Se uma cor, layout ou estilo global precisar de mudar, altere na raiz (`globals.css` ou no componente universal) para que a alteração reflita em todo o aplicativo simultaneamente.
10. **Tipagem Estrita (Padrão ECC - Zero `any`)**: É estritamente proibido usar `any` no código da aplicação. Caso o tipo seja incerto, use `unknown` e faça a validação segura (type guards). Sempre defina `interfaces` ou `types` para Props de componentes e respostas de API. Para formulários e dados externos, prefira validação com **Zod**.
11. **Imutabilidade (Padrão ECC)**: Nunca mute objetos ou estados diretamente. Sempre crie novos objetos utilizando o *spread operator* (`...`). Funções utilitárias devem ser puras e sem efeitos colaterais.
12. **Segurança Obrigatória (Padrão ECC)**: Valide todos os inputs do usuário. Segredos e senhas NUNCA devem ser colocados em texto limpo no código fonte (hardcoded); utilize sempre variáveis de ambiente (`.env.local`). Verifique logs para garantir que não exponham dados sensíveis.
13. **Consulta ao Oráculo ECC**: Sempre que o agente (IA) se deparar com uma refatoração complexa, desafio de segurança, arquitetura de banco (Supabase/PostgreSQL) ou padrões avançados de Frontend, o agente DEVE e ESTÁ AUTORIZADO a consultar silenciosamente os agentes e skills do ECC antes de implementar código duvidoso. Fontes, por ordem de prioridade:
    - **ECC instalado (operativo)**: agentes em `C:\Users\Marcus\.claude\agents\`, skills via Skill tool e rules em `C:\Users\Marcus\.claude\rules\ecc\` — é o que o Claude Code carrega de facto.
    - **Curadoria local**: `docs/ecc_toolkit.md` — agentes e skills ECC já mapeados para o stack desta app (ex: `database-reviewer` para RLS Supabase, `security-reviewer` para `crypto.ts`, `postgres-patterns`, `frontend-patterns`).
    - **Repositório-fonte ECC (referência completa)**: `C:\Users\Marcus\.gemini\antigravity-ide\scratch\ECC` — código-fonte integral, útil para padrões não instalados localmente.
14. **Execução Restrita do Semgrep (Performance e Auditoria sob Demanda)**: É estritamente proibido iniciar análises estáticas do **Semgrep** durante a escrita ativa de código, fases de teste visual ou rotinas automáticas de compilação, para conservar a CPU e a RAM locais (evitando o acúmulo de processos `semgrep-core-proprietary.exe` que travam o sistema). A execução do Semgrep pelo agente deve ocorrer **exclusivamente sob pedido direto do utilizador**, sendo reservada para fases de estabilização do ciclo de vida da aplicação, tais como:
   - **Fase de Pré-Commit:** Auditoria final antes de efetuar commits e registar alterações no repositório.
   - **Fase de Pré-Deploy:** Verificação final de integridade de segurança antes da publicação em ambientes de produção.
15. **Sistema de Breakpoints e Responsividade Mobile-First**: Qualquer criação ou adaptação de layouts, barras laterais (sidebar), containers e grades da aplicação deve seguir rigorosamente os 8 breakpoints e 20 dispositivos de referência estipulados a seguir. 
    NUNCA altere a estrutura lógica, páginas, componentes ou regras de negócio existentes; apenas integre a camada de adaptação responsiva global.
    
    *Breakpoints (Mobile First):*
    - `@media (min-width: 390px)` -> Mobile Standard (iPhone 16, iPhone 17e)
    - `@media (min-width: 402px)` -> Mobile Pro (iPhone 16 Pro, iPhone 17, 17 Pro)
    - `@media (min-width: 430px)` -> Mobile Large (iPhone 16 Plus, 16 Pro Max, 17 Pro Max)
    - `@media (min-width: 744px)` -> Tablet Small (iPad mini)
    - `@media (min-width: 820px)` -> Tablet Standard (iPad Air 11", iPad Pro 11")
    - `@media (min-width: 1024px)` -> Tablet Large (iPad Air 13", iPad Pro 13")
    - `@media (min-width: 1280px)` -> Laptop (HD, WXGA, MacBook Air/Pro)
    - `@media (min-width: 1920px)` -> Desktop (Full HD, QHD)
    
    *Diretrizes Obrigatórias de Usabilidade:*
    - **Touch Targets:** Mínimo de 44×44px para qualquer elemento interativo em mobile.
    - **Safe Areas iOS:** Respeitar `env(safe-area-inset-*)` para telas com notch/dynamic island.
    - **Evitar Auto-Zoom iOS:** Mínimo de `font-size: 16px` em inputs em mobile.
    - **Tipografia Fluida:** Utilizar `clamp()` para escalonamento elegante entre ecrãs.
    - **Imagens Responsivas:** Manter `max-width: 100%` e `height: auto` como base.
16. **Sincronização Contínua de Roteiro e Progresso (Foco em docs/)**: 
    - **Antes** de iniciar qualquer alteração ou criação de feature, o agente deve obrigatoriamente ler os arquivos `docs/task_plan.md` e `docs/progress.md` para se alinhar com o estado atual do repositório.
    - O agente deve **apresentar claramente ao usuário** em suas mensagens o status atualizado do plano de tarefas (`[ ]` Pendente, `[/]` Em Progresso, `[x]` Concluído) referente à alteração solicitada.
    - **Ao concluir** qualquer código ou tarefa, o agente deve obrigatoriamente atualizar os arquivos de progresso (`docs/progress.md`) e planejamento (`docs/task_plan.md`) na mesma resposta, informando o usuário exatamente o que foi marcado como concluído.
17. **Resumo Explicativo de Correções**: Sempre que corrigir um bug ou realizar qualquer modificação/melhoria no código da aplicação, o agente deve apresentar ao utilizador um resumo simples, direto e de fácil compreensão sobre o que foi feito (o problema que existia, a causa e o método utilizado para a resolução).


