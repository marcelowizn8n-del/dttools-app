# DTTools - Inventário Completo de Arquivos do Projeto

## 📁 Estrutura Geral do Projeto

Este documento lista **todos os arquivos** do projeto DTTools, organizados por categoria e função.

---

## 🔧 Arquivos de Configuração Raiz

### Configurações de Build e Dependências
- `package.json` - Dependências npm e scripts do projeto
- `package-lock.json` - Lockfile de dependências (não editar manualmente)
- `tsconfig.json` - Configuração TypeScript (target ES2020, module ESNext)
- `vite.config.ts` - Configuração Vite (build tool, aliases, plugins)
- `tailwind.config.ts` - Configuração Tailwind CSS (theme, colors, plugins)
- `drizzle.config.ts` - Configuração Drizzle ORM (database connection, migrations)
- `components.json` - Configuração shadcn/ui (style, aliases)

### Deploy e Infraestrutura
- `render.yaml` - Configuração Render.com (web service + database)
- `vercel.json` - Configuração Vercel (descontinuado, agora usa Render)
- `netlify.toml` - Configuração Netlify (descontinuado, agora usa Render)

### Documentação e Gestão de Projeto
- `replit.md` - **Arquivo central de memória do projeto** (arquitetura, changes, user preferences)
- `README.md` - Documentação principal do projeto
- `.gitignore` - Arquivos ignorados pelo Git

---

## 📂 CLIENT - Frontend React

### 📄 client/src/ - Código-Fonte Frontend

#### Arquivos Principais
- `main.tsx` - **Entry point da aplicação** (renders App, setup providers)
- `App.tsx` - **Router e layout global** (define todas as rotas)
- `index.css` - **Estilos globais e variáveis CSS** (Tailwind base, theme variables)

#### Contexts (Estado Global)
- `contexts/AuthContext.tsx` - **Autenticação** (login, logout, user state)
- `contexts/LanguageContext.tsx` - **Internacionalização** (i18n pt-BR, en, es, fr)

#### Hooks Customizados
- `hooks/use-toast.ts` - Toast notifications (Radix UI)
- `hooks/use-mobile.tsx` - Detecção de dispositivo mobile

#### Lib (Utilitários e Configurações)
- `lib/queryClient.ts` - **TanStack Query setup** (default fetcher, config)
- `lib/utils.ts` - Função `cn()` para merge de classNames
- `lib/reportGenerator.ts` - **Geração de PDFs** (jsPDF com templates)
- `lib/aiLearning.ts` - Sistema de aprendizado de IA

#### Utils
- `utils/screenshot-generator.ts` - Captura de screenshots (html2canvas)

---

### 📱 client/src/pages/ - Páginas da Aplicação

#### Autenticação e Perfil
- `login.tsx` - Página de login (email + senha)
- `signup.tsx` - Página de registro (email + senha + confirmação)
- `complete-profile.tsx` - Completar perfil (foto, bio, city, phone)
- `profile.tsx` - Visualizar/editar perfil do usuário

#### Dashboard e Projetos
- `dashboard.tsx` - **Dashboard principal** (overview, métricas, progresso)
- `landing.tsx` - Landing page para não-autenticados
- `projects.tsx` - **Lista de projetos** do usuário
- `projects-marketing.tsx` - Página de marketing de projetos
- `project-detail.tsx` - **Detalhes do projeto** (ferramentas por fase)

#### Funcionalidades Principais
- `chat.tsx` - **Chat com IA mentor** (Gemini AI)
- `library.tsx` - **Biblioteca de artigos** sobre Design Thinking
- `article-detail.tsx` - Detalhes de artigo individual
- `benchmarking.tsx` - **Análise de benchmarking e maturidade**

#### Administrativo
- `admin.tsx` - **Painel administrativo** (users, articles, plans, stats)

