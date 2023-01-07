import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Loading } from './components/loading';
import { Paginacao } from './components/paginacao';
import { Pokemon } from './components/pokemon';
import { api } from './infra/axios';

interface Response {
  count: number;
  next: string | null;
  prev: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
function App() {
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon', currentPage, perPage],
    queryFn: async () => {
      const position = currentPage * perPage;
      const { data } = await api.get<Response>('pokemon', {
        params: {
          offset: position,
          limit: perPage,
        },
      });
      data.results = data.results.sort((prev, nex) =>
        prev.name.localeCompare(nex.name)
      );

      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <h1>error</h1>;
  }
  return (
    <div className='w-full h-full'>
      <main>
        <h3 className='text-2xl'>desafio</h3>
        <h1 className='text-4xl font-semibold'>consumir api pokemon</h1>
        <hr className='m-4' />
        <div className='mx-auto w-full'>
          <Paginacao
            resultsCount={data?.count}
            limit={perPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </div>

        <ol>
          {data?.results.map((pokemon, index) => (
            <li
              key={pokemon.name}
              className={`${
                index % 2 == 0 ? 'bg-gray-100' : ''
              } hover:bg-blue-100`}
            >
              <Pokemon name={pokemon.name} url={pokemon.url} />
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

export default App;
