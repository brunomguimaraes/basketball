import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTeamRoster } from './roster-api';
import { ErrorCategory } from './types';

describe('roster-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set API key for tests
    process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY = 'test-api-key';
  });

  describe('fetchTeamRoster', () => {
    it('should fetch roster successfully', async () => {
      const mockPlayers = [
        {
          id: 1,
          first_name: 'LeBron',
          last_name: 'James',
          position: 'F',
          height: '6-9',
          weight: '250',
          jersey_number: '23',
          college: 'None',
          country: 'USA',
          draft_year: 2003,
          draft_round: 1,
          draft_number: 1,
          team: { id: 1, name: 'Lakers', abbreviation: 'LAL', city: 'Los Angeles', conference: 'West', division: 'Pacific', full_name: 'Los Angeles Lakers' },
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: mockPlayers,
          meta: {
            total_pages: 1,
            current_page: 1,
            next_page: null,
            per_page: 100,
            total_count: 1,
          },
        }),
      });

      const result = await fetchTeamRoster({ teamId: 1 });

      expect(result.data).toEqual(mockPlayers);
      expect(result.meta.total_count).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.balldontlie.io/v1/players?team_ids%5B%5D=1&per_page=100',
        expect.objectContaining({
          headers: {
            Authorization: 'test-api-key',
          },
        })
      );
    });

    it('should include per_page=100 in request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      });

      await fetchTeamRoster({ teamId: 1 });

      const callArgs = (global.fetch as any).mock.calls[0][0];
      expect(callArgs).toContain('per_page=100');
    });

    it('should handle 429 rate limit errors', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        new Response(null, { status: 429, statusText: 'Too Many Requests' })
      );

      try {
        await fetchTeamRoster({ teamId: 1 });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.category).toBe(ErrorCategory.RATE_LIMIT);
        expect(error.statusCode).toBe(429);
      }
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      let caughtError;
      try {
        await fetchTeamRoster({ teamId: 1 });
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeDefined();
      expect((caughtError as any).category).toBe(ErrorCategory.NETWORK);
    });

    it('should throw error if API key not configured', async () => {
      const originalKey = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;
      delete process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;

      let caughtError;
      try {
        await fetchTeamRoster({ teamId: 1 });
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeDefined();
      expect((caughtError as any).message).toBe('API key not configured');

      // Restore API key
      process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY = originalKey;
    });

    it('should handle server errors (5xx)', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        new Response(null, { status: 500, statusText: 'Internal Server Error' })
      );

      try {
        await fetchTeamRoster({ teamId: 1 });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.category).toBe(ErrorCategory.SERVER);
        expect(error.statusCode).toBe(500);
      }
    });

    it('should handle authentication errors (401)', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        new Response(null, { status: 401, statusText: 'Unauthorized' })
      );

      try {
        await fetchTeamRoster({ teamId: 1 });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
        expect(error.statusCode).toBe(401);
      }
    });

    it('should handle validation errors (400)', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        new Response(null, { status: 400, statusText: 'Bad Request' })
      );

      try {
        await fetchTeamRoster({ teamId: -1 });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.category).toBe(ErrorCategory.VALIDATION);
        expect(error.statusCode).toBe(400);
      }
    });
  });
});
