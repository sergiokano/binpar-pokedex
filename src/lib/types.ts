export type NormalizedPokemon = {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  generation: string;
};

export type PokemonIndexed = {
  name: string;
  generation: string;
  family: string[];
};
