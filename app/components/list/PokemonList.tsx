"use client";
import { getIndividualPokemon, pokemonLimit, pokemonURL } from "@/helpers/pokemon-getter";
import { type DetailedPokemon, type Pokemon,  type PokemonList } from "@/types";
import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Slide from "./slide/Slide";
import "@/components/list/pokemon-list.css";
import { loaderActive, pokedexGen } from "@/page";
import { type SwiperContainer } from "swiper/element";
import {
	register
} from 'swiper/element/bundle';
import { useComputed, useSignalEffect } from "@preact/signals-react/runtime";
import { getTheme } from "@/helpers/set-theme";

export default function PokemonList() {
    const swiper = useRef<SwiperContainer>(null);
    const [initSwiper, setSwiper] = useState(false);
	const [url, setURL] = useState(pokemonURL + pokemonLimit);
	const {ref, inView} = useInView({rootMargin: "0px 1000px 0px 0px"});
	const [nextUrl, setNextURL] = useState("");
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const [individualPokemonData, setIndividualPokemonData] = useState<DetailedPokemon[]>([]);

    useEffect(() => {
        register();

		async function updateTheme() {
			const theme = await getTheme();
			pokedexGen.value = theme ?? pokedexGen.value;
		}

		updateTheme().catch(console.error)

		if (swiper.current === null) return;
		swiper.current.addEventListener('slidechange', () => swiper.current?.querySelectorAll("swiper-slide").forEach(slide => slide.role === null ? updateSwiper(true) : null));
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

	useEffect(() => {
		if (inView) setURL(nextUrl);
	}, [nextUrl, inView])

	useEffect(() => {
		if (pokemon.length === 0) return
		const urls = pokemon.map(mon => mon.url);

		async function getData() {
			setIndividualPokemonData(await getIndividualPokemon(urls));
			loaderActive.value = false;
		}

		getData().catch(console.error);
	}, [pokemon])

	useEffect(() => {
		if (individualPokemonData.length === 0) return;
		setSwiper(true);
	}, [individualPokemonData])

	useEffect(() => {
		function getSwiperParams() {
			if (pokedexGen.value === "gen9") {
				return {
					direction: "horizontal",
					breakpoints: {
						320: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						559: {
							slidesPerView: 4,
							spaceBetween: 20,
						},
						1024: {
							slidesPerView: 6,
							spaceBetween: 20,
						},
						1400: {
							slidesPerView: 8,
							spaceBetween: 5,
						},
						2000: {
							slidesPerView: 10,
							spaceBetween: 5,
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
						},
						559: {
							slidesPerView: 1,
							spaceBetween: 10,
						},
						1024: {
							slidesPerView: 5,
							spaceBetween: 50
						},
						1400: {
							slidesPerView: 5,
							spaceBetween: 50
						},
						2000: {
							slidesPerView: 5,
							spaceBetween: 50
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

		if (!swiper.current || initSwiper !== true) return;

		const swiperParams = getSwiperParams();
		Object.assign(swiper.current, swiperParams);
		swiper.current.initialize();

		if (!swiper.current?.swiper?.params?.breakpoints?.["320"]) return;
		swiper.current.swiper.params.breakpoints["320"].slidesPerView = swiperParams.breakpoints["320"].slidesPerView;
		swiper.current.swiper.currentBreakpoint = false;
		swiper.current.swiper.update();
		setSwiper(false);
    }, [initSwiper])

	const genVal = useComputed(() => pokedexGen.value);
	useSignalEffect(() => getState(genVal.value))
  
	function getState(_value: string) {
		setTimeout(() => { 
			setSwiper(true);
		}, 800)
	}

	function updateSwiper(val: boolean) {
		setSwiper(val);
	}
  
    return (
        <div className="pokemon-list">
            <swiper-container init={false} ref={swiper} keyboard={true} mousewheel={true}>
				{individualPokemonData.map((data, index) => <Slide key={index} sprites={data.sprites} name={data.name} id={data.id} url={data.url} />)}
				<swiper-slide ref={ref}></swiper-slide>
            </swiper-container>
        </div>
    )
}