#### Informacionais e Suporte
- `pricing.tsx` - **Planos de assinatura** (Free, Pro, Team, Enterprise)
- `HelpCenter.tsx` - Central de ajuda e FAQ
- `support.tsx` - Página de suporte e contato
- `privacy-policy.tsx` - Política de privacidade (LGPD compliant)
- `terms.tsx` - Termos de uso
- `not-found.tsx` - Página 404

---

### 🧩 client/src/components/ - Componentes React

#### Componentes de Autenticação (auth/)
- `auth/LoginForm.tsx` - Formulário de login
- `auth/SignupForm.tsx` - Formulário de cadastro
- `auth/CompleteProfileForm.tsx` - Formulário de completar perfil
- `auth/UserMenu.tsx` - Menu dropdown do usuário (header)

#### Componentes de Dashboard
- `Header.tsx` - Cabeçalho da aplicação (logo, navegação, user menu)
- `Sidebar.tsx` - Sidebar de navegação
- `MetricsGrid.tsx` - Grid de métricas (dashboard)
- `ProgressChart.tsx` - Gráfico de progresso (recharts)
- `TeamPerformance.tsx` - Performance da equipe
- `RecentReports.tsx` - Relatórios recentes
- `AIInsights.tsx` - Insights gerados por IA
- `IntegrationStatus.tsx` - Status de integrações
- `ToolsSummary.tsx` - Resumo de ferramentas utilizadas
- `AnalysisReport.tsx` - Relatório de análise
- `BackupManager.tsx` - Gerenciador de backups
- `KanbanBoard.tsx` - Board Kanban
- `LanguageSelector.tsx` - Seletor de idioma
- `ScreenshotCapture.tsx` - Captura de screenshots

#### Componentes Admin (admin/)
- `admin/ArticleEditor.tsx` - Editor de artigos (WYSIWYG)

#### Componentes de Benchmarking (benchmarking/)
- `benchmarking/AIRecommendations.tsx` - Recomendações de IA
- `benchmarking/CompetitiveAnalysis.tsx` - Análise competitiva
- `benchmarking/DvfAssessment.tsx` - Avaliação DVF (Desejabilidade, Viabilidade, Exequibilidade)
- `benchmarking/LovabilityMetrics.tsx` - Métricas de Lovability (NPS, satisfação)
- `benchmarking/ProjectAnalytics.tsx` - Analytics do projeto

#### Componentes Fase 1: Empatizar (phase1/)
- `phase1/Phase1Tools.tsx` - Container das ferramentas da Fase 1
- `phase1/EmpathyMapTool.tsx` - Mapa de Empatia
- `phase1/PersonaTool.tsx` - Criação de Personas
- `phase1/InterviewTool.tsx` - Entrevistas com usuários
- `phase1/ObservationTool.tsx` - Observações de campo
- `phase1/EditEmpathyMapDialog.tsx` - Dialog para editar mapa de empatia
- `phase1/EditPersonaDialog.tsx` - Dialog para editar persona
- `phase1/EditInterviewDialog.tsx` - Dialog para editar entrevista
- `phase1/EditObservationDialog.tsx` - Dialog para editar observação

#### Componentes Fase 2: Definir (phase2/)
- `phase2/Phase2Tools.tsx` - Container das ferramentas da Fase 2
- `phase2/PovStatementTool.tsx` - POV Statements (User + Need + Insight)
- `phase2/HmwQuestionTool.tsx` - How Might We Questions
- `phase2/EditPovStatementDialog.tsx` - Dialog para editar POV
- `phase2/EditHmwQuestionDialog.tsx` - Dialog para editar HMW

#### Componentes Fase 3: Idear (phase3/)
- `phase3/Phase3Tools.tsx` - Container das ferramentas da Fase 3
- `phase3/IdeaTool.tsx` - Brainstorming de ideias
- `phase3/IdeaDrawingTool.tsx` - Canvas de desenho para ideias (Fabric.js)
- `phase3/EditIdeaDialog.tsx` - Dialog para editar ideia

