import { fetchPokemonDetails } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: number;
  name: string;
};

export default function PokemonCard({ id, name }: Props) {
  const { data } = useQuery({
    queryKey: ["pokemon-details", name],
    queryFn: () => fetchPokemonDetails(name),
  });

  return (
    <div className="rounded-lg border bg-white p-4 shadow transition hover:shadow-md">
      <p className="text-lg font-semibold capitalize">
        #{id} {name}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {data?.types.map((type: string) => (
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
