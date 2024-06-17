
import { pokemonURL } from "@/helpers/pokemon-getter";
import Form from "./Form/Form";
import { type PokemonList } from "@/types";

export default async function Search() {
    const controller = new AbortController();
    const signal = controller.signal;
    const f = await fetch(pokemonURL + "?limit=10000", {signal});
    const { results } = await f.json() as PokemonList;

    return (
        <Form pokemon={results} />
    )
}
