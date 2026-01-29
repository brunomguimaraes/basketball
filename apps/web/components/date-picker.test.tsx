import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('renders with selected date formatted correctly', () => {
    const selectedDate = new Date('2024-01-15');
    const onSelect = vi.fn();

    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    // Check if date is formatted as PPP (e.g., "January 15th, 2024")
    expect(screen.getByText(/January \d+\w*, 2024/i)).toBeInTheDocument();
  });

  it('opens popover on button click', async () => {
    const selectedDate = new Date('2024-01-15');
    const onSelect = vi.fn();

    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Calendar should be rendered (checking for grid role which calendar has)
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('calls onSelect with new date when date is selected', async () => {
    const selectedDate = new Date('2024-01-15');
    const onSelect = vi.fn();

    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Calendar should be open (checking for grid role which calendar has)
    expect(screen.getByRole('grid')).toBeInTheDocument();

    // Find day button - calendar days are in cells within the grid
    // Look for a gridcell that contains a clickable date
    const dayCells = screen.getAllByRole('gridcell');
    // Find a cell that represents a day (not empty/outside current month)
    const selectableDay = dayCells.find(
      (cell) =>
        cell.textContent &&
        !cell.querySelector('[disabled]') &&
        cell.querySelector('button')
    );

    expect(selectableDay).toBeDefined();
    if (selectableDay) {
      const dayButton = selectableDay.querySelector('button');
      if (dayButton) {
        fireEvent.click(dayButton);
        // onSelect should be called with a Date object
        expect(onSelect).toHaveBeenCalled();
        expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
      }
    }
  });

  it('has calendar icon', () => {
    const selectedDate = new Date('2024-01-15');
    const onSelect = vi.fn();

    const { container } = render(
      <DatePicker selected={selectedDate} onSelect={onSelect} />
    );

    // Check for SVG element (Calendar icon from lucide-react)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies NBA theme classes', () => {
    const selectedDate = new Date('2024-01-15');
    const onSelect = vi.fn();

    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-white/10');
    expect(button.className).toContain('border-white/20');
  });
});
