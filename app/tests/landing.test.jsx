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

  it('CTA has correct href to /sign-in', () => {
    renderPage()

    const cta = screen.getByRole('link', { name: /get started/i })
    expect(cta).toHaveAttribute('href', '/sign-in')
  })

  it('shows “What FitFlux Offers” with exactly the 4 feature cards', () => {
    renderPage()

    // section heading
    expect(
      screen.getByRole('heading', { name: /what fitflux offers/i })
    ).toBeInTheDocument()

    
    FEATURE_TITLES.forEach((title) => {
      expect(
        screen.getByRole('heading', {
          name: new RegExp(`^${title}$`, 'i'),
          level: 6,
        })
      ).toBeInTheDocument()
    })

   
    const allH6 = screen.getAllByRole('heading', { level: 6 })
    const featureH6 = allH6.filter((el) =>
      FEATURE_TITLES.some((title) =>
        new RegExp(`^${title}$`, 'i').test(el.textContent?.trim() || '')
      )
    )
    expect(featureH6).toHaveLength(FEATURE_TITLES.length)
  })

  it('renders footer with dynamic year', () => {
    renderPage()

    const year = new Date().getFullYear().toString()

    const footerLine = screen.getByText((content) => {
      const normalized = content.toLowerCase()
      return normalized.includes('fitflux') && content.includes(year)
    })

    expect(footerLine).toBeInTheDocument()
  })
})
