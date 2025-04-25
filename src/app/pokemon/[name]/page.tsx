
import { getPokemonDetail } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PokemonPage({
  params,
}: {
  params: { name: string };
}) {
  const pokemon = await getPokemonDetail(params.name).catch(() => null);

  if (!pokemon) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/" className="mb-8 inline-block text-sm text-indigo-600 hover:underline">
        ← Volver al listado
      </Link>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-8">
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
            <h1 className="text-4xl font-bold capitalize text-zinc-900">
              {pokemon.name}
            </h1>
            <p className="text-base text-zinc-500">
              Generación: {pokemon.generation.replace("generation-", "").toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium capitalize text-indigo-700"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {Array.isArray(pokemon.evolutions) && pokemon.evolutions.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-xl font-semibold text-zinc-800">Evoluciones</h2>
            <div className="flex flex-wrap gap-5">
              {pokemon.evolutions.map((evo) => (
                <Link href={`/pokemon/${evo.name}`} key={evo.name} prefetch={false}>
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
          <h2 className="mb-3 text-xl font-semibold text-zinc-800">Estadísticas</h2>
          <div className="space-y-3">
            {pokemon.stats.map((s) => (
              <div key={s.name} className="flex items-center gap-4 text-sm">
                <span className="w-24 text-right capitalize text-zinc-600">{s.name}</span>
                <div className="relative flex-1 h-3 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(s.value, 100)}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right font-medium text-zinc-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
