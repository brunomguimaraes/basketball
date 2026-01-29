/**
 * Error categories for centralized error handling
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Application error interface extending native Error
 */
export interface AppError extends Error {
  category: ErrorCategory;
  userMessage: string;
  statusCode?: number;
  retryable: boolean;
  originalError?: Error;
}

/**
 * User-friendly error messages mapped to error categories
 */
export const ERROR_MESSAGES: Record<ErrorCategory, string> = {
  [ErrorCategory.NETWORK]:
    'Unable to connect. Please check your internet connection and try again.',
  [ErrorCategory.RATE_LIMIT]:
    'Too many requests. The NBA API allows 5 requests per minute. Please wait a moment and try again.',
  [ErrorCategory.SERVER]:
    'The NBA API is temporarily unavailable. Please try again in a few moments.',
  [ErrorCategory.AUTHENTICATION]:
    'API authentication failed. Please contact support if this continues.',
  [ErrorCategory.VALIDATION]:
    'Invalid request. Please refresh the page and try again.',
  [ErrorCategory.UNKNOWN]:
    'An unexpected error occurred. Please try again.',
};
