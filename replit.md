# JobTrackAI - AI-Powered Job Application Tracker

## Overview

JobTrackAI is a full-stack web application that helps users track their job applications and receive AI-powered feedback on their resumes. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database, and integrates with OpenAI for intelligent resume analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Database Schema
- **Users**: Stores user profile information (required for Replit Auth)
- **Job Applications**: Tracks application details (company, position, status, dates, etc.)
- **AI Feedback**: Stores AI-generated resume feedback and analysis
- **Sessions**: Manages user sessions (required for authentication)

## Key Components

### Authentication System
- Uses Replit's OpenID Connect authentication
- Passport.js integration for session management
- Protected routes with authentication middleware
- Session storage in PostgreSQL for persistence

### Job Application Management
- CRUD operations for job applications
- Status tracking (Applied, Interview, Offer, Rejected, Ghosted)
- Filtering and search capabilities
- Form validation with Zod schemas

### AI Integration
- OpenAI GPT-4o integration for resume analysis
- Structured feedback generation (match score, strengths, improvements, recommendations)
- Asynchronous processing with loading states
- Error handling for API failures

### UI Components
- Responsive design with mobile-first approach
- Consistent component library using shadcn/ui
- Form handling with React Hook Form
- Toast notifications for user feedback
- Modal dialogs for data entry

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **Application Management**: Users create/edit job applications through forms, data validated and stored
3. **AI Feedback**: Users submit job descriptions and resumes to OpenAI API for analysis
4. **Data Persistence**: All user data stored in PostgreSQL with proper relationships
5. **Real-time Updates**: UI updates immediately using optimistic updates and React Query

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- Express.js for backend API
- TypeScript for type safety across the stack

### Database & ORM
- Drizzle ORM with PostgreSQL dialect
- Neon Database serverless PostgreSQL
- Database migrations via Drizzle Kit

### Authentication
- Replit Auth with OpenID Connect
- Passport.js for authentication middleware
- Connect-PG-Simple for PostgreSQL session storage

### AI Services
- OpenAI API for GPT-4o integration
- Structured prompts for resume analysis

### UI & Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- Class Variance Authority for component variants

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Automatic reloading and error overlay

### Production Build
- Vite builds optimized frontend bundle
- esbuild bundles backend for Node.js deployment
- Static assets served from dist/public directory

### Environment Configuration
- Database connection via DATABASE_URL
- OpenAI API key configuration
- Session secret for authentication security
- Replit-specific environment variables for auth

### Database Management
- Drizzle migrations for schema changes
- `db:push` command for development schema updates
- PostgreSQL connection pooling via Neon serverless

The application follows a traditional three-tier architecture with clear separation between presentation (React), business logic (Express), and data persistence (PostgreSQL) layers. The integration of AI capabilities and modern authentication makes it suitable for professional job search management.