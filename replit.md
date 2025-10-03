# DTTools - Design Thinking Tools

## Overview

DTTools é uma plataforma interativa e abrangente para guiar designers, equipes de inovação e profissionais criativos pelas etapas do Design Thinking. O aplicativo oferece ferramentas específicas para cada uma das 5 fases do processo, sistema de progresso gamificado e funcionalidades de colaboração e exportação.

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

### Sistema de Wiki/Ajuda Interna
- **Central de Ajuda**: Base de conhecimento integrada com artigos de suporte
- **Busca Inteligente**: Busca por palavras-chave, categorias e fases
- **Categorias Organizadas**: Artigos organizados por início rápido, fases do DT, colaboração e exportação
- **Artigos em Markdown**: Conteúdo formatado com suporte a Markdown
- **Interatividade**: Sistema de votação (artigos úteis) e contador de visualizações
- **Artigos em Destaque**: Destaques dos artigos mais importantes
- **Acesso Público**: Disponível para todos os usuários, logados ou não
- **Navegação Integrada**: Link de "Ajuda" no header principal (desktop e mobile)

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

## Recent Changes

### 03/10/2025 - Help Center Seed System for Production (v9.0.0-HELP-SEED) ✅ IMPLEMENTADO
- **SOLUÇÃO**: Sistema de seed para popular artigos do Help Center em produção
- **Problema Identificado**: Bancos separados dev/produção - artigos só existiam em desenvolvimento
- **Script de Seed**: Criado `scripts/seed-help-articles.ts` com 9 artigos completos
- **Endpoint Admin**: POST `/api/help/seed` protegido por autenticação de administrador
- **Botão no Admin**: Adicionado botão "🌱 Popular Artigos Iniciais" na tab Artigos
- **Condicional**: Botão aparece apenas quando não há artigos no banco
- **Artigos Criados**: 9 artigos (5 em destaque) cobrindo todas as funcionalidades
- **Documentação**: Arquivo SYNC_PRODUCTION_DB.md com instruções completas
- **Responsividade**: Layout mobile do Help Center melhorado para celular

### 02/10/2025 - Production Asset Sync & Auto-Deploy Fix (v8.0.0-AUTO-SYNC) ✅ RESOLVIDO
- **CRITICAL FIX**: Implementado sincronização automática de assets em produção - SOLUÇÃO DEFINITIVA
- **Root Cause Identificado**: Deployment não incluía arquivos de build porque server/public não era commitado
- **Auto-Sync Sistema**: Servidor agora copia dist/public → server/public automaticamente no startup de produção
- **Production Workflow**: Build → Deploy → Startup sync → Serve (100% automático)
- **GitIgnore Clean**: Removido server/public/ do .gitignore + adicionado exceção !server/public/
- **Asset Management**: Arquivos de build sincronizados automaticamente no startup
- **User Creation Form**: Campos Email e Nome Completo funcionando no Admin
- **Home Page Fix**: Tela branca em dttools.app completamente resolvida
- **Deployment Working**: Sistema testado e funcionando em produção

### 02/10/2025 - Admin Planos Tab Complete Fix (v6.0.0-FINAL-PLANOS-FIX)
- **CRITICAL FIX**: Resolvido problema definitivo da tab "Planos" no Admin
- **Inline Flexbox Styles**: Aplicado `style={{ flex: 1 }}` em todas as tabs do Admin para garantir renderização
- **Build Version Update**: Atualizado para v6.0.0-FINAL-PLANOS-FIX
- **Cache Invalidation**: Adicionado BUILD_VERSION constant no server para forçar rebuild do deployment
- **Environment Restart**: Executado `kill 1` para limpar caches e processos travados
- **Tab Planos Verified**: Tab confirmada funcionando em ambiente de desenvolvimento com data-testid="tab-plans"

### 02/10/2025 - Service Worker Cleanup & Admin Tab Fix (v3.0.0)
- **CRITICAL FIX**: Resolvido problema de cache do Service Worker que escondia tab "Planos" no Admin
- **Service Worker Removal**: Substituído SW por versão de auto-limpeza que deleta caches e se auto-desregistra
- **Auto-Cleanup Script**: Adicionado script no index.html para limpeza automática de Service Workers
- **CSS Ultra-Específico**: Implementado CSS com seletor `:has()` para garantir visibilidade da tab Planos
- **Duplicate Prevention**: Sistema de debouncing (3 segundos) para prevenir projetos duplicados
- **UserMenu Navigation**: Corrigido link de Administração com gerenciamento de estado do dropdown
- **Pricing Page Layout**: Corrigido layout dos botões nas cards de preços com flexbox
- **Documentation**: Criado `ADMIN_PLANOS_TAB_FIX.md` com instruções completas de resolução