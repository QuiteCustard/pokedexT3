import PokemonList from "./components/list/PokemonList";
import Loading from "./components/loader/Loader";

export default async function Page() {
  return (
    <>
      <PokemonList />
      <Loading />
    </>
  );
}