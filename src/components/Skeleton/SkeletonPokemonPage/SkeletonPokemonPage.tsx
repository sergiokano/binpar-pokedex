export default function SkeletonPokemonPage() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-6 py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[200px_1fr]">
          <div className="flex justify-center">
            <div className="h-[200px] w-[200px] rounded-xl bg-zinc-100" />
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div className="h-8 w-40 rounded bg-zinc-200" />
            <div className="h-4 w-24 rounded bg-zinc-100" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-zinc-200" />
              <div className="h-6 w-16 rounded-full bg-zinc-200" />
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <div className="h-6 w-32 rounded bg-zinc-200" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-sm">
              <div className="h-4 w-24 rounded bg-zinc-100" />
              <div className="h-3 flex-1 rounded-full bg-zinc-200" />
              <div className="h-4 w-8 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
