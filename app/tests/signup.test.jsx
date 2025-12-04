import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import SignUpPage from '../sign-up/page.jsx'

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

describe('SignUpPage', () => {
  it('renders the form fields and submit button', () => {
    render(<SignUpPage />)

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^full name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()         
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument() 
  })

  it('shows validation errors for empty/invalid inputs', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignUpPage />)

    await user.click(screen.getByRole('button', { name: /^sign up$/i })) 

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
  })

  it('accepts valid input, shows loading spinner, then re-enables', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/^full name$/i), 'Jon Snow')
    await user.type(screen.getByLabelText(/^email$/i), 'jon@example.com') 
    await user.type(screen.getByLabelText(/^password$/i), 'secret1')

    const submit = screen.getByRole('button', { name: /^sign up$/i })  
    await user.click(submit)

    expect(submit).toBeDisabled()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    await act(async () => { jest.advanceTimersByTime(900) })
    await waitFor(() => expect(submit).not.toBeDisabled())
  })

  it('OAuth buttons trigger their flows (mocked)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignUpPage />)

    await user.click(screen.getByRole('button', { name: /sign up with google/i }))
    await act(async () => { jest.advanceTimersByTime(700) })
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/mock google sign up/i))

    await user.click(screen.getByRole('button', { name: /sign up with microsoft/i }))
    await act(async () => { jest.advanceTimersByTime(700) })
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/mock microsoft sign up/i))
  })

  it('has a link to Sign In', () => {
    render(<SignUpPage />)
    const cta = screen.queryByRole('link',   { name: /sign in here/i })
            || screen.getByRole('button', { name: /sign in here/i })
    const anchor = cta.closest('a') || cta
    expect(anchor).toHaveAttribute('href', '/sign-in')
  })

  it('checkbox can be toggled (and disabled during loading)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SignUpPage />)


    const updates = screen.getByRole('checkbox', { name: /i want to receive updates via email/i })
    expect(updates).not.toBeChecked()
    await user.click(updates)
    expect(updates).toBeChecked()

    await user.type(screen.getByLabelText(/^full name$/i), 'Arya Stark')
    await user.type(screen.getByLabelText(/^email$/i), 'arya@example.com') 
    await user.type(screen.getByLabelText(/^password$/i), 'needle1')
    await user.click(screen.getByRole('button', { name: /^sign up$/i }))   

    expect(updates).toBeDisabled()
    await act(async () => { jest.advanceTimersByTime(900) })
  })
})
