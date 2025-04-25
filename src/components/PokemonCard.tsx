"use client";

import { typeTranslations } from "@/lib/translations";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  generation: string;
};

export default function PokemonCard({
  id,
  name,
  sprite,
  types,
  generation,
}: Props) {
  const params = useSearchParams();

  const search = params.get("search") || "";
  const type = params.get("type") || "";
  const gen = params.get("generation") || "";

  const query = new URLSearchParams({
    ...(search && { search }),
    ...(type && { type }),
    ...(gen && { generation: gen }),
  }).toString();

  return (
    <Link href={`/pokemon/${name}?${query}`}>
      <div className="group relative cursor-pointer rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex flex-col items-center">
          <img
            src={sprite}
            alt={name}
            className="h-24 w-auto max-w-[100px] object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <p className="mt-2 text-center text-lg font-bold text-gray-800 capitalize">
            #{id} {name}
          </p>
          <p className="text-sm text-gray-500">
            Gen {generation.replace("generation-", "").toUpperCase()}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {types.map((type) => (
              <span
                key={type}
                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 capitalize"
              >
                {typeTranslations[type] ?? type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