#### Componentes Fase 4: Prototipar (phase4/)
- `phase4/Phase4Tools.tsx` - Container das ferramentas da Fase 4
- `phase4/PrototypeTool.tsx` - Gerenciamento de protótipos
- `phase4/PrototypeDrawingTool.tsx` - Canvas de desenho para protótipos
- `phase4/EditPrototypeDialog.tsx` - Dialog para editar protótipo

#### Componentes Fase 5: Testar (phase5/)
- `phase5/Phase5Tools.tsx` - Container das ferramentas da Fase 5
- `phase5/TestPlanTool.tsx` - Planos de teste
- `phase5/TestResultTool.tsx` - Resultados de testes
- `phase5/EditTestPlanDialog.tsx` - Dialog para editar plano de teste

#### Componentes UI (ui/) - shadcn/ui Library

**Layout:**
- `ui/card.tsx` - Componente Card (header, content, footer)
- `ui/separator.tsx` - Separador horizontal/vertical
- `ui/scroll-area.tsx` - Área de scroll customizada
- `ui/aspect-ratio.tsx` - Container com aspect ratio fixo
- `ui/resizable.tsx` - Painéis redimensionáveis

**Formulários:**
- `ui/form.tsx` - Form wrapper (React Hook Form)
- `ui/input.tsx` - Input de texto
- `ui/textarea.tsx` - Textarea
- `ui/label.tsx` - Label para inputs
- `ui/button.tsx` - Botão (variants: default, destructive, outline, ghost, link)
- `ui/checkbox.tsx` - Checkbox
- `ui/radio-group.tsx` - Grupo de radio buttons
- `ui/select.tsx` - Select dropdown
- `ui/switch.tsx` - Switch toggle
- `ui/slider.tsx` - Slider numérico
- `ui/input-otp.tsx` - Input de OTP (códigos)
- `ui/calendar.tsx` - Seletor de data
- `ui/image-upload.tsx` - Upload de imagens

**Navegação:**
- `ui/tabs.tsx` - Tabs horizontais
- `ui/accordion.tsx` - Accordion expansível
- `ui/breadcrumb.tsx` - Breadcrumb de navegação
- `ui/navigation-menu.tsx` - Menu de navegação complexo
- `ui/menubar.tsx` - Barra de menu
- `ui/pagination.tsx` - Paginação
- `ui/sidebar.tsx` - Sidebar component

**Overlays:**
- `ui/dialog.tsx` - Dialog modal
- `ui/alert-dialog.tsx` - Alert dialog (confirmação)
- `ui/sheet.tsx` - Slide-over panel
- `ui/drawer.tsx` - Drawer (mobile-first)
- `ui/popover.tsx` - Popover flutuante
- `ui/tooltip.tsx` - Tooltip
- `ui/hover-card.tsx` - Hover card
- `ui/context-menu.tsx` - Menu de contexto (right-click)
- `ui/dropdown-menu.tsx` - Dropdown menu

**Feedback:**
- `ui/toast.tsx` - Toast notification component
- `ui/toaster.tsx` - Toast container
- `ui/alert.tsx` - Alert message
- `ui/progress.tsx` - Barra de progresso
- `ui/skeleton.tsx` - Skeleton loading state
- `ui/badge.tsx` - Badge/pill

**Data Display:**
- `ui/table.tsx` - Tabela responsiva
- `ui/avatar.tsx` - Avatar de usuário
- `ui/chart.tsx` - Gráficos (recharts wrapper)
- `ui/carousel.tsx` - Carrossel de imagens

**Outros:**
- `ui/command.tsx` - Command palette (busca)
- `ui/collapsible.tsx` - Container expansível
- `ui/toggle.tsx` - Toggle button
- `ui/toggle-group.tsx` - Grupo de toggles

---

### 📦 client/public/ - Assets Públicos
- `manifest.json` - PWA manifest (name, icons, theme_color)
- `favicon.ico` - Favicon do site
- `logo-horizontal.png` - Logo horizontal da marca
- `logo-icon.png` - Ícone da marca

---

## 🔙 SERVER - Backend Node.js

### server/ - Código-Fonte Backend

