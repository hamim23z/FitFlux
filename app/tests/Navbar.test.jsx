

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/navbar';

describe('Navbar Component', () => {
  
  
  test('renders the FitFlux brand name', () => {
    render(<Navbar />);
    const brand = screen.getByText(/fitflux/i);
    expect(brand).toBeInTheDocument();
  });

  
  test('renders all navbar links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /meal optimizer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /workout tracker/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();

    
    const signUpText = screen.getByText(/sign up/i);
    expect(signUpText).toBeInTheDocument();
  });

 
  test('each nav link has the correct href attribute', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /meal optimizer/i })).toHaveAttribute('href', '/meal');
    expect(screen.getByRole('link', { name: /workout tracker/i })).toHaveAttribute('href', '/workout-planner');
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/about-us');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/sign-in');

    
    const signUp = screen.getByText(/sign up/i);
    expect(signUp.closest('a')).toHaveAttribute('href', '/sign-up');
  });

 
  test('renders AppBar and Toolbar structure', () => {
    const { container } = render(<Navbar />);

   
    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();

   
    const toolbars = container.querySelectorAll('.MuiToolbar-root');
    expect(toolbars.length).toBeGreaterThan(0);
  });

  
  test('matches snapshot', () => {
    const { asFragment } = render(<Navbar />);
    expect(asFragment()).toMatchSnapshot();
  });

});
