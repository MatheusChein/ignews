import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router';
import { SubscribeButton } from '.'

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('should render subscribe button component correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false])
    
    render(<SubscribeButton />);
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('should redirect user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    const signInMocked = mocked(signIn)

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled()
  })

  it('should redirect user to posts when user is already subscribed', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'Matheus Chein',
        email: 'matheus@email.com',
      },
      activeSubscription: 'fake-active-subscription',
      expires: 'fake-expire'
    }, false]);
    
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      ...useRouterMocked(),
      push: pushMocked
    })

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalledWith('/posts')
  })
})

