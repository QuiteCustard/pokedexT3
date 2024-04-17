import { signal } from "@preact/signals-react";
import PokemonList from "./components/list/PokemonList";
import { type genValues } from "./types";

export const pokedexGen = signal<genValues>('gen9');

export default async function Page() {
  return (
    <>
      <PokemonList />
    </>
  );
}
