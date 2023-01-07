import axios from 'axios';
import { useEffect, useState } from 'react';
import { Loading } from './loading';

interface Response {
  base_experience: number;
  sprites: {
    front_default: string;
  };
}
export const Pokemon = (props: { name: string; url: string }) => {
  const [pokemon, setPokemon] = useState<Response>();
  useEffect(() => {
    axios
      .get<Response>(props.url)
      .then((response) => setPokemon(response.data));
  }, []);
  if (!pokemon) return <Loading />;
  return (
    <div className='flex justify-items-center flex-row p-2 '>
      <img
        src={pokemon.sprites.front_default}
        alt='pokemon front'
        className='object-center w-16 h-16 mr-4'
      />
      <div className='flex items-center justify-between text-lg w-48  '>
        <div className='capitalize font-semibold'>{props.name}</div>
        <span>{pokemon.base_experience}XP</span>
      </div>
    </div>
  );
};
