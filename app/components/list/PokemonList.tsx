"use client";
import { getIndividualPokemon, pokemonLimit, pokemonURL } from "@/helpers/pokemon-getter";
import { type DetailedPokemon, type Pokemon,  type PokemonList } from "@/types";
import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Slide from "./slide/Slide";
import "@/components/list/pokemon-list.css";
import { loaderActive, pokedexGen } from "@/page";
import { type SwiperContainer } from "swiper/element";
import {register} from 'swiper/element/bundle';
import { getTheme } from "@/helpers/set-theme";
import { useComputed, useSignalEffect } from "@preact/signals-react";

export default function PokemonList() {
	const [url, setURL] = useState(pokemonURL + pokemonLimit);
	const [nextUrl, setNextURL] = useState("");
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const swiper = useRef<SwiperContainer>(null);
	const [individualPokemonData, setIndividualPokemonData] = useState<DetailedPokemon[]>([]);
    const [initSwiper, setInitSwiper] = useState(false);
	const [updateSwiper, setUpdateSwiper] = useState(false);
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
			setTimeout(() => loaderActive.value = false, 200)
		}

		getData().catch(console.error);

		setInitSwiper(true);
	}, [pokemon])

	useEffect(() => {
		if (!swiper.current || initSwiper !== true) return;
		
		swiper.current.initialize();
		swiper.current.swiper.update();
    }, [initSwiper])


	useEffect(() => {
		if (!swiper.current || updateSwiper !== true) return;

		function getSwiperParams() {
			if (pokedexGen.value === "gen9") {
				return {
					direction: "horizontal",
					breakpoints: {
						320: {
							slidesPerView: 2,
							spaceBetween: 20,
							slidesOffsetBefore: 0,
							slidesOffsetAfter: 0,
						},
						559: {
							slidesPerView: 4,
							spaceBetween: 20,
							slidesOffsetBefore: 0,
							slidesOffsetAfter: 0,
						},
						1024: {
							slidesPerView: 6,
							spaceBetween: 20,
							slidesOffsetBefore: 0,
							slidesOffsetAfter: 0,
						},
						1400: {
							slidesPerView: 8,
							spaceBetween: 20,
							slidesOffsetBefore: 0,
							slidesOffsetAfter: 0,
						},
					},
					on: {
						init() {
							//
						},
					},
				}
			} else {
				return {
					direction: "vertical",
					breakpoints: {
						320: {
							slidesPerView: 1,
							spaceBetween: 10,
							slidesOffsetBefore: 0,
							slidesOffsetAfter: 0,
						},
						559: {
							slidesPerView: 1,
							spaceBetween: 10,
							slidesOffsetBefore: 0,
							slidesOffsetAfter: 0,
						},
						1024: {
							slidesPerView: 4,
							spaceBetween: 50,
							slidesOffsetBefore: 400,
							slidesOffsetAfter: 400,
						},
						1400: {
							slidesPerView: 4,
							spaceBetween: 50,
							slidesOffsetBefore: 400,
							slidesOffsetAfter: 400,
						},
					},
					on: {
						init() {
							//
						},
					},
				}
			}
		}

		const swiperParams = getSwiperParams();
		Object.assign(swiper.current, swiperParams);
		console.log(swiper.current.swiper.params)
		swiper.current.swiper.update();
		setUpdateSwiper(false);
	}, [updateSwiper])

	const genVal = useComputed(() => pokedexGen.value);
	useSignalEffect(() => getState(genVal.value))
  
	function getState(_value: string) {
		setTimeout(() => { 
			setUpdateSwiper(true);
		}, 800)
	}

	return (
		<div className="pokemon-list">
			<swiper-container init={false} ref={swiper} keyboard={true} mousewheel={true} freeMode={true} observer={true}>
				{individualPokemonData.map((data) => <Slide key={data.id} sprites={data.sprites} name={data.name} id={data.id} url={data.url} />)}
				<swiper-slide ref={ref}></swiper-slide>
			</swiper-container>
		</div>
	)
}