# NBA Scoreboard Challenge

## Overview

Build an **NBA Scoreboard** that displays game results for a selected date.

## Requirements

### Features

1. **Date Picker** - Select a date to view games
2. **Game Cards** - For each game, display:
   - Home and away team names
   - Scores for each period and final scores
3. **Loading State** - Show loading indicator while fetching
4. **Empty State** - Message when no games on selected date

### Technical Requirements

- Use `@tanstack/react-query` for data fetching
- Use existing `@repo/ui` components where appropriate
- Add additional shadcn components (`pnpm shadcn add <component>`) or build custom components as needed
- Ensure responsiveness
- Deploy to Vercel and provide the production URL

## API Setup

You will use the **balldontlie NBA API**.

1. **Create a free account** at [app.balldontlie.io](https://app.balldontlie.io) to get your API key
2. **API Documentation**: [https://docs.balldontlie.io/#nba-api](https://docs.balldontlie.io/#nba-api)

### Games Endpoint

```
GET https://api.balldontlie.io/v1/games?dates[]={YYYY-MM-DD}
```

Note: Free tier is limited to 5 requests/minute.

## Deliverables

1. GitHub repo link
2. Deployed Vercel URL
3. Brief notes on any decisions or tradeoffs
