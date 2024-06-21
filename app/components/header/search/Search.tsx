
import { baseURL, pokemonURL } from "@/helpers/pokemon-getter";
import Form from "./Form/Form";
import type { ApiGroupData } from "@/types";

export default async function Search() {
    const controller = new AbortController();
    const signal = controller.signal;
    const urls = [pokemonURL + "?limit=10000", 'move?limit=10000', 'ability?limit=10000'];

    const results = await Promise.all(urls.map(async url => {
        const data = await fetch(baseURL + url, {signal})
        const {results} = await data.json() as ApiGroupData;
        return results;
    }))

    const keysToIndexMap = {
        pokemon: 0,
        move: 1,
        ability: 2,
    }
      
    Object.entries(keysToIndexMap).forEach(([key, index]) => results[index]?.map(r => r.type = key))

    return (
        <Form data={results.flat()} />
    )
}
