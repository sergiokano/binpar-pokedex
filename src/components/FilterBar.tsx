"use client";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  typeFilter: string;
  onTypeFilter: (value: string) => void;
  generationFilter: string;
  onGenerationFilter: (value: string) => void;
};

export default function FilterBar({
  search,
  onSearch,
  typeFilter,
  onTypeFilter,
  generationFilter,
  onGenerationFilter,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <input
        type="text"
        placeholder="🔍 Buscar Pokémon..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-2 text-sm text-zinc-800 shadow-sm backdrop-blur-sm transition focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
      />

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilter(e.target.value)}
        className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-2 text-sm text-zinc-800 shadow-sm backdrop-blur-sm transition focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
      >
        <option value="">🧪 Todos los tipos</option>
        <option value="fire">🔥 Fire</option>
        <option value="water">💧 Water</option>
        <option value="grass">🌿 Grass</option>
        <option value="electric">⚡ Electric</option>
        <option value="psychic">🔮 Psychic</option>
        <option value="rock">🪨 Rock</option>
        <option value="ghost">👻 Ghost</option>
        <option value="dragon">🐉 Dragon</option>
      </select>

      <select
        value={generationFilter}
        onChange={(e) => onGenerationFilter(e.target.value)}
        className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-2 text-sm text-zinc-800 shadow-sm backdrop-blur-sm transition focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
      >
        <option value="">📚 Todas las generaciones</option>
        <option value="generation-i">Gen I</option>
        <option value="generation-ii">Gen II</option>
        <option value="generation-iii">Gen III</option>
        <option value="generation-iv">Gen IV</option>
        <option value="generation-v">Gen V</option>
        <option value="generation-vi">Gen VI</option>
        <option value="generation-vii">Gen VII</option>
        <option value="generation-viii">Gen VIII</option>
        <option value="generation-ix">Gen IX</option>
      </select>
    </div>
  );
}