#### Arquivos Principais
- `index.ts` - **Entry point do servidor** (Express setup, middlewares, routes)
- `routes.ts` - **Todas as rotas API** (100+ endpoints REST)
- `storage.ts` - **Interface de storage** (DB abstraction layer)
- `db.ts` - **Configuração PostgreSQL** (pool, connection)
- `vite.ts` - Integração com Vite dev server (apenas development)

#### Serviços
- `geminiService.ts` - **Google Gemini AI** integration (chat mentor)
- `pptxService.ts` - **Geração de PowerPoint** (pptxgenjs)

#### Middleware
- `middleware/auth.ts` - Middleware de autenticação (requireAuth, requireAdmin)

---

## 🗄️ SHARED - Código Compartilhado

### shared/ - Schemas e Types

- `schema.ts` - **FONTE DE VERDADE**: Database schema completo (Drizzle ORM)
  - **23 Tabelas**: users, projects, empathy_maps, personas, interviews, field_observations, user_journeys, pov_statements, hmw_questions, problem_statements, ideas, idea_categories, canvas_drawings, prototypes, test_plans, test_results, user_progress, user_subscriptions, subscription_plans, articles, help_articles, dvf_assessments, lovability_metrics
  - Zod schemas para validação (insertSchema, selectType)
- `schema-sqlite.ts` - Schema alternativo SQLite (descontinuado, agora usa PostgreSQL)

---

## 📊 MIGRATIONS - Migrações de Database

### migrations/ - Drizzle Migrations

- `meta/0000_snapshot.json` - Snapshot inicial do schema
- `meta/_journal.json` - Journal de migrações aplicadas
- **Nota**: Nunca editar manualmente, usar `npm run db:push`

---

## 📁 DIST - Build de Produção

### dist/ - Arquivos Compilados

**Frontend:**
- `public/index.html` - HTML principal
- `public/assets/*.js` - JavaScript bundles (code-split)
- `public/assets/*.css` - CSS compilado
- `public/*.png` - Assets estáticos

**Backend:**
- `index.js` - Backend compilado (esbuild, ~256KB)

---

## 📄 DOCUMENTAÇÃO - Arquivos Markdown

### Documentação Técnica
- `DOCUMENTACAO_TECNICA_COMPLETA.md` - **Este documento**: Documentação técnica completa
- `guia_tecnico_implementacao.md` - Guia técnico de implementação
- `ANALISE_ESCALABILIDADE_SISTEMA.md` - Análise de escalabilidade

### Planos de Negócio
- `PLANO_NEGOCIO_DTTOOLS.md` - Plano de negócios (versão antiga)
- `dttools_pitch_deck.md` - Pitch deck para investidores

### Guias de Deploy
- `DEPLOYMENT_GUIDE.md` - Guia geral de deploy
- `DEPLOY_URGENTE.md` - Deploy urgente
- `DEPLOY-FIX-README.md` - Correções de deploy
- `RENDER_DEPLOY.md` - **Guia de deploy no Render.com**
- `GUIA_NETLIFY_DTTOOLS.md` - Deploy no Netlify (descontinuado)
- `BACKUP_E_DEPLOY_NETLIFY.md` - Backup Netlify (descontinuado)
- `migracao-dttools-staycloud.md` - Migração StayCloud

### Guias de Configuração
- `CONFIGURACAO_DOMINIO_DNS_DTTOOLS.md` - Configuração de DNS
- `ADMIN_PLANOS_TAB_FIX.md` - Fix na aba de planos admin

### App Store e Mobile
- `APP_STORE_READINESS_CHECKLIST.md` - Checklist para submissão
- `APP_STORE_SUBMISSION_GUIDE.md` - Guia de submissão
- `GUIA_SUBMISSAO_APP_STORES.md` - Guia de submissão (português)
- `app_store_materials.md` - Materiais para App Store

