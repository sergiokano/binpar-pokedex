import { fetchPokemonBasicList } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function usePokemonList(limit = 151) {
  return useQuery({
    queryKey: ["pokemon-list", limit],
    queryFn: () => fetchPokemonBasicList(limit),
  });
}
