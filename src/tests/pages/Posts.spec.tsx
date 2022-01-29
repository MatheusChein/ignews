import { render, screen } from '@testing-library/react';
import { getPrismicClient } from '../../services/prismic';
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts';

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    summary: 'Post summary',
    updatedAt: '28 Jan 2022', // Aqui nao importa o formato da data, apenas importa que seja um texto, para verificarmos a renderização da página
  }
]

describe('Posts page', () => {
  it('should render the posts page correctly', () => {
    render(<Posts posts={posts}/>);

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('should load initial data from server side', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My New Post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post summary' }
              ]
            },
            last_publication_date: '01-28-2022',
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My New Post',
              summary: 'Post summary',
              updatedAt: '28 de janeiro de 2022', // essa é a formatação do toLocaleDateString que usamos no componente
            }
          ]
        }
    }))
  })
})