### Manuais de Usuário
- `manual_usuario_dttools.md` - Manual do usuário (minúscula)
- `MANUAL_USUARIO_DTTOOLS.md` - Manual do usuário (maiúscula)
- `MANUAL_ADMIN_DTTOOLS.md` - Manual do administrador

### Materiais de Marketing
- `MATERIAL_DIVULGACAO_DTTOOLS.md` - Material de divulgação
- `PACOTE_COMPLETO_DTTOOLS.md` - Pacote completo de marketing
- `PACOTE_COMPLETO_SCREENSHOTS.md` - Screenshots para marketing
- `marketing_one_pager.md` - One-pager de marketing
- `marketing-social-media.md` - Conteúdo para redes sociais
- `DESIGN_ALTERNATIVES.md` - Alternativas de design

### GitHub e Upload
- `DTTOOLS_GITHUB_UPLOAD_GUIDE.md` - Guia de upload para GitHub
- `GITHUB_UPLOAD_CHECKLIST.md` - Checklist de upload
- `DOWNLOAD_INSTRUCOES.md` - Instruções de download

### Wireframes e Design
- `WIREFRAMES_PACKAGE_COMPLETE.md` - Pacote completo de wireframes
- `FIGMA_WIREFRAMES_GUIDE.md` - Guia de wireframes no Figma
- `GOFULLPAGE_EXTENSION_GUIDE.md` - Extensão GoFullPage

---

## 📣 MARKETING - Materiais de Marketing

### marketing/ - Pasta de Marketing

#### App Store
- `marketing/app-store-apple.md` - Submissão Apple App Store
- `marketing/app-store-google.md` - Submissão Google Play Store

#### Calendário e Estratégia
- `marketing/CALENDARIO_LANCAMENTO_2025.md` - Calendário de lançamento

#### Conteúdo para Redes Sociais
- `marketing/instagram-content.md` - Conteúdo Instagram
- `marketing/INSTAGRAM_POSTS_2025.md` - Posts Instagram 2025
- `marketing/linkedin-content.md` - Conteúdo LinkedIn
- `marketing/LINKEDIN_POSTS_2025.md` - Posts LinkedIn 2025
- `marketing/FACEBOOK_POSTS_2025.md` - Posts Facebook 2025

#### Manuais
- `marketing/manual-de-uso.md` - Manual de uso para usuários

#### Pacote Completo
- `marketing/PACOTE_COMPLETO_MARKETING_2025.md` - Pacote completo 2025

---

### marketing_dttools/ - Pasta Alternativa de Marketing

#### Documentação
- `marketing_dttools/docs/DOCUMENTACAO_COMPLETA_DTTOOLS.md` - Documentação completa
- `marketing_dttools/docs/CRONOGRAMA_PUBLICACOES.md` - Cronograma de publicações
- `marketing_dttools/docs/ESTRATEGIA_REDES_SOCIAIS.md` - Estratégia de redes sociais
- `marketing_dttools/docs/GUIA_USO_MATERIAIS.md` - Guia de uso de materiais

#### Posts por Plataforma
- `marketing_dttools/facebook/posts_facebook.md` - Posts Facebook
- `marketing_dttools/instagram/posts_instagram.md` - Posts Instagram
- `marketing_dttools/linkedin/posts_linkedin.md` - Posts LinkedIn
- `marketing_dttools/medium/artigo_completo.md` - Artigo completo para Medium

---

### marketing_materials/ - Pasta de Materiais

#### App Store
- `marketing_materials/app_store/App_Store_Submission_Guide.md` - Guia de submissão
- `marketing_materials/app_store/Screenshots_Specifications.md` - Especificações de screenshots

#### Checklists
- `marketing_materials/launch_checklist.md` - Checklist de lançamento

#### Manuais
- `marketing_materials/manuals/Manual_Administrador_DTTools.md` - Manual do admin
- `marketing_materials/manuals/Manual_Usuario_DTTools.md` - Manual do usuário

#### Apresentação
- `marketing_materials/presentation/DTTools_Presentation_Script.md` - Script de apresentação

