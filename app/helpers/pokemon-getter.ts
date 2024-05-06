import type { DetailedPokemon } from "@/types";

export const pokemonURL = `https://pokeapi.co/api/v2/pokemon`
export const pokemonLimit = `?limit=21`;

export async function getIndividualPokemon(urls: string[]) {
    const controller = new AbortController();
    const signal = controller.signal;

    const data: DetailedPokemon[] = await Promise.all(urls.map(async url => {
        const response = await fetch(url, {signal});
        if (!response.ok) throw new Error('Critical error');
        const pokemonData = {...await response.json() as DetailedPokemon, url};
        return pokemonData;
    }))

    return data;
}