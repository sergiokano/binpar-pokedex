"use client";

import { useState, useEffect, useRef } from "react";
import { useInfinitePokemon } from "@/hooks/useInfiniteQuery";
import { useFullPokemonIndex } from "@/hooks/useFullPokemonIndex";
import { useQuery } from "@tanstack/react-query";

import FilterBar from "@/components/FilterBar";
import PokemonCard from "@/components/PokemonCard";
import SkeletonPokemonCard from "@/components/Skeleton/SkeletonPokemonCard/SkeletonPokemonCard";
import SkeletonPokemonCards from "@/components/Skeleton/SkeletonPokemonCard/SkeletonPokemonCards";
import { loadFullPokedex } from "@/server/loadFullPokedex";

export default function HomePage() {
  const { data: fullIndex } = useFullPokemonIndex();
  const {
    data: pagedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemon();

  const observerRef = useRef(null);
  const prevVisibleIds = useRef<number[]>([]);

  const { data: fullPokedex, isLoading: isFullLoading } = useQuery({
    queryKey: ["all-pokemon"],
    queryFn: loadFullPokedex,
    staleTime: Infinity,
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [generationFilter, setGenerationFilter] = useState("");

  const [isTransitioningFilter, setIsTransitioningFilter] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState<Record<number, boolean>>({});

  const isFiltering = search || typeFilter || generationFilter;

  useEffect(() => {
    if (isFiltering) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, fetchNextPage, isFiltering]);

  const visiblePokemons = pagedData?.pages.flat() ?? [];
  const source = isFiltering ? fullPokedex ?? [] : visiblePokemons;

  const filteredPokemons = source.filter((p) => {
    const searchTerm = search.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(searchTerm);
    const familyMatch =
      fullIndex?.find((f) => f.name === p.name)?.family.some((n) => n.includes(searchTerm)) ?? false;
    const typeMatch = typeFilter ? p.types.includes(typeFilter) : true;
    const genMatch = generationFilter ? p.generation === generationFilter : true;

    return (nameMatch || familyMatch) && typeMatch && genMatch;
  });

  // Loading al filtrar
  useEffect(() => {
    if (!filteredPokemons.length) return;

    setIsTransitioningFilter(true);

    const timeout = setTimeout(() => {
      const loadingMap: Record<number, boolean> = {};
      filteredPokemons.forEach((p) => (loadingMap[p.id] = true));
      setIsCardLoading(loadingMap);

      filteredPokemons.forEach((p, i) => {
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
      clearTimeout(timeout);
      setIsCardLoading({});
    };
  }, [search, typeFilter, generationFilter]);

  // Loading al hacer scroll
  useEffect(() => {
    if (isFiltering || !visiblePokemons.length) return;

    const currentIds = visiblePokemons.map((p) => p.id);
    const newIds = currentIds.filter((id) => !prevVisibleIds.current.includes(id));
    prevVisibleIds.current = currentIds;

    if (!newIds.length) return;

    const loadingMap: Record<number, boolean> = {};
    newIds.forEach((id) => (loadingMap[id] = true));
    setIsCardLoading((prev) => ({ ...prev, ...loadingMap }));

    newIds.forEach((id, i) => {
      setTimeout(() => {
        setIsCardLoading((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }, i * 60);
    });
  }, [visiblePokemons, isFiltering]);

  return (
    <main className="p-6">
      <FilterBar
        search={search}
        onSearch={setSearch}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
        generationFilter={generationFilter}
        onGenerationFilter={setGenerationFilter}
      />

      <section className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
        {isTransitioningFilter ? (
          <SkeletonPokemonCards amount={30} />
        ) : (
          filteredPokemons.map((pokemon) =>
            isCardLoading[pokemon.id] ? (
              <SkeletonPokemonCard key={`skeleton-${pokemon.id}`} />
            ) : (
              <PokemonCard key={pokemon.id} {...pokemon} />
            )
          )
        )}
      </section>

      {!isFiltering && (
        <>
          <div ref={observerRef} className="h-10" />
          {isFetchingNextPage && (
            <p className="mt-4 text-center">Cargando más Pokémon...</p>
          )}
        </>
      )}
    </main>
  );
}