#### Redes Sociais
- `marketing_materials/social_media/Instagram_Posts.md` - Posts Instagram
- `marketing_materials/social_media/LinkedIn_Posts.md` - Posts LinkedIn
- `marketing_materials/social_media/X_Twitter_Posts.md` - Posts Twitter/X

#### README
- `marketing_materials/README_Marketing_Package.md` - README do pacote de marketing

---

## 🔒 ATTACHED_ASSETS - Assets Anexados

### attached_assets/ - Imagens e Arquivos Anexados

**Imagens:**
- 200+ arquivos de imagem (`.jpeg`, `.png`, `.ai`)
- Screenshots de desenvolvimento
- Mockups de design
- Fotos de usuário para testes

**Documentos:**
- `.pdf` - PDFs exportados de projetos
- `.pptx` - PowerPoints gerados
- `.docx` - Documentos Word
- `.md` - Markdowns diversos
- `.rtf` - Rich text files

**Outros:**
- `.json` - Arquivos JSON de configuração
- `.MOV` - Vídeos de demonstração

**Nota**: Arquivos nesta pasta são anexados pelo usuário durante o uso do sistema.

---

## ⚙️ CONFIGURAÇÕES - Arquivos de Sistema

### .config/ - Configurações do Sistema

- `.config/configstore/update-notifier-netlify-cli.json` - Notificações Netlify CLI
- `.config/netlify/autocompletion.json` - Autocomplete Netlify
- `.config/netlify/config.json` - Config Netlify
- `.config/.semgrep/semgrep_rules.json` - Regras Semgrep (code analysis)

### .cache/ - Cache do Sistema

- `.cache/replit/` - Cache Replit
- `.cache/typescript/` - Cache TypeScript
- **Nota**: Arquivos de cache não devem ser commitados no Git

### .local/ - Estado Local

- `.local/state/replit/agent/` - Estado do agente Replit
- `.local/share/com.vercel.cli/` - Auth Vercel CLI
- **Nota**: Arquivos locais não devem ser commitados no Git

---

## 📊 Resumo Estatístico

### Total de Arquivos por Tipo

| Tipo | Quantidade | Descrição |
|------|------------|-----------|
| **TypeScript (.ts, .tsx)** | ~120 | Código-fonte (frontend + backend) |
| **Markdown (.md)** | ~80 | Documentação |
| **JSON (.json)** | ~20 | Configurações e data files |
| **Imagens (.png, .jpeg, .ai)** | ~200 | Screenshots, logos, mockups |
| **PDFs (.pdf)** | ~10 | Exports e documentos |
| **Outros (.yaml, .toml, .css)** | ~15 | Configs diversas |
| **TOTAL** | **~445** | Arquivos rastreados no projeto |

### Linhas de Código (Aproximado)

| Categoria | Linhas de Código |
|-----------|------------------|
| Frontend (React) | ~25.000 LOC |
| Backend (Express) | ~5.000 LOC |
| Shared (Schema) | ~2.000 LOC |
| UI Components (shadcn) | ~8.000 LOC |
| **TOTAL** | **~40.000 LOC** |

---

## 🎯 Arquivos Mais Importantes (Top 20)

### Críticos para o Sistema

1. **`server/routes.ts`** - Todas as 100+ rotas API
2. **`shared/schema.ts`** - Schema de database (23 tabelas)
3. **`client/src/App.tsx`** - Router principal
4. **`server/storage.ts`** - Interface de acesso ao DB
5. **`client/src/pages/project-detail.tsx`** - Coração da aplicação
6. **`server/geminiService.ts`** - IA integrada
7. **`server/pptxService.ts`** - Export de PowerPoint
8. **`client/src/lib/reportGenerator.ts`** - Export de PDF
9. **`client/src/contexts/AuthContext.tsx`** - Autenticação global
10. **`package.json`** - Dependências do projeto

### Documentação Essencial

