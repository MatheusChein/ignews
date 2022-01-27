import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
  it('should render sign in button component correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SignInButton />);
  
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  })

  it('should render sign in button component correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'Matheus Chein',
        email: 'matheus@email.com'
      },
      expires: 'fake-expires'
    }, false])

    render(<SignInButton />);

    expect(screen.getByText('Matheus Chein')).toBeInTheDocument();
  })
})

