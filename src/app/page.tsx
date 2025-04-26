import { Suspense } from "react";
import HomePage from "./HomePage/HomePage"; // O donde tengas HomePage

export default function Page() {
  return (
    <Suspense
      fallback={<div className="py-10 text-center">Loading Pokédex...</div>}
    >
      <HomePage />
    </Suspense>
  );
}
