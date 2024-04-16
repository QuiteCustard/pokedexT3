import { signal } from "@preact/signals-react";
import PokemonList from "./components/list/PokemonList";

export const GENS = {
  gen9: '9',
  gen4: '4'
} as const;

export type genValues = '9' | '4'
export const pokedexGen = signal<genValues>('9');

export default function Page() {

  return (
   <>
    <PokemonList />
   </>
  );
}
