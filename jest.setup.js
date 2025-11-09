import '@testing-library/jest-dom'

jest.mock('next/link', () => {
  return ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>
})


