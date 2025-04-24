"use client";

import PokemonCard from "@/components/PokemonCard";
import FilterBar from "@/components/FilterBar";
import { useFullPokemonIndex } from "@/hooks/useFullPokemonIndex";
import { useInfinitePokemon } from "@/hooks/useInfiniteQuery";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const { data: fullIndex } = useFullPokemonIndex();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePokemon();
  const observerRef = useRef(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [generationFilter, setGenerationFilter] = useState("");

  // IntersectionObserver para cargar más cuando haces scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, fetchNextPage]);

  const allPokemons = data?.pages.flat() ?? [];

  const filteredPokemons = allPokemons.filter((p) => {
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
      <div className="w-full"></div>
      <section className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} {...pokemon} />
        ))}
      </section>

      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <p className="mt-4 text-center">Cargando más Pokémon...</p>
      )}
    </main>
  );
}
