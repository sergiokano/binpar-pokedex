type Props = {
  id: number;
  name: string;
};

export default function PokemonCard({ id, name }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow transition hover:shadow-md">
      <p className="text-lg font-semibold capitalize">
        #{id} {name}
      </p>
    </div>
  );
}
