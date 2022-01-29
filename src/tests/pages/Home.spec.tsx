import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';
import { mocked } from 'jest-mock';

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('should render the home page correctly', () => {
    render(<Home product={{ priceId: 'fake-id', amount: 'R$10,00' }}/>);

    // como o elemento HTML que contem esse texto também contem mais coisas, usamos uma RegEx
    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument()
  })

  it('should load initial data from server side', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000, // 1000 centavos = 10 reais
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
    }))
  })
})