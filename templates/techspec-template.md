# Technical Specification Template

## Executive Summary

[Brief technical overview of solution approach. Summarize main architectural decisions and implementation strategy in 1-2 paragraphs. Mention which monorepo packages are affected.]

## System Architecture

### Monorepo Structure

[Describe which parts of the monorepo are involved:

- **Apps**: Which apps in `apps/` (e.g., `apps/web`)
- **Packages**: Which shared packages (e.g., `@repo/ui`, `@repo/tailwind-config`)
- **New packages**: Any new shared packages needed
- **Dependencies**: Inter-package dependencies]

### Component Overview

[Main components and responsibilities:

- **Pages** (Server Components by default): Route-level components (e.g., `/app/page.tsx`)
- **Client Components**: Interactive components with 'use client' directive
- **Shared UI Components**: Components from `@repo/ui` or new ones to add
- **Services/Hooks**: API integration with React Query
- **Data Flow**: How data moves through Server/Client Component boundary
- Main relationships and data flow]

## Implementation Design

### Component Structure

[Define main React components (≤20 lines per example):

**Server Components** (default, no 'use client'):
```typescript
// Example Server Component (async supported)
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  // Can fetch data directly in component
  const data = await fetchData(params.id);
  return <div>{/* render */}</div>;
}
```

**Client Components** (with 'use client'):
```typescript
'use client';

interface ComponentProps {
  prop: Type;
  onAction?: (data: Type) => void;
}

export function ClientComponent({ prop, onAction }: ComponentProps) {
  // Client-side interactivity, hooks, event handlers
}
```
]

### Data Models

[Essential data structures:

- Domain types (User, Game, Team, etc.)
- API request/response types
- Form data types
- React Query query keys and types
- Server Component props types]

### Services & API Integration

[API service functions with React Query:

```typescript
// Example React Query hook for Client Components
export const useDataQuery = (params: Type) => {
  return useQuery({
    queryKey: ['data', params],
    queryFn: () => fetchData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Example fetch function for Server Components
export async function fetchData(params: Type): Promise<ResponseType> {
  const response = await fetch('/api/endpoint', {
    next: { revalidate: 60 }, // Next.js caching
  });
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

- Service function signatures
- React Query configuration (staleTime, cacheTime, refetch policies)
- Error handling approach
- Loading state management]

### State Management

[React Query + React 19 hooks implementation:

- **Server State**: React Query for API data (queries, mutations)
- **Client State**: React 19 hooks (useState, useReducer) for UI-only state
- **Query Keys**: Naming convention and structure
- **Cache Strategy**: staleTime, cacheTime, refetchOnWindowFocus settings
- **Optimistic Updates**: Where to implement (mutations)
- **Server vs Client**: What data stays server-side vs client-side]

### Routing

[Next.js App Router structure:

- **Route paths**: File-based routing in `app/` directory
- **Layouts**: Shared layouts with `layout.tsx`
- **Loading states**: `loading.tsx` files for route segments
- **Error boundaries**: `error.tsx` files for error handling
- **Server vs Client pages**: Which routes are Server Components vs Client
- **Dynamic routes**: Params and search params handling]

### Styling Approach

[Tailwind CSS v4 implementation:

- **Shared styles**: Using `@repo/tailwind-config` package
- **Component-specific styles**: Component-level customization
- **Responsive design**: Mobile-first breakpoints
- **Theme customization**: CSS variables for theming (if needed)
- **shadcn/ui components**: Which components to use from `@repo/ui`
- **New UI components**: Which shadcn components to add with `pnpm shadcn add`]

## Integration Points

[External integrations if applicable:

- API endpoints (method, path, purpose)
- Authentication requirements
- Error handling approach
- Analytics events (PostHog)]

## Performance Considerations

[Apply rules from `.cursorrules` and `.agents/skills/vercel-react-best-practices/`:

- **Waterfalls**: Parallel data fetching with Promise.all, React Query parallel queries
- **Bundle Size**: Prefer Server Components, use `next/dynamic` for heavy client components
- **Server Components**: Default to Server Components, only use Client when needed
- **React Query optimization**: Proper staleTime, prefetching strategies
- **Re-renders**: React.memo for Client Components, useCallback, useMemo usage
- **Rendering**: Virtualization for long lists (>50 items), stable keys
- Specific optimizations for this feature]

## Testing Approach

### Unit Tests

[Unit testing strategy (Vitest or Jest):

- Component tests with React Testing Library
- Server Component testing approach
- Client Component testing with user interactions
- React Query hook tests (with QueryClientProvider wrapper)
- API function tests
- Mock requirements (API responses, React Query)]

### Integration Tests

[Integration testing:

- Multi-component interactions (Server + Client Components)
- API integration tests with React Query
- Form submission flows
- Navigation and routing tests
- Test data requirements]

## Development Sequencing

### Build Order

[Implementation sequence:

1. **Shared UI Components** (Add to `@repo/ui` if reusable)
2. **API Types & Functions** (Type definitions, fetch functions)
3. **React Query Hooks** (For Client Components)
4. **Server Components** (Pages with direct data fetching)
5. **Client Components** (Interactive components)
6. **Integration** (Connect Server and Client Components)
7. **Tests** (Unit and integration tests)]

### Technical Dependencies

[Blocking dependencies:

- Required npm packages (install with `pnpm add`)
- External API endpoints availability
- shadcn/ui components to add (`pnpm shadcn add <component>`)
- Monorepo package updates needed]

## Monitoring and Observability

[Monitoring approach:

- **Analytics Events**: Key user actions to track
- **Error Logging**: Error boundaries and error tracking
- **Performance Metrics**: Core Web Vitals tracking]

## Technical Considerations

### Key Decisions

[Important technical decisions:

- Chosen approach and justification
- Trade-offs considered (e.g., library vs custom implementation)
- Rejected alternatives and why]

### Known Risks

[Technical risks:

- Potential challenges
- Mitigation approaches
- Areas needing research]

### Standards Compliance

[Rules from `.cursorrules` and `.agents/skills/` that apply:

- **CRITICAL**: Waterfalls (parallel fetching), bundle size (Server Components default)
- **HIGH**: React Query for data fetching, proper cache configuration
- **MEDIUM**: Re-render optimization (React.memo, useCallback), rendering performance
- **Turborepo**: Proper package boundaries, workspace dependencies
- Specific performance rules that apply to this feature]

### Relevant and Dependent Files

[List relevant files in the monorepo:

- **App files**: Pages in `apps/web/app/`
- **Shared components**: Components in `packages/ui/src/components/`
- **Config files**: Tailwind, TypeScript, ESLint configs
- **Types**: Type definition files
- **API functions**: Service/hook files
- **Test files**: Test files to create]
