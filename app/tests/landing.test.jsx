import { render, screen } from '@testing-library/react'
import LandingPage from '../page.jsx'

const FEATURE_TITLES = [
  'Personalized Dashboard',
  'Meal Optimizer',
  'Workout Calendar',
  'Notes & Goals',
]

describe('LandingPage', () => {
  const renderPage = () => render(<LandingPage />)

  it('renders hero heading & subheading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: /optimize your fitness journey/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/balance workouts, meals, and lifestyle goals/i)
    ).toBeInTheDocument()
  })

  it('CTA has correct href to /dashboard', () => {
    renderPage()

    const cta = screen.getByRole('link', { name: /get started/i })
    expect(cta).toHaveAttribute('href', '/dashboard')
  })

  it('shows “What FitFlux Offers” with exactly the 4 feature cards', () => {
    renderPage()

    // section heading
    expect(
      screen.getByRole('heading', { name: /what fitflux offers/i })
    ).toBeInTheDocument()

    // each feature title exists as an h6
    FEATURE_TITLES.forEach((title) => {
      expect(
        screen.getByRole('heading', {
          name: new RegExp(`^${title}$`, 'i'),
          level: 6,
        })
      ).toBeInTheDocument()
    })

    // and there are exactly 4 of them
    const allH6 = screen.getAllByRole('heading', { level: 6 })
    const featureH6 = allH6.filter((el) =>
      FEATURE_TITLES.some((title) =>
        new RegExp(`^${title}$`, 'i').test(el.textContent?.trim() || '')
      )
    )
    expect(featureH6).toHaveLength(FEATURE_TITLES.length)
  })

  it('renders dynamic footer year', () => {
    renderPage()

    const year = new Date().getFullYear().toString()
    const footerLine = screen.getByText(/fitflux\. all rights reserved\./i)

    expect(footerLine).toBeInTheDocument()
    expect(footerLine.textContent).toMatch(new RegExp(year))
  })
})
