import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import SignInPage from '../sign-in/page.jsx'


jest.mock('../components/navbar', () => () => <div data-testid="navbar">Navbar</div>)

jest.mock('next/link', () => {
  return ({ href, children, ...props }) => (
    <a href={href} onClick={(e) => e.preventDefault()} {...props}>{children}</a>
  )
})

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(window, 'alert').mockImplementation(() => {})
})
afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  window.alert.mockRestore()
})

describe('SignInPage', () => {
  it('renders fields and the primary submit button', () => {
    render(<SignInPage />)

   
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()

    
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()

   
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()

    
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument()
  })

  it('shows validation messages for empty/invalid inputs', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignInPage />)

    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
  })

  it('accepts valid input, shows loading spinner, then re-enables', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignInPage />)

    await user.type(screen.getByLabelText(/^email$/i), 'arya@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'needle1')

    const submit = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submit)

    expect(submit).toBeDisabled()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    await act(async () => { jest.advanceTimersByTime(900) })
    await waitFor(() => expect(submit).not.toBeDisabled())
  })

  it('OAuth buttons trigger their flows (mocked)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignInPage />)

    await user.click(screen.getByRole('button', { name: /sign in with google/i }))
    await act(async () => { jest.advanceTimersByTime(700) })
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/mock google sign in/i))

    await user.click(screen.getByRole('button', { name: /sign in with microsoft/i }))
    await act(async () => { jest.advanceTimersByTime(700) })
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/mock microsoft sign in/i))
  })

  it('has a “Forgot password?” link and a link to Sign Up', () => {
    render(<SignInPage />)

    const forgot =
      screen.queryByRole('link', { name: /forgot password\?/i }) ||
      screen.getByRole('button', { name: /forgot password\?/i })
    expect((forgot.closest('a') || forgot)).toHaveAttribute('href', '/forgot-password')

    const signUpCta =
      screen.queryByRole('link', { name: /sign up here/i }) ||
      screen.getByRole('button', { name: /sign up here/i })
    expect((signUpCta.closest('a') || signUpCta)).toHaveAttribute('href', '/sign-up')
  })

  it('checkbox toggles and disables during loading', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignInPage />)

    const remember = screen.getByRole('checkbox', { name: /remember me/i })
    expect(remember).not.toBeChecked()
    await user.click(remember)
    expect(remember).toBeChecked()

    // trigger loading
    await user.type(screen.getByLabelText(/^email$/i), 'jon@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'secret1')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(remember).toBeDisabled()

    await act(async () => { jest.advanceTimersByTime(900) })
  })
})
