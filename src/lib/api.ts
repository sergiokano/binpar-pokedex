const BASE_URL = "https://pokeapi.co/api/v2";

export type PokemonIndexed = {
  name: string;
  generation: string;
  family: string[];
};

export async function fetchPokemonBasicList(limit = 151) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  const data = await res.json();

  return data.results.map((pokemon: any, index: number) => ({
    id: index + 1,
    name: pokemon.name,
  }));
}

export async function fetchPokemonDetails(name: string) {
  const res = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!res.ok) throw new Error("Error al cargar detalles");
  const data = await res.json();

  return {
    types: data.types.map((t: any) => t.type.name),
  };
}

export async function fetchPokemonSpecies(name: string) {
  const res = await fetch(`${BASE_URL}/pokemon-species/${name}`);
  if (!res.ok) throw new Error("Error al cargar especie");
  const data = await res.json();

  return {
    generation: data.generation.name,
  };
}

export async function fetchPokemonByName(name: string) {
  const [detailsRes, speciesRes] = await Promise.all([
    fetch(`${BASE_URL}/pokemon/${name}`),
    fetch(`${BASE_URL}/pokemon-species/${name}`),
  ]);

  if (!detailsRes.ok || !speciesRes.ok)
    throw new Error("Error al cargar Pokémon");

  const details = await detailsRes.json();
  const species = await speciesRes.json();

  return {
    id: details.id,
    name: details.name,
    types: details.types.map((t: any) => t.type.name),
    generation: species.generation.name || "unknown",
  };
}

export async function fetchFullPokemonIndex(): Promise<PokemonIndexed[]> {
  const index: PokemonIndexed[] = [];

  const evoChainRes = await fetch(`${BASE_URL}/evolution-chain`);
  const evoChainData = await evoChainRes.json();
  const evoChainUrls: string[] = evoChainData.results.map(
    (chain: any) => chain.url,
  );
  for (const url of evoChainUrls) {
    try {
      const res = await fetch(url);
      const evoData = await res.json();
      const family = extractEvolutionNames(evoData.chain);

      await Promise.all(
        family.map(async (name) => {
          try {
            const resSpecies = await fetch(
              `${BASE_URL}/pokemon-species/${name}`,
            );
            const speciesData = await resSpecies.json();
            const generation = speciesData.generation.name || "unknown";

            index.push({
              name,
              generation,
              family,
            });
          } catch (error) {
            console.error(`Error fetching species for ${name}:`, error);
          }
        }),
      );
    } catch (error) {
      console.error(`Error fetching evolution chain from ${url}:`, error);
    }
  }
  return index;
}

function extractEvolutionNames(chain: any): string[] {
  const names: string[] = [];

  function traverseEvolutions(evolution: any) {
    if (!evolution) return;
    names.push(evolution.species.name);
    evolution.evolves_to?.forEach(traverseEvolutions);
  }
  traverseEvolutions(chain);
  return names;
}
