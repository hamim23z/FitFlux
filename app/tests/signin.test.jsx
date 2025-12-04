import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SignInPage from '../sign-in/page';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(() => Promise.resolve()),
}));

import { signIn } from 'next-auth/react';

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders heading and OAuth buttons', () => {
    render(<SignInPage />);

    
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument();

    
    expect(
      screen.getByRole('button', { name: /sign in with google/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in with github/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in with discord/i })
    ).toBeInTheDocument();
  });

  test('renders sign up link with correct href', () => {
    render(<SignInPage />);

    const signUpLink = screen.getByRole('link', { name: /sign up here/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  test('renders footer navigation links (at least one with correct href)', () => {
    render(<SignInPage />);

   
    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
    expect(
      dashboardLinks.some((link) => link.getAttribute('href') === '/dashboard')
    ).toBe(true);

    const mealLinks = screen.getAllByRole('link', { name: /meal optimizer/i });
    expect(
      mealLinks.some(
        (link) => link.getAttribute('href') === '/meal-optimizer'
      )
    ).toBe(true);

    const workoutLinks = screen.getAllByRole('link', {
      name: /workout tracker/i,
    });
    expect(
      workoutLinks.some(
        (link) => link.getAttribute('href') === '/workout-tracker'
      )
    ).toBe(true);

    const aboutLinks = screen.getAllByRole('link', { name: /about us/i });
    expect(
      aboutLinks.some((link) => link.getAttribute('href') === '/about-us')
    ).toBe(true);

    const contactLinks = screen.getAllByRole('link', { name: /contact/i });
    expect(
      contactLinks.some((link) => link.getAttribute('href') === '/contact')
    ).toBe(true);
  });

  test('newsletter input is present', () => {
    render(<SignInPage />);

   
    const newsletterInput = screen.getByPlaceholderText(/your email address/i);
    expect(newsletterInput).toBeInTheDocument();
  });

  test('clicking OAuth buttons calls next-auth signIn with correct provider', async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    await user.click(
      screen.getByRole('button', { name: /sign in with google/i })
    );
    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });

    await user.click(
      screen.getByRole('button', { name: /sign in with github/i })
    );
    expect(signIn).toHaveBeenCalledWith('github', { callbackUrl: '/' });

    await user.click(
      screen.getByRole('button', { name: /sign in with discord/i })
    );
    expect(signIn).toHaveBeenCalledWith('discord', { callbackUrl: '/' });
  });
});
