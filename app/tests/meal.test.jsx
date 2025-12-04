import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// 👇 change this line to wherever your file actually is
// if your component is at app/meal/page.jsx:
import MealOptimizer from '../meal/page.jsx';
// if it's actually at app/MealOptimizer.jsx, use:
// import MealOptimizer from '../MealOptimizer.jsx';

// mock navbar/footer so they don't break tests
jest.mock('../components/Navbar', () => {
    const React = require('react');
    return () => React.createElement('div', { 'data-testid': 'navbar' });
});

jest.mock('../components/Footer', () => {
    const React = require('react');
    return () => React.createElement('div', { 'data-testid': 'footer' });
});

describe('MealOptimizer', () => {
    it('renders the title and initial chips', () => {
        render(<MealOptimizer />);

        expect(screen.getByText(/meal optimizer/i)).toBeInTheDocument();

        expect(screen.getByText('chicken')).toBeInTheDocument();
        expect(screen.getByText('rice')).toBeInTheDocument();
        expect(screen.getByText('broccoli')).toBeInTheDocument();
    });

    it('adds a new ingredient', () => {
        render(<MealOptimizer />);

        const input = screen.getByLabelText(/add ingredient/i);
        fireEvent.change(input, { target: { value: 'eggs' } });

        const addButton = screen.getByRole('button', { name: /add/i });
        fireEvent.click(addButton);

        expect(screen.getByText('eggs')).toBeInTheDocument();
    });

    it('generates a meal plan after clicking the button', async () => {
        jest.useFakeTimers();

        render(<MealOptimizer />);

        fireEvent.click(screen.getByRole('button', { name: /generate meal plan/i }));

        jest.runAllTimers();

        await waitFor(() => {
            expect(screen.getByText(/backend placment\./i)).toBeInTheDocument();
        });

        jest.useRealTimers();
    });
});
