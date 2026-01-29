import { describe, it, expect } from 'vitest';
import {
  getTeamBranding,
  getAllTeamAbbreviations,
  validateTeamBrandingData,
  TEAM_BRANDING,
} from './team-branding';

describe('Team Branding', () => {
  describe('TEAM_BRANDING data structure', () => {
    it('should have all 30 NBA teams', () => {
      const teamCount = Object.keys(TEAM_BRANDING).length;
      expect(teamCount).toBe(30);
    });

    it('should have valid data structure for each team', () => {
      Object.entries(TEAM_BRANDING).forEach(([abbreviation, team]) => {
        expect(team).toHaveProperty('id');
        expect(team).toHaveProperty('abbreviation');
        expect(team).toHaveProperty('name');
        expect(team).toHaveProperty('primaryColor');
        expect(team).toHaveProperty('secondaryColor');
        expect(team).toHaveProperty('logoUrl');
        expect(team.abbreviation).toBe(abbreviation);
      });
    });

    it('should have valid hex colors for primaryColor', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(TEAM_BRANDING).forEach((team) => {
        expect(team.primaryColor).toMatch(hexColorRegex);
      });
    });

    it('should have valid hex colors for secondaryColor', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(TEAM_BRANDING).forEach((team) => {
        expect(team.secondaryColor).toMatch(hexColorRegex);
      });
    });

    it('should have valid CDN logo URLs', () => {
      const urlRegex = /^https:\/\/cdn\.nba\.com\/logos\/nba\/\d+\/primary\/L\/logo\.svg$/;
      Object.values(TEAM_BRANDING).forEach((team) => {
        expect(team.logoUrl).toMatch(urlRegex);
      });
    });

    it('should have unique team IDs', () => {
      const ids = Object.values(TEAM_BRANDING).map((team) => team.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique abbreviations', () => {
      const abbreviations = Object.values(TEAM_BRANDING).map(
        (team) => team.abbreviation
      );
      const uniqueAbbreviations = new Set(abbreviations);
      expect(uniqueAbbreviations.size).toBe(abbreviations.length);
    });
  });

  describe('getTeamBranding', () => {
    it('should return correct branding for valid abbreviation', () => {
      const lakers = getTeamBranding('LAL');
      expect(lakers).toBeDefined();
      expect(lakers?.abbreviation).toBe('LAL');
      expect(lakers?.name).toBe('Lakers');
      expect(lakers?.primaryColor).toBe('#552583');
      expect(lakers?.secondaryColor).toBe('#FDB927');
    });

    it('should return correct branding for BOS', () => {
      const celtics = getTeamBranding('BOS');
      expect(celtics).toBeDefined();
      expect(celtics?.abbreviation).toBe('BOS');
      expect(celtics?.name).toBe('Celtics');
      expect(celtics?.primaryColor).toBe('#007A33');
      expect(celtics?.secondaryColor).toBe('#BA9653');
    });

    it('should return null for invalid abbreviation', () => {
      const result = getTeamBranding('INVALID');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = getTeamBranding('');
      expect(result).toBeNull();
    });

    it('should be case-sensitive', () => {
      const result = getTeamBranding('lal'); // lowercase
      expect(result).toBeNull();
    });

    it('should work for all 30 teams', () => {
      const abbreviations = [
        'ATL', 'BOS', 'BKN', 'CHA', 'CHI', 'CLE', 'DAL', 'DEN', 'DET', 'GSW',
        'HOU', 'IND', 'LAC', 'LAL', 'MEM', 'MIA', 'MIL', 'MIN', 'NOP', 'NYK',
        'OKC', 'ORL', 'PHI', 'PHX', 'POR', 'SAC', 'SAS', 'TOR', 'UTA', 'WAS',
      ];

      abbreviations.forEach((abbr) => {
        const branding = getTeamBranding(abbr);
        expect(branding).toBeDefined();
        expect(branding?.abbreviation).toBe(abbr);
      });
    });
  });

  describe('getAllTeamAbbreviations', () => {
    it('should return array of all team abbreviations', () => {
      const abbreviations = getAllTeamAbbreviations();
      expect(abbreviations).toHaveLength(30);
      expect(abbreviations).toContain('LAL');
      expect(abbreviations).toContain('BOS');
      expect(abbreviations).toContain('GSW');
    });

    it('should return array with all uppercase abbreviations', () => {
      const abbreviations = getAllTeamAbbreviations();
      abbreviations.forEach((abbr) => {
        expect(abbr).toMatch(/^[A-Z]{3}$/);
      });
    });
  });

  describe('validateTeamBrandingData', () => {
    it('should return true for complete data (30 teams)', () => {
      expect(validateTeamBrandingData()).toBe(true);
    });
  });

  describe('Team-specific branding', () => {
    it('should have correct Lakers branding', () => {
      const lakers = getTeamBranding('LAL');
      expect(lakers?.primaryColor).toBe('#552583'); // Purple
      expect(lakers?.secondaryColor).toBe('#FDB927'); // Gold
    });

    it('should have correct Warriors branding', () => {
      const warriors = getTeamBranding('GSW');
      expect(warriors?.primaryColor).toBe('#1D428A'); // Blue
      expect(warriors?.secondaryColor).toBe('#FFC72C'); // Gold
    });

    it('should have correct Heat branding', () => {
      const heat = getTeamBranding('MIA');
      expect(heat?.primaryColor).toBe('#98002E'); // Red
      expect(heat?.secondaryColor).toBe('#F9A01B'); // Orange
    });

    it('should have correct Bulls branding', () => {
      const bulls = getTeamBranding('CHI');
      expect(bulls?.primaryColor).toBe('#CE1141'); // Red
      expect(bulls?.secondaryColor).toBe('#000000'); // Black
    });
  });
});
