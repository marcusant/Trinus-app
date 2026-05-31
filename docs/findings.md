# 🔍 Findings - TRINUS-APP

## 📌 Pesquisas e Descobertas
- Extraído conteúdo da Landing Page original do `pt-app`.
- Mapeado Design System para o **Preset B (Midnight Luxe)**.
- Descoberto que a navegação horizontal esticada no PC degrada a usabilidade de ecrãs largos; a barra lateral fixa (Sidebar) esquerda resolve a proporção visual e melhora a experiência de uso (UX) desktop.
- Modal flutuante global centralizado resolve problemas de quebras de layout causadas por formulários de check-in inline que expandem e empurram outros elementos.

## ⚠️ Restrições e Limitações
- Requer GSAP para as animações cinematográficas da Landing Page.
- A página de controle do aluno requer autenticação ativa no Supabase e vinculação correta do treinador na tabela `trainer_clients` para carregar dados reais e evitar estados vazios.
