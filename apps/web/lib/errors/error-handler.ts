import {
  ErrorCategory,
  ERROR_MESSAGES,
  type AppError,
} from './error-types';

/**
 * Creates a typed AppError with proper categorization and user-friendly messaging
 * 
 * @param category - The error category for classification
 * @param originalError - The original error object (optional)
 * @param statusCode - HTTP status code if applicable (optional)
 * @returns AppError with all required properties
 */
export function createAppError(
  category: ErrorCategory,
  originalError?: Error,
  statusCode?: number
): AppError {
  const error = new Error(ERROR_MESSAGES[category]) as AppError;
  error.name = 'AppError';
  error.category = category;
  error.userMessage = ERROR_MESSAGES[category];
  error.statusCode = statusCode;
  error.retryable = [
    ErrorCategory.NETWORK,
    ErrorCategory.SERVER,
    ErrorCategory.UNKNOWN,
  ].includes(category);
  error.originalError = originalError;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[AppError]', {
      category,
      statusCode,
      message: error.message,
      originalError,
    });
  }

  return error;
}

/**
 * Handles API response errors and categorizes them based on HTTP status codes
 * 
 * @param responseOrError - Response object, Error, or unknown error
 * @returns Promise<AppError> with proper categorization
 */
export async function handleApiError(
  responseOrError: Response | Error | unknown
): Promise<AppError> {
  // Handle fetch Response errors
  if (responseOrError instanceof Response) {
    const { status } = responseOrError;

    switch (status) {
      case 429:
        return createAppError(ErrorCategory.RATE_LIMIT, undefined, status);
      case 401:
      case 403:
        return createAppError(ErrorCategory.AUTHENTICATION, undefined, status);
      case 400:
      case 422:
        return createAppError(ErrorCategory.VALIDATION, undefined, status);
      case 500:
      case 502:
      case 503:
      case 504:
        return createAppError(ErrorCategory.SERVER, undefined, status);
      default:
        return createAppError(ErrorCategory.UNKNOWN, undefined, status);
    }
  }

  // Handle network errors (fetch failures)
  if (responseOrError instanceof TypeError) {
    return createAppError(ErrorCategory.NETWORK, responseOrError);
  }

  // Handle generic errors
  if (responseOrError instanceof Error) {
    return createAppError(ErrorCategory.UNKNOWN, responseOrError);
  }

  // Unknown error type
  return createAppError(ErrorCategory.UNKNOWN);
}
