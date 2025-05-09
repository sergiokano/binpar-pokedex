"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfinitePokemon } from "@/hooks/useInfiniteQuery";
import { useFullPokemonIndex } from "@/hooks/useFullPokemonIndex";
import { useQuery } from "@tanstack/react-query";

import FilterBar from "@/components/FilterBar/FilterBar";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import SkeletonPokemonCard from "@/components/Skeleton/SkeletonPokemonCard/SkeletonPokemonCard";
import SkeletonPokemonCards from "@/components/Skeleton/SkeletonPokemonCard/SkeletonPokemonCards";
import { loadFullPokedex } from "@/server/loadFullPokedex";

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const { data: fullIndex } = useFullPokemonIndex();
  const {
    data: pagedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemon();
  const observerRef = useRef(null);
  const { data: fullPokedex } = useQuery({
    queryKey: ["all-pokemon"],
    queryFn: loadFullPokedex,
    staleTime: Infinity,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") ?? "");
  const [generationFilter, setGenerationFilter] = useState(
    searchParams.get("generation") ?? "",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Reiniciar estados cuando se navega a la página principal
  useEffect(() => {
    if (pathname === "/" && !searchParams.toString()) {
      setSearch("");
      setTypeFilter("");
      setGenerationFilter("");
      setCurrentPage(1);
    }
  }, [pathname, searchParams]);

  const isFiltering = Boolean(search || typeFilter || generationFilter);

  const visiblePokemons = pagedData?.pages.flat() ?? [];
  const source = isFiltering ? (fullPokedex ?? []) : visiblePokemons;

  const filteredPokemons = source.filter((p) => {
    const searchTerm = search.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(searchTerm);
    const familyMatch =
      fullIndex
        ?.find((f) => f.name === p.name)
        ?.family.some((n) => n.includes(searchTerm)) ?? false;
    const typeMatch = typeFilter ? p.types.includes(typeFilter) : true;
    const genMatch = generationFilter
      ? p.generation === generationFilter
      : true;
    return (nameMatch || familyMatch) && typeMatch && genMatch;
  });

  const paginatedPokemons = isFiltering
    ? filteredPokemons.slice(0, currentPage * ITEMS_PER_PAGE)
    : filteredPokemons;

  const [isTransitioningFilter, setIsTransitioningFilter] = useState(true);
  const [isCardLoading, setIsCardLoading] = useState<Record<number, boolean>>({});

  // Este efecto es SOLO para la primera carga si no hay filtros activos
  useEffect(() => {
    if (isFiltering || !fullPokedex) return;

    setIsTransitioningFilter(true);

    const initialTimeout = setTimeout(() => {
      const loadingMap: Record<number, boolean> = {};
      visiblePokemons.forEach((p) => (loadingMap[p.id] = true));
      setIsCardLoading(loadingMap);

      visiblePokemons.forEach((p, i) => {
        setTimeout(() => {
          setIsCardLoading((prev) => {
            const updated = { ...prev };
            delete updated[p.id];
            return updated;
          });
        }, i * 40);
      });

      setIsTransitioningFilter(false);
    }, 1);

    return () => clearTimeout(initialTimeout);
  }, [fullPokedex]);

  useEffect(() => {
    if (isFiltering) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting && paginatedPokemons.length < filteredPokemons.length) {
          setCurrentPage((prev) => prev + 1);
        }
      });

      if (observerRef.current) observer.observe(observerRef.current);

      return () => {
        if (observerRef.current) observer.unobserve(observerRef.current);
      };
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (observerRef.current) observer.observe(observerRef.current);

      return () => {
        if (observerRef.current) observer.unobserve(observerRef.current);
      };
    }
  }, [hasNextPage, fetchNextPage, isFiltering, paginatedPokemons.length, filteredPokemons.length]);

  useEffect(() => {
    if (!search && !typeFilter && !generationFilter) return;

    if (!source.length) return;

    setIsTransitioningFilter(true);
    setCurrentPage(1);

    const transitionTimeout = setTimeout(() => {
      const loadingMap: Record<number, boolean> = {};
      paginatedPokemons.forEach((p) => (loadingMap[p.id] = true));
      setIsCardLoading(loadingMap);

      paginatedPokemons.forEach((p, i) => {
        setTimeout(() => {
          setIsCardLoading((prev) => {
            const updated = { ...prev };
            delete updated[p.id];
            return updated;
          });
        }, i * 60);
      });

      setIsTransitioningFilter(false);
    }, 300);

    return () => {
      clearTimeout(transitionTimeout);
      setIsCardLoading({});
      setIsTransitioningFilter(false);
    };
  }, [search, typeFilter, generationFilter]);

  return (
    <main className="p-6">
      <FilterBar
        search={search}
        onSearch={(val) => {
          setSearch(val);
          router.replace(
            `/?search=${val}&type=${typeFilter}&generation=${generationFilter}`,
          );
        }}
        typeFilter={typeFilter}
        onTypeFilter={(val) => {
          setTypeFilter(val);
          router.replace(
            `/?search=${search}&type=${val}&generation=${generationFilter}`,
          );
        }}
        generationFilter={generationFilter}
        onGenerationFilter={(val) => {
          setGenerationFilter(val);
          router.replace(
            `/?search=${search}&type=${typeFilter}&generation=${val}`,
          );
        }}
      />

      <section className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
        {isTransitioningFilter ? (
          <SkeletonPokemonCards amount={30} />
        ) : (
          paginatedPokemons.map((pokemon) =>
            isCardLoading[pokemon.id] ? (
              <SkeletonPokemonCard key={`skeleton-${pokemon.id}`} />
            ) : (
              <PokemonCard key={pokemon.id} {...pokemon} />
            ),
          )
        )}
      </section>

      <div ref={observerRef} className="h-10" />
      {(isFetchingNextPage || (isFiltering && paginatedPokemons.length < filteredPokemons.length)) && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-500"></div>
            <span className="text-sm text-zinc-500">
              Cargando más Pokémon...
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
