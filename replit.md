# EventFlow Pro

## Overview

EventFlow Pro is a comprehensive event management platform with AI-driven insights and automation capabilities. The application provides event organizers with tools to track progress, manage teams, generate reports, and integrate with popular project management services. Built as a full-stack TypeScript application, it features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful APIs with structured error handling
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Custom Vite integration for hot module replacement
- **Request Logging**: Custom middleware for API request tracking

### Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations with schema definitions in TypeScript
- **Core Entities**:
  - Events: Main project entities with status tracking and budget management
  - Team Members: User profiles with efficiency metrics
  - Reports: Automated weekly progress reports with PDF generation
  - Integrations: Third-party service connections (Asana, Trello, Monday, Slack)
  - AI Insights: Machine learning-generated recommendations and pattern detection
  - User Behavior: Analytics tracking for AI learning and optimization

### Key Features
- **AI Learning Engine**: Client-side pattern recognition for user behavior optimization
- **Automated Report Generation**: PDF report creation with jsPDF
- **Real-time Metrics**: Live dashboard with completion rates and team efficiency
- **Integration Management**: Support for multiple project management platforms
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Data Flow Architecture
- **Client-Server Communication**: JSON-based REST APIs with fetch-based requests
- **Error Handling**: Centralized error boundaries with user-friendly messaging
- **Caching Strategy**: TanStack Query for intelligent data caching and synchronization
- **Type Safety**: End-to-end TypeScript with shared schema definitions

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and migration management

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent visual elements
- **Chart.js**: Interactive charts and data visualization

### Development Tools
- **Vite**: Fast build tool with HMR and optimization
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production builds

### Third-party Integrations
- **Project Management APIs**: Asana, Trello, Monday.com for task synchronization
- **Communication**: Slack integration for team notifications
- **PDF Generation**: jsPDF for automated report creation
- **Session Storage**: PostgreSQL-based session management with connect-pg-simple

### Analytics and AI
- **Client-side Learning**: Custom AI learning engine for user behavior analysis
- **Pattern Recognition**: Local storage-based pattern detection and recommendations
- **User Behavior Tracking**: Anonymous usage analytics for system optimization