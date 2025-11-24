import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignUpPage from '../sign-up/page.jsx'


jest.mock('../components/navbar', () => () => (
  <div data-testid="navbar">Navbar</div>
))


jest.mock('next/link', () => {
  return ({ href, children, ...props }) => (
    <a href={href} onClick={(e) => e.preventDefault()} {...props}>
      {children}
    </a>
  )
})


jest.mock('next-auth/react', () => ({
  signIn: jest.fn(() => Promise.resolve()),
}))

import { signIn } from 'next-auth/react'

describe('SignUpPage', () => {
  test('renders heading and OAuth buttons', () => {
    render(<SignUpPage />)

    
    expect(
      screen.getByRole('heading', { name: /sign up/i })
    ).toBeInTheDocument()

    
    expect(
      screen.getByRole('button', { name: /sign up with google/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign up with github/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign up with discord/i })
    ).toBeInTheDocument()
  })

  test('renders sign in link with correct href', () => {
    render(<SignUpPage />)

    const signInLink = screen.getByRole('link', { name: /sign in here/i })
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', '/sign-in')
  })

  test('clicking OAuth buttons calls next-auth signIn with correct provider', async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.click(
      screen.getByRole('button', { name: /sign up with google/i })
    )
    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' })

    await user.click(
      screen.getByRole('button', { name: /sign up with github/i })
    )
    expect(signIn).toHaveBeenCalledWith('github', { callbackUrl: '/' })

    await user.click(
      screen.getByRole('button', { name: /sign up with discord/i })
    )
    expect(signIn).toHaveBeenCalledWith('discord', { callbackUrl: '/' })
  })
})
