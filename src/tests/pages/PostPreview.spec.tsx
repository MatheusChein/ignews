import { render, screen } from '@testing-library/react';
import { useSession } from "next-auth/client"
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import { mocked } from 'jest-mock';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: '28 Jan 2022', // Aqui nao importa o formato da data, apenas importa que seja um texto, para verificarmos a renderização da página
}

describe('Post preview page', () => {
  it('should render the post preview page correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<PostPreview post={post}/>);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna keep reading?')).toBeInTheDocument();
  });

  it('should redirect user to full post if user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false
    ]);

    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)


    render(<PostPreview post={post}/>);

    expect(pushMocked).toHaveBeenCalledWith(`/posts/${post.slug}`)
  });

  it('should load initial data from server side', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

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

    const response = await getStaticProps({
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

