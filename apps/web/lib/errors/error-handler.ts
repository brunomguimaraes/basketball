import {
  ErrorCategory,
  ERROR_MESSAGES,
  type AppError,
} from './error-types';

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

export async function handleApiError(
  responseOrError: Response | Error | unknown
): Promise<AppError> {
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

  if (responseOrError instanceof TypeError) {
    return createAppError(ErrorCategory.NETWORK, responseOrError);
  }

  if (responseOrError instanceof Error) {
    return createAppError(ErrorCategory.UNKNOWN, responseOrError);
  }

  return createAppError(ErrorCategory.UNKNOWN);
}
