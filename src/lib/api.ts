const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonBasicList(limit = 151) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  const data = await res.json();

  return data.results.map((pokemon: any, index: number) => ({
    id: index + 1,
    name: pokemon.name,
  }));
}

export async function fetchPokemonDetails(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error("Error al cargar detalles");
  const data = await res.json();

  return {
    types: data.types.map((t: any) => t.type.name),
  };
}
