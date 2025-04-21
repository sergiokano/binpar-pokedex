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
    <div className="rounded-lg border bg-white p-4 shadow transition hover:shadow-md">
      <p className="text-lg font-semibold capitalize">
        #{id} {name}
      </p>

      <p className="text-muted-foreground text-xs">
        Generation: {species?.generation.replace("generation-", "").toUpperCase()}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {details?.types.map((type: string) => (
          <span
            key={type}
            className="rounded bg-gray-200 px-2 py-1 text-xs capitalize"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
