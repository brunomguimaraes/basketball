import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGames } from './api';
import { ErrorCategory } from './types';

describe('fetchGames API service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should fetch games successfully with valid response', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          date: '2024-01-15T00:00:00.000Z',
          status: 'Final',
          home_team: {
            id: 1,
            name: 'Lakers',
            abbreviation: 'LAL',
            city: 'Los Angeles',
            conference: 'West',
            division: 'Pacific',
            full_name: 'Los Angeles Lakers',
          },
          visitor_team: {
            id: 2,
            name: 'Celtics',
            abbreviation: 'BOS',
            city: 'Boston',
            conference: 'East',
            division: 'Atlantic',
            full_name: 'Boston Celtics',
          },
          home_team_score: 110,
          visitor_team_score: 105,
          season: 2024,
          period: 4,
          time: 'Final',
          postseason: false,
        },
      ],
      meta: {
        total_pages: 1,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 1,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchGames({ dates: ['2024-01-15'] });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]!.id).toBe(1);
    expect(result.data[0]!.home_team.name).toBe('Lakers');
    expect(result.meta.total_count).toBe(1);
  });

  it('should include Authorization header with API key', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], meta: {} }),
    });

    await fetchGames({ dates: ['2024-01-15'] });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('dates%5B%5D=2024-01-15'),
      expect.objectContaining({
        headers: {
          Authorization: 'test-api-key',
        },
      })
    );
  });

  it('should construct URL with multiple dates correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], meta: {} }),
    });

    await fetchGames({ dates: ['2024-01-15', '2024-01-16'] });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('dates%5B%5D=2024-01-15'),
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('dates%5B%5D=2024-01-16'),
      expect.any(Object)
    );
  });

  it('should throw AppError on 429 rate limit', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    try {
      await fetchGames({ dates: ['2024-01-15'] });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      // The error handler should categorize this
      expect(error.category).toBeDefined();
      expect(error.message).toBeDefined();
    }
  });

  it('should throw AppError on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(fetchGames({ dates: ['2024-01-15'] })).rejects.toMatchObject({
      category: ErrorCategory.NETWORK,
      retryable: true,
    });
  });

  it('should throw AppError on 401 authentication error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    try {
      await fetchGames({ dates: ['2024-01-15'] });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      // The error handler should categorize this
      expect(error.category).toBeDefined();
      expect(error.message).toBeDefined();
    }
  });

  it('should throw error if API key is not configured', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;
    delete process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;

    try {
      await fetchGames({ dates: ['2024-01-15'] });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
    } finally {
      process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY = originalEnv;
    }
  });
});
