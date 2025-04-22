import { fetchFullPokemonIndex } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useFullPokemonIndex() {
  return useQuery({
    queryKey: ["full-pokemon-index"],
    queryFn: () => fetchFullPokemonIndex(),
    staleTime: Infinity,
  });
}
