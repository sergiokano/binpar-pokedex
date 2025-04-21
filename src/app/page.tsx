"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import PokemonCard from "@/components/PokemonCard";

export default function HomePage() {
  const { data, isLoading, error } = usePokemonList();

  if (isLoading) return <p>Cargando Pokédex...</p>;
  if (error) return <p>Error al cargar los Pokémon.</p>;

  return (
    <main className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4">
      {data?.map((pokemon: { id: number; name: string }) => (
        <PokemonCard key={pokemon.id} id={pokemon.id} name={pokemon.name} />
      ))}
    </main>
  );
}
