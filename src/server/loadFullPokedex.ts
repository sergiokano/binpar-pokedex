// src/server/loadFullPokedex.ts

import type { NormalizedPokemon } from "@/lib/types";
import { fetchPokemonNames } from "@/lib/api";
import pLimit from "p-limit";
import { BASE_URL } from "@/lib/constants";

let cache: NormalizedPokemon[] | null = null;

export async function loadFullPokedex(): Promise<NormalizedPokemon[]> {
  if (cache) return cache;

  const names = await fetchPokemonNames(); // trae todos los nombres
  const limit = pLimit(10); // controla concurrencia para evitar bloquear

  const all = await Promise.all(
    names.map((name) => limit(() => normalizePokemonData(name))),
  );
  const filtered = all.filter((p) => p !== null);
  cache = filtered; // guarda en caché
  return filtered; // devuelve el pokédex completo
}

export async function normalizePokemonData(
  name: string,
): Promise<NormalizedPokemon | null> {
  const detailsRes = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!detailsRes.ok) return null;

  const speciesRes = await tryFetchSpecies(name);
  if (!speciesRes.ok) return null;

  const details = await detailsRes.json();
  const species = await speciesRes.json();

  return {
    id: details.id,
    name: details.name,
    sprite: details.sprites.other["official-artwork"].front_default,
    types: details.types.map((t: any) => t.type.name),
    generation: species.generation?.name || "unknown",
  };
}

// Maneja casos como "pikachu-original-cap", etc.
async function tryFetchSpecies(name: string): Promise<Response> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${name}`);
  if (res.ok) return res;

  const fallback = getFallbackName(name);
  return await fetch(`${BASE_URL}/pokemon-species/${fallback}`);
}

function getFallbackName(name: string): string {
  const parts = name.split("-");
  while (parts.length > 1) {
    parts.pop();
    const candidate = parts.join("-");
    if (candidate) return candidate;
  }
  return name;
}
