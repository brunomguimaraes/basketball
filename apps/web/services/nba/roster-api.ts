import { handleApiError } from '@/lib/errors/error-handler';
import type { PlayersResponse, FetchRosterParams } from './types';

const API_BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;

export async function fetchTeamRoster(
  params: FetchRosterParams
): Promise<PlayersResponse> {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  try {
    const url = new URL(`${API_BASE_URL}/players`);
    url.searchParams.append('team_ids[]', params.teamId.toString());
    url.searchParams.append('per_page', '100');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data: PlayersResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as any).category) {
      throw error;
    }
    throw handleApiError(error);
  }
}
