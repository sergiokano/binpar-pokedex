"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import PokemonCard from "@/components/PokemonCard";
import { useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import { useFullPokemonIndex } from "@/hooks/useFullPokemonIndex";
import { fetchPokemonByName } from "@/lib/api";

export default function HomePage() {
  const { data: visiblePokemon, isLoading, error } = usePokemonList();
  const { data: fullIndex, isLoading: isIndexLoading } = useFullPokemonIndex();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [generationFilter, setGenerationFilter] = useState("");
  const [extraResults, setExtraResults] = useState<any[]>([]);

  useEffect(() => {
    if (!search || !fullIndex || !visiblePokemon) return;

    const searchTerm = search.toLowerCase();
    const matching = fullIndex.filter((p) =>
      p.family.some((n) => n.includes(searchTerm)),
    );

    const names = matching.map((p) => p.name);
    const newOnes = names.filter(
      (name) => !visiblePokemon.some((p) => p.name === name),
    );

    Promise.all(newOnes.map(fetchPokemonByName))
      .then(setExtraResults)
      .catch(console.error);
  }, [search, fullIndex, visiblePokemon]);

  const allPokemon = [...(visiblePokemon || []), ...extraResults];

  const filtered = allPokemon.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const familyMatch =
      fullIndex
        ?.find((f) => f.name === p.name)
        ?.family.some((n) => n.includes(search.toLowerCase())) ?? false;

    const typeMatch = typeFilter ? p.types?.includes(typeFilter) : true;
    const genMatch = generationFilter
      ? p.generation === generationFilter
      : true;

    return (nameMatch || familyMatch) && typeMatch && genMatch;
  });

  if (isLoading) return <p>Cargando Pokédex...</p>;
  if (isIndexLoading) return <p>Cargando Pokédex completo...</p>;
  if (error) return <p>Error al cargar los Pokémon.</p>;

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
