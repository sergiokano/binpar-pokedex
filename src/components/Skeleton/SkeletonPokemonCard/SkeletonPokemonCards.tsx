import PokemonCard from "@/components/PokemonCard/PokemonCard";
import SkeletonPokemonCard from "./SkeletonPokemonCard";

type Props = {
  amount?: number;
};

export default function SkeletonPokemonCards({ amount = 12 }: Props) {
  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <SkeletonPokemonCard key={`skeleton-${i}`} />
      ))}
    </>
  );
}
