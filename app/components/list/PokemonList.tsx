"use client";
import { getIndividualPokemon, pokemonLimit, pokemonURL } from "@/helpers/pokemon-getter";
import { type DetailedPokemon, type Pokemon,  type PokemonList } from "@/types";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Slide from "./slide/Slide";
import "@/components/list/pokemon-list.css";
import { loaderActive, pokedexGen } from "@/page";
import {register} from 'swiper/element/bundle';
import { getTheme } from "@/helpers/set-theme";

export default function PokemonList() {
	const [url, setURL] = useState(pokemonURL + pokemonLimit);
	const [nextUrl, setNextURL] = useState("");
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const [individualPokemonData, setIndividualPokemonData] = useState<DetailedPokemon[]>([]);
	const {ref, inView} = useInView({rootMargin: "0px 1000px 0px 0px"});

    useEffect(() => {
        register();

		async function updateTheme() {
			// Updates the signal value to the one stored in cookies
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

			if (!results) return;
			setNextURL(next);
			setPokemon((p: Pokemon[] | undefined) => [...(p ?? []), ...results]);
		}

		getPokemonBatch().catch(console.error);

		//return () => controller.abort("fetch abandoned");
	}, [url])

	useEffect(() => {
		if (inView) setURL(nextUrl);
	}, [nextUrl, inView])

	useEffect(() => {
		if (pokemon.length === 0) return;
		const urls = pokemon.map(mon => mon.url);

		async function getData() {
			setIndividualPokemonData(await getIndividualPokemon(urls));
			setTimeout(() => loaderActive.value = false, 200)
		}

		getData().catch(console.error);
	}, [pokemon])

	return (
		<div className="pokemon-list">
			{individualPokemonData.map((data) => <Slide key={data.id} sprites={data.sprites} name={data.name} id={data.id} url={data.url} />)}
			<div ref={ref}></div>
		</div>
	)
}