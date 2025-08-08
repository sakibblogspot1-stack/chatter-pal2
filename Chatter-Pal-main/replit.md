# AI Voice Coach Application

## Overview

This is a full-stack AI-powered voice coaching application that provides real-time personality-based speaking practice and feedback. The app analyzes users' speech patterns, provides personalized coaching suggestions, and tracks progress over time.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Real-time Communication**: WebSocket server for live voice session handling
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: In-memory storage implementation with interface for easy database migration

### Key Components

#### Voice Processing System
- **Audio Capture**: Browser MediaRecorder API for real-time audio recording
- **Audio Analysis**: Web Audio API for volume and frequency analysis
- **Speech Analysis**: Server-side transcript processing for metrics calculation
- **Real-time Feedback**: WebSocket-based communication for instant coaching suggestions

#### AI Integration
- **OpenAI Service**: GPT-4o integration for personality analysis and feedback generation
- **Personality Assessment**: Analyzes communication style, confidence levels, and personality traits
- **Speech Coaching**: Generates contextual suggestions for improvement based on detected patterns

#### Data Management
- **User Profiles**: Stores personality types, progress tracking, and preferences
- **Session Management**: Tracks voice sessions with metrics, transcripts, and feedback
- **Progress Analytics**: Accumulates long-term improvement data and streak tracking

## Data Flow

1. **Session Initiation**: User starts voice session → WebSocket connection established
2. **Audio Processing**: Browser captures audio → Real-time analysis → Server receives chunks
3. **AI Analysis**: Transcript generated → OpenAI processes for personality insights → Feedback generated
4. **Real-time Updates**: Metrics calculated → Progress updated → UI receives live feedback via WebSocket
5. **Session Completion**: Final analysis stored → Progress metrics updated → Session summary provided

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for production
- **drizzle-orm**: Type-safe database operations and migrations
- **openai**: AI-powered speech analysis and personality assessment
- **ws**: WebSocket server for real-time communication

### UI Dependencies
- **@radix-ui/***: Accessible component primitives for consistent UX
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework with design system
- **react-hook-form**: Form validation and management

### Development Tools
- **vite**: Fast build tool with HMR for development
- **tsx**: TypeScript execution for server development
- **esbuild**: Production bundling for server code

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Automatic client and server refresh during development
- **Environment**: NODE_ENV=development with development-specific features

### Production Build
- **Client Build**: Vite builds optimized React bundle to `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built client files in production

### Database Strategy
- **Development**: In-memory storage for rapid prototyping
- **Production**: PostgreSQL with Drizzle migrations via `db:push`
- **Schema Management**: Shared schema definitions in `shared/schema.ts`

### Key Architectural Decisions

#### WebSocket over REST for Voice Sessions
- **Problem**: Real-time voice feedback requires low-latency communication
- **Solution**: WebSocket server for bidirectional real-time data flow
- **Benefits**: Instant feedback, live session updates, seamless audio streaming
- **Trade-offs**: More complex state management, connection handling overhead

#### Drizzle ORM with PostgreSQL
- **Problem**: Type-safe database operations with flexible deployment options
- **Solution**: Drizzle ORM with PostgreSQL dialect and Neon serverless
- **Benefits**: Type safety, migration management, serverless compatibility
- **Alternatives**: Prisma considered but Drizzle chosen for lighter bundle size

#### In-Memory Development Storage
- **Problem**: Rapid development without database setup complexity
- **Solution**: Memory-based storage implementation with same interface
- **Benefits**: Zero setup, fast iteration, easy testing
- **Migration Path**: Interface allows seamless transition to database storage

#### Monorepo Structure with Shared Schema
- **Problem**: Type consistency between client and server
- **Solution**: Shared TypeScript definitions and Zod schemas
- **Benefits**: Single source of truth, compile-time type checking
- **Structure**: `/shared` for common types, `/client` for React app, `/server` for API

This architecture prioritizes rapid development, type safety, and real-time user experience while maintaining flexibility for future scaling and feature additions.

## Recent Updates (July 31, 2025)

### Database Integration Completed
- Successfully integrated PostgreSQL database with Drizzle ORM
- All user data, progress tracking, and voice sessions now persist to database
- Fixed critical React component crashes that were causing blank screen issues
- Migrated from in-memory storage to full database persistence

### Frontend Rebuild and Voice Features
- Completely rebuilt React frontend using simple inline styles for maximum compatibility
- Eliminated complex UI library dependencies that were causing rendering issues
- Implemented real-time voice recording with MediaRecorder API
- Added live session metrics (clarity score, speech rate, confidence tracking)
- Created responsive interface with user profile, voice controls, and AI feedback dashboard

### Complete Application Implementation (July 31, 2025)
- Built full neo-minimalist futurism interface with three main modules
- Voice Call: Real-time waveform visualization, dynamic feedback panel, session memory toggle
- Interview: AI avatar grid with 3 animated characters, subject selection, performance metrics dashboard
- Seminar: Virtual auditorium view, speech timer, teleprompter, Q&A transcript panel
- Implemented frosted glass effects, gradient borders, micro-interactions throughout
- All modules fully functional with database persistence and real-time features

### Current Status
- Complete VoiceCoach AI platform with all three core modules operational
- Professional dashboard with module cards featuring hover animations
- Real-time voice processing with MediaRecorder API integration
- Live transcript display with color-coded feedback (grammar, pronunciation, vocabulary)
- Performance metrics tracking across all coaching scenarios
- Ready for deployment and advanced AI coaching features