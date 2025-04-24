export default function SkeletonPokemonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-4 shadow-md">
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="h-24 w-24 rounded-full bg-gray-200" />
        <div className="h-4 mt-2 w-2/3 rounded bg-gray-200" />
        <div className="h-4 mt-0.5 w-1/5 rounded bg-gray-200" />
        <div className="mt-1 flex gap-2">
          <div className="h-6 w-18 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
