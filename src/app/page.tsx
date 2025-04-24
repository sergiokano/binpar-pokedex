"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import PokemonCard from "@/components/PokemonCard";
import { useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import { useFullPokemonIndex } from "@/hooks/useFullPokemonIndex";
import { normalizePokemonData } from "@/lib/api";

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

    Promise.all(newOnes.map(normalizePokemonData))
      .then(setExtraResults)
      .catch(console.error);
  }, [search, fullIndex, visiblePokemon]);

  const allPokemon = [...(visiblePokemon || []), ...extraResults];

  const filtered = allPokemon.filter((p) => {
    console.log("checking", p);

    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const familyMatch =
      fullIndex
        ?.find((f) => f.name === p.name)
        ?.family.some((n) => n.includes(search.toLowerCase())) ?? false;
    console.log(p.types, p.generation);
    const typeMatch = typeFilter ? p.types?.includes(typeFilter) : true;
    const genMatch = generationFilter
      ? p.generation?.toLowerCase() === generationFilter.toLowerCase()
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
      <div className="w-full">
        <section className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
          {filtered?.map((pokemon: any) => (
            <PokemonCard key={pokemon.id} {...pokemon} />
          ))}
        </section>
      </div>
    </main>
  );
}
