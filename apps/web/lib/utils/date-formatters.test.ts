import { describe, it, expect } from 'vitest';
import { formatGameTime, formatDateDisplay, formatDateForApi } from './date-formatters';

describe('formatGameTime', () => {
  it('should convert ISO 8601 to readable format', () => {
    const result = formatGameTime('2026-01-29T01:30:00Z');
    // Note: The exact output depends on the timezone, but it should follow the pattern
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('should handle afternoon times', () => {
    const result = formatGameTime('2026-01-29T19:30:00Z');
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('should handle midnight times', () => {
    const result = formatGameTime('2026-01-29T00:00:00Z');
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('should handle noon times', () => {
    const result = formatGameTime('2026-01-29T12:00:00Z');
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('should handle invalid dates gracefully', () => {
    const result = formatGameTime('invalid-date');
    expect(result).toBe('Invalid date');
  });

  it('should handle empty string gracefully', () => {
    const result = formatGameTime('');
    expect(result).toBe('Invalid date');
  });
});

describe('formatDateDisplay', () => {
  it('should format Date object correctly', () => {
    const date = new Date(2026, 0, 29); // Month is 0-indexed
    const result = formatDateDisplay(date);
    expect(result).toMatch(/\w+ \d{1,2}, \d{4}/);
  });

  it('should handle January dates', () => {
    const date = new Date(2026, 0, 15); // Month is 0-indexed (0 = January)
    const result = formatDateDisplay(date);
    expect(result).toContain('2026');
    expect(result).toContain('15');
  });

  it('should handle December dates', () => {
    const date = new Date(2026, 11, 25); // Month is 0-indexed (11 = December)
    const result = formatDateDisplay(date);
    expect(result).toContain('2026');
    expect(result).toContain('25');
  });

  it('should handle invalid dates gracefully', () => {
    const result = formatDateDisplay(new Date('invalid'));
    expect(result).toBe('Invalid date');
  });
});

describe('formatDateForApi', () => {
  it('should format date for API in yyyy-MM-dd format', () => {
    const date = new Date(2026, 0, 29); // Month is 0-indexed
    const result = formatDateForApi(date);
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('should pad single digit months and days', () => {
    const date = new Date(2026, 0, 5); // Month is 0-indexed (0 = January)
    const result = formatDateForApi(date);
    // Should contain '01' for January and '05' for day
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(result).toContain('2026-01-05');
  });

  it('should handle invalid dates gracefully', () => {
    const result = formatDateForApi(new Date('invalid'));
    expect(result).toBe('');
  });
});
