# 📱 Currículo Xpress

> App mobile de gerenciamento de currículos com geração automática de resumos profissionais usando Google Gemini AI.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](http://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2051-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

---

## 📹 Demonstração

- 🎥 **Vídeo**: [Link do YouTube aqui - será adicionado após gravação]
- 📲 **QR Code (Expo Go)**: [Link do Expo aqui - será adicionado após publicação]

---

## ✨ Funcionalidade Extra - Inteligência Artificial

### 🤖 Geração Automática de Statements com Google Gemini

O diferencial deste app é a integração com **Google Gemini AI** para criar resumos profissionais personalizados:

- 📊 **Análise Inteligente**: O Gemini analisa todo o seu perfil (formações, experiências, skills, projetos)
- 🎯 **Personalização**: Considera a descrição da vaga de interesse
- ✍️ **Geração Automática**: Cria um statement otimizado e profissional em segundos
- 💾 **Salvamento Automático**: O statement gerado fica disponível para usar em qualquer currículo

**Como funciona:**

1. Você seleciona um currículo base (com seus dados)
2. Cola a descrição de uma vaga de interesse
3. O Gemini processa e gera um resumo personalizado
4. O statement é salvo automaticamente no seu acervo

---

## 🚀 Tecnologias Utilizadas

### Frontend (React Native)

- **Expo SDK 51** - Plataforma de desenvolvimento
- **Expo Router** - Navegação file-based type-safe
- **TypeScript** - Tipagem estática para maior segurança
- **Gluestack UI** - Sistema de design e componentes acessíveis
- **React Query (TanStack Query)** - Cache inteligente e gerenciamento de estado do servidor
- **Zustand** - Gerenciamento de estado global leve e performático
- **Axios** - Cliente HTTP com interceptors
- **Expo SecureStore** - Armazenamento seguro de tokens

### Backend (Node.js)

- **Node.js + TypeScript** - Runtime e tipagem
- **Express** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional (NeonDB)
- **Prisma ORM** - ORM type-safe
- **JWT (jsonwebtoken)** - Autenticação stateless
- **Google Generative AI** - SDK do Gemini
- **Vercel** - Plataforma de deploy serverless

### Design

- **Gluestack UI** - Componentes base
- **Tema Personalizado** - Paleta "Pavão" (azuis e verdes suaves)
- **React Native Vector Icons** - Ícones (MaterialIcons, Ionicons)

---

## 📱 Funcionalidades

### 🔐 Autenticação & Segurança

- ✅ Registro de usuário
- ✅ Login com JWT
- ✅ Token armazenado com SecureStore (criptografado)
- ✅ Logout automático quando token expira (401)
- ✅ Roteamento protegido

### 🧭 Navegação (5 Telas Principais)

- 🏠 **Home** - Lista de currículos criados
- 🎓 **Acadêmico** - Gerenciar formações acadêmicas
- 💼 **Profissional** - Gerenciar experiências profissionais
- ⭐ **Habilidades** - Gerenciar skills técnicas e soft skills
- 💻 **Projetos** - Gerenciar portfólio de projetos

### ✏️ CRUD Completo - Sistema de Acervo

Cada tipo de informação possui seu próprio acervo:

**Habilidades**

- Criar, visualizar e deletar skills
- Adicionar nome e nível (opcional)

**Formações Acadêmicas**

- Instituição, grau, área de estudo
- Datas de início e término
- Checkbox "Estou cursando atualmente"

**Experiências Profissionais**

- Empresa, cargo, descrição
- Datas de início e término
- Checkbox "Trabalho aqui atualmente"

**Projetos**

- Nome, descrição e URL (opcional)
- Repositório GitHub, site, etc.

### 📋 Gestão de Currículos

- ✅ Criar múltiplos currículos
- ✅ Visualizar detalhes completos
- ✅ Deletar com modal de confirmação
- ✅ Sistema de "acervo + montagem"
- ✅ Cada currículo mostra:
  - Statement (resumo pessoal)
  - Todas as formações
  - Todas as experiências
  - Todas as skills
  - Todos os projetos

### 🤖 IA - Funcionalidade Extra ⭐

- ✅ Geração de Statements com Google Gemini
- ✅ Personalização baseada em job description
- ✅ Contexto completo do usuário
- ✅ Salvamento automático

### 🎨 UX/UI

- ✅ Pull-to-refresh em todas as listas
- ✅ Estados de loading/erro/vazio
- ✅ Modais de confirmação para ações destrutivas
- ✅ Validação de formulários
- ✅ Feedback visual de ações

---

## 🗂️ Estrutura do Projeto

```
curriculo-xpress-app/
├── app/
│   ├── _layout.tsx                  # Layout raiz com proteção de rotas
│   ├── (auth)/                      # Grupo de autenticação
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                      # Navegação principal (5 tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Home
│   │   ├── academico.tsx            # CRUD Educações
│   │   ├── profissional.tsx         # CRUD Experiências
│   │   ├── habilidades.tsx          # CRUD Skills
│   │   └── projetos.tsx             # CRUD Projetos
│   ├── curriculum/                  # Gestão de currículos
│   │   ├── [id].tsx                 # Detalhes (rota dinâmica)
│   │   └── create.tsx               # Criar novo
│   └── ai/                          # Inteligência Artificial
│       └── generate-statement.tsx
├── hooks/                           # React Query hooks customizados
│   ├── useCurriculums.ts
│   ├── useStatements.ts
│   ├── useEducations.ts
│   ├── useExperiences.ts
│   ├── useSkills.ts
│   └── useProjects.ts
├── store/                           # Estado global (Zustand)
│   └── useAuthStore.ts
├── services/                        # Configuração de APIs
│   └── api.ts                       # Axios com interceptors
├── types/                           # Tipos TypeScript
│   └── api.ts                       # Interfaces da API
├── theme/                           # Tema Gluestack customizado
│   └── config.ts                    # Paleta Pavão
└── assets/                          # Imagens, fontes, ícones
```

---

## 🔧 Como Rodar Localmente

### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Conta no [Expo](https://expo.dev/) (opcional, mas recomendado)

### Instalação

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/curriculo-xpress-app.git
cd curriculo-xpress-app
```

**2. Instale as dependências**

```bash
npm install
```

**3. Inicie o servidor de desenvolvimento**

```bash
npx expo start
```

**4. No celular:**

- Abra o Expo Go
- Escaneie o QR Code que aparece no terminal
- Aguarde o bundle carregar

### Variáveis de Ambiente

O app já está configurado para usar o backend em produção:

```
API_URL=https://curriculo-express-api-10112025.vercel.app/api
```

Não é necessário configurar nada localmente.

---

## 🎯 Fluxo de Uso

### 1️⃣ Primeiro Acesso

```
Cadastro → Login → Tela Home (vazia)
```

### 2️⃣ Criar Acervo

```
Tab Habilidades → Adicionar skills (Python, React Native, etc.)
Tab Acadêmico → Adicionar formações
Tab Profissional → Adicionar experiências
Tab Projetos → Adicionar projetos
```

### 3️⃣ Gerar Statement com IA ⭐

```
Home → "Gerar Statement com IA" →
Selecionar currículo base →
Digitar título (ex: "Desenvolvedor Mobile") →
Colar job description →
"Gerar Statement" →
Aguardar Gemini processar →
Statement salvo automaticamente!
```

### 4️⃣ Criar Currículo

```
Home → "Criar Novo Currículo" →
Selecionar statement gerado →
Dar título ao currículo →
"Criar Currículo" →
Currículo criado com statement!
```

### 5️⃣ Visualizar

```
Home → Tocar no card do currículo →
Ver detalhes completos →
Statement + Formações + Experiências + Skills + Projetos
```

---

## 🏗️ Arquitetura & Padrões

### Frontend

- **File-based Routing**: Expo Router para roteamento automático
- **React Query**: Cache automático, retry inteligente, invalidação de queries
- **Zustand**: Estado global mínimo (apenas autenticação)
- **Hooks Customizados**: Encapsulam lógica de API
- **TypeScript**: Tipagem end-to-end (frontend + backend)

### Backend

- **API REST**: Endpoints RESTful padronizados
- **JWT Stateless**: Autenticação sem sessão
- **Relações N:M**: Tabelas pivot para associação de blocos aos currículos
- **IA Integration**: Google Gemini API com contexto completo

### Design Patterns

- **Repository Pattern**: Hooks abstraem chamadas de API
- **Separation of Concerns**: Camadas bem definidas
- **DRY (Don't Repeat Yourself)**: Código reutilizável
- **Type Safety**: TypeScript previne erros em runtime

---

## 📊 Estatísticas do Projeto

- **~25 componentes/telas** criados
- **6 hooks customizados** (React Query)
- **~3.500 linhas de código** TypeScript/React Native
- **4 CRUDs completos** implementados
- **1 integração com IA** (Google Gemini)
- **Autenticação JWT** end-to-end
- **5 telas de navegação** (tabs)

---

## 📄 Licença

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    <img alt="Licença Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>

Este trabalho está licenciado sob a **Creative Commons Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

### O que isso significa

#### ✅ Você PODE

- **Compartilhar** — copiar e redistribuir o material
- **Adaptar** — remixar, transformar e criar a partir do material
- **Estudar** — usar para fins educacionais
- **Modificar** — fazer alterações no código

#### ❌ Sob as seguintes condições

- **Atribuição (BY)** — Você deve dar crédito apropriado, fornecer um link para a licença e indicar se foram feitas alterações
- **Não Comercial (NC)** — Você não pode usar o material para fins comerciais
- **Compartilha Igual (SA)** — Se você modificar, deve distribuir sob a mesma licença

#### 💼 Uso Comercial

Para uso comercial ou licenciamento diferente, entre em contato comigo.

📖 **Leia o texto legal completo**: <https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pt>

---

## 👨‍💻 Autor

**Marcos Filipe Gonçalves Capella**

- 🐙 GitHub: [capella-marcosfilipe](https://github.com/capella-marcosfilipe)
- 💼 LinkedIn: [Meu Perfil](https://linkedin.com/in/capella-marcosfilipe)
- 📧 Email: <marcosfilipe.gc@gmail.com>
- 🎓 Universidade: Católica de Pernambuco (Unicap)

---

## 🎓 Contexto Acadêmico

**Universidade Católica de Pernambuco**

- **Curso**: Sistemas para Internet
- **Disciplina**: Programação para Dispositivos Móveis
- **Professor**: Márcio Bueno
- **Semestre**: 2025.2
- **Data de Entrega**: Novembro de 2025
