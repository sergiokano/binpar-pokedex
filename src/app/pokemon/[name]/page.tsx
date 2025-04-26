"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPokemonDetail } from "@/lib/api";
import SkeletonPokemonPage from "@/components/Skeleton/SkeletonPokemonPage/SkeletonPokemonPage";
import {
  generationTranslations,
  statTranslations,
  typeTranslations,
} from "@/lib/translations";
import { typeColors } from "@/lib/pokemonStyles";
import type { Pokemon } from "@/lib/types";

export default function PokemonPage() {
  // const { name } = useParams();

  const params = useParams();
  const name = typeof params.name === "string" ? params.name : undefined;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getPokemonDetail(name)
      .then(async (data) => {
        const evolutions = await data.evolutions; // 👈 Esperar resolución
        setPokemon({ ...data, evolutions });
      })
      .catch(() => setPokemon(null))
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 1000),
      );
  }, [name]);

  if (!name) return notFound();
  if (loading || !pokemon) return <SkeletonPokemonPage />;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[200px_1fr]">
          <div className="flex justify-center">
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              width={200}
              height={200}
              className="rounded-xl bg-zinc-50 p-4 shadow-md"
            />
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold text-zinc-900 capitalize">
              {pokemon.name}
            </h1>
            <p className="text-base text-zinc-500">
              {generationTranslations[pokemon.generation] ??
                pokemon.generation.replace("-", " ")}
            </p>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`rounded-full px-4 py-1 text-sm font-medium text-indigo-700 capitalize ${
                    typeColors[type] ?? "bg-gray-200 text-gray-700"
                  }`}
                >
                  {typeTranslations[type] ?? type.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        {Array.isArray(pokemon.evolutions) && pokemon.evolutions.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-xl font-semibold text-zinc-800">
              Evoluciones
            </h2>
            <div className="flex flex-wrap gap-5">
              {pokemon.evolutions.map((evo: any) => (
                <Link
                  href={`/pokemon/${evo.name}`}
                  key={evo.name}
                  prefetch={false}
                >
                  <div
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 shadow-sm transition hover:scale-105 hover:bg-zinc-50 ${
                      evo.name === pokemon.name ? "ring-2 ring-indigo-400" : ""
                    }`}
                  >
                    <Image
                      src={evo.sprite}
                      alt={evo.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                    <p className="mt-2 text-sm font-medium text-zinc-700 capitalize">
                      {evo.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-zinc-800">
            Estadísticas
          </h2>
          <div className="space-y-3">
            {pokemon.stats.map((s: any) => (
              <div key={s.name} className="flex items-center gap-4 text-sm">
                <span className="w-24 text-right text-zinc-600 capitalize">
                  {statTranslations[s.name] ?? s.name.replace("-", " ")}
                </span>
                <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(s.value, 100)}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right font-medium text-zinc-800">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
