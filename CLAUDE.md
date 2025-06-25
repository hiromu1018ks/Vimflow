# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Database Operations
```bash
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with initial data
docker-compose up -d    # Start PostgreSQL container (port 5433)
```

### Backend Server (Alternative Express.js)
```bash
cd backend && npm run ts    # Start Express server with hot reload (port 3001)
cd backend && npm run seed  # Seed database via Express backend
```

## Architecture

This is a full-stack todo application with **Vim-style keyboard navigation** built on:
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API routes (primary) + Express.js server (alternative)
- **Database**: PostgreSQL + Prisma ORM

### Key Directories
- `src/app/` - Next.js App Router with API routes at `/api/tasks`
- `src/hooks/` - Custom hooks: `useTodos` (CRUD), `useTaskEdit` (editing), `useVimMode` (keyboard navigation)
- `src/components/ui/` - shadcn/ui components
- `backend/` - Alternative Express.js server
- `prisma/` - Database schema and migrations

### Database Schema
Single `Task` model with `id`, `task`, `createdAt`, `updatedAt` fields using UUID primary keys.

### Custom Hooks Architecture
The app uses a clean separation pattern:
- **useTodos**: Handles all CRUD operations and loading states
- **useTaskEdit**: Manages task editing mode and operations
- **useVimMode**: Implements Vim-style keyboard navigation (j/k navigation, dd deletion, o/i for adding, Enter for editing)

### API Endpoints
- `GET/POST/PUT/DELETE /api/tasks` - Next.js API routes (primary)
- Express backend available as alternative with rate limiting

### Environment
```env
DATABASE_URL="postgresql://basic_todo_user:basic_todo_password@localhost:5433/basic_todo_db"
```

### Type Safety
All components use TypeScript with Zod validation for API requests and Prisma-generated types for database operations.