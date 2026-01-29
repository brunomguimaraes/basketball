import { format, parseISO } from 'date-fns';

export function formatGameTime(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'EEE, MMM d, h:mm a');
  } catch (error) {
    console.error('Error formatting game time:', error);
    return 'Invalid date';
  }
}

export function formatDateDisplay(date: Date): string {
  try {
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date display:', error);
    return 'Invalid date';
  }
}

export function formatDateForApi(date: Date): string {
  try {
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return '';
  }
}
