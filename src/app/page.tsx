import { Suspense } from "react";
import HomePage from "./HomePage/HomePage"; // O donde tengas HomePage

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
