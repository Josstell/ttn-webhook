# AGENTS.md

This document provides guidelines for AI agents working on this codebase.

## Project Overview

This is a Next.js 16 IoT webhook project with PostgreSQL, tRPC, Prisma, and real-time features using Pusher. The project uses the App Router, shadcn/ui components, and follows a feature-based architecture.

## Build, Lint, and Test Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Full build with Prisma generation and migration
npm run start                  # Start production server

# Database
npx prisma generate            # Generate Prisma client
npx prisma migrate deploy      # Run migrations
npx prisma studio              # Open Prisma database UI
npx prisma db push             # Push schema changes to database

# Linting and Type Checking
npm run lint                   # Run ESLint
npm run lint -- --fix          # Run ESLint with auto-fix

# Other
npm run postinstall            # Runs after npm install (generates Prisma client)
```

## Code Style Guidelines

### General Principles

- Write self-documenting code with clear intent
- Keep functions small and focused (single responsibility)
- Avoid deep nesting; prefer early returns
- Use TypeScript for all new code

### Imports and Organization

```typescript
// Order of imports:
// 1. Next.js/Server components
// 2. React hooks
// 3. External libraries (alphabetical)
// 4. tRPC/router imports
// 5. Components (relative paths)
// 6. Utilities (relative paths)
```

### TypeScript Conventions

- Enable strict mode in tsconfig.json
- Use explicit types for function parameters and return values
- Prefer interfaces for object types, types for unions/primitives
- Use `zod` for runtime validation with inferred types
- Use `PageProps` pattern for Next.js page components

```typescript
// Good
async function getData({ params }: { params: Promise<{ id: string }> }) {
  return db.user.findUnique({ where: { id: await params.id } });
}

// Avoid
async function getData(props: any) {
```

### Naming Conventions

- **Files**: kebab-case for non-components, PascalCase for React components
- **Components**: PascalCase (e.g., `DashboardChart.tsx`)
- **Variables/functions**: camelCase (e.g., `isValid`, `getUserData`)
- **Constants**: SCREAMING_SNAKE_CASE for global constants
- **Types/Interfaces**: PascalCase with meaningful names
- **Database models**: singular (e.g., `User`, `Session`)
- **API Routes**: kebab-case (e.g., `api/weebhook/route.ts`)

### React/Next.js Patterns

- Use `"use client"` directive only when needed
- Prefer Server Components by default
- Use `client-only` wrapper for client-only code
- Use `server-only` to prevent server code in client bundles
- Follow the `src/features/` pattern for domain logic

```typescript
// Server Component (default)
import { getUplinks } from "@/features/uplinks";

// Client Component
"use client";
import { useState } from "react";
```

### Error Handling

- Use `try/catch` with async/await for database operations
- Return typed results from tRPC procedures
- Use Zod for input validation
- Handle errors gracefully with user feedback (toast notifications)

```typescript
// tRPC procedure with error handling
const getUplink = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const uplink = await db.uplink.findUnique({
      where: { id: input.id },
    });
    if (!uplink) {
      throw new Error("Uplink not found");
    }
    return uplink;
  });
```

### Database (Prisma)

- Use the generated Prisma client from `src/generated/prisma`
- Access via `import { db } from "@/lib/db";`
- Use `map` attribute for custom table names
- Follow naming conventions in schema.prisma

### API Routes

- Use Next.js App Router pattern
- Place routes in `src/app/api/[route]/route.ts`
- Handle GET, POST, etc. methods explicitly

### Styling

- Use Tailwind CSS with `@/` alias for imports
- Follow shadcn/ui component patterns
- Use `cn()` utility for class merging: `cn("base-class", variantClass)`

### Utilities

- Use `src/lib/utils.ts` for shared utilities
- Follow the `formatX` pattern for formatting functions

## Directory Structure

```
src/
  app/                    # Next.js App Router pages
  components/
    ui/                   # shadcn/ui components
  features/               # Domain logic (uplinks, users, etc.)
  hooks/                  # Custom React hooks
  lib/                    # Core utilities (auth, db, pusher)
  trpc/                   # tRPC router configuration
```

## Key Libraries

- **Auth**: better-auth
- **Database**: Prisma ORM with PostgreSQL
- **API**: tRPC
- **Real-time**: Pusher
- **Validation**: Zod
- **Forms**: React Hook Form + Zod resolvers
- **UI**: shadcn/ui + Radix primitives
