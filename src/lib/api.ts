const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonBasicList(limit = 151) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  const data = await res.json();

  return data.results.map((pokemon: any, index: number) => ({
    id: index + 1,
    name: pokemon.name,
  }));
}
