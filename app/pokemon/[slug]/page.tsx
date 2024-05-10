import { getPokemonPageData } from "@/helpers/pokemon-getter";
import type {CompletedPokemon, Stat } from "@/types";
import "@/pokemon/pokemon.css";
import BasicInfo from "@/components/basic-info/BasicInfo";
import AdvancedInfo from "@/components/advanced-info/AdvancedInfo";

export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const data: CompletedPokemon = await getPokemonPageData(slug)
  const {name, id, sprites, types, flavor_text, genus, height, weight, base_experience, base_happiness, capture_rate, growth_rate, location_area_encounters, abilities, stats, egg_groups, moves, evolution_chain, varieties} = data;

  const formattedStats: Stat[] = stats.map((stat) => {
    return {
      ...stat,
      stat: {
        ...stat.stat,
        name: stat.stat.name.includes('-') ? stat.stat.name.replace(/-/g, ' ') : stat.stat.name,
      },
    }
  })

  return (
    <main>
      <BasicInfo name={name} id={id} genus={genus} types={types} flavor_text={flavor_text} sprites={sprites} height={height} weight={weight} />
      <AdvancedInfo base_experience={base_experience} base_happiness={base_happiness} capture_rate={capture_rate} growth_rate={growth_rate} egg_groups={egg_groups} abilities={abilities} evolution_chain={evolution_chain} stats={formattedStats} sprites={sprites} />
    </main>
  )
}