import { handleApiError, createAppError } from '@/lib/errors/error-handler';
import { ErrorCategory } from '@/lib/errors/error-types';
import type { GamesResponse, FetchGamesParams } from './types';

const API_BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;

export async function fetchGames(
  params: FetchGamesParams
): Promise<GamesResponse> {
  if (!API_KEY) {
    console.error(
      '❌ API key not configured!\n' +
      'Please create apps/web/.env.local with:\n' +
      'NEXT_PUBLIC_BALLDONTLIE_API_KEY=your_api_key_here\n\n' +
      'Get your free API key at: https://app.balldontlie.io/signup'
    );
    throw createAppError(
      ErrorCategory.AUTHENTICATION,
      new Error('API key not configured')
    );
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
    if ((error as any).category) {
      throw error;
    }
    throw await handleApiError(error);
  }
}
