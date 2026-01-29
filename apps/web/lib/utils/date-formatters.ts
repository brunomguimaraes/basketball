import { format, parseISO } from 'date-fns';

/**
 * Formats ISO 8601 date string to readable game time
 * @example "2026-01-29T01:30:00Z" → "Wed, Jan 29, 1:30 AM"
 * @param isoDate - ISO 8601 formatted date string
 * @returns Formatted date string in "EEE, MMM d, h:mm a" format
 */
export function formatGameTime(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'EEE, MMM d, h:mm a');
  } catch (error) {
    console.error('Error formatting game time:', error);
    // Return a fallback format
    return 'Invalid date';
  }
}

/**
 * Formats Date object for display in date picker
 * @example Date(2026-01-29) → "January 29, 2026"
 * @param date - JavaScript Date object
 * @returns Formatted date string in "MMMM d, yyyy" format
 */
export function formatDateDisplay(date: Date): string {
  try {
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date display:', error);
    return 'Invalid date';
  }
}

/**
 * Formats date for API requests
 * @example Date(2026-01-29) → "2026-01-29"
 * @param date - JavaScript Date object
 * @returns Formatted date string in "yyyy-MM-dd" format
 */
export function formatDateForApi(date: Date): string {
  try {
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return '';
  }
}
