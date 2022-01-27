import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

// os dois primeiros testes são duas maneiras de testar se o componente renderizou
describe('ActiveLink component', () => {
  it('should render active link component correctly - first way', () => {
    const { getByText } = render(
      <ActiveLink passHref href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );
  
    expect(getByText('Home')).toBeInTheDocument()
  })

  it('should render active link component correctly - second way', () => {
    render(
      <ActiveLink passHref href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );
  
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  it('should receive a class of active if link is currently active', () => {
    const { getByText } = render(
      <ActiveLink passHref href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );
  
    expect(getByText('Home')).toHaveClass('active')
  })
})

