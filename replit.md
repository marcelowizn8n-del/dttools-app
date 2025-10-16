# DTTools - Design Thinking Tools

## Overview

DTTools é uma plataforma interativa e abrangente para guiar designers, equipes de inovação e profissionais criativos pelas etapas do Design Thinking. O aplicativo oferece ferramentas específicas para cada uma das 5 fases do processo, sistema de progresso gamificado e funcionalidades de colaboração e exportação.

## Recent Changes

### 2025-10-16: AI Chat Project Context Fix + Export Response Hardening (v11.1.0)
**Status:** ✅ PRONTO PARA DEPLOY

**AI Chat - Correção "projeto undefined":**
- ✅ **Problema Identificado**: Chat IA mostrava "projeto undefined" ao invés do nome real do projeto
- ✅ **Root Cause**: Frontend enviava apenas `projectId`, mas backend esperava `projectName` e `projectDescription`
- ✅ **Solução Implementada**:
  - Extendida interface `DesignThinkingContext` no frontend com campos `projectName` e `projectDescription`
  - Modificado handler de seleção de projeto para popular todos os 3 campos (id, name, description)
  - Gemini agora recebe contexto completo do projeto e responde com nome correto
- ✅ **Arquivos Modificados**: `client/src/pages/chat.tsx` (linhas 38-45, 269-276)

**Export - Correção PDF/PPTX retornando HTML:**
- ✅ **Problema Identificado**: Arquivos PDF exportados abriam como HTML no Adobe Acrobat
- ✅ **Root Cause**: Erros de export caíam no middleware Vite, retornando index.html com extensão .pdf
- ✅ **Solução Implementada**:
  - Mudado `res.send()` para `res.end()` para terminar resposta sem passar para next()
  - Adicionado logging detalhado para rastreamento de export (project ID, user ID, buffer size)
  - Guard `!res.headersSent` antes de enviar erros JSON
  - Aplicado mesmo padrão para PPTX, PDF e Markdown
- ✅ **Arquivos Modificados**: `server/routes.ts` (endpoints export-pptx, export-pdf)

**Deploy No Render:**
- ℹ️ Logs analisados: Warnings normais (OPENAI_API_KEY, migration), **sem erros críticos**
- ✅ Serviço funcionando: "Your service is live 🎉", status 200/304
- ✅ Database: Default data initialized, PostgreSQL operacional

### 2025-10-16: PowerPoint Export Security Fix (v11.0.0-EXPORT-SECURITY)
**Status:** ✅ EM PRODUÇÃO

**Correções Críticas de Segurança:**
- ✅ **Data Isolation Fix**: Eliminado vazamento de dados entre requisições de export
- ✅ **PPTXService Refactor**: Cada export agora cria instância isolada de pptxgen
- ✅ **User Verification**: Todos exports verificam ownership via userId antes de gerar
- ✅ **ESM Compatibility**: pptxgenjs 4.0.1 confirmado com suporte ESM completo

**Problema Resolvido:**
- **Antes**: PPTXService reutilizava mesma instância pptxgen, causando leak de dados entre projetos/usuários
- **Depois**: Cada chamada de export cria nova instância isolada, garantindo segurança total

