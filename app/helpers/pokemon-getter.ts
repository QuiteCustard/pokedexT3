import type { DetailedPokemon } from "@/types";

export const pokemonURL = `https://pokeapi.co/api/v2/pokemon`
export const pokemonLimit = `?limit=1&offset=901`;
export const speciesURL = `https://pokeapi.co/api/v2/pokemon-species`;

export async function getIndividualPokemon(urls: string[]) {
    const controller = new AbortController();
    const signal = controller.signal;

    const data: DetailedPokemon[] = await Promise.all(urls.map(async url => {
        const response = await fetch(url, {signal});
        if (!response.ok) throw new Error('Critical error');
        const pokemonSpecies = await response.json() as DetailedPokemon;
        const monURL = pokemonSpecies.varieties[0]?.pokemon.url;
        if (!monURL) return {...pokemonSpecies, url};
        const f = await fetch(monURL, {signal});
        const {sprites} = await f.json() as DetailedPokemon;
        const pokemonData =  {...pokemonSpecies, sprites} as DetailedPokemon;
        return pokemonData;
    }))

    return data;
}