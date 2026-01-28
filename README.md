# Turborepo Monorepo

## Prerequisites

- Node.js ≥22
- pnpm 9+ (`npm install -g pnpm`)

## Apps and Packages

- `apps/web`: Next.js app (main application)
- `packages/ui`: Shared React components (shadcn/ui based)
- `packages/tailwind-config`: Shared Tailwind CSS config
- `packages/eslint-config`: ESLint configurations
- `packages/typescript-config`: Shared TypeScript configs

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development

The main app is in `apps/web/app/`. Edit `page.tsx` to get started.

### Using UI Components

```tsx
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
```

### Adding New shadcn Components

```bash
pnpm shadcn add <component>
```

Components are installed to `packages/ui/src/components/`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm check-types` | TypeScript check |