11. **`replit.md`** - Memória e arquitetura do projeto
12. **`DOCUMENTACAO_TECNICA_COMPLETA.md`** - Este documento
13. **`RENDER_DEPLOY.md`** - Guia de deploy em produção
14. **`PLANO_NEGOCIO_DTTOOLS.md`** - Plano de negócios
15. **`APP_STORE_READINESS_CHECKLIST.md`** - Submissão mobile

### Configuração de Infraestrutura

16. **`render.yaml`** - Deploy Render.com
17. **`vite.config.ts`** - Build configuration
18. **`drizzle.config.ts`** - Database ORM config
19. **`tailwind.config.ts`** - Styling config
20. **`tsconfig.json`** - TypeScript config

---

## 🔍 Como Encontrar Arquivos

### Por Funcionalidade

**Autenticação:**
- Backend: `server/routes.ts` (linhas 100-300)
- Frontend: `client/src/pages/login.tsx`, `client/src/contexts/AuthContext.tsx`
- Components: `client/src/components/auth/`

**Fase 1 (Empatizar):**
- Backend: `server/routes.ts` (linhas 400-800)
- Frontend: `client/src/components/phase1/`
- Tools: EmpathyMapTool, PersonaTool, InterviewTool, ObservationTool

**Fase 2 (Definir):**
- Backend: `server/routes.ts` (linhas 900-1200)
- Frontend: `client/src/components/phase2/`
- Tools: PovStatementTool, HmwQuestionTool

**Fase 3 (Idear):**
- Backend: `server/routes.ts` (linhas 1300-1700)
- Frontend: `client/src/components/phase3/`
- Tools: IdeaTool, IdeaDrawingTool (Fabric.js canvas)

**Fase 4 (Prototipar):**
- Backend: `server/routes.ts` (linhas 1800-2100)
- Frontend: `client/src/components/phase4/`
- Tools: PrototypeTool, PrototypeDrawingTool

**Fase 5 (Testar):**
- Backend: `server/routes.ts` (linhas 2200-2500)
- Frontend: `client/src/components/phase5/`
- Tools: TestPlanTool, TestResultTool

**Export:**
- PDF: `client/src/lib/reportGenerator.ts`
- PPTX: `server/pptxService.ts`
- Routes: `server/routes.ts` (linhas 2600-2800)

**IA Chat:**
- Service: `server/geminiService.ts`
- Frontend: `client/src/pages/chat.tsx`
- Routes: `server/routes.ts` (linhas 2900-3000)

**Admin:**
- Frontend: `client/src/pages/admin.tsx`
- Components: `client/src/components/admin/`
- Routes: `server/routes.ts` (linhas 3100-3400)

### Por Tecnologia

**React Components:**
- `client/src/components/` (100+ componentes)
- `client/src/pages/` (20+ páginas)

**APIs REST:**
- `server/routes.ts` (todas as rotas)
- `server/storage.ts` (CRUD operations)

**Database:**
- `shared/schema.ts` (23 tabelas Drizzle)
- `migrations/` (histórico de migrações)

**Styling:**
- `client/src/index.css` (global styles)
- `tailwind.config.ts` (theme config)
- `client/src/components/ui/` (shadcn components)

---

## 🚀 Comandos Úteis para Explorar

### Buscar Arquivos
```bash
# Buscar por nome
find . -name "*keyword*"

# Buscar arquivos TypeScript
find . -name "*.tsx" -o -name "*.ts"

# Buscar arquivos modificados recentemente
find . -type f -mtime -7
```

### Estatísticas
```bash
# Contar linhas de código
cloc . --exclude-dir=node_modules,dist,.cache

# Tamanho total do projeto
du -sh .

# Arquivos maiores
du -ah . | sort -rh | head -20
```

### Git
```bash
# Arquivos modificados
git status

# Histórico de commits
git log --oneline --graph

# Arquivos com mais mudanças
git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20
```

---

**Versão do Inventário:** 1.0.0  
**Última Atualização:** 16 de Outubro de 2025  
**Total de Arquivos Catalogados:** ~445  
**Linhas de Código:** ~40.000 LOC
