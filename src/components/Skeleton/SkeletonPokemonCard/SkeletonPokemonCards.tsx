import SkeletonPokemonCard from "./SkeletonPokemonCard";
interface SkeletonPokemonCardProps {
  amount?: number;
}

export default function SkeletonPokemonCards({
  amount = 12,
}: SkeletonPokemonCardProps) {
  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <SkeletonPokemonCard key={`skeleton-${i}`} />
      ))}
    </>
  );
}
