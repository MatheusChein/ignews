import { render, screen } from '@testing-library/react';
import { getSession } from "next-auth/client"
import { getPrismicClient } from '../../services/prismic';
import { mocked } from 'jest-mock';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: '28 Jan 2022', // Aqui nao importa o formato da data, apenas importa que seja um texto, para verificarmos a renderização da página
}


describe('Post page', () => {
  it('should render the post page correctly', () => {
    render(<Post post={post}/>);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('should redirect user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    })

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: `/posts/preview/my-new-post`,
          permanent: false
        }
      })
    )
  });

  it('should load initial data from server side', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    });

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My New Post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ]
        },
        last_publication_date: '01-28-2022'
      })
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post content</p>',
            updatedAt: '28 de janeiro de 2022'
          }
        }
      })
    )

  });
})

