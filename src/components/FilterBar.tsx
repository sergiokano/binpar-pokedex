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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="w-full rounded border p-2 sm:w-1/3"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        className="w-full rounded border p-2 sm:w-1/3"
        value={typeFilter}
        onChange={(e) => onTypeFilter(e.target.value)}
      >
        <option value="">Todos los tipos</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        {/* TO-DO: Adding more? */}
      </select>

      <select
        className="w-full rounded border p-2 sm:w-1/3"
        value={generationFilter}
        onChange={(e) => onGenerationFilter(e.target.value)}
      >
        <option value="">Todas las generaciones</option>
        <option value="generation-i">Gen I</option>
        <option value="generation-ii">Gen II</option>
        {/* TO-DO: Adding more? */}
      </select>
    </div>
  );
}
