# SocialAI Pro - Advanced AI Social Media Manager

## Overview

SocialAI Pro is a comprehensive web application that leverages AI to manage, schedule, and analyze social media posts across multiple platforms. The application provides AI-driven content suggestions, automated post optimization using analytics insights, customizable dashboards, and collaborative team management features. It supports posting to Twitter, Facebook, Instagram, LinkedIn, TikTok, Pinterest, and Snapchat through integration with the Ayrshare API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives 
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture  
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints with consistent error handling

### Database Design
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle migrations stored in `/migrations` directory
- **Core Tables**:
  - `users` - User profiles and authentication data
  - `posts` - Social media post content, scheduling, and status
  - `analytics` - Performance metrics and engagement data  
  - `teams` - Team collaboration and role management
  - `ai_suggestions` - AI-generated content recommendations
  - `sessions` - Session storage for authentication

### Authentication & Authorization
- **Provider**: Replit Auth with OIDC (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTP-only cookies, CSRF protection, and secure session handling
- **Authorization**: Route-level protection with middleware validation

### Component Architecture
- **Layout**: Responsive design with collapsible sidebar navigation
- **Forms**: Reusable form components with validation and error handling
- **Data Display**: Real-time analytics dashboards with customizable metrics
- **AI Integration**: Dedicated panels for AI suggestions and optimization tips

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon serverless platform
- **Authentication**: Replit Auth service for user management
- **Session Storage**: PostgreSQL with connect-pg-simple adapter

### Social Media Integration
- **Ayrshare API**: Third-party service for cross-platform social media posting and scheduling

### Frontend Libraries
- **UI Components**: Radix UI ecosystem for accessible component primitives
- **Data Fetching**: TanStack Query for server state synchronization
- **Form Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting
- **Styling**: Tailwind CSS with class-variance-authority for component variants

### Development Tools
- **Build System**: Vite with React plugin for fast development and building
- **Code Quality**: TypeScript for static type checking
- **Development**: Replit-specific plugins for cartographer and error overlay