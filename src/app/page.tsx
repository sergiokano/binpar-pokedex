"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import PokemonCard from "@/components/PokemonCard";
import { useState } from "react";
import FilterBar from "@/components/FilterBar";

export default function HomePage() {
  const { data, isLoading, error } = usePokemonList();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [generationFilter, setGenerationFilter] = useState("");

  if (isLoading) return <p>Cargando Pokédex...</p>;
  if (error) return <p>Error al cargar los Pokémon.</p>;

  const filtered = data?.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter ? p.types?.includes(typeFilter) : true;

    const matchGen = generationFilter
      ? p.generation === generationFilter
      : true;

    return matchName && matchType && matchGen;
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

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filtered?.map((pokemon: any) => (
          <PokemonCard key={pokemon.id} {...pokemon} />
        ))}
      </section>
    </main>
  );
}
