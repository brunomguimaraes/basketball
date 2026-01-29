import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamLogoFallback } from './team-logo-fallback';

describe('TeamLogoFallback', () => {
  it('should render team abbreviation', () => {
    render(<TeamLogoFallback abbreviation="LAL" />);
    expect(screen.getByText('LAL')).toBeInTheDocument();
  });

  it('should have proper ARIA label', () => {
    render(<TeamLogoFallback abbreviation="BOS" />);
    const element = screen.getByRole('img');
    expect(element).toHaveAttribute('aria-label', 'BOS logo placeholder');
  });

  it('should render with correct styling classes', () => {
    render(<TeamLogoFallback abbreviation="GSW" />);
    const element = screen.getByRole('img');
    expect(element).toHaveClass('w-12', 'h-12', 'rounded-full', 'bg-white/10');
  });

  it('should display abbreviation in correct font style', () => {
    render(<TeamLogoFallback abbreviation="MIA" />);
    const text = screen.getByText('MIA');
    expect(text).toHaveClass('font-team-name', 'text-white', 'text-sm', 'font-bold');
  });

  it('should handle three-letter abbreviations', () => {
    render(<TeamLogoFallback abbreviation="PHX" />);
    expect(screen.getByText('PHX')).toBeInTheDocument();
  });

  it('should render multiple fallbacks independently', () => {
    const { rerender } = render(<TeamLogoFallback abbreviation="LAL" />);
    expect(screen.getByText('LAL')).toBeInTheDocument();

    rerender(<TeamLogoFallback abbreviation="BOS" />);
    expect(screen.getByText('BOS')).toBeInTheDocument();
    expect(screen.queryByText('LAL')).not.toBeInTheDocument();
  });
});
