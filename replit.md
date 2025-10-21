# DTTools - Design Thinking Tools

## Overview

DTTools is an interactive platform designed to guide designers, innovation teams, and creative professionals through the stages of Design Thinking. It provides specific tools for each of the 5 phases of the process, a gamified progress system, and collaboration and export functionalities. The project aims to be a comprehensive solution for implementing Design Thinking methodologies, with features like benchmarking against industry standards, personalized recommendations, and a robust progress tracking system.

## User Preferences

Preferred communication style: Simple, everyday language.

## **CRITICAL DEPLOYMENT WORKFLOW**

⚠️ **Changes ONLY work in production after BOTH steps:**

1. **Git commit + push to GitHub**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Manual deploy on Render.com**:
   - Go to Render Dashboard → Your service → "Manual Deploy" → "Deploy latest commit"
   - Or wait for automatic deploy (if configured)

**IMPORTANT NOTES:**
- Replit Preview does NOT reflect production changes
- Replit Preview has aggressive caching and is unreliable for testing
- ALWAYS test on `www.designthinkingtools.com` after Render deployment
- DO NOT waste time debugging on Replit Preview - it's only for local development
- Apex domain `designthinkingtools.com` (without www) is not configured - only `www.designthinkingtools.com` works

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for navigation
- **UI Components**: shadcn/ui library with Radix UI primitives
- **Styling**: Tailwind CSS with a custom Design Thinking theme
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful APIs for each Design Thinking phase
- **Database ORM**: Drizzle ORM for type-safe operations
- **Session Management**: Express sessions for user progress
- **Development**: Vite integration for hot module replacement

### Database Design
- **Database**: PostgreSQL
- **Schema Management**: Drizzle migrations with TypeScript definitions
- **Core Entities**: Projects, Empathy Maps, Personas, Interviews, POV Statements, Ideas, Prototypes, Tests, User Progress.

### Key Features - 5 Phases of Design Thinking
DTTools provides tools for each of the five Design Thinking phases:
1.  **Empathize**: Empathy Map, Personas, Interviews, Field Observations, User Journey Mapping.
2.  **Define**: Point of View Statements, How Might We questions, Problem Statements.
3.  **Ideate**: Brainstorming tool, Idea Categorization, Prioritization.
4.  **Prototype**: Various prototype types (digital, physical, storyboard), documentation, versioning.
5.  **Test**: Test plans, results collection, insights generation.

### System-Wide Features
-   **Benchmarking System**: Industry comparison, maturity analysis, performance indicators, personalized recommendations, progress reports, custom assessments.
-   **Progress System**: Badges, scoring, visual progress tracking, gamification.
-   **Data Flow**: REST APIs for CRUD operations, PDF and CSV export, automatic progress saving, end-to-end type safety with shared schemas.
-   **Export Functionality**: Generation of PPTX, PDF, and Markdown files from project data, with data isolation and user ownership verification.
-   **Authentication**: Enhanced user registration and login flow using email, display name, email confirmation, password confirmation with strength indicator, and backward compatibility for existing users.
-   **Automatic Schema Verification**: On application startup (BEFORE server initialization), the system automatically checks and adds missing columns to the `subscription_plans` table (`included_users`, `price_per_additional_user`) using idempotent SQL with `ALTER TABLE IF EXISTS`.
-   **Multilingual Content System**: Full multilingual support for articles and testimonials with translation columns (PT/EN/ES/FR). Library page and landing page automatically display translated content based on selected language with fallback to Portuguese. Admin panel includes translation tabs for managing content in all supported languages.

## External Dependencies

### UI and Styling
-   **Radix UI**: Accessible UI components.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Lucide React**: Icon library.
-   **Framer Motion**: Animation library.

### Development Tools
-   **Vite**: Fast build tool with HMR.
-   **TypeScript**: Static type checking for frontend and backend.
-   **React Hook Form**: Form management.

### Export and Sharing
-   **jsPDF**: PDF generation.
-   **pptxgenjs**: PowerPoint (PPTX) generation.
-   **CSV Export**: For tabular data.
-   **Local Storage**: Offline progress caching.
-   **Sharp**: Image processing (for resizing and base64 encoding of images).