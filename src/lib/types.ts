export interface NormalizedPokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  generation: string;
}

export interface PokemonIndexed {
  name: string;
  generation: string;
  family: string[];
}

interface Evolution {
  name: string;
  sprite: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  generation: string;
  types: string[];
  stats: { name: string; value: number }[];
  evolutions: Evolution[];
}
