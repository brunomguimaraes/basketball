import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GameCardSkeleton } from './game-card-skeleton';

describe('GameCardSkeleton', () => {
  it('renders with pulse animation', () => {
    const { container } = render(<GameCardSkeleton />);

    // Check for elements with animate-pulse-glow class
    const animatedElements = container.querySelectorAll('.animate-pulse-glow');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('matches GameCard dimensions structure', () => {
    const { container } = render(<GameCardSkeleton />);

    // Should have Card, CardHeader, and CardContent
    const card = container.querySelector('[class*="bg-white/5"]');
    expect(card).toBeInTheDocument();

    // Should have skeleton elements for time, badge, teams, and scores
    const skeletons = container.querySelectorAll('[class*="bg-white/10"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(6); // time, badge, 2 team names, 2 abbreviations, 2 scores
  });

  it('has proper spacing structure', () => {
    const { container } = render(<GameCardSkeleton />);

    // Should have space-y-4 for proper spacing
    const content = container.querySelector('[class*="space-y-4"]');
    expect(content).toBeInTheDocument();
  });

  it('applies NBA theme glassmorphism', () => {
    const { container } = render(<GameCardSkeleton />);

    const card = container.querySelector('[class*="backdrop-blur-sm"]');
    expect(card).toBeInTheDocument();
  });
});
