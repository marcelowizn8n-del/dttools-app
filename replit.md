# DTTools - Design Thinking Tools

## Overview

DTTools is an interactive platform guiding designers and innovation teams through the Design Thinking process. It offers specific tools for each of the 5 phases, a gamified progress system, and collaboration and export functionalities. The project aims to be a comprehensive solution for implementing Design Thinking methodologies, including benchmarking, personalized recommendations, and robust progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with a custom Design Thinking theme
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite

### Backend
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful APIs
- **Database ORM**: Drizzle ORM
- **Session Management**: Express sessions

### Database
- **Database**: PostgreSQL
- **Schema Management**: Drizzle migrations
- **Core Entities**: Projects, Empathy Maps, Personas, Interviews, POV Statements, Ideas, Prototypes, Tests, User Progress.

### Key Features - 5 Phases of Design Thinking
Tools are provided for each of the five Design Thinking phases:
1.  **Empathize**: Empathy Map, Personas, Interviews, Field Observations, User Journey Mapping.
2.  **Define**: Point of View Statements, How Might We questions, Problem Statements.
3.  **Ideate**: Brainstorming, Idea Categorization, Prioritization.
4.  **Prototype**: Various prototype types, documentation, versioning.
5.  **Test**: Test plans, results collection, insights generation.

### System-Wide Features
-   **Benchmarking System**: Industry comparison, maturity analysis, personalized recommendations, progress reports.
-   **Progress System**: Badges, scoring, visual progress tracking, gamification.
-   **Data Flow**: REST APIs for CRUD, PDF/CSV export, automatic progress saving, end-to-end type safety.
-   **Export Functionality**: Generation of PPTX, PDF, and Markdown files from project data.
-   **Authentication**: Enhanced user registration/login with email confirmation and password strength.
-   **Automatic Schema Verification**: On startup, checks and adds missing columns to `subscription_plans` table.
-   **Multilingual Content System**: Full multilingual support for articles and testimonials (PT/EN/ES/FR) with language-based content display and admin translation tabs.
-   **Guided UX for Non-Experts**: Contextual guidance, visual progress tracking, and step-by-step recommendations.
-   **Double Diamond Framework**: AI-powered tool for the Double Diamond methodology, following "minimum input, maximum output."

### Double Diamond Framework
-   **Philosophy**: Minimum input (5 fields), maximum output (AI generates complete business MVPs).
-   **Implementation**: Database schema (`double_diamond_projects`), AI service (Google Gemini 2.0 Flash) with 5 generation functions for each phase, storage layer with CRUD methods, protected API routes, and dedicated frontend pages.
-   **User Flow**: Users create a project with 5 inputs, then trigger AI generation for each of the Discover, Define, Develop, Deliver, and DFV analysis phases.
-   **Key Features**: Sequential flow enforcement, progress tracking, current phase indicator, error handling with retry, loading states, responsive interface.
-   **PDF Export**: Complete project export with DTTools branding, includes all 5 phases (Discover, Define, Develop, Deliver, DFV Analysis) with formatted sections, logo header/footer on all pages.

### UX Improvement System
-   **Problem Addressed**: User confusion regarding product purpose, navigation, and guidance for Design Thinking beginners, specifically "what to write" in forms.
-   **Solution Components**:
    -   **WelcomeMessage**: Explains DTTools purpose on first dashboard visit.
    -   **PhaseNavigator**: Visual progress tracker for all 5 phases.
    -   **NextStepCard**: Context-aware recommendations and actionable next steps.
    -   **ContextualTooltip**: Reusable inline help for forms and complex UI.
-   **Implementation in Forms**: Comprehensive inline guidance (tooltips, best practice banners, smart placeholders) in core tools for Empathy Maps, Personas, POV Statements, HMW Questions, and Ideas.

## External Dependencies

### UI and Styling
-   **Radix UI**: Accessible UI components.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Lucide React**: Icon library.
-   **Framer Motion**: Animation library.

### Development Tools
-   **Vite**: Fast build tool.
-   **TypeScript**: Static type checking.
-   **React Hook Form**: Form management.

### Export and Sharing
-   **jsPDF**: PDF generation.
-   **pptxgenjs**: PowerPoint (PPTX) generation.
-   **CSV Export**: For tabular data.
-   **Sharp**: Image processing.