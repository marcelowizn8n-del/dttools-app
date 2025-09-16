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