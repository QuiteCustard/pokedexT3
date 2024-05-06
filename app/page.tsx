import { signal } from "@preact/signals-react";
import PokemonList from "./components/list/PokemonList";
import Loading from "./components/loader/Loader";

export const loaderActive = signal(true);
export const initSwiper = signal(false);

export default async function Page() {
  return (
    <>
    <PokemonList />
    <Loading />
    </>
  );
}