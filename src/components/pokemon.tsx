interface Props {
  data: {
    base_experience: number;
    sprites: {
      front_default: string;
    };
    name: string;
  };
}
export const Pokemon = ({ data: pokemon }: Props) => {
  // const [pokemon, setPokemon] = useState<Response>();
  // useEffect(() => {
  //   axios
  //     .get<Response>(props.url)
  //     .then((response) => setPokemon(response.data));
  // }, []);
  // if (!pokemon) return <Loading />;
  return (
    <div className='flex justify-items-center flex-row p-2 '>
      <img
        src={pokemon.sprites.front_default}
        alt='pokemon front'
        className='object-center w-16 h-16 mr-4'
      />
      <div className='flex items-center justify-between text-lg w-48  '>
        <div className='capitalize font-semibold'>{pokemon.name}</div>
        <span>{pokemon.base_experience}XP</span>
      </div>
    </div>
  );
};
