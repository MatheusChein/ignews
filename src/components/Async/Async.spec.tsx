import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from '.';

describe('Async component', () => {
  it('should render correctly - findByText', async () => {
    render(<Async />);
  
    expect(screen.getByText('Hello Async')).toBeInTheDocument();
    expect(await screen.findByText('Button', {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('should render correctly - waitFor', async () => {
    render(<Async />);
  
    expect(screen.getByText('Hello Async')).toBeInTheDocument();

    await waitFor(() => {
      return expect(screen.getByText('Button')).toBeInTheDocument()
    }, {
      timeout: 4000
    })
  });

  // Esse último teste não vai passar, pq ele espera o elemento ser removido. 
  // Mas, o elemento ja nao está em tela no primeiro momento que o componente é renderizado.
  // Esse teste nao serve para esse componente, teria que ser ao contrário, um botão visível no começo, 
  // mas que fosse removido depois do setTimeOut. Ai sim daria pra usar esse waitForElementToBeRemoved

  // it('should render correctly - waitForElementToBeRemoved', async () => {
  //   render(<Async />);
  
  //   expect(screen.getByText('Hello Async')).toBeInTheDocument();

  //   await waitForElementToBeRemoved(screen.queryByText('Button'))
  // });
})

