# Dearly - Digital Legacy & Emotional Messaging Platform

## Overview

Dearly is a full-stack web application that enables users to create heartfelt messages, videos, or letters for their loved ones to be delivered at a future scheduled time or after their passing. The platform combines emotional messaging with digital legacy management, providing a secure and encrypted way to store and deliver personal messages.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema**: Relational design with proper foreign key constraints
- **Tables**: users, recipients, messages, message_recipients, trusted_contacts

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Secure password hashing with scrypt
- Protected routes with authentication middleware
- User registration and login with form validation

### Message Management
- Encrypted message storage using AES-256 encryption
- Support for multiple message types (text, video, document) 
- Flexible delivery options (date-based or life event-based)
- Message-recipient relationship management

### Recipient Management
- Contact management for message recipients
- Support for multiple recipients per message
- Recipient verification and notification system

### User Interface
- Responsive design with mobile-first approach
- Comprehensive UI component library based on Radix UI
- Dark/light theme support
- Form validation with react-hook-form and Zod

## Data Flow

1. **User Authentication**: Users register/login through protected authentication routes
2. **Message Creation**: Users create encrypted messages with specified recipients and delivery settings
3. **Recipient Management**: Users manage their contact lists and trusted contacts
4. **Message Delivery**: System handles scheduled delivery based on date or life events
5. **Notification System**: Recipients receive notifications when messages are delivered

## External Dependencies

### Frontend Dependencies
- **UI Components**: @radix-ui/* for accessible component primitives
- **State Management**: @tanstack/react-query for server state synchronization
- **Form Handling**: react-hook-form with @hookform/resolvers for validation
- **Styling**: tailwindcss with class-variance-authority for component variants
- **Encryption**: crypto-js for client-side encryption utilities

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Authentication**: passport with passport-local strategy
- **Session Management**: express-session with connect-pg-simple
- **Validation**: zod for runtime type checking

### Development Dependencies
- **Build Tools**: vite, esbuild for bundling
- **Development**: tsx for TypeScript execution
- **Database Tools**: drizzle-kit for schema management

## Deployment Strategy

### Development Environment
- Local development server with hot module replacement
- PostgreSQL database (local or Neon)
- Environment variables for database connection and session secrets

### Production Deployment
- **Platform**: Replit deployment with autoscale
- **Build Process**: Vite build for frontend, esbuild for backend
- **Database**: Neon PostgreSQL serverless
- **Static Assets**: Served through Express static middleware
- **Process Management**: Node.js process with proper error handling

### Environment Configuration
- Database URL configuration for PostgreSQL connection
- Session secret for authentication security
- Build-time environment variable handling

## Changelog

```
Changelog:
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```