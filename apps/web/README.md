# NBA Scoreboard Web App

Next.js 16 application built with React 19, TypeScript, and Tailwind CSS v4.

## Setup

### 1. Install Dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure API Key

Create `.env.local` in the `apps/web` directory:

```bash
# apps/web/.env.local
NEXT_PUBLIC_BALLDONTLIE_API_KEY=your_api_key_here
```

**Get your free API key:**
1. Visit [https://app.balldontlie.io/signup](https://app.balldontlie.io/signup)
2. Sign up for a free account
3. Copy your API key
4. Paste it into `.env.local`

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- 🏀 View NBA game scores for any date
- 📅 Interactive date picker with localStorage persistence
- ⚡ Fast data fetching with React Query
- 🎨 NBA-themed gradient UI
- 📱 Fully responsive (mobile/tablet/desktop)
- ✨ Smooth animations with Framer Motion
- 🛡️ Comprehensive error handling
- 🧪 88 passing tests

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Data Fetching**: @tanstack/react-query
- **Animations**: Framer Motion
- **Components**: shadcn/ui
- **Testing**: Vitest + React Testing Library

## Available Scripts

```bash
# Development
pnpm dev          # Start dev server (http://localhost:3000)

# Testing
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once

# Building
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint
```

## Project Structure

```
apps/web/
├── app/                  # Next.js App Router
│   ├── page.tsx         # Main scoreboard page
│   ├── layout.tsx       # Root layout
│   ├── error.tsx        # Error boundary
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── game-card.tsx
│   ├── games-list.tsx
│   ├── date-picker.tsx
│   └── ...
├── services/            # API services
│   └── nba/
│       ├── api.ts       # API client
│       ├── hooks.ts     # React Query hooks
│       └── types.ts     # TypeScript types
├── lib/                 # Utilities
│   └── errors/          # Error handling
└── hooks/               # Custom React hooks
```

## Troubleshooting

### "Error Loading Games"

If you see this error:

1. **Check API Key**: Ensure `.env.local` exists with your API key
2. **Restart Server**: After adding `.env.local`, restart the dev server
3. **Check Console**: Look for detailed error messages in browser console

### Hydration Errors

If you see hydration warnings:
- Clear browser cache and localStorage
- Restart the development server
- The app will self-heal on the client side

## Performance

The app follows React best practices:

- ✅ **No waterfalls**: Single API call per date change
- ✅ **Intelligent caching**: 24hr for completed games, 1min for live
- ✅ **Lazy loading**: React Query devtools only in development
- ✅ **Optimized re-renders**: React.memo on GameCard components
- ✅ **Stable keys**: Using `game.id` instead of array indices

## API Rate Limits

BallDontLie API free tier: **5 requests per minute**

The app respects this by:
- Caching responses for 5+ minutes
- Deduplicating simultaneous requests
- Showing user-friendly rate limit errors
