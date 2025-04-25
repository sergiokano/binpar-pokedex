import { useInfiniteQuery } from "@tanstack/react-query";
import { normalizePokemonData } from "@/lib/api";
import { BASE_URL } from "@/lib/constants";

const PAGE_SIZE = 100;

export function useInfinitePokemon() {
  return useInfiniteQuery({
    queryKey: ["pokemon-infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${pageParam}`,
      );
      const data = await res.json();
      const names = data.results.map((p: any) => p.name);

      const pokemons = await Promise.all(
        names.map((name: string) =>
          normalizePokemonData(name).catch(() => null),
        ),
      );

      return pokemons.filter(Boolean);
    },
    getNextPageParam: (_, allPages) => allPages.length * PAGE_SIZE,
    initialPageParam: 0,
    staleTime: Infinity,
  });
}
