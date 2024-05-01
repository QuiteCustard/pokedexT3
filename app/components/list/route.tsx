"use client";

import { pokemonURL, pokemonLimit } from "@/helpers/pokemon-getter";
import { getTheme } from "@/helpers/set-theme";
import { pokedexGen } from "@/page";
import type { Pokemon, PokemonList } from "@/types";
import { useState, useEffect } from "react";

export default function PokemonList() {
    const [url, setURL] = useState(pokemonURL + pokemonLimit);
	const [nextUrl, setNextURL] = useState("");
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);

    useEffect(() => {
		async function updateTheme() {
			const theme = await getTheme();
			pokedexGen.value = theme ?? pokedexGen.value;
		}

		updateTheme().catch(console.error)
	}, [])

    useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function getPokemonBatch() {
			const data = await fetch(url, {signal})

			const {results, next} = await data.json() as PokemonList;

			if (results) {
				setNextURL(next);
				setPokemon((p: Pokemon[] | undefined) => [...(p ?? []), ...results]);
			}
		}

		getPokemonBatch().catch(console.error);

		return () => controller.abort();
	}, [url])

    return (
        <div>
        
        </div>
    )
}
