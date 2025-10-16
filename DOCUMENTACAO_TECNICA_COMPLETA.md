# DTTools - Documentação Técnica Completa

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Arquitetura Técnica](#arquitetura-técnica)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Database Schema](#database-schema)
6. [APIs e Endpoints](#apis-e-endpoints)
7. [Funcionalidades Principais](#funcionalidades-principais)
8. [Fluxo de Dados](#fluxo-de-dados)
9. [Segurança e Autenticação](#segurança-e-autenticação)
10. [Deploy e Infraestrutura](#deploy-e-infraestrutura)

---

## 1. Visão Geral do Sistema

### O Que é o DTTools?

**DTTools (Design Thinking Tools)** é uma plataforma SaaS completa que guia designers, equipes de inovação e profissionais criativos através das 5 fases do processo de Design Thinking. A plataforma oferece ferramentas específicas para cada fase, sistema de progresso gamificado, colaboração em tempo real e funcionalidades avançadas de análise e exportação.

### Proposta de Valor

- **Guia Completo**: Ferramentas específicas para cada uma das 5 fases do Design Thinking
- **Gamificação**: Sistema de pontos, badges e níveis para engajar usuários
- **Colaboração**: Trabalho em equipe com permissões e compartilhamento
- **IA Integrada**: Chat com mentor de IA (Gemini) para orientação personalizada
- **Exportação Profissional**: Relatórios em PDF, PowerPoint e Markdown com templates branded
- **Benchmarking**: Comparação com indústria e análise de maturidade

### Público-Alvo

1. **Designers e UX Researchers** - Profissionais que executam projetos de Design Thinking
2. **Equipes de Inovação** - Times corporativos trabalhando em novos produtos/serviços
3. **Consultores** - Facilitadores que conduzem workshops de Design Thinking
4. **Educadores** - Professores ensinando metodologias de inovação
5. **Empresas** - Organizações implementando cultura de inovação centrada no usuário

---

## 2. Arquitetura Técnica

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  ┌──────────────┬──────────────┬─────────────────────────┐  │
│  │  UI Layer    │  State Mgmt  │   Routing & Navigation  │  │
│  │  (shadcn/ui) │  (TanStack)  │       (Wouter)          │  │
│  └──────────────┴──────────────┴─────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────┴────────────────────────────────────┐
│                    BACKEND (Express.js)                      │
│  ┌──────────────┬──────────────┬─────────────────────────┐  │
│  │   Routes     │  Middleware  │    Business Logic       │  │
│  │   (REST)     │   (Auth)     │     (Services)          │  │
│  └──────────────┴──────────────┴─────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries (Drizzle ORM)
┌────────────────────────┴────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  23 Tables: users, projects, empathy_maps, personas, │   │
│  │  ideas, prototypes, subscriptions, articles, etc.    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                         
┌─────────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES                              │
│  ┌──────────────┬──────────────┬─────────────────────────┐  │
│  │  Gemini AI   │   Stripe     │    Render.com           │  │
│  │  (Chat)      │  (Payments)  │    (Hosting)            │  │
│  └──────────────┴──────────────┴─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Princípios Arquiteturais

1. **Separation of Concerns**: Frontend e backend completamente separados
2. **Type Safety**: TypeScript end-to-end com schemas compartilhados
3. **RESTful Design**: APIs seguem convenções REST
4. **Database-First**: Schema Drizzle como fonte de verdade
5. **Stateless Backend**: Sessions em PostgreSQL para escalabilidade

---

## 3. Stack Tecnológico

### Frontend

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|-----------|
| **Framework** | React | 18.x | UI library principal |
| **Build Tool** | Vite | 5.x | Build rápido com HMR |
| **Language** | TypeScript | 5.x | Type safety |
| **Router** | Wouter | 3.x | Roteamento client-side |
| **State** | TanStack Query | 5.x | Server state management |
| **UI Components** | shadcn/ui | Latest | Component library (Radix UI) |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Icons** | Lucide React | Latest | Ícones modernos |
| **Forms** | React Hook Form | 7.x | Gerenciamento de formulários |
| **Validation** | Zod | 3.x | Schema validation |
| **Charts** | Recharts | 2.x | Gráficos e visualizações |
| **Canvas** | Fabric.js | 6.x | Canvas para desenhos |
| **PDF Generation** | jsPDF | 3.x | Geração de PDFs |
| **PPTX Generation** | pptxgenjs | 4.x | Geração de PowerPoint |

### Backend

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|-----------|
| **Runtime** | Node.js | 20.x | JavaScript runtime |
| **Framework** | Express.js | 4.x | Web framework |
| **Language** | TypeScript | 5.x | Type safety |
| **ORM** | Drizzle ORM | 0.39.x | Database ORM |
| **Database** | PostgreSQL | 16.x | Relational database |
| **Sessions** | express-session + connect-pg-simple | Latest | Session management |
| **Authentication** | Passport.js | Latest | Autenticação local |
| **Password Hash** | bcrypt | 6.x | Hash de senhas |
| **AI** | Google Gemini | Latest | Chat IA com mentor |
| **Payments** | Stripe | Latest | Processamento de pagamentos |
| **Image Processing** | Sharp | Latest | Resize e otimização de imagens |

### DevOps & Infrastructure

| Categoria | Tecnologia | Propósito |
|-----------|-----------|-----------|
| **Hosting** | Render.com | Backend + Frontend + Database |
| **Domain** | designthinkingtools.com | Domínio customizado |
| **Database** | Render PostgreSQL | Database gerenciado |
| **Version Control** | Git + GitHub | Controle de versão |
| **Build** | esbuild | Backend bundler |
| **Package Manager** | npm | Gerenciamento de dependências |

---

## 4. Estrutura de Arquivos

### Estrutura Geral

```
dttools/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── auth/                # Autenticação (Login, Signup, UserMenu)
│   │   │   ├── phase1/              # Ferramentas Fase 1: Empatizar
│   │   │   ├── phase2/              # Ferramentas Fase 2: Definir
│   │   │   ├── phase3/              # Ferramentas Fase 3: Idear
│   │   │   ├── phase4/              # Ferramentas Fase 4: Prototipar
│   │   │   └── phase5/              # Ferramentas Fase 5: Testar
│   │   ├── pages/                   # Páginas da aplicação
│   │   │   ├── dashboard.tsx        # Dashboard principal
│   │   │   ├── projects.tsx         # Lista de projetos
│   │   │   ├── project-detail.tsx   # Detalhes do projeto
│   │   │   ├── chat.tsx             # Chat com IA
│   │   │   ├── library.tsx          # Biblioteca de artigos
│   │   │   ├── pricing.tsx          # Planos de assinatura
│   │   │   ├── admin.tsx            # Painel admin
│   │   │   ├── benchmarking.tsx     # Análise de benchmarking
│   │   │   ├── privacy-policy.tsx   # Política de privacidade
│   │   │   ├── terms.tsx            # Termos de uso
│   │   │   └── support.tsx          # Suporte
│   │   ├── contexts/                # React contexts
│   │   │   ├── AuthContext.tsx      # Contexto de autenticação
│   │   │   └── LanguageContext.tsx  # Contexto de idioma (i18n)
│   │   ├── lib/                     # Utilitários
│   │   │   └── queryClient.ts       # Configuração TanStack Query
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── use-toast.ts         # Toast notifications
│   │   │   └── use-mobile.tsx       # Detecção mobile
│   │   ├── utils/                   # Funções utilitárias
│   │   │   ├── reportGenerator.ts   # Geração de PDFs
│   │   │   └── screenshot-generator.ts # Captura de screenshots
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   └── index.html                   # HTML template
│
├── server/                          # Backend Node.js
│   ├── routes.ts                    # Definição de todas as rotas API
│   ├── storage.ts                   # Interface de storage (DB abstraction)
│   ├── db.ts                        # Configuração PostgreSQL
│   ├── index.ts                     # Entry point do servidor
│   ├── vite.ts                      # Integração Vite (dev mode)
│   ├── geminiService.ts             # Serviço IA Gemini
│   ├── pptxService.ts               # Geração de PowerPoint
│   └── middleware/
│       └── auth.ts                  # Middleware de autenticação
│
├── shared/                          # Código compartilhado
│   └── schema.ts                    # Database schema (Drizzle) + Zod types
│
├── dist/                            # Build de produção
│   ├── public/                      # Assets estáticos (frontend)
│   └── index.js                     # Backend compilado
│
├── attached_assets/                 # Assets anexados pelo usuário
├── public/                          # Assets públicos
│   ├── logo-horizontal.png          # Logo horizontal
│   └── logo-icon.png                # Logo ícone
│
├── package.json                     # Dependências npm
├── tsconfig.json                    # Configuração TypeScript
├── vite.config.ts                   # Configuração Vite
├── tailwind.config.ts               # Configuração Tailwind
├── drizzle.config.ts                # Configuração Drizzle ORM
├── render.yaml                      # Configuração Render.com
└── replit.md                        # Documentação do projeto
```

### Arquivos-Chave e Responsabilidades

#### Frontend (`client/src/`)

| Arquivo | Responsabilidade |
|---------|------------------|
| `App.tsx` | Roteamento principal, layout global |
| `main.tsx` | Entry point, providers (Auth, Language, QueryClient) |
| `pages/dashboard.tsx` | Dashboard com visão geral de progresso |
| `pages/projects.tsx` | Lista de projetos do usuário |
| `pages/project-detail.tsx` | Detalhes e ferramentas do projeto por fase |
| `pages/chat.tsx` | Chat com IA mentor de Design Thinking |
| `pages/library.tsx` | Biblioteca de artigos sobre DT |
| `pages/pricing.tsx` | Planos de assinatura e checkout Stripe |
| `pages/admin.tsx` | Painel administrativo (users, articles, plans) |
| `pages/benchmarking.tsx` | Análise de maturidade e benchmarking |
| `contexts/AuthContext.tsx` | Estado global de autenticação |
| `contexts/LanguageContext.tsx` | I18n (pt-BR, en, es, fr) |
| `lib/queryClient.ts` | Configuração TanStack Query + fetcher |
| `utils/reportGenerator.ts` | Geração de PDFs com templates |
| `components/phase[1-5]/` | Ferramentas específicas de cada fase |

#### Backend (`server/`)

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.ts` | Servidor Express, configuração de middlewares |
| `routes.ts` | **ARQUIVO CENTRAL**: Todas as 100+ rotas API |
| `storage.ts` | Interface de acesso ao banco de dados |
| `db.ts` | Pool de conexões PostgreSQL |
| `geminiService.ts` | Integração com Google Gemini AI |
| `pptxService.ts` | Geração de apresentações PowerPoint |
| `vite.ts` | Dev server Vite (apenas em desenvolvimento) |

#### Shared (`shared/`)

| Arquivo | Responsabilidade |
|---------|------------------|
| `schema.ts` | **FONTE DE VERDADE**: Database schema completo em Drizzle + Zod types para validação |

---

## 5. Database Schema

### Tabelas Principais (23 Tabelas)

#### Usuários e Autenticação

1. **users** - Usuários da plataforma
   - Campos: id, username, email, password (bcrypt), displayName, role (admin/user)
   - Perfil: bio, profilePicture, city, phone, interests
   - Stripe: stripeCustomerId, stripeSubscriptionId, subscriptionPlanId
   - Status: subscriptionStatus, subscriptionEndDate

2. **user_subscriptions** - Histórico de assinaturas
   - Campos: id, userId, planId, stripeSubscriptionId, status, billingPeriod
   - Datas: currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd

3. **subscription_plans** - Planos de assinatura
   - Campos: id, name, displayName, description
   - Preços: priceMonthly, priceYearly (em centavos)
   - Stripe: stripePriceIdMonthly, stripePriceIdYearly
   - Limites: maxProjects, maxPersonasPerProject, maxUsersPerTeam
   - Usuários: includedUsers, pricePerAdditionalUser
   - Features: aiChatLimit, libraryArticlesCount, exportFormats
   - Booleans: hasCollaboration, hasPermissionManagement, hasSso, has24x7Support

#### Projetos e Design Thinking

4. **projects** - Projetos de Design Thinking
   - Campos: id, name, description, userId
   - Status: currentPhase (1-5), status (active/completed/archived)
   - Metadados: industry, companySize, targetAudience

5. **empathy_maps** - Mapas de Empatia (Fase 1)
   - Campos: id, projectId, userId, title
   - Quadrantes: says, thinks, does, feels
   - Metadados: insights, painPoints

6. **personas** - Personas de Usuários (Fase 1)
   - Campos: id, projectId, userId, name, age, occupation
   - Detalhes: bio, goals, frustrations, motivations, behaviors
   - Imagem: photo (base64)

7. **interviews** - Entrevistas com Usuários (Fase 1)
   - Campos: id, projectId, userId, intervieweeName
   - Conteúdo: questions, answers, insights, date

8. **field_observations** - Observações de Campo (Fase 1)
   - Campos: id, projectId, userId, location, context
   - Conteúdo: observations, insights, images (base64)

9. **user_journeys** - Jornadas do Usuário (Fase 1)
   - Campos: id, projectId, userId, title
   - Jornada: stages (array), touchpoints, emotions, painPoints

10. **pov_statements** - Point of View Statements (Fase 2)
    - Campos: id, projectId, userId
    - POV: user, need, insight
    - Metadados: priority

11. **hmw_questions** - How Might We Questions (Fase 2)
    - Campos: id, projectId, userId, question
    - Metadados: category, priority

12. **problem_statements** - Declarações de Problemas (Fase 2)
    - Campos: id, projectId, userId, statement
    - Contexto: target, problem, goal

13. **ideas** - Ideias (Fase 3)
    - Campos: id, projectId, userId, title, description
    - Metadados: category, feasibility, impact, effort
    - Votos: votes

14. **idea_categories** - Categorias de Ideias
    - Campos: id, projectId, name, description, color

15. **canvas_drawings** - Desenhos em Canvas (Fase 3 e 4)
    - Campos: id, projectId, userId, type (idea/prototype)
    - Canvas: canvasData (JSON do Fabric.js)
    - Thumbnail: thumbnailBase64

16. **prototypes** - Protótipos (Fase 4)
    - Campos: id, projectId, userId, title, description
    - Tipo: type (digital/physical/storyboard)
    - Versão: version, iterationNotes
    - Mídia: images (base64 array), materials

17. **test_plans** - Planos de Teste (Fase 5)
    - Campos: id, projectId, userId, title
    - Teste: methodology, targetAudience, objectives
    - Métricas: successCriteria

18. **test_results** - Resultados de Testes (Fase 5)
    - Campos: id, testPlanId, projectId, userId
    - Resultados: findings, userFeedback, metrics
    - Análise: insights, nextSteps

#### Gamificação e Progresso

19. **user_progress** - Progresso do Usuário
    - Campos: id, userId, level, points, completedActivities
    - Badges: badges (array)
    - Fases: phase1Progress, phase2Progress, ..., phase5Progress

#### Conteúdo e Biblioteca

20. **articles** - Artigos da Biblioteca
    - Campos: id, title, content, category, author
    - SEO: excerpt, tags
    - Status: isPublished

21. **help_articles** - Artigos de Ajuda/FAQ
    - Campos: id, title, content, category, order
    - SEO: slug (único)
    - Status: isPublished

#### Análise e Benchmarking

22. **dvf_assessments** - Avaliações DVF (Desejabilidade, Viabilidade, Exequibilidade)
    - Campos: id, projectId, ideaId, userId
    - Scores: desirabilityScore, feasibilityScore, viabilityScore
    - Análise: overallScore, recommendation (proceed/modify/stop)

23. **lovability_metrics** - Métricas de Lovability
    - Campos: id, projectId, userId
    - NPS: npsScore, promoters, passives, detractors
    - Satisfação: satisfactionScore, feedbackCount
    - Engajamento: engagementRate, emotionalDistribution
    - Score: overallLovabilityScore

### Relações entre Tabelas

```
users (1) ──┬── (N) projects
            ├── (N) user_subscriptions
            ├── (N) user_progress
            └── (N) empathy_maps, personas, ideas, etc.

projects (1) ──┬── (N) empathy_maps
               ├── (N) personas
               ├── (N) interviews
               ├── (N) field_observations
               ├── (N) user_journeys
               ├── (N) pov_statements
               ├── (N) hmw_questions
               ├── (N) problem_statements
               ├── (N) ideas
               ├── (N) idea_categories
               ├── (N) canvas_drawings
               ├── (N) prototypes
               ├── (N) test_plans
               ├── (N) test_results
               ├── (N) dvf_assessments
               └── (N) lovability_metrics

subscription_plans (1) ──── (N) user_subscriptions

test_plans (1) ──── (N) test_results
```

---

## 6. APIs e Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/signup` | Criar nova conta | Não |
| POST | `/api/auth/login` | Login com email/password | Não |
| POST | `/api/auth/logout` | Logout | Sim |
| GET | `/api/auth/me` | Dados do usuário logado | Sim |
| PUT | `/api/auth/complete-profile` | Completar perfil (bio, foto, etc.) | Sim |

### Projetos (`/api/projects`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/projects` | Listar projetos do usuário | Sim |
| POST | `/api/projects` | Criar novo projeto | Sim |
| GET | `/api/projects/:id` | Detalhes do projeto | Sim |
| PUT | `/api/projects/:id` | Atualizar projeto | Sim |
| DELETE | `/api/projects/:id` | Deletar projeto | Sim |
| GET | `/api/projects/:id/stats` | Estatísticas do projeto | Sim |

### Fase 1: Empatizar

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects/:id/empathy-maps` | Listar mapas de empatia |
| POST | `/api/projects/:id/empathy-maps` | Criar mapa de empatia |
| PUT | `/api/empathy-maps/:id` | Atualizar mapa |
| DELETE | `/api/empathy-maps/:id` | Deletar mapa |
| GET | `/api/projects/:id/personas` | Listar personas |
| POST | `/api/projects/:id/personas` | Criar persona |
| PUT | `/api/personas/:id` | Atualizar persona |
| DELETE | `/api/personas/:id` | Deletar persona |
| GET | `/api/projects/:id/interviews` | Listar entrevistas |
| POST | `/api/projects/:id/interviews` | Criar entrevista |
| PUT | `/api/interviews/:id` | Atualizar entrevista |
| DELETE | `/api/interviews/:id` | Deletar entrevista |
| GET | `/api/projects/:id/observations` | Listar observações |
| POST | `/api/projects/:id/observations` | Criar observação |
| PUT | `/api/observations/:id` | Atualizar observação |
| DELETE | `/api/observations/:id` | Deletar observação |
| GET | `/api/projects/:id/user-journeys` | Listar jornadas |
| POST | `/api/projects/:id/user-journeys` | Criar jornada |
| PUT | `/api/user-journeys/:id` | Atualizar jornada |
| DELETE | `/api/user-journeys/:id` | Deletar jornada |

### Fase 2: Definir

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects/:id/pov-statements` | Listar POVs |
| POST | `/api/projects/:id/pov-statements` | Criar POV |
| PUT | `/api/pov-statements/:id` | Atualizar POV |
| DELETE | `/api/pov-statements/:id` | Deletar POV |
| GET | `/api/projects/:id/hmw-questions` | Listar HMWs |
| POST | `/api/projects/:id/hmw-questions` | Criar HMW |
| PUT | `/api/hmw-questions/:id` | Atualizar HMW |
| DELETE | `/api/hmw-questions/:id` | Deletar HMW |
| GET | `/api/projects/:id/problem-statements` | Listar problemas |
| POST | `/api/projects/:id/problem-statements` | Criar problema |
| PUT | `/api/problem-statements/:id` | Atualizar problema |
| DELETE | `/api/problem-statements/:id` | Deletar problema |

### Fase 3: Idear

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects/:id/ideas` | Listar ideias |
| POST | `/api/projects/:id/ideas` | Criar ideia |
| PUT | `/api/ideas/:id` | Atualizar ideia |
| DELETE | `/api/ideas/:id` | Deletar ideia |
| POST | `/api/ideas/:id/vote` | Votar em ideia |
| GET | `/api/projects/:id/idea-categories` | Listar categorias |
| POST | `/api/projects/:id/idea-categories` | Criar categoria |
| PUT | `/api/idea-categories/:id` | Atualizar categoria |
| DELETE | `/api/idea-categories/:id` | Deletar categoria |
| GET | `/api/projects/:id/canvas-drawings` | Listar desenhos canvas |
| POST | `/api/projects/:id/canvas-drawings` | Salvar desenho canvas |
| PUT | `/api/canvas-drawings/:id` | Atualizar desenho |
| DELETE | `/api/canvas-drawings/:id` | Deletar desenho |

### Fase 4: Prototipar

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects/:id/prototypes` | Listar protótipos |
| POST | `/api/projects/:id/prototypes` | Criar protótipo |
| PUT | `/api/prototypes/:id` | Atualizar protótipo |
| DELETE | `/api/prototypes/:id` | Deletar protótipo |

### Fase 5: Testar

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects/:id/test-plans` | Listar planos de teste |
| POST | `/api/projects/:id/test-plans` | Criar plano |
| PUT | `/api/test-plans/:id` | Atualizar plano |
| DELETE | `/api/test-plans/:id` | Deletar plano |
| GET | `/api/test-plans/:id/results` | Listar resultados |
| POST | `/api/test-plans/:id/results` | Criar resultado |
| PUT | `/api/test-results/:id` | Atualizar resultado |
| DELETE | `/api/test-results/:id` | Deletar resultado |

### Exportação

| Método | Endpoint | Descrição | Formato |
|--------|----------|-----------|---------|
| GET | `/api/projects/:id/export-pdf` | Exportar projeto como PDF | application/pdf |
| GET | `/api/projects/:id/export-pptx` | Exportar projeto como PowerPoint | application/vnd.openxmlformats... |
| GET | `/api/projects/:id/export-markdown` | Exportar projeto como Markdown | text/markdown |

### IA e Chat

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/chat` | Enviar mensagem para IA mentor | Gemini AI |
| POST | `/api/chat/suggestions` | Gerar sugestões baseadas em contexto | Gemini AI |

### Biblioteca

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/articles` | Listar artigos | Sim |
| GET | `/api/articles/:id` | Detalhes do artigo | Sim |
| POST | `/api/articles` | Criar artigo | Admin |
| PUT | `/api/articles/:id` | Atualizar artigo | Admin |
| DELETE | `/api/articles/:id` | Deletar artigo | Admin |

### Assinaturas e Pagamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/subscription-plans` | Listar planos disponíveis | Não |
| GET | `/api/subscription-plans/:id` | Detalhes do plano | Não |
| POST | `/api/create-checkout-session` | Criar sessão Stripe Checkout | Sim |
| GET | `/api/subscription/status` | Status da assinatura do usuário | Sim |
| POST | `/api/subscription/cancel` | Cancelar assinatura | Sim |
| POST | `/api/webhook/stripe` | Webhook Stripe (events) | Não (Stripe) |

### Benchmarking

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects/:id/dvf-assessments` | Listar avaliações DVF |
| POST | `/api/projects/:id/dvf-assessments` | Criar avaliação DVF |
| GET | `/api/projects/:id/lovability-metrics` | Métricas de lovability |
| POST | `/api/projects/:id/lovability-metrics` | Criar métricas |
| GET | `/api/projects/:id/benchmarking-data` | Dados completos de benchmarking |
| POST | `/api/projects/:id/benchmarking-recommendations` | Gerar recomendações IA |

### Admin

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/admin/users` | Listar todos os usuários | Admin |
| PUT | `/api/admin/users/:id` | Atualizar usuário | Admin |
| DELETE | `/api/admin/users/:id` | Deletar usuário | Admin |
| GET | `/api/admin/stats` | Estatísticas gerais | Admin |

### Progresso do Usuário

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/user-progress` | Progresso do usuário logado |
| PUT | `/api/user-progress` | Atualizar progresso |
| POST | `/api/user-progress/award-badge` | Conceder badge |

---

## 7. Funcionalidades Principais

### 7.1 Sistema de Autenticação e Perfil

**Features:**
- ✅ Registro com email + senha + confirmação
- ✅ Login com email ou username (backward compatibility)
- ✅ Indicador de força de senha
- ✅ Perfil completo: foto, bio, city, phone, interests
- ✅ Roles: admin e user
- ✅ Sessions persistentes (PostgreSQL)

**Implementação:**
- Backend: Passport.js + bcrypt
- Frontend: AuthContext com React Context API
- Segurança: Sessions em DB, HTTPS only, password hashing

### 7.2 As 5 Fases do Design Thinking

#### Fase 1: Empatizar
**Ferramentas:**
1. **Mapa de Empatia** - Quadrantes: Says, Thinks, Does, Feels
2. **Personas** - Perfis detalhados com foto, bio, goals, frustrations
3. **Entrevistas** - Perguntas, respostas e insights
4. **Observações de Campo** - Local, contexto, observações, imagens
5. **Jornada do Usuário** - Etapas, touchpoints, emoções, pain points

#### Fase 2: Definir
**Ferramentas:**
1. **POV Statements** - User + Need + Insight
2. **How Might We** - Perguntas para redefinir problemas
3. **Problem Statements** - Target + Problem + Goal

#### Fase 3: Idear
**Ferramentas:**
1. **Brainstorming de Ideias** - Título, descrição, categoria
2. **Categorização** - Organização em categorias coloridas
3. **Votação** - Sistema de votos para priorizar ideias
4. **Canvas de Desenho** - Fabric.js para desenhar ideias
5. **Avaliação DVF** - Desejabilidade, Viabilidade, Exequibilidade

#### Fase 4: Prototipar
**Ferramentas:**
1. **Gerenciamento de Protótipos** - Digital, físico, storyboard
2. **Versionamento** - Iterações e notas de mudança
3. **Upload de Imagens** - Imagens em base64
4. **Canvas de Desenho** - Protótipos visuais
5. **Materiais** - Lista de materiais necessários

#### Fase 5: Testar
**Ferramentas:**
1. **Planos de Teste** - Metodologia, público-alvo, objetivos
2. **Critérios de Sucesso** - Definição de métricas
3. **Resultados de Teste** - Findings, feedback, métricas
4. **Insights** - Análise e próximos passos
5. **Métricas de Lovability** - NPS, satisfação, engajamento

### 7.3 Chat IA com Mentor

**Features:**
- ✅ Google Gemini 2.5 Flash (custo-efetivo)
- ✅ Contexto de projeto (nome, descrição, fase atual)
- ✅ Sugestões personalizadas por fase
- ✅ Histórico de conversas
- ✅ Ajuda específica para cada fase do DT

**Implementação:**
- Backend: `geminiService.ts` com prompts especializados
- Frontend: Interface de chat com seleção de projeto
- Fallback: Mensagens amigáveis se API falhar

### 7.4 Sistema de Exportação

**Formatos Suportados:**
1. **PDF** - Relatório completo com template branded
2. **PowerPoint** - Apresentação profissional com slides por fase
3. **Markdown** - Formato de texto estruturado

**Template Branding:**
- Logo "Design Thinking Tools"
- Cores: Blue (#2563EB), Green (#10B981)
- Bordas pontilhadas
- Layout consistente

**Implementação:**
- PDF: `reportGenerator.ts` usando jsPDF
- PPTX: `pptxService.ts` usando pptxgenjs
- Segurança: Verificação de ownership antes de exportar

### 7.5 Gamificação e Progresso

**Sistema de Pontos:**
- Criar projeto: 50 pontos
- Completar ferramenta: 10-30 pontos por tipo
- Completar fase: 100 pontos

**Badges:**
- "First Steps" - Primeiro projeto criado
- "Empathy Master" - 10 mapas de empatia
- "Idea Generator" - 50 ideias geradas
- "Prototype Pro" - 5 protótipos criados
- "Testing Expert" - 10 testes realizados

**Níveis:**
1. Iniciante (0-99 pontos)
2. Intermediário (100-499 pontos)
3. Avançado (500-999 pontos)
4. Expert (1000+ pontos)

### 7.6 Benchmarking e Análise

**Avaliação DVF:**
- Desejabilidade (1-10): O usuário quer isso?
- Viabilidade (1-10): É tecnicamente possível?
- Exequibilidade (1-10): É sustentável financeiramente?
- Recomendação: Proceed / Modify / Stop

**Métricas de Lovability:**
- **NPS Score**: Net Promoter Score
- **Satisfaction Score**: Nota média de satisfação
- **Engagement Rate**: Taxa de engajamento
- **Emotional Distribution**: Distribuição de emoções
- **Overall Score**: Score geral de lovability

**Recomendações IA:**
- Análise cruzada de dados
- Identificação de gaps competitivos
- Sugestões de melhoria
- Próximos passos priorizados

### 7.7 Sistema de Assinaturas (Stripe)

**Planos:**

| Plano | Preço/mês | Usuários | Projetos | Features |
|-------|-----------|----------|----------|----------|
| **Free** | R$ 0 | 1 | 1 | Básico |
| **Pro** | R$ 99 | 3 | 10 | Completo + IA |
| **Enterprise** | R$ 299 | 10 + R$29.90/adicional | Ilimitado | Tudo + SSO + Suporte 24/7 |

**Implementação:**
- Stripe Checkout Sessions
- Webhooks para sincronizar status
- Upgrade/downgrade automático
- Cancel at period end
- Billing portal

### 7.8 Internacionalização (i18n)

**Idiomas Suportados:**
- 🇧🇷 Português Brasileiro (padrão)
- 🇺🇸 Inglês
- 🇪🇸 Espanhol
- 🇫🇷 Francês

**Implementação:**
- Context API (`LanguageContext`)
- Tradução de interface completa
- Conversão de moeda automática (BRL, USD, EUR)
- Formatação de datas/números por locale

### 7.9 Biblioteca de Conteúdo

**Features:**
- ✅ Artigos sobre Design Thinking
- ✅ Categorias: Fase 1-5, Geral, Avançado
- ✅ Sistema de tags
- ✅ Busca e filtros
- ✅ Markdown rendering
- ✅ CRUD admin

**Conteúdo Padrão:**
- 6 artigos iniciais sobre DT
- Guias para cada fase
- Best practices
- Casos de estudo

### 7.10 Canvas de Desenho

**Features:**
- ✅ Fabric.js para manipulação
- ✅ Ferramentas: Pincel, Formas, Texto, Apagar
- ✅ Cores e espessuras ajustáveis
- ✅ Salvar como base64 ou JSON
- ✅ Responsivo (800-1400px)

**Uso:**
- Desenhar ideias na Fase 3
- Protótipos visuais na Fase 4
- Storyboards
- Wireframes

---

## 8. Fluxo de Dados

### 8.1 Fluxo de Autenticação

```
1. User submits email + password
   ↓
2. Frontend: zodResolver validation
   ↓
3. POST /api/auth/login
   ↓
4. Backend: Passport.js authentication
   ↓
5. Bcrypt compare password
   ↓
6. Create session in PostgreSQL
   ↓
7. Return session cookie + user data
   ↓
8. Frontend: Update AuthContext
   ↓
9. Redirect to /dashboard
```

### 8.2 Fluxo de Criação de Projeto

```
1. User clicks "Novo Projeto"
   ↓
2. Fill form: name, description, industry
   ↓
3. Frontend validation (Zod)
   ↓
4. POST /api/projects
   ↓
5. Backend: Check user subscription limits
   ↓
6. Create project in database
   ↓
7. Award "First Steps" badge if first project
   ↓
8. Return project data
   ↓
9. TanStack Query: Invalidate '/api/projects'
   ↓
10. Redirect to /projects/:id
```

### 8.3 Fluxo de Export (PDF/PPTX)

```
1. User clicks "Exportar PDF"
   ↓
2. GET /api/projects/:id/export-pdf
   ↓
3. Backend: Verify ownership (userId)
   ↓
4. Fetch all project data (empathy maps, personas, etc.)
   ↓
5. Generate PDF with jsPDF
   ↓
6. Set headers: Content-Type, Content-Disposition
   ↓
7. res.end(pdfBuffer)
   ↓
8. Browser downloads file
```

### 8.4 Fluxo de Chat IA

```
1. User selects project + types message
   ↓
2. Context: { projectId, projectName, currentPhase }
   ↓
3. POST /api/chat { messages, context }
   ↓
4. Backend: Build Gemini prompt with project context
   ↓
5. Call Gemini API
   ↓
6. Return AI response
   ↓
7. Frontend: Add message to chat history
   ↓
8. Generate suggestions for next question
```

### 8.5 Fluxo de Pagamento (Stripe)

```
1. User selects plan on /pricing
   ↓
2. Click "Assinar"
   ↓
3. POST /api/create-checkout-session { planId, billingPeriod }
   ↓
4. Backend: Create Stripe Checkout Session
   ↓
5. Return session URL
   ↓
6. Redirect to Stripe Checkout
   ↓
7. User completes payment
   ↓
8. Stripe webhook → POST /api/webhook/stripe
   ↓
9. Backend: Update user subscription
   ↓
10. User redirected to /dashboard
```

---

## 9. Segurança e Autenticação

### 9.1 Segurança de Senhas

- **Hashing**: bcrypt com salt rounds = 10
- **Validação**: Mínimo 8 caracteres, indicador de força
- **Armazenamento**: Apenas hash no banco, nunca texto plano

### 9.2 Sessions

- **Storage**: PostgreSQL (connect-pg-simple)
- **Persistência**: Sessions sobrevivem restart do servidor
- **Timeout**: 7 dias de inatividade
- **Cookie**: httpOnly, secure (HTTPS only), sameSite: lax

### 9.3 Autorização

- **Middleware**: `requireAuth` verifica sessão
- **Role-based**: Rotas admin verificam `user.role === 'admin'`
- **Ownership**: Todas as queries filtram por userId

### 9.4 Proteção de Dados

- **SQL Injection**: Drizzle ORM com prepared statements
- **XSS**: React escapa HTML automaticamente
- **CSRF**: SameSite cookies + HTTPS
- **Rate Limiting**: express-rate-limit em /api/auth/login

### 9.5 HTTPS e SSL

- **Produção**: Render.com fornece SSL automático
- **Database**: PostgreSQL com SSL `{ rejectUnauthorized: false }`
- **Cookies**: Secure flag ativo em produção

### 9.6 Secrets Management

- **Environment Variables**: DATABASE_URL, SESSION_SECRET, STRIPE_SECRET_KEY, GEMINI_API_KEY
- **Render**: Secrets configurados no dashboard
- **Development**: .env local (não commitado)

---

## 10. Deploy e Infraestrutura

### 10.1 Arquitetura de Hosting

```
Domain: www.designthinkingtools.com
   ↓ (DNS)
Render.com Load Balancer
   ↓
Web Service (dttools-app)
   ├── Frontend: dist/public/ (static files)
   └── Backend: dist/index.js (Node.js)
   ↓ (PostgreSQL connection)
Render PostgreSQL Database (dttools-db)
```

### 10.2 Configuração Render.com

**render.yaml:**
```yaml
services:
  - type: web
    name: dttools-app
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase: dttools-db
      - key: SESSION_SECRET
        generateValue: true

databases:
  - name: dttools-db
    plan: free
    databaseName: dttools
```

### 10.3 Build Process

**Frontend Build (Vite):**
```bash
vite build
→ dist/public/index.html
→ dist/public/assets/*.js
→ dist/public/assets/*.css
```

**Backend Build (esbuild):**
```bash
esbuild server/index.ts --bundle --format=esm
→ dist/index.js (256kb)
```

**Total Build Time:** ~25 segundos

### 10.4 Environment Variables

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `NODE_ENV` | Required | `production` |
| `DATABASE_URL` | Required | PostgreSQL connection string |
| `SESSION_SECRET` | Required | Secret para sessions |
| `GEMINI_API_KEY` | Optional | Para chat IA |
| `STRIPE_SECRET_KEY` | Optional | Para pagamentos |
| `STRIPE_WEBHOOK_SECRET` | Optional | Para webhooks Stripe |
| `PORT` | Auto | Porta do servidor (default: 10000) |

### 10.5 Database Management

**Migrations:**
```bash
# Sync schema to database
npm run db:push

# Force sync (ignore warnings)
npm run db:push -- --force
```

**Connection Pool:**
- Max connections: 50
- SSL: Ativo em produção
- Timeout: 30 segundos

### 10.6 Monitoring e Logs

**Logs Disponíveis:**
- Application logs (stdout)
- Error logs (stderr)
- Database query logs
- HTTP request logs

**Status Checks:**
- Health endpoint: `/api/auth/me`
- Expected: 200 (authenticated) ou 401 (not authenticated)
- Timeout: 30s

### 10.7 Performance

**Frontend:**
- Vite code splitting
- Lazy loading de páginas
- Image optimization (Sharp)
- Gzip compression

**Backend:**
- PostgreSQL connection pooling
- Express compression middleware
- Cached queries (TanStack Query)

**Database:**
- Indexes em foreign keys
- Composite indexes em queries frequentes

### 10.8 Backup e Recovery

**Database Backup:**
- Render PostgreSQL: Backups automáticos diários
- Retention: 7 dias (free plan)
- Restore: Via dashboard do Render

**Code Rollback:**
- Git tags para releases
- Rollback via Render dashboard
- Version control no GitHub

---

## 11. Desenvolvimento Local

### 11.1 Setup Inicial

```bash
# Clone do repositório
git clone [repo-url]
cd dttools

# Install dependencies
npm install

# Setup database
DATABASE_URL="postgresql://user:pass@localhost/dttools" npm run db:push

# Start development server
npm run dev
```

### 11.2 Development Mode

**Frontend (Vite):**
- Hot Module Replacement (HMR)
- Porta: 5000
- Proxy: Requests /api/* → backend

**Backend (tsx):**
- Watch mode automático
- Porta: 5001 (exemplo)
- Restart on file changes

### 11.3 Ferramentas de Debug

- React DevTools (extensão browser)
- TanStack Query DevTools (embutido)
- PostgreSQL GUI (TablePlus, DBeaver)
- Browser Network tab

---

## 12. Próximos Passos e Roadmap

### Features Planejadas

**Q1 2026:**
- [ ] Colaboração em tempo real (WebSockets)
- [ ] Comentários e feedback em ferramentas
- [ ] Notificações push
- [ ] Mobile app (React Native)

**Q2 2026:**
- [ ] Integração com Miro/Figma
- [ ] Templates de projeto
- [ ] API pública para integrações
- [ ] White-label para empresas

**Q3 2026:**
- [ ] Analytics avançado
- [ ] Machine Learning para sugestões
- [ ] Versioning de projetos
- [ ] Import de dados externos

### Melhorias Técnicas

- [ ] Migration para React Server Components
- [ ] WebSockets para real-time
- [ ] GraphQL API
- [ ] Testes automatizados (Jest, Playwright)
- [ ] CI/CD pipeline (GitHub Actions)

---

## 13. Contato e Suporte

**Emails de Suporte:**
- support@dttools.app - Suporte geral
- bugs@dttools.app - Reportar bugs
- feedback@dttools.app - Sugestões
- enterprise@dttools.app - Vendas enterprise

**Documentação:**
- Site: https://www.designthinkingtools.com
- Help Center: /support
- Privacy Policy: /privacy-policy
- Terms of Service: /terms

---

**Versão do Documento:** 1.0.0  
**Última Atualização:** 16 de Outubro de 2025  
**Autor:** DTTools Development Team
