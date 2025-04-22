import { fetchPokemonDetails, fetchPokemonSpecies } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: number;
  name: string;
};

export default function PokemonCard({ id, name }: Props) {
  const { data: details } = useQuery({
    queryKey: ["pokemon-details", name],
    queryFn: () => fetchPokemonDetails(name),
  });

  const { data: species } = useQuery({
    queryKey: ["pokemon-species", name],
    queryFn: () => fetchPokemonSpecies(name),
  });

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex flex-col items-center">
        <img
          src={details?.sprite}
          alt={name}
          className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
        />
        <p className="mt-2 text-center text-lg font-bold text-gray-800 capitalize">
          #{id} {name}
        </p>
        <p className="text-sm text-gray-500">
          Gen {species?.generation.replace("generation-", "").toUpperCase()}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {details?.types.map((type: string) => (
            <span
              key={type}
              className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 capitalize"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
