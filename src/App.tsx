import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
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
interface ResponseDetail {
  base_experience: number;
  sprites: {
    front_default: string;
  };
  name: string;
}
interface Detail {
  details: ResponseDetail[];
  count: number;
}
function App() {
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [detail, setDetail] = useState<Detail>();
  const fetchData = () => {
    const position = currentPage * perPage;
    api
      .get<Response>('pokemon', {
        params: {
          offset: position,
          limit: perPage,
        },
      })
      .then(({ data }) => {
        const sortedList = data.results.sort((prev, nex) =>
          prev.name.localeCompare(nex.name)
        );
        const promises = sortedList.map((item) => {
          return axios.get<ResponseDetail>(item.url);
        });
        Promise.all(promises).then((values) => {
          const details = values.map((response) => response.data);
          setDetail({
            count: data.count,
            details,
          });
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, [perPage, currentPage]);
  /*
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
*/
  return (
    <div className='w-full h-full'>
      <main>
        <h3 className='text-2xl'>desafio</h3>
        <h1 className='text-4xl font-semibold'>consumir api pokemon</h1>
        <hr className='m-4' />
        {detail ? (
          <>
            <ol className='overflow-auto scrollbar h-[calc(100vh-10rem)]'>
              {detail.details.map((pokemon, index) => (
                <li
                  key={pokemon.name}
                  className={`${
                    index % 2 == 0 ? 'bg-gray-100' : ''
                  } hover:bg-blue-100`}
                >
                  <Pokemon data={pokemon} />
                </li>
              ))}
            </ol>
            <div className='mx-auto w-full'>
              <Paginacao
                resultsCount={detail.count}
                limit={perPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </div>
          </>
        ) : (
          <Loading />
        )}
      </main>
    </div>
  );
}

export default App;
