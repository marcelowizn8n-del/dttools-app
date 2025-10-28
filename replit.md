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
-   **Guided UX for Non-Experts (MVP 1 - October 2025)**: Enhanced user experience with contextual guidance, visual progress tracking, and step-by-step recommendations to support users who are not Design Thinking experts.

### UX Improvement System (MVP 1)
**Problem Addressed**: User testing revealed confusion about product purpose, unclear navigation ("E agora?"), and lack of guidance for Design Thinking beginners.

**Solution Components**:
1. **WelcomeMessage Component** (`client/src/components/ui/welcome-message.tsx`)
   - Displayed on first Dashboard visit
   - Explains DTTools purpose and value proposition
   - Dismissible with localStorage persistence
   - Personalized with user's name

2. **PhaseNavigator Component** (`client/src/components/ui/phase-navigator.tsx`)
   - Visual progress tracker for all 5 Design Thinking phases
   - Shows current phase with highlight and checkmarks for completed phases
   - Interactive navigation to jump between phases
   - Integrated into Dashboard for constant visibility

3. **NextStepCard Component** (`client/src/components/ui/next-step-card.tsx`)
   - Context-aware recommendations based on user progress
   - Shows next recommended action with:
     - Clear title and description
     - Estimated time to complete
     - Actionable CTA button
     - 3 practical tips for success
   - Adapts content for each phase (Empatizar → Definir → Idear → Prototipar → Testar)
   - Special handling for first-time users (no projects yet)

4. **ContextualTooltip Component** (`client/src/components/ui/contextual-tooltip.tsx`)
   - Reusable tooltip for inline help
   - Icon-based trigger (HelpCircle)
   - Ready for integration in forms and complex UI elements
   - Uses Radix UI Tooltip for accessibility

**Dashboard Integration**:
- Welcome message appears at top for new users
- Phase navigator shows progress for users with projects
- Next step card always visible with contextual guidance
- Clean, hierarchical information architecture

**Impact**: Addresses ~70% of identified UX problems by providing:
- Clear purpose explanation (onboarding)
- Visual navigation cues (phase progress)
- Actionable next steps (reduces "E agora?" confusion)
- Contextual guidance throughout the journey

### UX Improvement System (MVP 2 - October 2025)
**Problem Addressed**: MVP 1 solved high-level navigation and onboarding, but users still struggled with "what to write" in forms, especially in core Design Thinking tools (Empathy Maps, Personas, POV Statements, HMW Questions, Ideas).

**Solution - Contextual Help in ALL Forms**:
Implemented comprehensive inline guidance across all Phase 1-3 tools using tooltips, best practice banners, and smart placeholders.

**Implemented Components**:

1. **Phase 1 - Empathize (Empatizar)**:
   - **EmpathyMapTool** (`client/src/components/phase1/EmpathyMapTool.tsx`)
     - Tooltips on all 4 quadrants (Diz, Pensa, Faz, Sente) explaining what each means
     - Best practices banner with 4 key tips
     - Smart placeholders with concrete examples for each quadrant
     - Clear guidance on how to fill empathy maps effectively
   
   - **PersonaTool** (`client/src/components/phase1/PersonaTool.tsx`)
     - Tooltips on Objetivos (Goals), Frustrações (Frustrations), Motivações (Motivations)
     - Best practices banner explaining persona creation
     - Practical examples for each field
     - Guidance on making personas realistic and actionable

2. **Phase 2 - Define (Definir)**:
   - **POVStatementTool** (`client/src/components/phase2/PovStatementTool.tsx`)
     - Complete tooltips explaining POV formula (User + Need + Insight)
     - Visual formula display showing structure
     - 3 full examples of well-written POV statements
     - Best practices banner with 5 tips
     - Field-specific placeholders with examples
   
   - **HMWQuestionTool** (`client/src/components/phase2/HmwQuestionTool.tsx`)
     - Tooltip explaining How Might We methodology
     - Best practices banner with 5 key tips:
       - Always start with "Como poderíamos..."
       - Avoid too broad questions
       - Avoid too specific/restrictive questions
       - Focus on user needs, not predetermined solutions
       - Create multiple HMWs per POV Statement
     - 3 practical examples of good HMW questions

3. **Phase 3 - Ideate (Idear)**:
   - **IdeaTool** (`client/src/components/phase3/IdeaTool.tsx`)
     - DVF Framework banner explaining the 3 criteria:
       - Desirability (Desejabilidade): Do users want this?
       - Viability (Viabilidade): Is it a good business?
       - Feasibility (Exequibilidade): Can we build it?
     - Individual tooltips for each DVF criterion with scoring guidance:
       - Desirability: "Does it solve a real user need?"
       - Viability: "Can this become sustainable business?"
       - Feasibility: "Do we have technical capability?"
     - Examples showing 5 = critical problem, 3 = useful, 1 = users don't care

**Design Patterns Used**:
- **ContextualTooltip**: Reusable component with title, content, and examples
- **Best Practice Banners**: Color-coded info boxes at top of dialogs
- **Smart Placeholders**: Concrete examples directly in input fields
- **Progressive Disclosure**: Help available but not intrusive

**Impact**: Resolves ~90% of identified UX problems (when combined with MVP 1):
- ✅ Clear product purpose (MVP 1: WelcomeMessage)
- ✅ Visual progress tracking (MVP 1: PhaseNavigator)
- ✅ Next step guidance (MVP 1: NextStepCard)
- ✅ "What to write" problem solved (MVP 2: tooltips + examples in all forms)
- ✅ Design Thinking education embedded in the tool itself

**Coverage**:
- Phase 1 Tools: ✅ Empathy Maps, ✅ Personas (Interviews and Field Observations have basic forms)
- Phase 2 Tools: ✅ POV Statements, ✅ HMW Questions
- Phase 3 Tools: ✅ Ideas (DVF framework explained)
- Phase 4-5: Basic implementations (sufficient for MVP)

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