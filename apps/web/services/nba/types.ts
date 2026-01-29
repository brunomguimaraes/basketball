/**
 * BallDontLie API Response Types
 * Reference: https://docs.balldontlie.io/#nba-api
 */

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface PeriodScore {
  period: number;
  home_score: number;
  visitor_score: number;
}

export interface Game {
  id: number;
  date: string; // ISO 8601 format
  season: number;
  status: 'Final' | 'In Progress' | 'Scheduled';
  period: number;
  time: string;
  postseason: boolean;
  home_team: Team;
  home_team_score: number;
  visitor_team: Team;
  visitor_team_score: number;
  period_scores?: PeriodScore[];
}

export interface GamesResponse {
  data: Game[];
  meta: {
    total_pages: number;
    current_page: number;
    next_page: number | null;
    per_page: number;
    total_count: number;
  };
}

/**
 * API Request Parameters
 */
export interface FetchGamesParams {
  dates: string[]; // YYYY-MM-DD format
}

/**
 * React Query Types
 */
export type GamesQueryKey = ['games', string]; // ['games', '2024-01-15']

/**
 * Error Types (from error abstraction layer)
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError extends Error {
  category: ErrorCategory;
  userMessage: string;
  statusCode?: number;
  retryable: boolean;
  originalError?: Error;
}
