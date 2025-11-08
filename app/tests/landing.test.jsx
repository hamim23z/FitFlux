import { render, screen } from '@testing-library/react'
import LandingPage from '../page.jsx'

describe('LandingPage', () => {
  it('renders hero heading & subheading', () => {
    render(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /optimize your fitness journey/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/balance workouts, meals, and lifestyle goals/i)
    ).toBeInTheDocument()
  })

  it('CTA has correct href to /dashboard ', () => {
    render(<LandingPage />)
    const cta = screen.getByRole('link', { name: /get started/i })
    expect(cta).toHaveAttribute('href', '/dashboard')
  })

  it('shows “What FitFlux Offers” with exactly the 4 feature cards', () => {
    render(<LandingPage />)

   
    expect(
      screen.getByRole('heading', { name: /what fitflux offers/i })
    ).toBeInTheDocument()

    
    const titles = [
      'Personalized Dashboard',
      'Meal Optimizer',
      'Workout Calendar',
      'Notes & Goals',
    ]

    
    titles.forEach((t) => {
      expect(
        screen.getByRole('heading', { name: new RegExp(`^${t}$`, 'i'), level: 6 })
      ).toBeInTheDocument()
    })

    
    const allH6 = screen.getAllByRole('heading', { level: 6 })
    const featureH6 = allH6.filter((el) =>
      titles.some((t) => new RegExp(`^${t}$`, 'i').test(el.textContent?.trim() || ''))
    )
    expect(featureH6).toHaveLength(4)
  })

  it('renders dynamic footer year', () => {
    render(<LandingPage />)
    const year = new Date().getFullYear().toString()
    const footerLine = screen.getByText(/fitflux\. all rights reserved\./i)
    expect(footerLine).toBeInTheDocument()
    expect(footerLine.textContent).toMatch(new RegExp(year))
  })
})
