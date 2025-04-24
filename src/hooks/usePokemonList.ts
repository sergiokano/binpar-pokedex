// src/hooks/usePokemonList.ts
import { fetchPokemonNames, normalizePokemonData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function usePokemonList(limit = 151) {
  return useQuery({
    queryKey: ["pokemon-list", limit],
    queryFn: async () => {
      const names = await fetchPokemonNames(limit);
      const all = await Promise.all(names.map(normalizePokemonData));
      return all;
    },
    staleTime: Infinity,
  });
}
