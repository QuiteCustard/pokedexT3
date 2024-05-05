import { signal } from "@preact/signals-react";
import PokemonList from "./components/list/PokemonList";

export const loaderActive = signal(true);
export const initSwiper = signal(false);

export default async function Page() {
  return (
    <PokemonList />
  );
}
