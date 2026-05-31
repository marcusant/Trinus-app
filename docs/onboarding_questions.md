# 📋 Perguntas do Onboarding — TRINUS-APP

Este documento lista detalhadamente todas as etapas, perguntas, campos e opções de resposta integrados no formulário de Onboarding (`app/onboarding/page.tsx`) do sistema **TRINUS-APP**.

O Onboarding está estruturado em **3 Passos** sequenciais em formato de formulário Wizard com validação de dados em tempo de execução via **Zod**.

---

## 🟢 Passo 1: Dados Pessoais
* **Objetivo**: Recolha de informações de identificação e perfil biológico básico.

### 1. Nome Completo
* **Tipo**: Texto (`string`)
* **Validação**: Obrigatório. Mínimo de 3 caracteres, máximo de 100 caracteres.
* **Placeholder**: `"O teu nome"`

### 2. Data de Nascimento
* **Tipo**: Data (`date` / `string`)
* **Validação**: Obrigatória.

### 3. Género
* **Tipo**: Seleção de Opção Única (`enum` / Rádio)
* **Validação**: Obrigatório.
* **Opções**:
  * ♂️ **Masculino**
  * ♀️ **Feminino**
  * 👤 **Outro**
  * 🔒 **Prefiro não dizer**

---

## 🌍 Passo 2: Origem
* **Objetivo**: Recolha de informações geográficas e demográficas.

### 4. Nacionalidade
* **Tipo**: Menu Dropdown (`select`)
* **Validação**: Obrigatória.
* **Opções pré-definidas**:
  * Portuguesa
  * Brasileira
  * Angolana
  * Moçambicana
  * Cabo-verdiana
  * Espanhola
  * Francesa
  * Britânica
  * Alemã
  * Americana
  * Outra

### 5. País de Residência
* **Tipo**: Menu Dropdown (`select`)
* **Validação**: Obrigatório.
* **Opções populares**:
  * 🇵🇹 Portugal
  * 🇧🇷 Brasil
  * 🇦🇴 Angola
  * 🇲🇿 Moçambique
  * 🇨🇻 Cabo Verde
  * 🇪🇸 Espanha
  * 🇫🇷 França
  * 🇬🇧 Reino Unido
  * 🇩🇪 Alemanha
  * 🇺🇸 Estados Unidos
  * 🇨🇭 Suíça
  * 🇱🇺 Luxemburgo

### 6. Cidade de Residência
* **Tipo**: Texto (`string`)
* **Validação**: Obrigatória.
* **Placeholder**: `"Ex: Lisboa, Porto, São Paulo..."`

---

## 💪 Passo 3: Objetivos e Rotina
* **Objetivo**: Mapeamento de rotinas de treino, metas físicas e nível de aptidão para personalização do ecossistema.

### 7. Objetivo Principal
* **Tipo**: Seleção de Opção Única (`enum` / Card com Rádio)
* **Validação**: Obrigatório.
* **Opções**:
  * 🔥 **Emagrecer** *(Queimar gordura e perder peso corporal)*
  * 💪 **Hipertrofia** *(Ganhar massa muscular e força)*
  * ❤️ **Saúde Geral** *(Melhorar bem-estar, vitalidade e longevidade)*
  * 🏆 **Performance** *(Melhorar rendimento físico e potência)*
  * ⚖️ **Recomposição Corporal** *(Perder gordura e ganhar músculo em simultâneo)*
  * 🧘 **Flexibilidade** *(Melhorar flexibilidade, postura e articulações)*

### 8. Nível de Experiência
* **Tipo**: Seleção de Opção Única (`enum` / Card com Rádio)
* **Validação**: Obrigatório.
* **Opções**:
  * 🌱 **Iniciante** *(Comecei há pouco tempo / sem ritmo regular)*
  * 🏃 **Intermediário** *(Treino regularmente há alguns meses)*
  * 🏋️ **Avançado** *(Treino de forma estruturada há vários anos)*

### 9. Onde preferes treinar?
* **Tipo**: Seleção de Opção Única (`enum` / Rádio)
* **Validação**: Obrigatório.
* **Opções**:
  * 🏢 **Ginásio**
  * 🏠 **Casa**
  * 🌳 **Ar Livre**
  * 🔄 **Híbrido**

### 10. Quantos dias por semana tens disponíveis para treinar?
* **Tipo**: Seletor numérico (`number`)
* **Validação**: Obrigatório. Mínimo 1 dia, máximo 7 dias.
* **Valor Padrão**: 3 dias
* **Opções de clique rápido**: 1, 2, 3, 4, 5, 6, 7

### 11. Tempo de treino preferido por sessão?
* **Tipo**: Seletor numérico (`number` em minutos)
* **Validação**: Obrigatório. Mínimo 15 minutos, máximo 180 minutos.
* **Valor Padrão**: 60 minutos
* **Opções de clique rápido**: 30 min, 45 min, 60 min, 75 min, 90 min, 120 min

---

## 💾 Modelo de Dados e Salvamento
No envio do formulário, os dados validados acima são enviados para a Server Action `saveOnboarding` (`lib/actions/onboarding.ts`) que persiste as informações na tabela `profiles` do Supabase do utilizador logado e completa o seu perfil, direcionando-o em seguida para o Painel do Aluno (`/client`).
