import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders icon and message', () => {
    const testDate = new Date('2024-01-15');
    const { container } = render(<EmptyState date={testDate} />);

    // Check for heading
    expect(screen.getByText('No games scheduled')).toBeInTheDocument();

    // Check for Calendar icon SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays selected date in message', () => {
    const testDate = new Date('2024-01-15');
    render(<EmptyState date={testDate} />);

    // Date should be formatted with PPP format (includes ordinal suffix)
    expect(screen.getByText(/January \d+\w*, 2024/i)).toBeInTheDocument();
  });

  it('shows helpful suggestion text', () => {
    const testDate = new Date('2024-01-15');
    render(<EmptyState date={testDate} />);

    expect(
      screen.getByText(/Try selecting a different date/i)
    ).toBeInTheDocument();
  });

  it('has proper centered layout', () => {
    const testDate = new Date('2024-01-15');
    const { container } = render(<EmptyState date={testDate} />);

    const wrapper = container.querySelector(
      '[class*="flex"][class*="items-center"][class*="justify-center"]'
    );
    expect(wrapper).toBeInTheDocument();
  });

  it('applies NBA theme styling', () => {
    const testDate = new Date('2024-01-15');
    const { container } = render(<EmptyState date={testDate} />);

    // Check for icon background with NBA theme
    const iconBg = container.querySelector('[class*="bg-white/5"]');
    expect(iconBg).toBeInTheDocument();

    // Check for text color classes
    const heading = screen.getByText('No games scheduled');
    expect(heading.className).toContain('text-white');
  });

  it('has minimum height for consistent layout', () => {
    const testDate = new Date('2024-01-15');
    const { container } = render(<EmptyState date={testDate} />);

    const wrapper = container.querySelector('[class*="min-h-"]');
    expect(wrapper).toBeInTheDocument();
  });
});
