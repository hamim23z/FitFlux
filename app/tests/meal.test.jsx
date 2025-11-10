import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MealOptimizer from '../MealOptimizer';

// mock navbar/footer so they don't break tests
jest.mock('../components/navbar', () => () => <div data-testid="navbar" />);
jest.mock('../components/Footer', () => () => <div data-testid="footer" />);

describe('MealOptimizer', () => {
  it('renders the title and initial chips', () => {
    render(<MealOptimizer />);

    // title
    expect(screen.getByText(/meal optimizer/i)).toBeInTheDocument();

    // default ingredients
    expect(screen.getByText('chicken')).toBeInTheDocument();
    expect(screen.getByText('rice')).toBeInTheDocument();
    expect(screen.getByText('broccoli')).toBeInTheDocument();
  });

  it('adds a new ingredient', () => {
    render(<MealOptimizer />);

    fireEvent.change(screen.getByLabelText(/add ingredient/i), {
      target: { value: 'eggs' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText('eggs')).toBeInTheDocument();
  });

  it('generates a meal plan after clicking the button', async () => {
    // component uses setTimeout → fake timers
    jest.useFakeTimers();

    render(<MealOptimizer />);

    fireEvent.click(screen.getByRole('button', { name: /generate meal plan/i }));

    // fast-forward 1 second
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText(/backend placment\./i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
