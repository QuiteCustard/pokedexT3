"use client";
import { getIndividualPokemon, pokemonLimit, pokemonURL } from "@/helpers/pokemon-getter";
import { type DetailedPokemon, type Pokemon,  type PokemonList } from "@/types";
import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Slide from "./slide/Slide";

export default function PokemonList() {
    const [url, setURL] = useState(pokemonURL + pokemonLimit);
	const [nextUrl, setNextURL] = useState("");
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const {ref, inView} = useInView({rootMargin: "0px 1000px 0px 0px"});
	const [initSwiper, setInitSwiper] = useState(false);
	const swiper = useRef(null);
    const [individualPokemonData, setIndividualPokemonData] = useState<DetailedPokemon[]>([]);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function getPokemonBatch() {
			const data = await fetch(url, {signal})

			const {results, next} = await data.json() as PokemonList;

			if (results) {
				setNextURL(next);
				setPokemon((p: Pokemon[] | undefined) => [...(p ?? []), ...results]);
				setInitSwiper(true);
			}
		}

		getPokemonBatch().catch(console.error);

		return () => controller.abort();
	}, [url])

    useEffect(() => {
		if (inView) setURL(nextUrl);
	}, [nextUrl, inView])

    useEffect(() => {
		const urls = pokemon.map(mon => mon.url);

		async function getData() {
			setIndividualPokemonData(await getIndividualPokemon(urls));
		}

		getData().catch(console.error);
	}, [pokemon])

    return (
        <div className="pokemon-list">
            <swiper-container init={false} ref={swiper} mousewheel={true} keyboard={true} freeMode={true}>
                {individualPokemonData.map((data, index) => <Slide key={index} sprites={data.sprites} name={data.name} id={data.id} url={data.url} />)}
            </swiper-container>
        </div>
    )
}