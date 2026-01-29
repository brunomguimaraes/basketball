/**
 * NBA Team Branding Data
 * Static mapping of team logos and colors for all 30 NBA teams
 * Using official NBA CDN for logo URLs
 */

export interface TeamBranding {
  id: number;
  abbreviation: string;
  name: string;
  primaryColor: string; // Hex color
  secondaryColor: string; // Hex color
  logoUrl: string; // CDN URL
}

/**
 * Complete NBA team branding mapping
 * All 30 teams with official colors and CDN logo URLs
 */
export const TEAM_BRANDING: Record<string, TeamBranding> = {
  ATL: {
    id: 1,
    abbreviation: 'ATL',
    name: 'Hawks',
    primaryColor: '#E03A3E',
    secondaryColor: '#C1D32F',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
  },
  BOS: {
    id: 2,
    abbreviation: 'BOS',
    name: 'Celtics',
    primaryColor: '#007A33',
    secondaryColor: '#BA9653',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
  },
  BKN: {
    id: 3,
    abbreviation: 'BKN',
    name: 'Nets',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
  },
  CHA: {
    id: 4,
    abbreviation: 'CHA',
    name: 'Hornets',
    primaryColor: '#1D1160',
    secondaryColor: '#00788C',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
  },
  CHI: {
    id: 5,
    abbreviation: 'CHI',
    name: 'Bulls',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
  },
  CLE: {
    id: 6,
    abbreviation: 'CLE',
    name: 'Cavaliers',
    primaryColor: '#860038',
    secondaryColor: '#FDBB30',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
  },
  DAL: {
    id: 7,
    abbreviation: 'DAL',
    name: 'Mavericks',
    primaryColor: '#00538C',
    secondaryColor: '#002B5E',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
  },
  DEN: {
    id: 8,
    abbreviation: 'DEN',
    name: 'Nuggets',
    primaryColor: '#0E2240',
    secondaryColor: '#FEC524',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
  },
  DET: {
    id: 9,
    abbreviation: 'DET',
    name: 'Pistons',
    primaryColor: '#C8102E',
    secondaryColor: '#1D42BA',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
  },
  GSW: {
    id: 10,
    abbreviation: 'GSW',
    name: 'Warriors',
    primaryColor: '#1D428A',
    secondaryColor: '#FFC72C',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
  },
  HOU: {
    id: 11,
    abbreviation: 'HOU',
    name: 'Rockets',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
  },
  IND: {
    id: 12,
    abbreviation: 'IND',
    name: 'Pacers',
    primaryColor: '#002D62',
    secondaryColor: '#FDBB30',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
  },
  LAC: {
    id: 13,
    abbreviation: 'LAC',
    name: 'Clippers',
    primaryColor: '#C8102E',
    secondaryColor: '#1D428A',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
  },
  LAL: {
    id: 14,
    abbreviation: 'LAL',
    name: 'Lakers',
    primaryColor: '#552583',
    secondaryColor: '#FDB927',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
  },
  MEM: {
    id: 15,
    abbreviation: 'MEM',
    name: 'Grizzlies',
    primaryColor: '#5D76A9',
    secondaryColor: '#12173F',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
  },
  MIA: {
    id: 16,
    abbreviation: 'MIA',
    name: 'Heat',
    primaryColor: '#98002E',
    secondaryColor: '#F9A01B',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
  },
  MIL: {
    id: 17,
    abbreviation: 'MIL',
    name: 'Bucks',
    primaryColor: '#00471B',
    secondaryColor: '#EEE1C6',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
  },
  MIN: {
    id: 18,
    abbreviation: 'MIN',
    name: 'Timberwolves',
    primaryColor: '#0C2340',
    secondaryColor: '#236192',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
  },
  NOP: {
    id: 19,
    abbreviation: 'NOP',
    name: 'Pelicans',
    primaryColor: '#0C2340',
    secondaryColor: '#C8102E',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
  },
  NYK: {
    id: 20,
    abbreviation: 'NYK',
    name: 'Knicks',
    primaryColor: '#006BB6',
    secondaryColor: '#F58426',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
  },
  OKC: {
    id: 21,
    abbreviation: 'OKC',
    name: 'Thunder',
    primaryColor: '#007AC1',
    secondaryColor: '#EF3B24',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
  },
  ORL: {
    id: 22,
    abbreviation: 'ORL',
    name: 'Magic',
    primaryColor: '#0077C0',
    secondaryColor: '#C4CED4',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
  },
  PHI: {
    id: 23,
    abbreviation: 'PHI',
    name: '76ers',
    primaryColor: '#006BB6',
    secondaryColor: '#ED174C',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
  },
  PHX: {
    id: 24,
    abbreviation: 'PHX',
    name: 'Suns',
    primaryColor: '#1D1160',
    secondaryColor: '#E56020',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
  },
  POR: {
    id: 25,
    abbreviation: 'POR',
    name: 'Trail Blazers',
    primaryColor: '#E03A3E',
    secondaryColor: '#000000',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
  },
  SAC: {
    id: 26,
    abbreviation: 'SAC',
    name: 'Kings',
    primaryColor: '#5A2D81',
    secondaryColor: '#63727A',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
  },
  SAS: {
    id: 27,
    abbreviation: 'SAS',
    name: 'Spurs',
    primaryColor: '#C4CED4',
    secondaryColor: '#000000',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
  },
  TOR: {
    id: 28,
    abbreviation: 'TOR',
    name: 'Raptors',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
  },
  UTA: {
    id: 29,
    abbreviation: 'UTA',
    name: 'Jazz',
    primaryColor: '#002B5C',
    secondaryColor: '#00471B',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
  },
  WAS: {
    id: 30,
    abbreviation: 'WAS',
    name: 'Wizards',
    primaryColor: '#002B5C',
    secondaryColor: '#E31837',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg',
  },
};

/**
 * Get team branding by abbreviation
 * @param abbreviation - Team abbreviation (e.g., 'LAL', 'BOS')
 * @returns TeamBranding object or null if not found
 */
export function getTeamBranding(abbreviation: string): TeamBranding | null {
  return TEAM_BRANDING[abbreviation] || null;
}

/**
 * Get all team abbreviations
 * Useful for testing and validation
 */
export function getAllTeamAbbreviations(): string[] {
  return Object.keys(TEAM_BRANDING);
}

/**
 * Validate team branding data completeness
 * Returns true if all 30 teams are present
 */
export function validateTeamBrandingData(): boolean {
  const expectedTeamCount = 30;
  const actualTeamCount = Object.keys(TEAM_BRANDING).length;
  return actualTeamCount === expectedTeamCount;
}
