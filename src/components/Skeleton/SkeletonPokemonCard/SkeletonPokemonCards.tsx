import PokemonCard from "@/components/PokemonCard";
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
      {/* <PokemonCard
          id={999}
          name="Mockmon"
          sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          types={["electric"]}
          generation="generation-i"
        /> */}
    </>
  );
}
