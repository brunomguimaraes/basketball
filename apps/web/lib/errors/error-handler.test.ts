import { describe, it, expect, vi } from 'vitest';
import { handleApiError, createAppError } from './error-handler';
import { ErrorCategory } from './error-types';

describe('error-handler', () => {
  describe('createAppError', () => {
    it('should create AppError with correct properties', () => {
      const error = createAppError(ErrorCategory.NETWORK);

      expect(error.name).toBe('AppError');
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.userMessage).toContain('Unable to connect');
      expect(error.retryable).toBe(true);
    });

    it('should set retryable to false for RATE_LIMIT', () => {
      const error = createAppError(ErrorCategory.RATE_LIMIT);
      expect(error.retryable).toBe(false);
      expect(error.category).toBe(ErrorCategory.RATE_LIMIT);
    });

    it('should set retryable to false for AUTHENTICATION', () => {
      const error = createAppError(ErrorCategory.AUTHENTICATION);
      expect(error.retryable).toBe(false);
    });

    it('should include status code when provided', () => {
      const error = createAppError(ErrorCategory.SERVER, undefined, 500);
      expect(error.statusCode).toBe(500);
    });

    it('should include original error when provided', () => {
      const originalError = new Error('Original error');
      const error = createAppError(ErrorCategory.UNKNOWN, originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('handleApiError', () => {
    it('should categorize 429 as RATE_LIMIT', async () => {
      const response = new Response(null, { status: 429 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.RATE_LIMIT);
      expect(error.statusCode).toBe(429);
      expect(error.retryable).toBe(false);
      expect(error.userMessage).toContain('5 requests per minute');
    });

    it('should categorize 401 as AUTHENTICATION', async () => {
      const response = new Response(null, { status: 401 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.statusCode).toBe(401);
      expect(error.retryable).toBe(false);
    });

    it('should categorize 403 as AUTHENTICATION', async () => {
      const response = new Response(null, { status: 403 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.statusCode).toBe(403);
    });

    it('should categorize 400 as VALIDATION', async () => {
      const response = new Response(null, { status: 400 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.statusCode).toBe(400);
    });

    it('should categorize 422 as VALIDATION', async () => {
      const response = new Response(null, { status: 422 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.statusCode).toBe(422);
    });

    it('should categorize 500 as SERVER', async () => {
      const response = new Response(null, { status: 500 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.SERVER);
      expect(error.statusCode).toBe(500);
      expect(error.retryable).toBe(true);
    });

    it('should categorize 502 as SERVER', async () => {
      const response = new Response(null, { status: 502 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.SERVER);
      expect(error.statusCode).toBe(502);
    });

    it('should categorize 503 as SERVER', async () => {
      const response = new Response(null, { status: 503 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.SERVER);
      expect(error.statusCode).toBe(503);
    });

    it('should categorize 504 as SERVER', async () => {
      const response = new Response(null, { status: 504 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.SERVER);
      expect(error.statusCode).toBe(504);
    });

    it('should categorize TypeError as NETWORK', async () => {
      const networkError = new TypeError('Failed to fetch');
      const error = await handleApiError(networkError);

      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.retryable).toBe(true);
      expect(error.originalError).toBe(networkError);
    });

    it('should categorize generic Error as UNKNOWN', async () => {
      const genericError = new Error('Something went wrong');
      const error = await handleApiError(genericError);

      expect(error.category).toBe(ErrorCategory.UNKNOWN);
      expect(error.retryable).toBe(true);
    });

    it('should categorize unknown error type as UNKNOWN', async () => {
      const error = await handleApiError('string error');

      expect(error.category).toBe(ErrorCategory.UNKNOWN);
      expect(error.retryable).toBe(true);
    });

    it('should categorize unexpected status codes as UNKNOWN', async () => {
      const response = new Response(null, { status: 418 });
      const error = await handleApiError(response);

      expect(error.category).toBe(ErrorCategory.UNKNOWN);
      expect(error.statusCode).toBe(418);
    });
  });
});
