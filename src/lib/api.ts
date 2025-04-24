import type { NormalizedPokemon, PokemonIndexed } from "./types";

const BASE_URL = "https://pokeapi.co/api/v2";


export async function fetchPokemonNames(limit = 1300): Promise<string[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!res.ok) throw new Error("Error al obtener lista de Pokémon");
  const data = await res.json();
  return data.results.map((p: any) => p.name);
}

async function fetchPokemonGeneration(family: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${family}`);
  if (!res.ok) return "unknown";
  const data = await res.json();
  return data.generation?.name || "unknown";
}

export async function normalizePokemonData(
  name: string,
): Promise<NormalizedPokemon> {
  const detailsRes = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!detailsRes.ok) {
    console.warn(`❌ Error en /pokemon/${name}`);
    throw new Error("Error al cargar detalles del Pokémon");
  }

  const speciesRes = await tryFetchSpecies(name);
  if (!speciesRes.ok) {
    console.warn(`❌ Error en /pokemon-species/${name} y su fallback`);
    throw new Error("Error al cargar especie del Pokémon");
  }

  const details = await detailsRes.json();
  const species = await speciesRes.json();

  return {
    id: details.id,
    name: details.name,
    types: details.types.map((t: any) => t.type.name),
    sprite: details.sprites.other["official-artwork"].front_default,
    generation: species.generation?.name || "unknown",
  };
}

async function tryFetchSpecies(name: string): Promise<Response> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${name}`);
  if (res.ok) return res;
}

export async function fetchFullPokemonIndex(): Promise<PokemonIndexed[]> {
  const index: PokemonIndexed[] = [];

  const evoChainRes = await fetch(`${BASE_URL}/evolution-chain?limit=500`);
  console.log("evoChainRes", evoChainRes);
  const evoChainData = await evoChainRes.json();
  const evoChainUrls: string[] = evoChainData.results.map(
    (chain: any) => chain.url,
  );
  for (const url of evoChainUrls) {
    try {
      const res = await fetch(url);
      const evoData = await res.json();
      const family = extractEvolutionNames(evoData.chain);

      console.log("family", family);

      await Promise.all(
        family.map(async (name) => {
          const generation = await fetchPokemonGeneration(name);

          try {
            // const resSpecies = await fetch(
            //   `${BASE_URL}/pokemon-species/${name}`,
            // );
            const resSpecies = "unknow";
            // const speciesData = await resSpecies.json();
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
