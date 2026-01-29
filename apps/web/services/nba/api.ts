import { handleApiError } from '@/lib/errors/error-handler';
import type { GamesResponse, FetchGamesParams } from './types';

const API_BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;

/**
 * Fetches NBA games for specified dates from BallDontLie API
 * 
 * @param params - Object containing array of dates in YYYY-MM-DD format
 * @returns Promise<GamesResponse> with games data and metadata
 * @throws {AppError} Categorized error for user-friendly handling
 * 
 * @example
 * ```typescript
 * const games = await fetchGames({ dates: ['2024-01-15'] });
 * console.log(games.data); // Array of Game objects
 * ```
 */
export async function fetchGames(
  params: FetchGamesParams
): Promise<GamesResponse> {
  if (!API_KEY) {
    throw new Error('API key not configured. Please set NEXT_PUBLIC_BALLDONTLIE_API_KEY in .env.local');
  }

  try {
    const url = new URL(`${API_BASE_URL}/games`);
    params.dates.forEach((date) => url.searchParams.append('dates[]', date));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data: GamesResponse = await response.json();
    return data;
  } catch (error) {
    // If already an AppError, rethrow; otherwise, wrap it
    if ((error as any).category) {
      throw error;
    }
    throw await handleApiError(error);
  }
}
