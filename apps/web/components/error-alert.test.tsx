import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorAlert } from './error-alert';
import { ErrorCategory } from '@/services/nba/types';
import type { AppError } from '@/services/nba/types';

const createMockError = (
  category: ErrorCategory,
  retryable: boolean
): AppError => {
  const error = new Error('Test error') as AppError;
  error.category = category;
  error.userMessage = 'Test error message';
  error.retryable = retryable;
  return error;
};

describe('ErrorAlert', () => {
  it('displays error userMessage', () => {
    const error = createMockError(ErrorCategory.NETWORK, true);
    error.userMessage = 'Network connection failed';

    render(<ErrorAlert error={error} />);

    expect(screen.getByText('Network connection failed')).toBeInTheDocument();
    expect(screen.getByText('Error Loading Games')).toBeInTheDocument();
  });

  it('shows retry button when error is retryable', () => {
    const error = createMockError(ErrorCategory.NETWORK, true);
    const onRetry = vi.fn();

    render(<ErrorAlert error={error} onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('hides retry button when error is not retryable', () => {
    const error = createMockError(ErrorCategory.RATE_LIMIT, false);

    render(<ErrorAlert error={error} />);

    const retryButton = screen.queryByRole('button', { name: /Try Again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const error = createMockError(ErrorCategory.SERVER, true);
    const onRetry = vi.fn();

    render(<ErrorAlert error={error} onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('displays correct color for NETWORK category', () => {
    const error = createMockError(ErrorCategory.NETWORK, true);
    const { container } = render(<ErrorAlert error={error} />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('bg-yellow-500/10');
    expect(alert?.className).toContain('text-yellow-500');
  });

  it('displays correct color for RATE_LIMIT category', () => {
    const error = createMockError(ErrorCategory.RATE_LIMIT, false);
    const { container } = render(<ErrorAlert error={error} />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('bg-orange-500/10');
    expect(alert?.className).toContain('text-orange-500');
  });

  it('displays correct color for SERVER category', () => {
    const error = createMockError(ErrorCategory.SERVER, true);
    const { container } = render(<ErrorAlert error={error} />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('bg-red-500/10');
    expect(alert?.className).toContain('text-red-500');
  });

  it('displays correct color for AUTHENTICATION category', () => {
    const error = createMockError(ErrorCategory.AUTHENTICATION, false);
    const { container } = render(<ErrorAlert error={error} />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('bg-red-500/10');
    expect(alert?.className).toContain('text-red-500');
  });

  it('has proper ARIA attributes for accessibility', () => {
    const error = createMockError(ErrorCategory.UNKNOWN, true);
    const { container } = render(<ErrorAlert error={error} />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert?.getAttribute('aria-live')).toBe('assertive');
  });

  it('displays AlertCircle icon', () => {
    const error = createMockError(ErrorCategory.VALIDATION, true);
    const { container } = render(<ErrorAlert error={error} />);

    // Check for SVG icon
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not show retry button if onRetry is not provided', () => {
    const error = createMockError(ErrorCategory.NETWORK, true);

    render(<ErrorAlert error={error} />);

    const retryButton = screen.queryByRole('button', { name: /Try Again/i });
    expect(retryButton).not.toBeInTheDocument();
  });
});
