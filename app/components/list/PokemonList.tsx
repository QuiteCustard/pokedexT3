"use client";
import { getIndividualPokemon, pokemonLimit, speciesURL } from "@/helpers/pokemon-getter";
import { type DetailedPokemon, type Pokemon,  type PokemonList } from "@/types";
import { useState, useEffect, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import "@/components/list/pokemon-list.css";
import PokemonArticle from "./pokemon-article/PokemonArticle";
import { signal } from "@preact/signals-react";
import Loading from "../loader/Loader";

const observerActive = signal(false);

export default function PokemonList() {
	const [url, setURL] = useState(speciesURL + pokemonLimit);
	const [nextUrl, setNextURL] = useState("");
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const [individualPokemonData, setIndividualPokemonData] = useState<DetailedPokemon[]>([]);
	const {ref, inView} = useInView({rootMargin: "0px 1000px 0px 0px"});

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

		return () => controller.abort("fetch abandoned");
	}, [url])

	useEffect(() => {
		if (inView) setURL(nextUrl);
	}, [nextUrl, inView])

	useEffect(() => {
		if (pokemon.length === 0) return;
		const urls = pokemon.map(mon => mon.url);

		async function getData() {
			setIndividualPokemonData(await getIndividualPokemon(urls));
			observerActive.value = true;
		}
		getData().catch(console.error);
	}, [pokemon])

	return (
		<main className="pokemon-list">
			<Suspense fallback={<Loading />}>
				{individualPokemonData.map((data) => <PokemonArticle key={data.id} sprites={data.sprites} name={data.name} id={data.id} />)}
			</Suspense>
			{observerActive.value === true ? <div ref={ref}></div> : null}
		</main>
	)
}