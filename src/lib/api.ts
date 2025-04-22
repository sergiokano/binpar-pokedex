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

export async function fetchFullPokemonIndex(): Promise<PokemonIndexed[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=100000`);
  const data = await res.json();

  const speciesList: { name: string; url: string }[] = data.results;

  const index: PokemonIndexed[] = [];

  for (const species of speciesList) {
    try {
      const resSpecie = await fetch(species.url);
      const speciesData = await resSpecie.json();

const generation = speciesData.generation?.name || "unknown";
const evoUrl = speciesData.evolution_chain?.url ;

if(!evoUrl) continue;

const resEvo = await fetch(evoUrl);

const evoData = await resEvo.json();

const family = extractEvolutionNames(evoData.chain);  
family.forEach(name => {
  index.push({
    name,
    generation,
    family,
  });
}
  } catch (error) {
    console.error(`Error fetching species data for ${species.name}:`, error);
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