**Arquitetura de Export:**
- ✅ **PPTX**: Template com logo "Design Thinking Tools", cores brand (blue #2563EB, green #10B981), bordas pontilhadas
- ✅ **PDF**: Mesmo template visual, gerado via reportGenerator.ts
- ✅ **Markdown**: Export de texto estruturado
- ✅ **Notion**: REMOVIDO (bundle size reduzido 6%)

**Mudanças Técnicas:**
- ✅ PPTXService: Removido `private pres` do construtor
- ✅ Todos métodos helper agora recebem `pres: pptxgen` como parâmetro
- ✅ `generateProjectPPTX()` cria `const pres = new pptxgen()` no início
- ✅ Build recompilado e validado (dist/index.js atualizado)
- ✅ Routes: Endpoints `/api/projects/:id/export-{pptx,pdf,markdown}` reativados

**Deploy Instructions:**
1. Fazer commit das mudanças
2. Push para produção: `git push render main`
3. Aguardar deploy automático no Render.com (2-3 min)
4. Verificar status "Live" no dashboard do Render

### 2025-10-13: Auth UX Improvement (v10.0.0-AUTH-UX)
**Status:** ✅ EM PRODUÇÃO

**Melhorias de Registro e Login:**
- ✅ **Campo Email**: Login agora usa email em vez de username (mais intuitivo)
- ✅ **Nome de Exibição**: Campo separado para nome que aparecerá no sistema
- ✅ **Confirmação de Email**: Dupla verificação para evitar erros de digitação
- ✅ **Confirmação de Senha**: Garantia que a senha foi digitada corretamente
- ✅ **Indicador de Força**: Medidor visual da força da senha (Fraca/Média/Forte)
- ✅ **Compatibilidade Total**: Usuários antigos continuam funcionando (aceita email OU username)

**Arquitetura Técnica:**
- ✅ Backend: Adicionado `getUserByEmail()` no storage
- ✅ Backend: Login aceita tanto email quanto username (backwards compatibility)
- ✅ Frontend: SignupForm com validação Zod para email + senha
- ✅ Frontend: LoginForm simplificado (email + senha)
- ✅ Schema: Username auto-gerado a partir do email (compatibilidade)

**UX Final:**
- Registro: Nome de Exibição + Email + Confirmar Email + Senha + Confirmar Senha
- Login: Email + Senha (ou username antigo para compatibilidade)

### 2025-10-11: Render.com Migration + New Domain (v9.0.0-RENDER-PRODUCTION)
**Status:** ✅ EM PRODUÇÃO

**Nova Infraestrutura:**
- ✅ **Plataforma**: Migrado de Railway para Render.com
- ✅ **Domínio Principal**: https://www.designthinkingtools.com (novo domínio profissional)
- ✅ **Database**: PostgreSQL no Render (migração completa)
- ✅ **CORS**: Configurado para novos domínios (designthinkingtools.com + www)

**Correções de Cache e Performance:**
- ✅ **React Query Cache Fix**: Mudado de `staleTime: Infinity` para `30000ms` (30 segundos)
- ✅ **Refetch on Mount**: Ativado para garantir dados atualizados
- ✅ **Build Path Fix**: Corrigido caminho de arquivos estáticos para `__dirname/public`

**Planos de Assinatura Corrigidos:**
- ✅ **Enterprise**: R$ 299/mês, 10 usuários incluídos, R$ 29/usuário adicional
- ✅ **Pro**: R$ 99/mês
- ✅ **Free**: R$ 0/mês
- ✅ Banco de dados atualizado manualmente via TablePlus

**Arquitetura de Deploy:**
- ✅ **Render**: Backend + Frontend + PostgreSQL (https://www.designthinkingtools.com)
- ✅ **Database**: PostgreSQL persistente no Render
- ✅ **Sessions**: PostgreSQL-backed sessions (persistem entre restarts)

### 2025-10-09: Railway Production Fixes (v8.2.0-PRODUCTION-STABLE)
**Status:** ⚠️ DESCONTINUADO (migrado para Render)

**Correções Críticas para Railway:**
- ✅ **Image Upload Persistence**: Mudado de arquivos (efêmeros) para base64 no banco de dados - imagens nunca mais somem após restart
- ✅ **Canvas Responsivo**: Largura aumentada de 800px fixo para 800-1400px responsivo - usa tela inteira
- ✅ **Biblioteca Populada**: Adicionados 6 artigos padrão sobre Design Thinking para popular a Biblioteca
- ✅ **CORS Configurado**: Frontend URL configurada para aceitar requisições do Netlify

**Arquitetura de Deploy:**
- ⚠️ **Railway**: DESCONTINUADO (substituído por Render)
- ⚠️ **Netlify**: DESCONTINUADO (ultrapassou limites gratuitos)

**Documentação Técnica:**
- ✅ Upload de imagens usa Sharp para resize + base64 encoding
- ✅ Canvas calcula dimensões baseado em window.innerWidth
- ✅ Default data initialization executada no primeiro deploy

### 2025-10-07: App Store Readiness Release (v7.0.0-APPSTORE-READY)
**Status:** ✅ PRONTO PARA SUBMISSÃO (Apple & Google)

**Correções Críticas Implementadas:**
- ✅ **SelectItem Bug Fix**: Resolvido race condition em ArticleEditor com defaults controlados e useEffect sequenciado
- ✅ **Service Worker Cleanup**: Removido completamente para eliminar cache stale
- ✅ **Form Validation**: Schema hardening com validação obrigatória de categoria, título, autor e conteúdo
- ✅ **Cache-Busting**: Headers Netlify configurados para forçar reload de assets (/assets/* max-age=0, /index.html no-cache)

**Novas Páginas Obrigatórias (App Store Compliance):**
- ✅ `/privacy-policy` - Política de Privacidade completa em português (LGPD compliant)
- ✅ `/terms` - Termos de Uso com descrição de serviço, responsabilidades e cancelamento
- ✅ `/support` - Central de Ajuda com FAQ e canais de suporte

**Qualidade e Performance:**
- ✅ Zero erros críticos no console
- ✅ Todas as funcionalidades core testadas e funcionando
- ✅ Banco de dados PostgreSQL operacional
- ✅ APIs respondendo corretamente
- ✅ Deployment architecture: Netlify (frontend) + Replit (backend) + PostgreSQL

**Documentação:**
- ✅ APP_STORE_READINESS_CHECKLIST.md criado com requisitos completos para Apple e Google
- ✅ Emails de suporte configurados: support@, privacy@, legal@, bugs@, feedback@, enterprise@dttools.app

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 com TypeScript
- **Routing**: Wouter para navegação entre fases
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS com tema customizado para Design Thinking
- **State Management**: TanStack Query para gerenciamento de estado do servidor
- **Build Tool**: Vite com configuração customizada

### Backend Architecture
- **Framework**: Express.js com TypeScript
- **API Design**: APIs RESTful para cada fase do Design Thinking
- **Database ORM**: Drizzle ORM para operações type-safe
- **Session Management**: Express sessions para progresso do usuário
- **Development**: Integração Vite para hot module replacement

### Database Design
- **Database**: PostgreSQL para persistência de dados
- **Schema Management**: Drizzle migrations com definições TypeScript
- **Core Entities**:
  - **Projects**: Projetos de Design Thinking dos usuários
  - **Empathy Maps**: Mapas de empatia (Fase 1)
  - **Personas**: Personas criadas pelos usuários (Fase 1)
  - **Interviews**: Entrevistas com usuários (Fase 1)
  - **POV Statements**: Point of View statements (Fase 2)
  - **Ideas**: Ideias geradas (Fase 3)
  - **Prototypes**: Protótipos criados (Fase 4)
  - **Tests**: Resultados de testes (Fase 5)
  - **User Progress**: Sistema de progresso e badges

### Key Features - 5 Fases do Design Thinking

#### 1. Empatizar
- **Mapa de Empatia**: Ferramenta para capturar o que o usuário diz, pensa, faz e sente
- **Personas**: Criação de perfis detalhados dos usuários-alvo
- **Entrevistas**: Documentação de entrevistas com usuários
- **Observações de Campo**: Registro de comportamentos observados
- **Jornada do Usuário**: Mapeamento da experiência do usuário

#### 2. Definir
- **POV Statements**: Point of View statements estruturados
- **How Might We**: Definição de desafios de design
- **Problem Statements**: Declarações claras dos problemas

#### 3. Idear
- **Brainstorming**: Ferramenta para geração de ideias
- **Categorização de Ideias**: Organização e agrupamento
- **Priorização**: Sistema de votação e ranking

#### 4. Prototipar
- **Tipos de Protótipo**: Digital, física, storyboard
- **Documentação**: Imagens, descrições, materiais
- **Iterações**: Versionamento de protótipos

#### 5. Testar
- **Planos de Teste**: Definição de metodologias
- **Resultados**: Coleta de feedback e métricas
- **Insights**: Learnings e próximos passos

### Sistema de Benchmarking
- **Comparação com Indústria**: Benchmarks por setor e tamanho de empresa
- **Análise de Maturidade**: Avaliação de competências por fase do Design Thinking
- **Indicadores de Performance**: Métricas e KPIs de maturidade
- **Recomendações Personalizadas**: Sugestões de melhoria baseadas em dados
- **Relatórios de Progresso**: Acompanhamento de evolução ao longo do tempo
- **Assessments Customizados**: Avaliações específicas por projeto ou equipe

### Sistema de Progresso
- **Badges**: Conquistas por completar atividades
- **Pontuação**: Sistema de pontos por fase
- **Tracking**: Progresso visual através das 5 fases
- **Gamificação**: Níveis e reconhecimentos

### Data Flow Architecture
- **Client-Server Communication**: APIs REST para CRUD de cada ferramenta
- **Export Functionality**: Geração de PDFs e CSVs dos dados
- **Progress Tracking**: Salvamento automático de progresso
- **Type Safety**: TypeScript end-to-end com schemas compartilhados

## External Dependencies

### UI and Styling
- **Radix UI**: Componentes acessíveis para interface complexa
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide React**: Biblioteca de ícones
- **Framer Motion**: Animações para progresso e gamificação

### Development Tools
- **Vite**: Build tool rápido com HMR
- **TypeScript**: Type checking em frontend e backend
- **jsPDF**: Geração de relatórios PDF
- **React Hook Form**: Formulários para cada ferramenta

### Export and Sharing
- **PDF Generation**: jsPDF para exportação de mapas e relatórios
- **CSV Export**: Para dados tabulares de pesquisas e testes
- **Local Storage**: Cache de progresso offline