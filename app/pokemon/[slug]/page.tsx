import { getPokemonPageData } from "@/helpers/pokemon-getter";
import type {CompletedPokemon, Stat } from "@/types";
import "@/pokemon/pokemon.css";
import BasicInfo from "@/components/basic-info/BasicInfo";
import AdvancedInfo from "@/components/advanced-info/AdvancedInfo";
import EvolutionVarieties from "@/components/evolution-varieties/EvolutionVarieties";
import Moves from "@/components/moves/Moves";
import Locations from "@/components/locations/Locations";
import { Suspense } from "react";
import Loader from "@/components/loader/Loader";

export default async function Page({params: {slug}}: {params: {slug: string}}) {
	const data: CompletedPokemon = await getPokemonPageData(slug.toLowerCase())
	const {name, id, sprites, types, flavor_text, genus, height, weight, base_experience, base_happiness, capture_rate, growth_rate, location_area_encounters, abilities, stats, egg_groups, moves, evolution_chain, varieties, cries} = data;

	const formattedStats: Stat[] = stats.map((stat) => ({
		...stat,
		stat: {
			...stat.stat,
			name: stat.stat.name.includes('-') ? stat.stat.name.replace(/-/g, ' ') : stat.stat.name,
		},
	}))

	return (
		<main>
			<BasicInfo name={name} id={id} genus={genus} types={types} flavor_text={flavor_text} sprites={sprites} height={height} weight={weight} cries={cries} />
			{(evolution_chain && evolution_chain.length > 0) ?? (varieties && varieties?.length > 0) ? <EvolutionVarieties evolution_chain={evolution_chain} varieties={varieties} sprites={sprites} /> : null}
			<AdvancedInfo base_experience={base_experience} base_happiness={base_happiness} capture_rate={capture_rate} growth_rate={growth_rate} egg_groups={egg_groups} abilities={abilities} stats={formattedStats} />
			<Suspense fallback={<section className="moves"><Loader noBackground loadContent={"moves"} /></section>}>
				{moves ? <Moves moves={moves} evolutions={evolution_chain ?? []} /> : null}
			</Suspense>
			<Suspense fallback={<section className="locations"><Loader noBackground loadContent={"location"} /></section>}>
				<Locations location={location_area_encounters} />
			</Suspense>
		</main>
	)
}